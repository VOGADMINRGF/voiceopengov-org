import { NextResponse } from "next/server";
import { prisma } from "@/libs/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCALE_RE = /^[a-z]{2}(?:-[A-Z]{2})?$/;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const rawLocale = url.searchParams.get("locale") || "de";
  const locale = LOCALE_RE.test(rawLocale) ? rawLocale : "de";

  const redirectTo = (ok: "0" | "1") =>
    NextResponse.redirect(new URL(`/${locale}/newsletter/confirm?ok=${ok}`, url.origin));

  if (!token) return redirectTo("0");

  try {
    // Wenn UNIQUE(token) im Schema vorhanden ist → findUnique; ansonsten findFirst.
    const sub = await prisma.newsletterSubscription.findFirst({ where: { token } });
    if (!sub) return redirectTo("0");

    // Token-Ablauf prüfen (falls Feld existiert)
    if (sub.tokenExpiresAt && sub.tokenExpiresAt < new Date()) {
      await prisma.newsletterSubscription.update({
        where: { supporterId: sub.supporterId },
        data: { token: null, tokenExpiresAt: null },
      });
      return redirectTo("0");
    }

    // Idempotenz: schon bestätigt?
    if (sub.confirmedAt && sub.subscribed) {
      if (sub.token) {
        await prisma.newsletterSubscription.update({
          where: { supporterId: sub.supporterId },
          data: { token: null, tokenExpiresAt: null },
        });
      }
      return redirectTo("1");
    }

    // Bestätigen
    await prisma.newsletterSubscription.update({
      where: { supporterId: sub.supporterId },
      data: {
        token: null,
        tokenExpiresAt: null,
        confirmedAt: new Date(),
        subscribed: true,
        unsubscribedAt: null,
      },
    });

    return redirectTo("1");
  } catch (e) {
    console.error("[newsletter/confirm] error", e);
    return redirectTo("0");
  }
}
