import { z } from "zod";
import {
  EDITORIAL_STATUSES,
  EDITORIAL_INTAKE_KINDS,
  EVIDENCE_RELIABILITY,
  EVIDENCE_BIAS_TAGS,
} from "./types";

export const EditorialStatusSchema = z.enum(EDITORIAL_STATUSES);
export const EditorialIntakeKindSchema = z.enum(EDITORIAL_INTAKE_KINDS);

export const EditorialItemCreateSchema = z.object({
  orgId: z.string().optional(),
  title: z.string().min(2).max(200),
  summary: z.string().max(2000).optional(),
  rawText: z.string().max(20000).optional(),
  topicKey: z.string().max(80).optional(),
  regionCode: z.string().max(32).optional(),
  language: z.string().max(8).optional(),
});

export const EditorialItemPatchSchema = z.object({
  intake: z
    .object({
      topicKey: z.string().max(80).nullable().optional(),
      regionCode: z.string().max(32).nullable().optional(),
    })
    .optional(),
  flags: z
    .object({
      needsPIIRedaction: z.boolean().optional(),
      conflictLikely: z.boolean().optional(),
      duplicateOf: z.string().nullable().optional(),
    })
    .optional(),
});

export const EditorialAssignSchema = z.object({
  ownerUserId: z.string().nullable().optional(),
  dueAt: z.string().datetime().nullable().optional(),
  slaHours: z.number().int().min(1).max(720).nullable().optional(),
});

export const EditorialStatusChangeSchema = z.object({
  status: EditorialStatusSchema,
  reason: z.string().min(3).max(300).optional(),
});

export const EditorialRevisionSchema = z.object({
  changeNote: z.string().min(3).max(300),
  content: z.object({
    headline: z.string().max(200).nullable().optional(),
    bodyMarkdown: z.string().max(20000).nullable().optional(),
    summary: z.string().max(2000).nullable().optional(),
    tags: z.array(z.string().max(40)).max(20).optional(),
    topicKey: z.string().max(80).nullable().optional(),
    regionCode: z.string().max(32).nullable().optional(),
  }),
});

export const EditorialPublishSchema = z.object({
  changeNote: z.string().min(3).max(300),
  publicUrl: z.string().url().optional(),
});

export const EvidenceSourceCreateSchema = z.object({
  url: z.string().url(),
  title: z.string().max(200).optional(),
  publisher: z.string().max(160).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  quote: z.string().max(2000).optional(),
  reliability: z.enum(EVIDENCE_RELIABILITY).optional(),
  biasTag: z.enum(EVIDENCE_BIAS_TAGS).nullable().optional(),
});

export const EvidenceSourcePatchSchema = z.object({
  title: z.string().max(200).nullable().optional(),
  publisher: z.string().max(160).nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  quote: z.string().max(2000).nullable().optional(),
  reliability: z.enum(EVIDENCE_RELIABILITY).optional(),
  biasTag: z.enum(EVIDENCE_BIAS_TAGS).nullable().optional(),
  disabledAt: z.string().datetime().nullable().optional(),
});
