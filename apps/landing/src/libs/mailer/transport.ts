import nodemailer, { Transporter } from "nodemailer";
import { MAIL_ENABLED } from "@/libs/featureFlags";

const host = process.env.MAIL_HOST ?? "";
const port = Number(process.env.MAIL_PORT ?? 587);
const user = process.env.MAIL_USER ?? "";
const pass = process.env.MAIL_PASS ?? "";
const from = process.env.MAIL_FROM ?? "VoiceOpenGov <noreply@voiceopengov.org>";

let transporter: Transporter | null = null;

if (MAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined
    // falls nötig (Self-signed/older TLS):
    // tls: { rejectUnauthorized: false }
  });
}

export async function verifyTransport() {
  if (!MAIL_ENABLED || !transporter) return { ok: false, reason: "MAIL_DISABLED" } as const;
  try {
    await transporter.verify();
    return { ok: true } as const;
  } catch (err) {
    console.error("[mailer] verify failed:", err);
    return { ok: false, reason: "VERIFY_FAILED", error: String((err as Error).message || err) } as const;
  }
}

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  if (!MAIL_ENABLED || !transporter) return { ok: false, reason: "MAIL_DISABLED" } as const;
  try {
    await transporter.sendMail({ from, ...opts });
    return { ok: true } as const;
  } catch (err) {
    console.error("[mailer] send failed:", err);
    return { ok: false, reason: "SEND_FAILED", error: String((err as Error).message || err) } as const;
  }
}
