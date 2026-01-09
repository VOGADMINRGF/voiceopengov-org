import { coreCol } from "@core/db/triMongo";
import type { ReportAssetDoc, ReportRevisionDoc } from "./types";

const ASSETS_COLLECTION = "report_assets";
const REVISIONS_COLLECTION = "report_revisions";

const ensured = {
  assets: false,
  revisions: false,
};

async function ensureAssetIndexes() {
  if (ensured.assets) return;
  const col = await coreCol<ReportAssetDoc>(ASSETS_COLLECTION);
  await col.createIndex({ kind: 1, "key.topicKey": 1, "key.regionCode": 1, "key.slug": 1 });
  await col.createIndex({ status: 1, orgId: 1, updatedAt: -1 });
  ensured.assets = true;
}

async function ensureRevisionIndexes() {
  if (ensured.revisions) return;
  const col = await coreCol<ReportRevisionDoc>(REVISIONS_COLLECTION);
  await col.createIndex({ assetId: 1, rev: -1 });
  ensured.revisions = true;
}

export async function reportAssetsCol() {
  await ensureAssetIndexes();
  return coreCol<ReportAssetDoc>(ASSETS_COLLECTION);
}

export async function reportRevisionsCol() {
  await ensureRevisionIndexes();
  return coreCol<ReportRevisionDoc>(REVISIONS_COLLECTION);
}
