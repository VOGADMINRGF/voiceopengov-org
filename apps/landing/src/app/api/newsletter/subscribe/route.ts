// src/app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import crypto from "crypto";
import { prisma } from "@/libs/db/client";
import { NewsletterSchema } from "@/libs/validators/newsletter";
import { sendMail } from "@/libs/mailer/transport";

// sehr simples Memory-RateLimit (pro Node-Instance)
const rl = new Map<string, { count: number; ts: number }>();
function rateLimit(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const e = rl.get(key);
  if (!e || now - e.ts > windowMs) {
    rl.set(key, { count: 1, ts: now });
    return { allowed: true, remaining: limit - 1 };
  }
  if (e.count >= limit) return { allowed: false, remaining: 0 };
  e.count += 1;
  return { allowed: true, remaining: limit - e.count };
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip")?.trim() ||
      "0.0.0.0";

    const { allowed, remaining } = rateLimit(`newsletter:${ip}`);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 }
      );
    }

    const json = await req.json();

    // Honeypot-Feld (nicht ausfüllen)
    if (json?.website) {
      // still OK (silent drop), damit Bots keine Signale bekommen
      return NextResponse.json({ ok: true });
    }

    // Mini-Zeitgating (Client misst Eingabedauer in ms und sendet _duration)
    const dur = Number(json?._duration ?? 0);
    if (!Number.isFinite(dur) || dur < 800) {
      return NextResponse.json(
        { ok: false, error: "bot_suspected" },
        { status: 400 }
      );
    }

    // Eingabe validieren (NewsletterSchema: { email: string; locale?: string })
    const parsed = NewsletterSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid_input" },
        { status: 400 }
      );
    }

    const email = String(parsed.data.email).trim().toLowerCase();
    const locale = (parsed.data as any)?.locale || "de";

    // Supporter anlegen/finden
    const supporter = await prisma.supporter.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // neuer Bestätigungstoken – (re)aktiviert die Subscription
    const token = crypto.randomBytes(24).toString("hex");

    await prisma.newsletterSubscription.upsert({
      where: { supporterId: supporter.id },
      update: { token, subscribed: true, confirmedAt: null },
      create: { supporterId: supporter.id, token, subscribed: true },
    });

    // Basis-URL (prod in ENV setzen)
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Link zur API-Confirm-Route; die Route selbst macht Redirect → Danke-Seite
    const confirmUrl = `${base}/api/newsletter/confirm?token=${encodeURIComponent(
      token
    )}&locale=${encodeURIComponent(locale)}`;

    // Zweiter CTA (Unterstützen)
    const supportUrl = `${base}/${locale}/support?amount=5.63&rhythm=monthly`;

    // CI-konformes, dunkles HTML (aus V1), leicht aufgeräumt
    const html = `<!doctype html>
<html>
  <body style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#e5edff;background:#0b1220;padding:0;margin:0">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#0b1220;padding:32px">
      <tr><td>
        <h1 style="margin:0 0 16px 0;font-size:28px;line-height:1.2;color:#e5edff">
          Newsletter-Anmeldung bestätigen
        </h1>
        <p style="margin:0 0 20px 0;font-size:16px;color:#c7d2fe">
          Bitte bestätige deine Anmeldung:
        </p>
        <p style="margin:0 0 28px 0">
          <a href="${confirmUrl}" style="
            display:inline-block;padding:14px 22px;border-radius:999px;
            color:#fff;text-decoration:none;font-weight:700;
            background-image:linear-gradient(90deg,#22c1c3,#4b6bff);
            box-shadow:0 8px 22px rgba(75,107,255,.35);
          ">Bestätigen</a>
        </p>

        <p style="margin:0 0 14px 0;font-size:15px;color:#c7d2fe">
          Danke für dein Interesse! Damit wir dauerhaft wirken können, brauchen wir auch
          <strong>unterstützende Mitglieder</strong> – schon ein kleiner Mindestbeitrag von
          <strong>5,63&nbsp;€</strong> macht einen Unterschied.
        </p>
        <p style="margin:0 0 26px 0">
          <a href="${supportUrl}" style="
            display:inline-block;padding:10px 16px;border-radius:999px;border:1px solid #7dd3fc;
            color:#e6f9ff;background:#04121a;text-decoration:none
          ">Unterstützen ab 5,63&nbsp;€</a>
        </p>

        <p style="margin:0 0 10px 0;font-size:13px;color:#94a3b8">
          Falls der Button nicht funktioniert, kopiere diesen Link:
        </p>
        <p style="word-break:break-all;font-size:12px;color:#94a3b8">${confirmUrl}</p>
      </td></tr>
    </table>
  </body>
</html>`;

    await sendMail({
      to: email,
      subject: "Bitte Anmeldung bestätigen – VoiceOpenGov",
      html,
    });

    const res = NextResponse.json({ ok: true });
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    return res;
  } catch (e) {
    console.error("[newsletter/subscribe] error", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
