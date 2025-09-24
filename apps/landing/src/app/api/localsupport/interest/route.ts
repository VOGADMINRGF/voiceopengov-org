import { NextResponse } from "next/server";
import { ChapterInterestSchema, type ChapterInterestInput } from "@/libs/validators/chapterInterest";
import { requiresShipping } from "@/libs/chapters/bundles";
import { sendMail } from "@/libs/mailer/transport"; // passe ggf. auf deinen Mail‑Helper an

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as unknown;
    const parsed = ChapterInterestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid_input", issues: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data as ChapterInterestInput;

    // Minimal‑Routing/Branching
    const branch = data.interestType === "b2b" ? "B2B Standort" : "Vor‑Ort Support";
    const needShip = data.bundles && requiresShipping(data.bundles);

    // E‑Mail an Ops (kann durch DB‑Insert ersetzt/ergänzt werden)
    const subject = `Chapter‑Interesse: ${branch} – ${data.city ?? data.country}`;
    const pre = [
      `Typ: ${branch}`,
      `Land/Ort: ${data.country}${data.postal ? ", " + data.postal : ""}${data.city ? " " + data.city : ""}`,
      `E‑Mail: ${data.email}`,
      data.message ? `Nachricht: ${data.message}` : null,
      data.bundles?.length ? `Bundle: ${data.bundles.map((b) => `${b.key}×${b.qty}`).join(", ")}` : null,
      needShip ? `Versand: JA (${data.shipping?.street ?? "Adresse folgt"})` : `Versand: nein`,
      data.opening?.length ? `Öffnungszeiten: ${data.opening.map((o) => `${o.day}@${o.start}-${o.end}`).join(", ")}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await sendMail({
        to: process.env.OPSMail ?? "ops@voiceopengov.local",
        subject,
        text: pre,
      });
    } catch {
      // Falls Mailer nicht konfiguriert: nicht fatal
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}