// src/app/api/newsletter/confirm/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/libs/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const locale = url.searchParams.get("locale") || "de";

  const to = (ok: "0" | "1") =>
    NextResponse.redirect(new URL(`/${locale}/newsletter/confirm?ok=${ok}`, url.origin));

  if (!token) return to("0");

  try {
    // Tipp: Lege in Prisma/DB ein UNIQUE-Index auf `token` (nullable) an,
    // dann kannst du hier auch `findUnique` verwenden.
    const sub = await prisma.newsletterSubscription.findFirst({ where: { token } });
    if (!sub) return to("0");

    // Idempotent: Falls bereits bestätigt, trotzdem nett "ok=1" anzeigen
    if (sub.confirmedAt && sub.subscribed) {
      // Aufräumen, falls der Token wider Erwarten noch gesetzt ist
      if (sub.token) {
        await prisma.newsletterSubscription.update({
          where: { supporterId: sub.supporterId },
          data: { token: null },
        });
      }
      return to("1");
    }

    await prisma.newsletterSubscription.update({
      where: { supporterId: sub.supporterId },
      data: {
        token: null,                 // macht den Link einmalig
        confirmedAt: new Date(),     // Zeitstempel setzen
        subscribed: true,            // Double-Opt-in finalisieren
      },
    });

    return to("1");
  } catch (e) {
    console.error("[newsletter/confirm] error", e);
    return to("0");
  }
}
