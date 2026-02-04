import crypto from "crypto";
import { NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";
import { sendMail } from "@/lib/mail/sendMail";

export const runtime = "nodejs";

const MIN_DONATION_CENTS = 500;
const MAX_IMAGE_DATA_URL_LENGTH = 4_000_000;
const DATA_URL_PREFIX = "data:image/";
const MIN_AGE = 16;

type Body = {
  type?: "person" | "organisation";
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
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
  supporterNote?: string;

  wantsNewsletter?: boolean;
  wantsNewsletterEdDebatte?: boolean;
  donationCents?: number;
};

type MemberDoc = {
  type: "person" | "organisation";
  email: string;

  firstName?: string;
  lastName?: string;
  birthDate?: string;
  orgName?: string;

  city?: string;
  country?: string;
  lat?: number;
  lng?: number;

  isPublic: boolean;
  avatarUrl?: string;

  publicSupporter: boolean;
  supporterImageUrl?: string;
  supporterNote?: string;

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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

function isAtLeastAge(date: Date, minAge: number) {
  const now = new Date();
  const cutoff = new Date(
    Date.UTC(now.getUTCFullYear() - minAge, now.getUTCMonth(), now.getUTCDate()),
  );
  return date <= cutoff;
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
    const supporterNote =
      publicSupporter && typeof body.supporterNote === "string"
        ? body.supporterNote.replace(/\s+/g, " ").trim().slice(0, 160)
        : undefined;

    let birthDateValue: string | undefined;
    if (type === "person") {
      const birthRaw = typeof body.birthDate === "string" ? body.birthDate : "";
      const parsedBirth = parseDateOnly(birthRaw);
      if (!parsedBirth) {
        return NextResponse.json(
          { ok: false, requestId, error: { message: "invalid_birthdate" } },
          { status: 400 }
        );
      }
      if (!isAtLeastAge(parsedBirth, MIN_AGE)) {
        return NextResponse.json(
          { ok: false, requestId, error: { message: "underage" } },
          { status: 400 }
        );
      }
      birthDateValue = parsedBirth.toISOString().slice(0, 10);
    }

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
      birthDate: birthDateValue,
      orgName: body.orgName?.trim() || undefined,

      city: body.city?.trim() || undefined,
      country: body.country?.trim() || undefined,
      lat: typeof body.lat === "number" ? body.lat : undefined,
      lng: typeof body.lng === "number" ? body.lng : undefined,

      isPublic,
      avatarUrl,

      publicSupporter,
      supporterImageUrl,
      supporterNote,

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

    const upsertResult = await col.updateOne(
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

    const displayName =
      type === "organisation"
        ? body.orgName?.trim()
        : [body.firstName?.trim(), body.lastName?.trim()].filter(Boolean).join(" ");
    const locationParts = [body.city?.trim(), body.country?.trim()].filter(Boolean).join(", ");
    const visibilityText = isPublic ? "Öffentlich (nur Orts-Summen)" : "Privat";
    const supporterText = publicSupporter ? "Ja" : "Nein";
    const newsletterText = wantsNewsletter ? "Ja" : "Nein";
    const newsletterEdText = wantsNewsletterEdDebatte ? "Ja" : "Nein";
    const birthDateText = birthDateValue
      ? birthDateValue.split("-").reverse().join(".")
      : undefined;
    const donationUrl = "https://startnext.com/mehrheit";
    const contactUrl = `${base}/kontakt`;
    const notifyEmail =
      process.env.VOG_MEMBERSHIP_CONTACT_EMAIL || "members@voiceopengov.org";

    if (upsertResult.upsertedId) {
      const summaryLines = [
        `Mitgliedschaft: ${type === "organisation" ? "Organisation" : "Person"}`,
        `Name: ${displayName ? escapeHtml(displayName) : "—"}`,
        `Ort: ${locationParts ? escapeHtml(locationParts) : "—"}`,
        `Sichtbarkeit: ${visibilityText}`,
        `Unterstützer-Banner: ${supporterText}`,
        `Newsletter VoiceOpenGov: ${newsletterText}`,
        `Updates eDebatte: ${newsletterEdText}`,
      ];
      if (supporterNote) summaryLines.push(`Motivation: ${escapeHtml(supporterNote)}`);
      if (birthDateText) summaryLines.push(`Geburtsdatum: ${escapeHtml(birthDateText)}`);

      try {
        await sendMail({
          to: notifyEmail,
          subject: `Neuer Eintrag: ${displayName || email}`,
          html: [
            "<h2>Neuer Mitgliedseintrag</h2>",
            "<ul>",
            ...summaryLines.map((line) => `<li>${line}</li>`),
            "</ul>",
          ].join(""),
        });
      } catch (err) {
        console.warn("[public-register] notify email failed", err);
      }
    }

    await sendMail({
      to: email,
      subject: "Bitte E-Mail bestätigen – VoiceOpenGov",
      html: [
        `<div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #0f172a;">`,
        `<h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700;">Bitte E-Mail bestätigen</h2>`,
        `<p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5;">Danke für deine Eintragung bei VoiceOpenGov. Bitte bestätige deine E-Mail-Adresse, damit wir dich aktivieren können:</p>`,
        `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 14px;">`,
        `<tr>`,
        `<td bgcolor="#0ea5e9" style="border-radius: 999px;">`,
        `<a href="${confirmUrl}" style="display: inline-block; padding: 10px 18px; font-weight: 600; font-size: 14px; color: #ffffff; text-decoration: none; border-radius: 999px;">E-Mail bestätigen</a>`,
        `</td>`,
        `</tr>`,
        `</table>`,
        `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 22px;">`,
        `<tr>`,
        `<td bgcolor="#06b6d4" style="border-radius: 999px;">`,
        `<a href="${donationUrl}" style="display: inline-block; padding: 8px 14px; font-weight: 600; font-size: 12px; color: #ffffff; text-decoration: none; border-radius: 999px;">Spenden via Startnext</a>`,
        `</td>`,
        `<td style="width: 10px;"></td>`,
        `<td bgcolor="#e2e8f0" style="border-radius: 999px;">`,
        `<a href="${contactUrl}" style="display: inline-block; padding: 8px 14px; font-weight: 600; font-size: 12px; color: #0f172a; text-decoration: none; border-radius: 999px;">Fragen?</a>`,
        `</td>`,
        `</tr>`,
        `</table>`,
        `<div style="margin: 0 0 18px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc;">`,
        `<div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 8px;">Deine Angaben</div>`,
        `<table style="width: 100%; font-size: 13px; color: #0f172a; border-collapse: collapse;">`,
        `<tr><td style="padding: 4px 0; color: #475569;">Mitgliedschaft</td><td style="padding: 4px 0; font-weight: 600;">${type === "organisation" ? "Organisation" : "Person"}</td></tr>`,
        displayName
          ? `<tr><td style="padding: 4px 0; color: #475569;">Name</td><td style="padding: 4px 0; font-weight: 600;">${escapeHtml(displayName)}</td></tr>`
          : "",
        birthDateText
          ? `<tr><td style="padding: 4px 0; color: #475569;">Geburtsdatum</td><td style="padding: 4px 0; font-weight: 600;">${escapeHtml(birthDateText)}</td></tr>`
          : "",
        locationParts
          ? `<tr><td style="padding: 4px 0; color: #475569;">Ort</td><td style="padding: 4px 0; font-weight: 600;">${escapeHtml(locationParts)}</td></tr>`
          : "",
        `<tr><td style="padding: 4px 0; color: #475569;">Sichtbarkeit</td><td style="padding: 4px 0; font-weight: 600;">${visibilityText}</td></tr>`,
        `<tr><td style="padding: 4px 0; color: #475569;">Unterstützer-Banner</td><td style="padding: 4px 0; font-weight: 600;">${supporterText}</td></tr>`,
        supporterNote
          ? `<tr><td style="padding: 4px 0; color: #475569;">Motivation</td><td style="padding: 4px 0; font-weight: 600;">${escapeHtml(supporterNote)}</td></tr>`
          : "",
        `<tr><td style="padding: 4px 0; color: #475569;">Newsletter VoiceOpenGov</td><td style="padding: 4px 0; font-weight: 600;">${newsletterText}</td></tr>`,
        `<tr><td style="padding: 4px 0; color: #475569;">Updates eDebatte</td><td style="padding: 4px 0; font-weight: 600;">${newsletterEdText}</td></tr>`,
        `</table>`,
        `</div>`,
        `<p style="margin: 0 0 10px; font-size: 13px; color: #334155;">Wir halten aktuell über Startnext Ausschau nach finanziellen Mitteln, um Infrastruktur, Moderation und Chapters auszubauen.</p>`,
        `<p style="margin: 0 0 10px; font-size: 13px; color: #334155;">Wenn du dich in Marketing, Programmierung oder gesellschaftlich einbringen willst, freuen wir uns auf ein Zeichen an <a href="mailto:members@voiceopengov.org" style="color:#0ea5e9; font-weight:600; text-decoration:none;">members@voiceopengov.org</a>.</p>`,
        `<p style="margin: 0 0 16px; font-size: 13px; color: #334155;">Ansonsten freuen wir uns erstmal über deine Beteiligung.</p>`,
        `<p style="margin: 0; font-size: 12px; color: #64748b;">Wenn du dich nicht eingetragen hast, kannst du diese E-Mail ignorieren.</p>`,
        `</div>`,
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
