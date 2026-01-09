import { z } from "zod";
import { REPORT_ASSET_KINDS, REPORT_ASSET_STATUSES } from "./types";

export const ReportAssetKindSchema = z.enum(REPORT_ASSET_KINDS);
export const ReportAssetStatusSchema = z.enum(REPORT_ASSET_STATUSES);

export const ReportAssetCreateSchema = z.object({
  orgId: z.string().optional(),
  kind: ReportAssetKindSchema,
  key: z.object({
    topicKey: z.string().max(80).nullable().optional(),
    regionCode: z.string().max(32).nullable().optional(),
    slug: z.string().max(80).nullable().optional(),
  }),
});

export const ReportAssetStatusChangeSchema = z.object({
  status: ReportAssetStatusSchema,
  reason: z.string().min(3).max(300).optional(),
});

export const ReportRevisionSchema = z.object({
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

export const ReportPublishSchema = z.object({
  changeNote: z.string().min(3).max(300),
});
