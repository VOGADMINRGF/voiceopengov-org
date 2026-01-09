import crypto from "crypto";

export const REVISION_HASH_ALGO = "sha256" as const;

export type RevisionHashInput = {
  prevHash?: string | null;
  dossierId: string;
  entityType: string;
  entityId: string;
  action: string;
  diffSummary: string;
  byRole: string;
  byUserId?: string | null;
  timestamp: Date;
};

export function buildRevisionHashPayload(input: RevisionHashInput) {
  return {
    prevHash: input.prevHash ?? null,
    dossierId: input.dossierId,
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    diffSummary: input.diffSummary,
    byRole: input.byRole,
    byUserId: input.byUserId ?? null,
    timestamp: input.timestamp.toISOString(),
  };
}

export function computeRevisionHash(input: RevisionHashInput) {
  const payload = buildRevisionHashPayload(input);
  return crypto.createHash(REVISION_HASH_ALGO).update(JSON.stringify(payload)).digest("hex");
}
