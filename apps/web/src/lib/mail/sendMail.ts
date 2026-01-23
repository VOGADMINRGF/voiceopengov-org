import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const { to, subject, html, text } = opts;
  const from = process.env.MAIL_FROM || "noreply@voiceopengov.org";

  const wantsSmtp = Boolean(process.env.SMTP_HOST || process.env.SMTP_USER);
  if (!wantsSmtp) {
    console.warn("[mailer] SMTP not configured; falling back to console output.");
    console.log(`[MAIL->${to}] ${subject}\n${html}\n`);
    return { ok: true, fallback: true as const };
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text: text ?? html.replace(/<[^>]+>/g, ""),
  });

  return { ok: true, smtp: true as const };
}
