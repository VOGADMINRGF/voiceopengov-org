import crypto from "node:crypto";
import {
  DEFAULT_LOCALE,
  getLocaleConfig,
  isSupportedLocale,
  type SupportedLocale,
} from "@/config/locales";

const DOI_TTL_MS = 48 * 60 * 60 * 1000;

export type DoiCopy = {
  subject: string;
  heading: string;
  intro: string;
  confirm: string;
  ignore: string;
  expires: string;
  missingTitle: string;
  missingMessage: string;
  invalidTitle: string;
  invalidMessage: string;
  expiredTitle: string;
  expiredMessage: string;
  confirmedTitle: string;
  confirmedMessage: string;
  statusConfirmed: string;
  statusNotConfirmed: string;
  resend: string;
  resentTitle: string;
  resentMessage: string;
  home: string;
  support: string;
  questions: string;
  noInfluence: string;
  accountAccess: string;
};

const DE: DoiCopy = {
  subject: "E-Mail bestätigen – VoiceOpenGov",
  heading: "E-Mail bestätigen",
  intro: "Danke für deine Community-Anmeldung bei VoiceOpenGov. Bestätige bitte deine E-Mail-Adresse.",
  confirm: "E-Mail bestätigen",
  ignore: "Wenn du dich nicht angemeldet hast, kannst du diese E-Mail ignorieren.",
  expires: "Der Link ist 48 Stunden gültig.",
  missingTitle: "Link unvollständig",
  missingMessage: "Der Bestätigungslink ist unvollständig. Nutze bitte den Link aus deiner E-Mail.",
  invalidTitle: "Bestätigungslink ungültig",
  invalidMessage: "Der Link ist ungültig oder wurde bereits verwendet.",
  expiredTitle: "Bestätigungslink abgelaufen",
  expiredMessage: "Der Link ist abgelaufen. Fordere hier sicher einen neuen an.",
  confirmedTitle: "E-Mail bestätigt",
  confirmedMessage: "Danke! Deine Community-Anmeldung ist jetzt bestätigt. Sie ist in der aktuellen Aufbauphase keine Vereins- oder gesellschaftsrechtliche Mitgliedschaft.",
  statusConfirmed: "Bestätigt",
  statusNotConfirmed: "Nicht bestätigt",
  resend: "Neuen Link senden",
  resentTitle: "Neue E-Mail angefordert",
  resentMessage: "Falls eine offene Anmeldung gefunden wurde, haben wir einen neuen Link gesendet.",
  home: "Zur Startseite",
  support: "Freiwillig unterstützen",
  questions: "Fragen?",
  noInfluence: "Finanzielle Unterstützung ist freiwillig und kauft niemals Stimmgewicht oder politischen Einfluss.",
  accountAccess: "Sicheren Community-Zugang einrichten",
};

