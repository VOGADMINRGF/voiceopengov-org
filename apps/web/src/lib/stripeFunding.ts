import { createHmac, timingSafeEqual } from "crypto";
import type { SupportedLocale } from "@/config/locales";

const SIGNATURE_TOLERANCE_SECONDS = 300;
const ID_PATTERN = /^(cs|cus|sub|pi|in|evt)_[A-Za-z0-9_]{6,240}$/;

type StripeObject = Record<string, unknown>;

export type StripeEvent = {
  id: string;
  type: string;
  created?: number;
  data: { object: StripeObject };
};

export type FundingStatus = "pending" | "succeeded" | "failed" | "past_due" | "canceled";

export type FundingProviderUpdate = {
  eventId: string;
  eventType: string;
  attemptId?: string;
  checkoutSessionId?: string;
  customerId?: string;
  subscriptionId?: string;
  paymentIntentId?: string;
  invoiceId?: string;
  amountCents?: number;
  currency?: string;
  locale?: SupportedLocale;
  cadence: "one_time" | "recurring";
  supportLevel?: "one_time" | "supporting" | "funding";
  edebatteEntitlement?: "none" | "plus" | "pro";
  status: FundingStatus;
  occurredAt: Date;
};

function safeEqualHex(left: string, right: string) {
  if (!/^[a-f0-9]{64}$/i.test(left) || !/^[a-f0-9]{64}$/i.test(right)) return false;
  return timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

export function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = SIGNATURE_TOLERANCE_SECONDS,
) {
  if (!header || !secret) return false;
  const parts = header.split(",").map((part) => part.trim().split("=", 2));
  const timestampRaw = parts.find(([key]) => key === "t")?.[1];
  const timestamp = Number(timestampRaw);
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!Number.isSafeInteger(timestamp) || Math.abs(nowSeconds - timestamp) > toleranceSeconds || signatures.length === 0) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return signatures.some((signature) => safeEqualHex(expected, signature));
}

export function parseStripeEvent(payload: string): StripeEvent | null {
  try {
    const value = JSON.parse(payload) as Record<string, unknown>;
    const data = value.data as Record<string, unknown> | undefined;
    if (typeof value.id !== "string" || !value.id.startsWith("evt_") || typeof value.type !== "string") return null;
    if (!data?.object || typeof data.object !== "object") return null;
    return { id: value.id, type: value.type, created: typeof value.created === "number" ? value.created : undefined, data: { object: data.object as StripeObject } };
  } catch {
    return null;
  }
}

function id(value: unknown, prefix?: string) {
  const candidate = typeof value === "string" ? value : value && typeof value === "object" ? (value as StripeObject).id : undefined;
  if (typeof candidate !== "string" || !ID_PATTERN.test(candidate) || (prefix && !candidate.startsWith(`${prefix}_`))) return undefined;
  return candidate;
}

function metadata(object: StripeObject) {
  const direct = object.metadata;
  if (direct && typeof direct === "object") return direct as Record<string, unknown>;
  const parent = object.parent as StripeObject | undefined;
  const subscriptionDetails = parent?.subscription_details as StripeObject | undefined;
  return subscriptionDetails?.metadata && typeof subscriptionDetails.metadata === "object"
    ? subscriptionDetails.metadata as Record<string, unknown>
    : {};
}

function supportedMetadata(object: StripeObject) {
  const meta = metadata(object);
  return meta.purpose === "voluntary_support" && meta.political_voice_weight === "none" ? meta : null;
}

function integer(value: unknown) {
  return Number.isSafeInteger(value) && Number(value) >= 0 ? Number(value) : undefined;
}

function locale(value: unknown): SupportedLocale | undefined {
  return typeof value === "string" && /^(de|en|fr|es|tr|ar|pl|it|ru|zh)$/.test(value) ? value as SupportedLocale : undefined;
}

function attemptId(value: unknown) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{16,80}$/.test(value) ? value : undefined;
}

