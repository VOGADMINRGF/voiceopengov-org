import { cookies } from "next/headers";
import type { EventualitySnapshotDoc } from "@core/eventualities";
import { maskUserId } from "@core/pii/redact";

const STAFF_ROLES = new Set(["admin", "superadmin", "moderator", "staff"]);

export type StaffContext = {
  role: string;
  userId: string | null;
};

export async function getStaffContext(): Promise<StaffContext | null> {
  const jar = await cookies();
  const role = jar.get("u_role")?.value ?? "guest";
  if (!STAFF_ROLES.has(role)) return null;
  return {
    role,
    userId: jar.get("u_id")?.value ?? null,
  };
}

export function serializeSnapshot(doc: EventualitySnapshotDoc) {
  const toIso = (value?: Date | null) =>
    value instanceof Date ? value.toISOString() : value ? new Date(value).toISOString() : null;

  return {
    contributionId: doc.contributionId,
    locale: doc.locale,
    userIdMasked: doc.userIdMasked ?? null,
    nodesCount: doc.nodesCount,
    treesCount: doc.treesCount,
    reviewed: doc.reviewed,
    reviewedAt: toIso(doc.reviewedAt ?? null),
    reviewedBy: doc.reviewedBy ?? null,
    createdAt: toIso(doc.createdAt),
    updatedAt: toIso(doc.updatedAt),
  };
}
