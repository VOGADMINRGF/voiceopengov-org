import { NextResponse } from "next/server";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { prisma } from "@/libs/db/client"; // Singleton-Client (empfohlen)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCALE_RE = /^[a-z]{2}(?:-[A-Z]{2})?$/;
const TOKEN_TTL_HOURS = 48;

function baseUrl(req: Request) {
  return (
    process.env.PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    new URL(req.url).origin
  );
}

// Mailer einmalig initialisieren
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || "587"),
  secure: Number(process.env.SMTP_PORT || "587") === 465,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
});
const FROM = process.env.SMTP_FROM || "no-reply@example.org";

async function sendConfirmMail(to: string, link: string, locale = "de") {
  const t = (d: Record<string, string>) => d[locale] || d.de;
  const subject = t({
    de: "Bitte bestätige deine Newsletter-Anmeldung",
    en: "Please confirm your newsletter subscription",
  });
  const text = t({
    de: `Hi!

Bitte bestätige deine Anmeldung mit diesem Link:

${link}

Wenn du das nicht warst, kannst du diese E-Mail ignorieren.`,
    en: `Hi!

Please confirm your subscription with this link:

${link}

If this wasn't you, you can ignore this email.`,
  });
  await transporter.sendMail({
    from: FROM,
    to,
    subject,
    text,
    html: `<p>${text.replace(/\n/g, "<br/>")}</p>`,
  });
}

export async function POST(req: Request) {
  try {
    const { email, name, locale: rawLocale } =
      ((await req.json().catch(() => ({}))) as {
        email?: string;
        name?: string;
        locale?: string;
      }) || {};

    const emailNorm = (email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }
    const locale =
      (rawLocale && LOCALE_RE.test(rawLocale) && rawLocale) ||
      process.env.DEFAULT_LOCALE ||
      "de";

    // Supporter anlegen/aktualisieren
    const supporter = await prisma.supporter.upsert({
      where: { email: emailNorm },
      create: { email: emailNorm, firstName: name ?? "" },
      update: { firstName: name ?? undefined },
    });

    // neuen Token + Ablauf erzeugen
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

    // Subscription auf pending setzen (subscribed=false) – idempotent
    await prisma.newsletterSubscription.upsert({
      where: { supporterId: supporter.id },
      create: {
        supporterId: supporter.id,
        token,
        tokenExpiresAt: expiresAt,
        subscribed: false,
        confirmedAt: null,
        unsubscribedAt: null,
      },
      update: {
        token,
        tokenExpiresAt: expiresAt,
        subscribed: false,
        confirmedAt: null,
        unsubscribedAt: null,
      },
    });

    // Bestätigungslink zur Confirm-API (die auf die schöne Seite umleitet)
    const confirmLink = new URL(
      `/api/newsletter/confirm?token=${encodeURIComponent(token)}&locale=${encodeURIComponent(
        locale
      )}`,
      baseUrl(req)
    ).toString();

    await sendConfirmMail(emailNorm, confirmLink, locale);

    return NextResponse.json({ ok: true, status: "pending" });
  } catch (e) {
    console.error("[newsletter/subscribe] error", e);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}
