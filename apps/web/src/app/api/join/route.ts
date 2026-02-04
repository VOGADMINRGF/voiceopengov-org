import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMongoDb } from "@/lib/db/mongo";
import { createReviewToken } from "@/lib/reviewTokens";
import { sendMail } from "@/lib/mail/sendMail";
import { verifyHumanTokenDetailed } from "@/lib/security/human-token";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 4, windowMs: 15 * 60 * 1000 };

const JoinSchema = z
  .object({
    kind: z.enum(["person", "org"]),
    participation: z.enum(["newsletter", "passiv", "support", "aktiv"]),
    firstName: z.string().min(1).max(120).optional(),
    lastName: z.string().min(1).max(120).optional(),
    birthDate: z.string().min(4).max(20).optional(),
    birthPlace: z.string().min(1).max(120).optional(),
    orgName: z.string().min(2).max(160).optional(),
    contactName: z.string().min(1).max(120).optional(),
    email: z.string().email().max(320),
    countryCode: z.string().min(2).max(3),
    supportMode: z.enum(["passiv", "aktiv"]).optional(),
    newsletterOptIn: z.boolean().optional(),
    contributionInterest: z.boolean().optional(),
    activeDetails: z
      .object({
        areas: z.array(z.string().min(2).max(80)).max(6).optional(),
        skillsText: z.string().max(1200).optional(),
        timeBudget: z.string().max(120).optional(),
      })
      .optional(),
    privacyAccepted: z.boolean(),
    humanToken: z.string().min(10),
    hp_join: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "person") {
      if (!data.firstName) ctx.addIssue({ code: "custom", message: "firstName required" });
      if (!data.lastName) ctx.addIssue({ code: "custom", message: "lastName required" });
      if (!data.birthDate) ctx.addIssue({ code: "custom", message: "birthDate required" });
      if (!data.birthPlace) ctx.addIssue({ code: "custom", message: "birthPlace required" });
    }
    if (data.kind === "org" && !data.orgName) {
      ctx.addIssue({ code: "custom", message: "orgName required" });
    }
    if (!data.privacyAccepted) {
      ctx.addIssue({ code: "custom", message: "privacyAccepted required" });
    }
  });

function normalizeText(value: string | undefined) {
  if (!value) return undefined;
  return value.replace(/\s+/g, " ").trim();
}

function isAtLeastAge(dateStr: string, minAge: number) {
  const birth = new Date(dateStr);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= minAge;
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  const ipRate = await rateLimitFromRequest(req, RATE_LIMIT.limit, RATE_LIMIT.windowMs, {
    scope: "join",
  });
  if (!ipRate.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryIn: ipRate.retryIn },
      { status: 429, headers: rateLimitHeaders(ipRate) },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = JoinSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (parsed.data.hp_join && parsed.data.hp_join.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const human = await verifyHumanTokenDetailed(parsed.data.humanToken);
  if (!human.ok) {
    return NextResponse.json({ ok: false, error: "invalid_human_token" }, { status: 400 });
  }
  const formId = typeof human.payload.formId === "string" ? human.payload.formId : "join";
  if (formId !== "join") {
    return NextResponse.json({ ok: false, error: "invalid_human_token" }, { status: 400 });
  }

  const db = await getMongoDb();
  const collection = db.collection("supporters_pii");

  const emailLower = parsed.data.email.toLowerCase();
  const existing = await collection.findOne(
    { emailLower, status: { $in: ["pending", "approved"] } },
    { projection: { status: 1 } },
  );
  if (existing) {
    return NextResponse.json({ ok: true, status: existing.status });
  }

  const { token, tokenHash, expiresAt } = createReviewToken();
  const now = new Date();

  if (parsed.data.kind === "person") {
    const ageOk = isAtLeastAge(parsed.data.birthDate ?? "", 16);
    if (ageOk === null) {
      return NextResponse.json({ ok: false, error: "invalid_birthdate" }, { status: 400 });
    }
    if (!ageOk) {
      return NextResponse.json({ ok: false, error: "underage" }, { status: 400 });
    }
  }

  const isActive = parsed.data.participation === "aktiv";
  const supportMode = isActive ? "aktiv" : "passiv";

  const record: Record<string, unknown> = {
    kind: parsed.data.kind,
    participation: parsed.data.participation,
    supportMode,
    newsletterOptIn: parsed.data.participation === "newsletter",
    contributionInterest: parsed.data.participation === "support",
    email: parsed.data.email,
    emailLower,
    countryCode: parsed.data.countryCode.toUpperCase(),
    activeDetails: isActive ? parsed.data.activeDetails ?? undefined : undefined,
    privacyAccepted: parsed.data.privacyAccepted,
    status: "pending",
    createdAt: now,
    reviewTokenHash: tokenHash,
    reviewTokenExpiresAt: expiresAt,
  };

  if (parsed.data.kind === "person") {
    record.firstName = normalizeText(parsed.data.firstName);
    record.lastName = normalizeText(parsed.data.lastName);
    record.birthDate = normalizeText(parsed.data.birthDate);
    record.birthPlace = normalizeText(parsed.data.birthPlace);
  } else {
    record.orgName = normalizeText(parsed.data.orgName);
    record.contactName = normalizeText(parsed.data.contactName);
  }

  await collection.insertOne(record);

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const reviewUrl = new URL(`/review?token=${token}`, getBaseUrl()).toString();
    const subject =
      parsed.data.kind === "person"
        ? `Neue Person: ${parsed.data.firstName} ${parsed.data.lastName}`
        : `Neue Organisation: ${parsed.data.orgName}`;
    const summaryLines = [
      `Typ: ${parsed.data.kind === "person" ? "Person" : "Organisation"}`,
      `E-Mail: ${parsed.data.email}`,
      `Land: ${parsed.data.countryCode.toUpperCase()}`,
      `Mitgliedschaft: ${parsed.data.participation}`,
      `Support: ${supportMode}`,
    ];
    if (parsed.data.kind === "person") {
      summaryLines.push(`Name: ${parsed.data.firstName} ${parsed.data.lastName}`);
      summaryLines.push(`Geburtsdatum: ${parsed.data.birthDate}`);
      summaryLines.push(`Geburtsort: ${parsed.data.birthPlace}`);
    } else {
      summaryLines.push(`Organisation: ${parsed.data.orgName}`);
      if (parsed.data.contactName) summaryLines.push(`Kontakt: ${parsed.data.contactName}`);
    }
    if (isActive && parsed.data.activeDetails?.areas?.length) {
      summaryLines.push(`Bereiche: ${parsed.data.activeDetails.areas.join(", ")}`);
    }
    if (isActive && parsed.data.activeDetails?.timeBudget) {
      summaryLines.push(`Zeitbudget: ${parsed.data.activeDetails.timeBudget}`);
    }
    if (isActive && parsed.data.activeDetails?.skillsText) {
      summaryLines.push(`Skills: ${parsed.data.activeDetails.skillsText}`);
    }

    await sendMail({
      to: adminEmail,
      subject,
      html: [
        "<h2>Neuer Supporter (pending)</h2>",
        "<ul>",
        ...summaryLines.map((line) => `<li>${line}</li>`),
        "</ul>",
        `<p><a href="${reviewUrl}">Eintrag pruefen</a></p>`,
      ].join(""),
    });
  } else {
    console.warn("[join] ADMIN_EMAIL not set, skipping admin notification.");
  }

  return NextResponse.json({ ok: true });
}
