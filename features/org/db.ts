import { coreCol } from "@core/db/triMongo";
import type { OrgDoc, OrgMembershipDoc } from "./types";

const ORGS_COLLECTION = "orgs";
const MEMBERS_COLLECTION = "org_memberships";

const ensured = {
  orgs: false,
  memberships: false,
};

async function ensureOrgIndexes() {
  if (ensured.orgs) return;
  const col = await coreCol<OrgDoc>(ORGS_COLLECTION);
  await col.createIndex({ slug: 1 }, { unique: true, sparse: true });
  await col.createIndex({ archivedAt: 1 });
  ensured.orgs = true;
}

async function ensureMembershipIndexes() {
  if (ensured.memberships) return;
  const col = await coreCol<OrgMembershipDoc>(MEMBERS_COLLECTION);
  await col.createIndex({ orgId: 1, userId: 1 }, { unique: true });
  await col.createIndex({ orgId: 1, status: 1 });
  await col.createIndex({ inviteTokenHash: 1 });
  ensured.memberships = true;
}

export async function orgsCol() {
  await ensureOrgIndexes();
  return coreCol<OrgDoc>(ORGS_COLLECTION);
}

export async function orgMembershipsCol() {
  await ensureMembershipIndexes();
  return coreCol<OrgMembershipDoc>(MEMBERS_COLLECTION);
}
