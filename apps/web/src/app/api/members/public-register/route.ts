import crypto from "crypto";
import { NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";
import { sendMail } from "@/lib/mail/sendMail";

export const runtime = "nodejs";

const MIN_DONATION_CENTS = 500;
const MAX_IMAGE_DATA_URL_LENGTH = 4_000_000;
const DATA_URL_PREFIX = "data:image/";

type Body = {
  type?: "person" | "organisation";
  email?: string;
  firstName?: string;
  lastName?: string;
  orgName?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;

  isPublic?: boolean;
  visibility?: "public" | "private";

  publicSupporter?: boolean;
  avatarUrl?: string;
  supporterImageUrl?: string;

  wantsNewsletter?: boolean;
  wantsNewsletterEdDebatte?: boolean;
  donationCents?: number;
};

type MemberDoc = {
  type: "person" | "organisation";
  email: string;

  firstName?: string;
  lastName?: string;
  orgName?: string;

  city?: string;
  country?: string;
  lat?: number;
  lng?: number;

  isPublic: boolean;
  avatarUrl?: string;

  publicSupporter: boolean;
  supporterImageUrl?: string;

  wantsNewsletter: boolean;
  wantsNewsletterEdDebatte: boolean;

  status: "pending" | "active";
  doiToken: string;
  doiExpiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
};

function normEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeHttpUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return trimmed;
  } catch {
    return undefined;
  }
}

function normalizeImageDataUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (!trimmed.startsWith(DATA_URL_PREFIX)) return undefined;
  if (trimmed.length > MAX_IMAGE_DATA_URL_LENGTH) return undefined;
  return trimmed;
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body?.email) {
      return NextResponse.json(
        { ok: false, requestId, error: { message: "missing_email" } },
        { status: 400 }
      );
    }

    const donationCents = typeof body.donationCents === "number" ? body.donationCents : 0;
    if (donationCents > 0 && donationCents < MIN_DONATION_CENTS) {
      return NextResponse.json(
        { ok: false, requestId, error: { message: "donation_min_5_eur" } },
        { status: 400 }
      );
    }

    const email = normEmail(body.email);
    const type: "person" | "organisation" = body.type === "organisation" ? "organisation" : "person";

    const isPublic =
      typeof body.isPublic === "boolean" ? body.isPublic : body.visibility === "public";

    const publicSupporter = Boolean(body.publicSupporter);
    const wantsNewsletter = Boolean(body.wantsNewsletter);
    const wantsNewsletterEdDebatte = Boolean(body.wantsNewsletterEdDebatte);

    const token = crypto.randomBytes(24).toString("hex");
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const now = new Date();

    const avatarUrl = isPublic
      ? type === "organisation"
        ? normalizeHttpUrl(body.avatarUrl)
        : normalizeImageDataUrl(body.avatarUrl)
      : undefined;

    const supporterImageUrl = publicSupporter
      ? type === "organisation"
        ? normalizeHttpUrl(body.supporterImageUrl)
        : normalizeImageDataUrl(body.supporterImageUrl)
      : undefined;

    const doc: MemberDoc = {
      type,
      email,

      firstName: body.firstName?.trim() || undefined,
      lastName: body.lastName?.trim() || undefined,
      orgName: body.orgName?.trim() || undefined,

      city: body.city?.trim() || undefined,
      country: body.country?.trim() || undefined,
      lat: typeof body.lat === "number" ? body.lat : undefined,
      lng: typeof body.lng === "number" ? body.lng : undefined,

      isPublic,
      avatarUrl,

      publicSupporter,
      supporterImageUrl,

      wantsNewsletter,
      wantsNewsletterEdDebatte,

      status: "pending",
      doiToken: token,
      doiExpiresAt: expires,

      createdAt: now,
      updatedAt: now,
    };

    const col = await membersCol();
    const { createdAt, ...docWithoutCreatedAt } = doc;

    await col.updateOne(
      { email },
      {
        $set: { ...docWithoutCreatedAt, updatedAt: new Date() },
        $setOnInsert: { createdAt },
      },
      { upsert: true }
    );

    const base =
      process.env.PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";
    const confirmUrl = `${base}/api/members/confirm?token=${token}`;
    await sendMail({
      to: email,
      subject: "Bitte E-Mail bestätigen – VoiceOpenGov",
      html: [
        "<p>Danke für deine Eintragung bei VoiceOpenGov.</p>",
        "<p>Bitte bestätige deine E-Mail-Adresse, damit wir dich aktivieren können:</p>",
        `<p><a href="${confirmUrl}">E-Mail bestätigen</a></p>`,
        "<p>Wenn du dich nicht eingetragen hast, kannst du diese E-Mail ignorieren.</p>",
      ].join(""),
    });

    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json({ ok: true, requestId, devToken: isDev ? token : undefined });
  } catch (err: any) {
    console.error("[public-register]", requestId, err);

    const msg =
      process.env.NODE_ENV === "development"
        ? (err?.message ?? String(err))
        : "Das hat nicht geklappt. Bitte später erneut versuchen.";

    return NextResponse.json(
      { ok: false, requestId, error: { message: msg } },
      { status: 500 }
    );
  }
}
