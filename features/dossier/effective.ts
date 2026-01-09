type FindingLike = {
  claimId: string;
  producedBy?: string;
  updatedAt?: Date | string | null;
};

function toTime(value: Date | string | null | undefined) {
  if (!value) return 0;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

export function selectEffectiveFindings<T extends FindingLike>(findings: T[]) {
  const byClaim = new Map<string, T>();
  for (const finding of findings) {
    const existing = byClaim.get(finding.claimId);
    if (!existing) {
      byClaim.set(finding.claimId, finding);
      continue;
    }
    if (existing.producedBy !== "editor" && finding.producedBy === "editor") {
      byClaim.set(finding.claimId, finding);
      continue;
    }
    const existingTime = toTime(existing.updatedAt);
    const currentTime = toTime(finding.updatedAt);
    if (existing.producedBy === finding.producedBy && currentTime > existingTime) {
      byClaim.set(finding.claimId, finding);
    }
  }
  return Array.from(byClaim.values());
}

export function sanitizeClaimPublic<T extends { authorRef?: { userId?: string; handle?: string } }>(claim: T) {
  if (!claim.authorRef) return claim;
  const safeAuthorRef: Record<string, string> = {};
  if (claim.authorRef.handle) safeAuthorRef.handle = claim.authorRef.handle;
  if (Object.keys(safeAuthorRef).length === 0) {
    const { authorRef, ...rest } = claim as any;
    return rest;
  }
  return { ...(claim as any), authorRef: safeAuthorRef };
}
