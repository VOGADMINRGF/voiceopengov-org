import type { ObjectId } from "@core/db/triMongo";

export const EDITORIAL_STATUSES = [
  "triage",
  "review",
  "fact_check",
  "ready",
  "published",
  "rejected",
  "archived",
] as const;
export type EditorialStatus = (typeof EDITORIAL_STATUSES)[number];

export const EDITORIAL_INTAKE_KINDS = ["rss", "api", "manual", "upload"] as const;
export type EditorialIntakeKind = (typeof EDITORIAL_INTAKE_KINDS)[number];

export const EDITORIAL_CREATED_BY_TYPES = ["human", "ai", "system"] as const;
export type EditorialCreatedByType = (typeof EDITORIAL_CREATED_BY_TYPES)[number];

export type EditorialItemDoc = {
  _id?: ObjectId;
  orgId?: ObjectId | null;
  intake: {
    kind: EditorialIntakeKind;
    sourceUrl?: string | null;
    sourceId?: string | null;
    title?: string | null;
    summary?: string | null;
    rawText?: string | null;
    language?: string | null;
    regionCode?: string | null;
    topicKey?: string | null;
    receivedAt: Date;
  };
  status: EditorialStatus;
  assignment: {
    ownerUserId?: ObjectId | null;
    dueAt?: Date | null;
    slaHours?: number | null;
  };
  flags: {
    needsPIIRedaction?: boolean;
    conflictLikely?: boolean;
    duplicateOf?: ObjectId | null;
  };
  createdBy: {
    type: EditorialCreatedByType;
    userId?: ObjectId | null;
    provider?: string | null;
    model?: string | null;
  };
  published: {
    publishedAt?: Date | null;
    publishedByUserId?: ObjectId | null;
    publicUrl?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date | null;
};

export type EditorialRevisionDoc = {
  _id?: ObjectId;
  itemId: ObjectId;
  rev: number;
  changeNote: string;
  content: {
    headline?: string | null;
    bodyMarkdown?: string | null;
    summary?: string | null;
    tags?: string[];
    topicKey?: string | null;
    regionCode?: string | null;
  };
  createdByUserId: ObjectId;
  createdAt: Date;
};

export const EVIDENCE_RELIABILITY = ["unknown", "low", "medium", "high"] as const;
export type EvidenceReliability = (typeof EVIDENCE_RELIABILITY)[number];

export const EVIDENCE_BIAS_TAGS = [
  "unknown",
  "left",
  "center",
  "right",
  "state",
  "activist",
] as const;
export type EvidenceBiasTag = (typeof EVIDENCE_BIAS_TAGS)[number];

export type EvidenceSourceDoc = {
  _id?: ObjectId;
  itemId: ObjectId;
  url: string;
  title?: string | null;
  publisher?: string | null;
  publishedAt?: Date | null;
  quote?: string | null;
  reliability: EvidenceReliability;
  biasTag?: EvidenceBiasTag | null;
  checkedByUserId?: ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  disabledAt?: Date | null;
};
