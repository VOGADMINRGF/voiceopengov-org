import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/utils/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ContactSchema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
  newsletterOptIn: z.string().optional(),
  website: z.string().optional(), // Honeypot
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const raw = Object.fromEntries(form.entries());
  const parsed = ContactSchema.safeParse(raw);

  const redirect = (suffix: string) => NextResponse.redirect(new URL(`/kontakt?${suffix}`, req.url));

  if (!parsed.success) {
    return redirect("error=invalid");
  }

  const {
    category,
    name,
    email,
    phone,
    subject,
    message,
    newsletterOptIn,
    website,
  } = parsed.data;

  // Honeypot: Bots füllen häufig "website" aus -> still drop
  if (website && `${website}`.trim() !== "") {
    return redirect("sent=1");
  }

  const to = process.env.CONTACT_INBOX || "kontakt@voiceopengov.org";
  const safeSubject =
    subject && subject.trim().length > 0
      ? subject.trim()
      : `Kontakt (${category})`;

  const html = `
    <h3>Neue Kontaktanfrage</h3>
    <p><strong>Kategorie:</strong> ${escapeHtml(category)}</p>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
    <p><strong>Newsletter Opt-In:</strong> ${newsletterOptIn ? "ja" : "nein"}</p>
    <p><strong>Nachricht:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  await sendMail({
    to,
    subject: safeSubject,
    html,
  });

  return redirect("sent=1");
}
