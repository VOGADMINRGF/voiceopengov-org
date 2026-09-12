import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { membersCol } from "@/lib/vogMongo";
import { createPasswordSetupToken, normalizeMemberEmail } from "@/lib/memberAuth";
import { sendMail } from "@/lib/mail/sendMail";
import { getTextDirection, type SupportedLocale } from "@/config/locales";
import { resolveDoiLocale } from "@/lib/membershipDoi";
import { rateLimitFromRequest, rateLimitHeaders } from "@/utils/rateLimitHelpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 5, windowMs: 30 * 60 * 1000 };
const StartSchema = z.object({ email: z.string().email().max(320) });

type AccessMail = { subject: string; title: string; body: string; button: string; expiry: string };
const ACCESS_MAIL: Record<SupportedLocale, AccessMail> = {
  de: { subject: "VoiceOpenGov – Mitgliedszugang", title: "Dein VoiceOpenGov-Mitgliedszugang", body: "Über diesen Link kannst du deinen Mitgliedszugang erstmals einrichten oder dein Passwort neu setzen.", button: "Zugang einrichten", expiry: "Der Link ist zwei Stunden gültig. Wenn du ihn nicht angefordert hast, kannst du diese E-Mail ignorieren." },
  en: { subject: "VoiceOpenGov – member access", title: "Your VoiceOpenGov member access", body: "Use this link to set up your member access for the first time or reset your password.", button: "Set up access", expiry: "The link is valid for two hours. If you did not request it, you can ignore this email." },
  fr: { subject: "VoiceOpenGov – accès membre", title: "Votre accès membre VoiceOpenGov", body: "Utilisez ce lien pour configurer votre accès membre ou réinitialiser votre mot de passe.", button: "Configurer l’accès", expiry: "Le lien est valable deux heures. Si vous ne l’avez pas demandé, ignorez cet e-mail." },
  es: { subject: "VoiceOpenGov – acceso de miembro", title: "Tu acceso de miembro de VoiceOpenGov", body: "Usa este enlace para configurar tu acceso de miembro o restablecer tu contraseña.", button: "Configurar acceso", expiry: "El enlace es válido durante dos horas. Si no lo solicitaste, ignora este correo." },
  tr: { subject: "VoiceOpenGov – üye erişimi", title: "VoiceOpenGov üye erişiminiz", body: "Üye erişiminizi ayarlamak veya şifrenizi sıfırlamak için bu bağlantıyı kullanın.", button: "Erişimi ayarla", expiry: "Bağlantı iki saat geçerlidir. Siz istemediyseniz bu e-postayı yok sayabilirsiniz." },
  ar: { subject: "VoiceOpenGov – وصول العضو", title: "وصولك كعضو في VoiceOpenGov", body: "استخدم هذا الرابط لإعداد وصول العضو أو إعادة تعيين كلمة المرور.", button: "إعداد الوصول", expiry: "الرابط صالح لمدة ساعتين. إذا لم تطلبه، يمكنك تجاهل هذه الرسالة." },
  pl: { subject: "VoiceOpenGov – dostęp członka", title: "Twój dostęp członka VoiceOpenGov", body: "Użyj tego linku, aby skonfigurować dostęp członka lub zresetować hasło.", button: "Skonfiguruj dostęp", expiry: "Link jest ważny przez dwie godziny. Jeśli go nie zamawiano, zignoruj tę wiadomość." },
  it: { subject: "VoiceOpenGov – accesso membro", title: "Il tuo accesso membro VoiceOpenGov", body: "Usa questo link per configurare l’accesso membro o reimpostare la password.", button: "Configura l’accesso", expiry: "Il link è valido per due ore. Se non l’hai richiesto, ignora questa e-mail." },
  ru: { subject: "VoiceOpenGov – доступ участника", title: "Ваш доступ участника VoiceOpenGov", body: "Используйте эту ссылку, чтобы настроить доступ участника или сбросить пароль.", button: "Настроить доступ", expiry: "Ссылка действует два часа. Если вы её не запрашивали, проигнорируйте письмо." },
  zh: { subject: "VoiceOpenGov – 会员访问", title: "您的 VoiceOpenGov 会员访问", body: "使用此链接设置会员访问或重置密码。", button: "设置访问权限", expiry: "链接有效期为两小时。如非本人申请，请忽略此邮件。" },
};

function baseUrl() {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL;
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  const rate = await rateLimitFromRequest(req, RATE_LIMIT.limit, RATE_LIMIT.windowMs, {
    scope: "member-password-start",
  });
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryIn: rate.retryIn },
      { status: 429, headers: rateLimitHeaders(rate) },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = StartSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: true });

  const email = normalizeMemberEmail(parsed.data.email);
  const members = await membersCol();
  const member = await members.findOne(
    { email, status: "active" },
    { projection: { _id: 1, locale: 1 } },
  );

  // Always return the same public response to avoid account enumeration.
  if (!member?._id) return NextResponse.json({ ok: true });

  try {
    const locale = resolveDoiLocale(member.locale || req.cookies.get("lang")?.value);
    const strings = ACCESS_MAIL[locale];
    const { token } = await createPasswordSetupToken(String(member._id));
    const setupUrl = `${baseUrl()}/konto/passwort?token=${encodeURIComponent(token)}&lang=${locale}`;
    await sendMail({
      to: email,
      subject: strings.subject,
      html: [
        `<div lang="${locale}" dir="${getTextDirection(locale)}" style="font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;">`,
        `<h2>${strings.title}</h2>`,
        `<p>${strings.body}</p>`,
        `<p><a href="${setupUrl}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:linear-gradient(90deg,#1a8cff,#18cfc8);color:#071727;text-decoration:none;font-weight:700;">${strings.button}</a></p>`,
        `<p style="font-size:12px;color:#64748b;">${strings.expiry}</p>`,
        `</div>`,
      ].join(""),
    });
  } catch (error) {
    console.warn("[member-password-start] setup mail failed", error);
  }

  return NextResponse.json({ ok: true });
}