const COPY: Record<SupportedLocale, DoiCopy> = {
  de: DE,
  en: {
    ...DE,
    subject: "Confirm your email – VoiceOpenGov",
    heading: "Confirm your email",
    intro: "Thank you for registering with the VoiceOpenGov community. Please confirm your email address.",
    confirm: "Confirm email",
    ignore: "If you did not sign up, you can ignore this email.",
    expires: "This link is valid for 48 hours.",
    missingTitle: "Incomplete link",
    missingMessage: "The confirmation link is incomplete. Please use the link in your email.",
    invalidTitle: "Invalid confirmation link",
    invalidMessage: "This link is invalid or has already been used.",
    expiredTitle: "Confirmation link expired",
    expiredMessage: "This link has expired. Request a new one securely here.",
    confirmedTitle: "Email confirmed",
    confirmedMessage: "Thank you! Your community registration is now confirmed. During the current build-up phase, this is not membership in a legal association or company.",
    statusConfirmed: "Confirmed",
    statusNotConfirmed: "Not confirmed",
    resend: "Send a new link",
    resentTitle: "New email requested",
    resentMessage: "If an open registration was found, we sent a new link.",
    home: "Home",
    support: "Support voluntarily",
    questions: "Questions?",
    noInfluence: "Financial support is voluntary and never buys voting weight or political influence.",
    accountAccess: "Set up secure community access",
  },
  fr: {
    ...DE,
    subject: "Confirmez votre e-mail – VoiceOpenGov",
    heading: "Confirmez votre e-mail",
    intro: "Merci de vous inscrire à la communauté VoiceOpenGov. Veuillez confirmer votre adresse e-mail.",
    confirm: "Confirmer l’e-mail",
    ignore: "Si vous ne vous êtes pas inscrit, ignorez cet e-mail.",
    expires: "Ce lien est valable 48 heures.",
    missingTitle: "Lien incomplet",
    missingMessage: "Le lien de confirmation est incomplet. Utilisez le lien reçu par e-mail.",
    invalidTitle: "Lien de confirmation invalide",
    invalidMessage: "Ce lien est invalide ou a déjà été utilisé.",
    expiredTitle: "Lien de confirmation expiré",
    expiredMessage: "Ce lien a expiré. Demandez-en un nouveau ici en toute sécurité.",
    confirmedTitle: "E-mail confirmé",
    confirmedMessage: "Merci ! Votre inscription à la communauté est confirmée. Pendant la phase actuelle de construction, il ne s’agit pas d’une adhésion à une association ou à une société juridique.",
    statusConfirmed: "Confirmé",
    statusNotConfirmed: "Non confirmé",
    resend: "Envoyer un nouveau lien",
    resentTitle: "Nouvel e-mail demandé",
    resentMessage: "Si une inscription en attente existe, nous avons envoyé un nouveau lien.",
    home: "Accueil",
    support: "Soutenir librement",
    questions: "Des questions ?",
    noInfluence: "Le soutien financier est volontaire et n’achète jamais de poids de vote ni d’influence politique.",
    accountAccess: "Configurer un accès sécurisé à la communauté",
  },
  es: {
    ...DE,
    subject: "Confirma tu correo – VoiceOpenGov",
    heading: "Confirma tu correo",
    intro: "Gracias por registrarte en la comunidad VoiceOpenGov. Confirma tu dirección de correo.",
    confirm: "Confirmar correo",
    ignore: "Si no te registraste, puedes ignorar este correo.",
    expires: "Este enlace es válido durante 48 horas.",
    missingTitle: "Enlace incompleto",
    missingMessage: "El enlace de confirmación está incompleto. Usa el enlace de tu correo.",
    invalidTitle: "Enlace de confirmación no válido",
    invalidMessage: "Este enlace no es válido o ya se utilizó.",
    expiredTitle: "Enlace de confirmación caducado",
    expiredMessage: "Este enlace ha caducado. Solicita uno nuevo de forma segura aquí.",
    confirmedTitle: "Correo confirmado",
    confirmedMessage: "Gracias. Tu registro en la comunidad está confirmado. Durante la fase actual de construcción no constituye membresía en una asociación o empresa jurídica.",
    statusConfirmed: "Confirmado",
    statusNotConfirmed: "No confirmado",
    resend: "Enviar un enlace nuevo",
    resentTitle: "Nuevo correo solicitado",
    resentMessage: "Si encontramos un registro pendiente, enviamos un enlace nuevo.",
    home: "Inicio",
    support: "Apoyar voluntariamente",
    questions: "¿Preguntas?",
    noInfluence: "El apoyo financiero es voluntario y nunca compra peso de voto ni influencia política.",
    accountAccess: "Configurar acceso seguro a la comunidad",
  },
  tr: {
    ...DE,
    subject: "E-postanızı doğrulayın – VoiceOpenGov",
    heading: "E-postanızı doğrulayın",
    intro: "VoiceOpenGov topluluğuna kaydolduğunuz için teşekkürler. Lütfen e-posta adresinizi doğrulayın.",
    confirm: "E-postayı doğrula",
    ignore: "Kaydolmadıysanız bu e-postayı yok sayabilirsiniz.",
    expires: "Bu bağlantı 48 saat geçerlidir.",
    confirmedTitle: "E-posta doğrulandı",
    confirmedMessage: "Teşekkürler. Topluluk kaydınız doğrulandı. Mevcut kuruluş aşamasında bu, bir dernek veya şirket üyeliği değildir.",
    statusConfirmed: "Doğrulandı",
    statusNotConfirmed: "Doğrulanmadı",
    resend: "Yeni bağlantı gönder",
    resentTitle: "Yeni e-posta istendi",
    resentMessage: "Bekleyen bir kayıt bulunduysa yeni bağlantı gönderdik.",
    home: "Ana sayfa",
    support: "Gönüllü destek",
    questions: "Sorularınız mı var?",
    noInfluence: "Maddi destek gönüllüdür; oy ağırlığı veya siyasi etki satın alamaz.",
    accountAccess: "Güvenli topluluk erişimini ayarla",
  },
  ar: {
    ...DE,
    subject: "تأكيد بريدك الإلكتروني – VoiceOpenGov",
    heading: "تأكيد بريدك الإلكتروني",
    intro: "شكرًا لتسجيلك في مجتمع VoiceOpenGov. يرجى تأكيد عنوان بريدك الإلكتروني.",
    confirm: "تأكيد البريد",
    ignore: "إذا لم تسجّل، يمكنك تجاهل هذه الرسالة.",
    expires: "هذا الرابط صالح لمدة 48 ساعة.",
    confirmedTitle: "تم تأكيد البريد",
    confirmedMessage: "شكرًا. تم تأكيد تسجيلك في المجتمع. خلال مرحلة البناء الحالية لا يُعد ذلك عضوية قانونية في جمعية أو شركة.",
    statusConfirmed: "تم التأكيد",
    statusNotConfirmed: "غير مؤكد",
    resend: "إرسال رابط جديد",
    resentTitle: "تم طلب رسالة جديدة",
    resentMessage: "إذا وجدنا تسجيلًا معلقًا، فقد أرسلنا رابطًا جديدًا.",
    home: "الرئيسية",
    support: "دعم طوعي",
    questions: "أسئلة؟",
    noInfluence: "الدعم المالي طوعي ولا يشتري أبدًا وزنًا تصويتيًا أو نفوذًا سياسيًا.",
    accountAccess: "إعداد وصول آمن للمجتمع",
  },
  pl: {
    ...DE,
    subject: "Potwierdź e-mail – VoiceOpenGov",
    heading: "Potwierdź e-mail",
    intro: "Dziękujemy za rejestrację w społeczności VoiceOpenGov. Potwierdź swój adres e-mail.",
    confirm: "Potwierdź e-mail",
    ignore: "Jeśli to nie Ty, zignoruj tę wiadomość.",
    expires: "Link jest ważny przez 48 godzin.",
    confirmedTitle: "E-mail potwierdzony",
    confirmedMessage: "Dziękujemy. Rejestracja w społeczności została potwierdzona. Na obecnym etapie budowy nie jest to formalne członkostwo w stowarzyszeniu ani spółce.",
    resend: "Wyślij nowy link",
    noInfluence: "Wsparcie finansowe jest dobrowolne i nigdy nie kupuje siły głosu ani wpływu politycznego.",
    accountAccess: "Skonfiguruj bezpieczny dostęp do społeczności",
  },
  it: {
    ...DE,
    subject: "Conferma la tua e-mail – VoiceOpenGov",
    heading: "Conferma la tua e-mail",
    intro: "Grazie per esserti registrato nella community VoiceOpenGov. Conferma il tuo indirizzo e-mail.",
    confirm: "Conferma e-mail",
    ignore: "Se non ti sei registrato, ignora questa e-mail.",
    expires: "Il link è valido per 48 ore.",
    confirmedTitle: "E-mail confermata",
    confirmedMessage: "Grazie. La registrazione alla community è confermata. Nell’attuale fase di sviluppo non costituisce un’adesione legale a un’associazione o società.",
    resend: "Invia un nuovo link",
    noInfluence: "Il sostegno finanziario è volontario e non compra mai peso di voto o influenza politica.",
    accountAccess: "Configura l’accesso sicuro alla community",
  },
  ru: {
    ...DE,
    subject: "Подтвердите e-mail – VoiceOpenGov",
    heading: "Подтвердите e-mail",
    intro: "Спасибо за регистрацию в сообществе VoiceOpenGov. Подтвердите адрес электронной почты.",
    confirm: "Подтвердить e-mail",
    ignore: "Если вы не регистрировались, проигнорируйте письмо.",
    expires: "Ссылка действительна 48 часов.",
    confirmedTitle: "E-mail подтверждён",
    confirmedMessage: "Спасибо. Регистрация в сообществе подтверждена. На текущем этапе создания это не является юридическим членством в ассоциации или компании.",
    resend: "Отправить новую ссылку",
    noInfluence: "Финансовая поддержка добровольна и никогда не даёт дополнительного веса голосу или политического влияния.",
    accountAccess: "Настроить безопасный доступ к сообществу",
  },
  zh: {
    ...DE,
    subject: "确认您的电子邮件 – VoiceOpenGov",
    heading: "确认您的电子邮件",
    intro: "感谢注册 VoiceOpenGov 社区。请确认您的电子邮件地址。",
    confirm: "确认电子邮件",
    ignore: "如果并非您本人注册，请忽略此邮件。",
    expires: "此链接有效期为48小时。",
    confirmedTitle: "电子邮件已确认",
    confirmedMessage: "谢谢。您的社区注册已确认。在当前建设阶段，这并不构成协会或公司的法律会员资格。",
    resend: "发送新链接",
    noInfluence: "资金支持完全自愿，绝不会购买投票权重或政治影响力。",
    accountAccess: "设置安全社区访问",
  },
};

