
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { getEnv } from "./env";

export function createTransport(): Transporter {
  const env = getEnv();
  const port = Number(env.SMTP_PORT || 587);
  const secure = port === 465;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

export async function verifyTransport(t: Transporter) {
  try {
    await t.verify();
    return { ok: true as const };
  } catch (e: any) {
    console.error("[SMTP verify]", e?.message || e);
    return { ok: false as const, error: "smtp_verify_failed", detail: String(e?.message || e) };
  }
}
