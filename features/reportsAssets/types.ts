import type { ObjectId } from "@core/db/triMongo";

export const REPORT_ASSET_STATUSES = ["draft", "review", "published", "archived"] as const;
export type ReportAssetStatus = (typeof REPORT_ASSET_STATUSES)[number];

export const REPORT_ASSET_KINDS = ["topic", "region", "custom"] as const;
export type ReportAssetKind = (typeof REPORT_ASSET_KINDS)[number];

export type ReportAssetDoc = {
  _id?: ObjectId;
  orgId?: ObjectId | null;
  kind: ReportAssetKind;
  key: {
    topicKey?: string | null;
    regionCode?: string | null;
    slug?: string | null;
  };
  status: ReportAssetStatus;
  currentRev: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  publishedByUserId?: ObjectId | null;
};

export type ReportRevisionDoc = {
  _id?: ObjectId;
  assetId: ObjectId;
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
