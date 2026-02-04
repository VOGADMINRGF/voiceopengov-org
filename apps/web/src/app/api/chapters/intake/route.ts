import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chapterIntakeCol } from "@/lib/vogMongo";
import { verifyHumanTokenDetailed } from "@/lib/security/human-token";
import { sendMail } from "@/lib/mail/sendMail";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 4, windowMs: 30 * 60 * 1000 };
const INTEREST_VALUES = ["start", "join", "space", "info"] as const;

const IntakeSchema = z.object({
  contactName: z.string().min(2).max(120),
  contactEmail: z.string().email().max(320),
  orgName: z.string().max(160).optional(),
  location: z.string().min(2).max(160),
  interests: z.array(z.enum(INTEREST_VALUES)).min(1),
  spaceAvailable: z.enum(["yes", "maybe", "no"]).optional(),
  spaceNotes: z.string().max(800).optional(),
  notes: z.string().max(1500).optional(),
  privacyAccepted: z.boolean(),
  humanToken: z.string().min(10),
  hp_chapter: z.string().optional(),
});

const INTEREST_LABELS: Record<(typeof INTEREST_VALUES)[number], string> = {
  start: "Chapter starten",
  join: "Mithelfen",
  space: "Raeumlichkeiten anbieten",
  info: "Erstmal Infos",
};

const SPACE_LABELS: Record<"yes" | "maybe" | "no", string> = {
  yes: "Ja, Raum vorhanden",
  maybe: "Vielleicht / spaeter",
  no: "Kein Raum",
};

function normalizeText(value: string | undefined) {
  if (!value) return undefined;
  return value.replace(/\s+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  const ipRate = await rateLimitFromRequest(req, RATE_LIMIT.limit, RATE_LIMIT.windowMs, {
    scope: "chapter",
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

  if (parsed.data.hp_chapter && parsed.data.hp_chapter.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const human = await verifyHumanTokenDetailed(parsed.data.humanToken);
  if (!human.ok) {
    return NextResponse.json({ ok: false, error: "invalid_human_token" }, { status: 400 });
  }
  const formId = typeof human.payload.formId === "string" ? human.payload.formId : "chapter-intake";
  if (formId !== "chapter-intake") {
    return NextResponse.json({ ok: false, error: "invalid_human_token" }, { status: 400 });
  }

  const collection = await chapterIntakeCol();
  const now = new Date();

  await collection.insertOne({
    contactName: normalizeText(parsed.data.contactName) ?? parsed.data.contactName,
    contactEmail: parsed.data.contactEmail,
    orgName: normalizeText(parsed.data.orgName),
    location: normalizeText(parsed.data.location),
    interests: parsed.data.interests,
    spaceAvailable: parsed.data.spaceAvailable,
    spaceNotes: normalizeText(parsed.data.spaceNotes),
    notes: parsed.data.notes?.trim(),
    privacyAccepted: parsed.data.privacyAccepted,
    status: "new",
    createdAt: now,
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const interestLabels = parsed.data.interests.map((value) => INTEREST_LABELS[value]).join(", ");
    const summaryLines = [
      `Kontakt: ${parsed.data.contactEmail}`,
      `Name: ${parsed.data.contactName}`,
      `Interesse: ${interestLabels}`,
    ];
    if (parsed.data.orgName) summaryLines.push(`Organisation: ${parsed.data.orgName}`);
    if (parsed.data.location) summaryLines.push(`Ort/Region: ${parsed.data.location}`);
    if (parsed.data.spaceAvailable) {
      summaryLines.push(`Raeume: ${SPACE_LABELS[parsed.data.spaceAvailable]}`);
    }
    if (parsed.data.spaceNotes) summaryLines.push(`Raum-Details: ${parsed.data.spaceNotes}`);
    if (parsed.data.notes) summaryLines.push(`Notizen: ${parsed.data.notes}`);

    await sendMail({
      to: adminEmail,
      subject: `Chapter-Anfrage: ${parsed.data.contactName}`,
      html: [
        "<h2>Neue Chapter-Anfrage</h2>",
        "<ul>",
        ...summaryLines.map((line) => `<li>${line}</li>`),
        "</ul>",
      ].join(""),
    });
  }

  return NextResponse.json({ ok: true });
}
