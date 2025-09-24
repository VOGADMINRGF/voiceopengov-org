// src/app/api/b2b/order/route.ts
import { NextResponse } from "next/server";
import { sendMail } from "@/libs/mailer/transport"; // existiert bei dir schon

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO: optional persistieren (Prisma) – fürs MVP reicht Mail
    const html = `
      <h3>B2B/Lokal-Bestellung</h3>
      <pre>${JSON.stringify(body, null, 2)}</pre>
    `;
    await sendMail({ to: process.env.MAIL_FROM!, subject: "B2B/Lokal – neue Anfrage", html });
    if (body?.email) {
      await sendMail({ to: body.email, subject: "Danke – wir melden uns", html: "<p>Danke für deine Anfrage. Wir melden uns bald mit Details.</p>"});
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
