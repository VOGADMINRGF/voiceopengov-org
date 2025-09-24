import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { prisma } from "@/libs/db/client";
import { ChapterLeadSchema } from "@/libs/validators/chapters";
import { sendMail } from "@/libs/mailer/transport";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = ChapterLeadSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });

    const lead = await prisma.chapterLead.create({
      data: {
        email: parsed.data.email,
        countryCode: parsed.data.countryCode,
        postal: parsed.data.postal,
        city: parsed.data.city,
        intent: parsed.data.intent === "join" ? "JOIN" : "FOUND",
        message: parsed.data.message
      }
    });

    const admin = process.env.MAIL_USER || process.env.MAIL_FROM || "noreply@voiceopengov.org";
    const html = `<!doctype html><html><body style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a">
      <h2>Neuer Chapter-Lead</h2>
      <p><strong>E-Mail:</strong> ${lead.email}</p>
      <p><strong>Land:</strong> ${lead.countryCode} · <strong>PLZ/Ort:</strong> ${lead.postal ?? ""} ${lead.city ?? ""}</p>
      <p><strong>Absicht:</strong> ${lead.intent}</p>
      <p><strong>Nachricht:</strong><br />${lead.message ?? "–"}</p>
    </body></html>`;

    // Mailversand darf nicht fehlschlagen lassen
    try { await sendMail({ to: String(admin), subject: "Neuer Chapter-Lead", html }); } catch {}

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/chapters] error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
