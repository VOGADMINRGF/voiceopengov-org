import { coreCol } from "@core/db/triMongo";
import type { EditorialItemDoc, EditorialRevisionDoc, EvidenceSourceDoc } from "./types";

const ITEMS_COLLECTION = "editorial_items";
const REVISIONS_COLLECTION = "editorial_revisions";
const SOURCES_COLLECTION = "evidence_sources";

const ensured = {
  items: false,
  revisions: false,
  sources: false,
};

async function ensureItemIndexes() {
  if (ensured.items) return;
  const col = await coreCol<EditorialItemDoc>(ITEMS_COLLECTION);
  await col.createIndex({ status: 1, orgId: 1, updatedAt: -1 });
  await col.createIndex({ "assignment.ownerUserId": 1 });
  await col.createIndex({ "intake.topicKey": 1 });
  await col.createIndex({ "intake.regionCode": 1 });
  ensured.items = true;
}

async function ensureRevisionIndexes() {
  if (ensured.revisions) return;
  const col = await coreCol<EditorialRevisionDoc>(REVISIONS_COLLECTION);
  await col.createIndex({ itemId: 1, rev: -1 });
  ensured.revisions = true;
}

async function ensureSourceIndexes() {
  if (ensured.sources) return;
  const col = await coreCol<EvidenceSourceDoc>(SOURCES_COLLECTION);
  await col.createIndex({ itemId: 1 });
  await col.createIndex({ url: 1 });
  ensured.sources = true;
}

export async function editorialItemsCol() {
  await ensureItemIndexes();
  return coreCol<EditorialItemDoc>(ITEMS_COLLECTION);
}

export async function editorialRevisionsCol() {
  await ensureRevisionIndexes();
  return coreCol<EditorialRevisionDoc>(REVISIONS_COLLECTION);
}

export async function evidenceSourcesCol() {
  await ensureSourceIndexes();
  return coreCol<EvidenceSourceDoc>(SOURCES_COLLECTION);
}
