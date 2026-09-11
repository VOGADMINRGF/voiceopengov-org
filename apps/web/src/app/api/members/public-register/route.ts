import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";
import { sendMail } from "@/lib/mail/sendMail";
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from "@/config/locales";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";
import { buildDoiMail, createDoiToken } from "@/lib/membershipDoi";
import { recordFunnelEvent } from "@/lib/funnelEvents";

export const runtime = "nodejs";

const MIN_DONATION_CENTS = 500;
const MAX_IMAGE_DATA_URL_LENGTH = 4_000_000;
const DATA_URL_PREFIX = "data:image/";
const MIN_AGE = 16;
const RATE_LIMIT = { limit: 6, windowMs: 15 * 60 * 1000 };

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
  locale?: string;
  acquisition?: {
    landingPath?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
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
  doiTokenHash: string;
  doiExpiresAt: Date;
  doiSentAt: Date;

  createdAt: Date;
  updatedAt: Date;
  locale: SupportedLocale;
  acquisition?: Body["acquisition"];
};

function cleanAcquisition(input: Body["acquisition"]): Body["acquisition"] | undefined {
  if (!input || typeof input !== "object") return undefined;
  const clean = (value: unknown, max: number) =>
    typeof value === "string" ? value.replace(/[\r\n]/g, " ").trim().slice(0, max) || undefined : undefined;
  const result = {
    landingPath: clean(input.landingPath, 240),
    referrer: clean(input.referrer, 500),
    utmSource: clean(input.utmSource, 120),
    utmMedium: clean(input.utmMedium, 120),
    utmCampaign: clean(input.utmCampaign, 160),
  };
  return Object.values(result).some(Boolean) ? result : undefined;
}

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

function containsContactInfo(value: string) {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const urlRegex = /\bhttps?:\/\/|\bwww\./i;
  return emailRegex.test(value) || urlRegex.test(value);
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

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    const ipRate = await rateLimitFromRequest(req, RATE_LIMIT.limit, RATE_LIMIT.windowMs, {
      scope: "public-member-register",
    });
    if (!ipRate.ok) {
      return NextResponse.json(
        { ok: false, requestId, error: { message: "rate_limited" }, retryIn: ipRate.retryIn },
        { status: 429, headers: rateLimitHeaders(ipRate) },
      );
    }

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
    const locale = isSupportedLocale(body.locale) ? body.locale : DEFAULT_LOCALE;
    const type: "person" | "organisation" = body.type === "organisation" ? "organisation" : "person";

    const isPublic =
      typeof body.isPublic === "boolean" ? body.isPublic : body.visibility === "public";

    const publicSupporter = Boolean(body.publicSupporter);
    const wantsNewsletter = Boolean(body.wantsNewsletter);
    const wantsNewsletterEdDebatte = Boolean(body.wantsNewsletterEdDebatte);
    const supporterNoteRaw =
      typeof body.supporterNote === "string" ? body.supporterNote : "";
    const supporterNote = supporterNoteRaw.replace(/\s+/g, " ").trim().slice(0, 160) || undefined;
    if (supporterNote && containsContactInfo(supporterNote)) {
      return NextResponse.json(
        { ok: false, requestId, error: { message: "supporter_note_contact" } },
        { status: 400 }
      );
    }

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

    const { token, tokenHash, expiresAt: expires } = createDoiToken();

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
      doiTokenHash: tokenHash,
      doiExpiresAt: expires,
      doiSentAt: now,

      createdAt: now,
      updatedAt: now,
      locale,
      acquisition: cleanAcquisition(body.acquisition),
    };

    const col = await membersCol();
    const existing = await col.findOne({ email }, { projection: { status: 1 } });
    if (existing?.status === "active") {
      return NextResponse.json({ ok: true, requestId });
    }
    const { createdAt, ...docWithoutCreatedAt } = doc;

    const upsertResult = await col.updateOne(
      { email },
      {
        $set: { ...docWithoutCreatedAt, updatedAt: new Date() },
        $setOnInsert: { createdAt },
      },
      { upsert: true }
    );
    const memberId = String(
      upsertResult.upsertedId ?? (await col.findOne({ email }, { projection: { _id: 1 } }))?._id ?? "",
    );
    await recordFunnelEvent({
      event: "registration_submitted",
      memberId,
      source: doc.acquisition?.utmSource,
      medium: doc.acquisition?.utmMedium,
      campaign: doc.acquisition?.utmCampaign,
      country: doc.country,
      locale,
      landingPath: doc.acquisition?.landingPath,
    }).catch((error) => console.warn("[public-register] funnel event failed", error));

    const base =
      process.env.PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";
    const confirmUrl = `${base}/api/members/confirm?token=${token}&lang=${locale}`;

    const displayName =
      type === "organisation"
        ? body.orgName?.trim()
        : [body.firstName?.trim(), body.lastName?.trim()].filter(Boolean).join(" ");
    const locationParts = [body.city?.trim(), body.country?.trim()].filter(Boolean).join(", ");
    const visibilityText = isPublic ? "Anonym (nur Orts-Summen)" : "Privat";
    const supporterText = publicSupporter ? "Ja" : "Nein";
    const newsletterText = wantsNewsletter ? "Ja" : "Nein";
    const newsletterEdText = wantsNewsletterEdDebatte ? "Ja" : "Nein";
    const birthDateText = birthDateValue
      ? birthDateValue.split("-").reverse().join(".")
      : undefined;
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

    await sendMail({ to: email, ...buildDoiMail(locale, confirmUrl) });
    await recordFunnelEvent({
      event: "doi_sent",
      memberId,
      source: doc.acquisition?.utmSource,
      medium: doc.acquisition?.utmMedium,
      campaign: doc.acquisition?.utmCampaign,
      country: doc.country,
      locale,
      landingPath: doc.acquisition?.landingPath,
    }).catch((error) => console.warn("[public-register] funnel event failed", error));

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
