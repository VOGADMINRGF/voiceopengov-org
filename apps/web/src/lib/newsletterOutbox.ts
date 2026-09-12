import { membersCol, vogDb } from "@/lib/vogMongo";

export type NewsletterAudience = "voiceopengov" | "edebatte";
export type NewsletterOutboxStatus = "pending" | "leased" | "delivered" | "failed";
export const NEWSLETTER_OUTBOX_EXPORT_MODE = "disabled" as const;

export type NewsletterOutboxDoc = {
  _id?: unknown;
  memberId: string;
  audience: NewsletterAudience;
  operation: "subscribe";
  locale: string;
  status: NewsletterOutboxStatus;
  consentSource: "membership_registration";
  consentVersion: "membership-registration-v1";
  consentConfirmedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  attempts: number;
  nextAttemptAt: Date;
  leasedAt?: Date;
  leaseExpiresAt?: Date;
  deliveredAt?: Date;
  lastError?: string;
};

export type ConfirmedNewsletterConsent = {
  memberId: string;
  locale?: string;
  wantsNewsletter: boolean;
  wantsNewsletterEdDebatte?: boolean;
  confirmedAt: Date;
};

export function buildNewsletterOutboxEntries(consent: ConfirmedNewsletterConsent, now = new Date()): NewsletterOutboxDoc[] {
  const audiences: NewsletterAudience[] = [];
  if (consent.wantsNewsletter) audiences.push("voiceopengov");
  if (consent.wantsNewsletterEdDebatte) audiences.push("edebatte");
  return audiences.map((audience) => ({
    memberId: consent.memberId,
    audience,
    operation: "subscribe",
    locale: /^(de|en|fr|es|tr|ar|pl|it|ru|zh)$/.test(consent.locale || "") ? consent.locale! : "de",
    status: "pending",
    consentSource: "membership_registration",
    consentVersion: "membership-registration-v1",
    consentConfirmedAt: consent.confirmedAt,
    createdAt: now,
    updatedAt: now,
    attempts: 0,
    nextAttemptAt: now,
  }));
}

async function outboxCollection() {
  const db = await vogDb();
  const col = db.collection<NewsletterOutboxDoc>("newsletter_outbox");
  await col.createIndex({ memberId: 1, audience: 1 }, { unique: true }).catch(() => {});
  await col.createIndex({ status: 1, nextAttemptAt: 1 }).catch(() => {});
  return col;
}

export async function queueConfirmedNewsletterConsent(consent: ConfirmedNewsletterConsent) {
  const entries = buildNewsletterOutboxEntries(consent);
  if (entries.length === 0) return 0;
  const col = await outboxCollection();
  for (const entry of entries) {
    await col.updateOne(
      { memberId: entry.memberId, audience: entry.audience },
      { $setOnInsert: entry },
      { upsert: true },
    );
  }
  return entries.length;
}

export async function reconcileNewsletterOutbox(limit = 100) {
  const safeLimit = Math.max(1, Math.min(500, Math.trunc(limit) || 100));
  const members = await membersCol();
  const candidates = await members.find({
    status: "active",
    $or: [{ wantsNewsletter: true }, { wantsNewsletterEdDebatte: true }],
    newsletterOutboxQueuedAt: { $exists: false },
  }, { projection: { _id: 1, locale: 1, wantsNewsletter: 1, wantsNewsletterEdDebatte: 1, confirmedAt: 1, createdAt: 1 } }).limit(safeLimit).toArray();
  let queuedMembers = 0;
  for (const member of candidates) {
    try {
      await queueConfirmedNewsletterConsent({
        memberId: String(member._id),
        locale: member.locale,
        wantsNewsletter: member.wantsNewsletter,
        wantsNewsletterEdDebatte: member.wantsNewsletterEdDebatte,
        confirmedAt: member.confirmedAt || member.createdAt,
      });
      await members.updateOne({ _id: member._id }, { $set: { newsletterOutboxQueuedAt: new Date() }, $unset: { newsletterOutboxPending: "" } });
      queuedMembers += 1;
    } catch (error) {
      await members.updateOne({ _id: member._id }, { $set: { newsletterOutboxPending: true } }).catch(() => {});
      console.warn("[newsletter-outbox] reconciliation failed", { memberId: String(member._id), error: String(error) });
    }
  }
  return { scanned: candidates.length, queuedMembers };
}

export async function getNewsletterOutboxSummary() {
  const col = await outboxCollection();
  const rows = await col.aggregate<{ _id: { audience: NewsletterAudience; status: NewsletterOutboxStatus }; count: number }>([
    { $group: { _id: { audience: "$audience", status: "$status" }, count: { $sum: 1 } } },
  ]).toArray();
  return rows.map((row) => ({ audience: row._id.audience, status: row._id.status, count: row.count }));
}
