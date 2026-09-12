import { createHash } from "crypto";
import type { SupportedLocale } from "@/config/locales";

export const MIN_FUNDING_CENTS = 500;
export const MAX_FUNDING_CENTS = 1_000_000;
export type FundingCadence = "one_time" | "monthly" | "annual";

const CHECKOUT_COPY: Record<SupportedLocale, { product: string; noInfluence: string }> = {
  de: { product: "Freiwillige Unterstützung für VoiceOpenGov", noInfluence: "Die Unterstützung ist freiwillig und kauft weder Stimmgewicht noch politischen Einfluss." },
  en: { product: "Voluntary support for VoiceOpenGov", noInfluence: "Support is voluntary and never buys voting weight or political influence." },
  fr: { product: "Soutien volontaire à VoiceOpenGov", noInfluence: "Le soutien est volontaire et n’achète ni poids de vote ni influence politique." },
  es: { product: "Apoyo voluntario a VoiceOpenGov", noInfluence: "El apoyo es voluntario y no compra peso de voto ni influencia política." },
  tr: { product: "VoiceOpenGov için gönüllü destek", noInfluence: "Destek gönüllüdür; oy ağırlığı veya siyasi etki satın almaz." },
  ar: { product: "دعم طوعي لـ VoiceOpenGov", noInfluence: "الدعم طوعي ولا يشتري وزنًا تصويتيًا أو نفوذًا سياسيًا." },
  pl: { product: "Dobrowolne wsparcie VoiceOpenGov", noInfluence: "Wsparcie jest dobrowolne i nie kupuje siły głosu ani wpływu politycznego." },
  it: { product: "Sostegno volontario a VoiceOpenGov", noInfluence: "Il sostegno è volontario e non acquista peso di voto né influenza politica." },
  ru: { product: "Добровольная поддержка VoiceOpenGov", noInfluence: "Поддержка добровольна и не покупает вес голоса или политическое влияние." },
  zh: { product: "对 VoiceOpenGov 的自愿支持", noInfluence: "支持完全自愿，不能购买投票权重或政治影响力。" },
};

export type FundingRequest = {
  amountCents: number;
  cadence: FundingCadence;
  locale: SupportedLocale;
  attemptId: string;
  termsAccepted: true;
};

export function parseFundingRequest(input: unknown): FundingRequest | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Record<string, unknown>;
  const amountCents = Number(value.amountCents);
  const cadence = value.cadence;
  const locale = value.locale;
  const attemptId = value.attemptId;
  if (!Number.isSafeInteger(amountCents) || amountCents < MIN_FUNDING_CENTS || amountCents > MAX_FUNDING_CENTS) return null;
  if (cadence !== "one_time" && cadence !== "monthly" && cadence !== "annual") return null;
  if (typeof locale !== "string" || !/^(de|en|fr|es|tr|ar|pl|it|ru|zh)$/.test(locale)) return null;
  if (typeof attemptId !== "string" || !/^[A-Za-z0-9_-]{16,80}$/.test(attemptId)) return null;
  if (value.termsAccepted !== true) return null;
  return { amountCents, cadence, locale: locale as SupportedLocale, attemptId, termsAccepted: true };
}

export function fundingIdempotencyKey(request: FundingRequest) {
  const digest = createHash("sha256")
    .update(`${request.attemptId}:${request.amountCents}:${request.cadence}`)
    .digest("hex");
  return `vog_funding_${digest}`;
}

export function buildStripeCheckoutBody(request: FundingRequest, baseUrl: string) {
  const params = new URLSearchParams();
  const recurring = request.cadence !== "one_time";
  const copy = CHECKOUT_COPY[request.locale];
  params.set("mode", recurring ? "subscription" : "payment");
  params.set("success_url", `${baseUrl}/unterstuetzen/erfolg?lang=${request.locale}&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${baseUrl}/unterstuetzen?lang=${request.locale}&cancelled=1`);
  params.set("line_items[0][price_data][currency]", "eur");
  params.set("line_items[0][price_data][unit_amount]", String(request.amountCents));
  params.set("line_items[0][price_data][product_data][name]", copy.product);
  params.set("line_items[0][quantity]", "1");
  if (recurring) {
    params.set("line_items[0][price_data][recurring][interval]", request.cadence === "annual" ? "year" : "month");
    params.set("subscription_data[metadata][purpose]", "voluntary_support");
    params.set("subscription_data[metadata][political_voice_weight]", "none");
  } else {
    params.set("customer_creation", "always");
    params.set("payment_intent_data[metadata][purpose]", "voluntary_support");
    params.set("payment_intent_data[metadata][political_voice_weight]", "none");
  }
  params.set("locale", "auto");
  params.set("metadata[purpose]", "voluntary_support");
  params.set("metadata[political_voice_weight]", "none");
  params.set("metadata[locale]", request.locale);
  params.set("custom_text[submit][message]", copy.noInfluence);
  return params;
}

export function resolvePublicBaseUrl(configured: string | undefined, requestOrigin: string) {
  const candidate = configured?.trim() || requestOrigin;
  const url = new URL(candidate);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
    throw new Error("invalid_public_base_url");
  }
  return url.origin;
}
