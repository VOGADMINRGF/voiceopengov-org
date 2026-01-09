import type { ObjectId } from "@core/db/triMongo";

export const GRAPH_REPAIR_TYPES = ["merge_suggest", "relink"] as const;
export type GraphRepairType = (typeof GRAPH_REPAIR_TYPES)[number];

export const GRAPH_REPAIR_STATUSES = ["pending", "applied", "rejected"] as const;
export type GraphRepairStatus = (typeof GRAPH_REPAIR_STATUSES)[number];

export type GraphRepairDoc = {
  _id?: ObjectId;
  type: GraphRepairType;
  status: GraphRepairStatus;
  payload: {
    aId?: string;
    bId?: string;
    fromId?: string;
    toId?: string;
    reason?: string | null;
  };
  createdByUserId?: ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  appliedAt?: Date | null;
  appliedByUserId?: ObjectId | null;
  rejectedAt?: Date | null;
  rejectedByUserId?: ObjectId | null;
  rejectReason?: string | null;
};

export type GraphHealthSummary = {
  nodes: number;
  edges: number;
  orphans: number;
  duplicatesSuggested: number;
  brokenPaths: number;
  unlinkedEvidence: number;
  lastSyncAt: string | null;
};
