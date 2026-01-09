#!/usr/bin/env tsx
import { coreCol } from "@core/db/triMongo";

const FINDINGS_COLLECTION = "dossier_findings";

function keyMatches(a: Record<string, number>, b: Record<string, number>) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function run() {
  const col = await coreCol<any>(FINDINGS_COLLECTION);
  const now = new Date();

  const updateRes = await col.updateMany(
    { producedBy: { $exists: false } },
    { $set: { producedBy: "pipeline", updatedAt: now } },
  );

  console.log(
    `[migrate_findings_producedBy] updated=${updateRes.modifiedCount} matched=${updateRes.matchedCount}`,
  );

  const indexes = await col.indexes();
  const legacyIndex = indexes.find(
    (idx) => idx.unique && keyMatches(idx.key as any, { dossierId: 1, claimId: 1 }),
  );
  if (legacyIndex?.name) {
    await col.dropIndex(legacyIndex.name);
    console.log(`[migrate_findings_producedBy] dropped index ${legacyIndex.name}`);
  } else {
    console.log("[migrate_findings_producedBy] legacy index not found");
  }

  try {
    await col.createIndex(
      { dossierId: 1, claimId: 1, producedBy: 1 },
      { unique: true, name: "dossier_claim_producedBy_unique" },
    );
    console.log("[migrate_findings_producedBy] created index dossier_claim_producedBy_unique");
  } catch (err: any) {
    console.warn("[migrate_findings_producedBy] create producedBy index skipped", err?.message ?? err);
  }

  try {
    await col.createIndex(
      { dossierId: 1, findingId: 1 },
      { unique: true, name: "dossier_findingId_unique" },
    );
    console.log("[migrate_findings_producedBy] created index dossier_findingId_unique");
  } catch (err: any) {
    console.warn("[migrate_findings_producedBy] create findingId index skipped", err?.message ?? err);
  }
}

run().catch((err) => {
  console.error("[migrate_findings_producedBy] fatal", err);
  process.exit(1);
});