function supportLevel(value: unknown): FundingProviderUpdate["supportLevel"] {
  return value === "one_time" || value === "supporting" || value === "funding" ? value : undefined;
}

function edebatteEntitlement(value: unknown): FundingProviderUpdate["edebatteEntitlement"] {
  return value === "none" || value === "plus" || value === "pro" ? value : undefined;
}

function base(event: StripeEvent, object: StripeObject, meta: Record<string, unknown>) {
  return {
    eventId: event.id,
    eventType: event.type,
    attemptId: attemptId(meta.attempt_id),
    customerId: id(object.customer, "cus"),
    subscriptionId: id(object.subscription, "sub"),
    paymentIntentId: id(object.payment_intent, "pi"),
    locale: locale(meta.locale),
    supportLevel: supportLevel(meta.support_level),
    edebatteEntitlement: edebatteEntitlement(meta.edebatte_entitlement),
    occurredAt: new Date((event.created || Math.floor(Date.now() / 1000)) * 1000),
  };
}

export function fundingUpdateFromStripeEvent(event: StripeEvent): FundingProviderUpdate | null {
  const object = event.data.object;
  const meta = supportedMetadata(object);
  if (!meta) return null;
  const common = base(event, object, meta);

  if (["checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.async_payment_failed"].includes(event.type)) {
    const checkoutSessionId = id(object.id, "cs");
    if (!checkoutSessionId) return null;
    const status = event.type === "checkout.session.async_payment_failed"
      ? "failed"
      : event.type === "checkout.session.async_payment_succeeded" || object.payment_status === "paid"
        ? "succeeded"
        : "pending";
    return { ...common, checkoutSessionId, amountCents: integer(object.amount_total), currency: typeof object.currency === "string" ? object.currency.toUpperCase() : undefined, cadence: object.mode === "subscription" ? "recurring" : "one_time", status };
  }

  if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const invoiceId = id(object.id, "in");
    if (!invoiceId) return null;
    const parent = object.parent as StripeObject | undefined;
    const subscriptionDetails = parent?.subscription_details as StripeObject | undefined;
    return { ...common, invoiceId, subscriptionId: common.subscriptionId || id(subscriptionDetails?.subscription, "sub"), amountCents: integer(event.type === "invoice.paid" ? object.amount_paid : object.amount_due), currency: typeof object.currency === "string" ? object.currency.toUpperCase() : undefined, cadence: "recurring", status: event.type === "invoice.paid" ? "succeeded" : "past_due" };
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscriptionId = id(object.id, "sub");
    if (!subscriptionId) return null;
    const rawStatus = event.type === "customer.subscription.deleted" ? "canceled" : object.status;
    const status: FundingStatus = rawStatus === "active" || rawStatus === "trialing" ? "succeeded" : rawStatus === "past_due" || rawStatus === "unpaid" ? "past_due" : rawStatus === "canceled" || rawStatus === "incomplete_expired" ? "canceled" : "pending";
    return { ...common, subscriptionId, cadence: "recurring", status };
  }

  return null;
}

export function publicFundingStatus(object: StripeObject) {
  const meta = supportedMetadata(object);
  const checkoutSessionId = id(object.id, "cs");
  if (!meta || !checkoutSessionId) return null;
  const status: FundingStatus = object.payment_status === "paid" || object.payment_status === "no_payment_required" ? "succeeded" : object.status === "expired" ? "failed" : "pending";
  return { status, amountCents: integer(object.amount_total), currency: typeof object.currency === "string" ? object.currency.toUpperCase() : undefined, cadence: object.mode === "subscription" ? "recurring" as const : "one_time" as const, customerId: id(object.customer, "cus"), checkoutSessionId };
}

export function isCheckoutSessionId(value: unknown): value is string {
  return typeof value === "string" && /^cs_(test_|live_)?[A-Za-z0-9]{12,220}$/.test(value);
}
