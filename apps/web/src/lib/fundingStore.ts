import type { Filter } from "mongodb";
import { vogDb } from "@/lib/vogMongo";
import type { FundingProviderUpdate, FundingStatus } from "@/lib/stripeFunding";

type FundingPaymentDoc = {
  _id?: unknown;
  stripeCheckoutSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  amountCents?: number;
  currency?: string;
  locale?: string;
  cadence: "one_time" | "recurring";
  status: FundingStatus;
  politicalVoiceWeight: "none";
  lastStripeEventId: string;
  lastStripeEventType: string;
  providerOccurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  successRecordedAt?: Date;
};

type StripeWebhookEventDoc = {
  _id: string;
  type: string;
  status: "processing" | "processed" | "failed";
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  error?: string;
};

async function paymentsCollection() {
  const db = await vogDb();
  const col = db.collection<FundingPaymentDoc>("funding_payments");
  await col.createIndex({ stripeCheckoutSessionId: 1 }, { unique: true, sparse: true }).catch(() => {});
  await col.createIndex({ stripeSubscriptionId: 1 }, { unique: true, sparse: true }).catch(() => {});
  await col.createIndex({ stripePaymentIntentId: 1 }, { unique: true, sparse: true }).catch(() => {});
  await col.createIndex({ status: 1, updatedAt: -1 }).catch(() => {});
  return col;
}

async function webhookEventsCollection() {
  const db = await vogDb();
  const col = db.collection<StripeWebhookEventDoc>("stripe_webhook_events");
  await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});
  return col;
}

export async function claimStripeWebhookEvent(eventId: string, type: string) {
  const col = await webhookEventsCollection();
  const now = new Date();
  try {
    await col.insertOne({ _id: eventId, type, status: "processing", createdAt: now, updatedAt: now, expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) });
    return "claimed" as const;
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error;
  }
  const existing = await col.findOne({ _id: eventId });
  if (existing?.status === "processed") return "duplicate" as const;
  if (existing?.status === "failed") {
    const reclaimed = await col.updateOne({ _id: eventId, status: "failed" }, { $set: { status: "processing", updatedAt: now }, $unset: { error: "" } });
    if (reclaimed.modifiedCount === 1) return "claimed" as const;
  }
  return "busy" as const;
}

export async function finishStripeWebhookEvent(eventId: string) {
  const col = await webhookEventsCollection();
  await col.updateOne({ _id: eventId }, { $set: { status: "processed", updatedAt: new Date() }, $unset: { error: "" } });
}

export async function failStripeWebhookEvent(eventId: string, error: unknown) {
  const col = await webhookEventsCollection();
  await col.updateOne({ _id: eventId }, { $set: { status: "failed", error: String(error).slice(0, 300), updatedAt: new Date() } });
}

function paymentIdentity(update: FundingProviderUpdate): Filter<FundingPaymentDoc> | null {
  if (update.subscriptionId) return { stripeSubscriptionId: update.subscriptionId };
  if (update.checkoutSessionId) return { stripeCheckoutSessionId: update.checkoutSessionId };
  if (update.paymentIntentId) return { stripePaymentIntentId: update.paymentIntentId };
  return null;
}

export async function applyFundingProviderUpdate(update: FundingProviderUpdate) {
  const identity = paymentIdentity(update);
  if (!identity) return { successRecorded: false };
  const col = await paymentsCollection();
  const now = new Date();
  const fields = {
    ...(update.checkoutSessionId ? { stripeCheckoutSessionId: update.checkoutSessionId } : {}),
    ...(update.customerId ? { stripeCustomerId: update.customerId } : {}),
    ...(update.subscriptionId ? { stripeSubscriptionId: update.subscriptionId } : {}),
    ...(update.paymentIntentId ? { stripePaymentIntentId: update.paymentIntentId } : {}),
    ...(update.invoiceId ? { stripeInvoiceId: update.invoiceId } : {}),
    ...(update.amountCents !== undefined ? { amountCents: update.amountCents } : {}),
    ...(update.currency ? { currency: update.currency } : {}),
    ...(update.locale ? { locale: update.locale } : {}),
    cadence: update.cadence,
    status: update.status,
    politicalVoiceWeight: "none" as const,
    lastStripeEventId: update.eventId,
    lastStripeEventType: update.eventType,
    providerOccurredAt: update.occurredAt,
    updatedAt: now,
  };
  await col.updateOne(identity, { $set: fields, $setOnInsert: { createdAt: now } }, { upsert: true });
  if (update.status !== "succeeded") return { successRecorded: false };
  const recorded = await col.updateOne({ ...identity, successRecordedAt: { $exists: false } }, { $set: { successRecordedAt: now } });
  return { successRecorded: recorded.modifiedCount === 1 };
}