export function resolveDoiLocale(value?: string | null): SupportedLocale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDoiCopy(locale: SupportedLocale): DoiCopy {
  return COPY[locale];
}

export function createDoiToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashDoiToken(token),
    expiresAt: new Date(Date.now() + DOI_TTL_MS),
  };
}

export function hashDoiToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function buildDoiMail(locale: SupportedLocale, confirmUrl: string) {
  const copy = getDoiCopy(locale);
  const direction = getLocaleConfig(locale).direction;
  const escapedUrl = confirmUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  return {
    subject: copy.subject,
    text: `${copy.heading}\n\n${copy.intro}\n${confirmUrl}\n\n${copy.expires}\n${copy.noInfluence}\n\n${copy.ignore}`,
    html: `<div lang="${locale}" dir="${direction}" style="font-family:Segoe UI,Arial,sans-serif;color:#0f172a;line-height:1.6"><h2>${copy.heading}</h2><p>${copy.intro}</p><p><a href="${escapedUrl}" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#1a8cff;color:#fff;text-decoration:none;font-weight:700">${copy.confirm}</a></p><p>${copy.expires}</p><p style="padding:12px;border:1px solid #18cfc8;border-radius:10px">${copy.noInfluence}</p><p style="color:#64748b;font-size:12px">${copy.ignore}</p></div>`,
  };
}
