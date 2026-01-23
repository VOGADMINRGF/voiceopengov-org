import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMongoDb } from "@/lib/db/mongo";
import { createReviewToken } from "@/lib/reviewTokens";
import { sendMail } from "@/lib/mail/sendMail";
import { verifyHumanTokenDetailed } from "@/lib/security/human-token";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 4, windowMs: 30 * 60 * 1000 };

const IntakeSchema = z.object({
  orgName: z.string().max(160).optional(),
  contactName: z.string().max(120).optional(),
  contactEmail: z.string().email().max(320),
  topic: z.string().min(3).max(200),
  region: z.string().max(120).optional(),
  goal: z.string().max(400).optional(),
  notes: z.string().max(1500).optional(),
  privacyAccepted: z.boolean(),
  humanToken: z.string().min(10),
  hp_initiative: z.string().optional(),
});

function normalizeText(value: string | undefined) {
  if (!value) return undefined;
  return value.replace(/\s+/g, " ").trim();
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  const ipRate = await rateLimitFromRequest(req, RATE_LIMIT.limit, RATE_LIMIT.windowMs, {
    scope: "initiative",
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

  const parsed = IntakeSchema.safeParse(payload);
  if (!parsed.success || !parsed.data.privacyAccepted) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (parsed.data.hp_initiative && parsed.data.hp_initiative.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const human = await verifyHumanTokenDetailed(parsed.data.humanToken);
  if (!human.ok) {
    return NextResponse.json({ ok: false, error: "invalid_human_token" }, { status: 400 });
  }
  const formId = typeof human.payload.formId === "string" ? human.payload.formId : "initiative";
  if (formId !== "initiative") {
    return NextResponse.json({ ok: false, error: "invalid_human_token" }, { status: 400 });
  }

  const db = await getMongoDb();
  const collection = db.collection("initiative_intake");

  const { token, tokenHash, expiresAt } = createReviewToken();
  const now = new Date();

  await collection.insertOne({
    orgName: normalizeText(parsed.data.orgName),
    contactName: normalizeText(parsed.data.contactName),
    contactEmail: parsed.data.contactEmail,
    topic: normalizeText(parsed.data.topic),
    region: normalizeText(parsed.data.region),
    goal: normalizeText(parsed.data.goal),
    notes: parsed.data.notes?.trim(),
    privacyAccepted: parsed.data.privacyAccepted,
    status: "new",
    createdAt: now,
    reviewTokenHash: tokenHash,
    reviewTokenExpiresAt: expiresAt,
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const reviewUrl = new URL(`/review?token=${token}`, getBaseUrl()).toString();
    const summaryLines = [
      `Thema: ${parsed.data.topic}`,
      `Kontakt: ${parsed.data.contactEmail}`,
    ];
    if (parsed.data.orgName) summaryLines.push(`Organisation: ${parsed.data.orgName}`);
    if (parsed.data.contactName) summaryLines.push(`Ansprechperson: ${parsed.data.contactName}`);
    if (parsed.data.region) summaryLines.push(`Region: ${parsed.data.region}`);
    if (parsed.data.goal) summaryLines.push(`Ziel: ${parsed.data.goal}`);
    if (parsed.data.notes) summaryLines.push(`Notizen: ${parsed.data.notes}`);

    await sendMail({
      to: adminEmail,
      subject: `Neue Initiative: ${parsed.data.topic}`,
      html: [
        "<h2>Neue Initiative (Intake)</h2>",
        "<ul>",
        ...summaryLines.map((line) => `<li>${line}</li>`),
        "</ul>",
        `<p><a href="${reviewUrl}">Eintrag pruefen</a></p>`,
      ].join(""),
    });
  } else {
    console.warn("[initiatives] ADMIN_EMAIL not set, skipping admin notification.");
  }

  return NextResponse.json({ ok: true });
}
