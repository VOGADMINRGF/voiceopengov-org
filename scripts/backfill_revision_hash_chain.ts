#!/usr/bin/env tsx
import { coreCol } from "@core/db/triMongo";
import { computeRevisionHash, REVISION_HASH_ALGO } from "@features/dossier/revisionHash";

type RevisionDoc = {
  _id?: unknown;
  revId?: string;
  dossierId: string;
  entityType: string;
  entityId: string;
  action: string;
  diffSummary: string;
  byRole: string;
  byUserId?: unknown;
  timestamp: Date | string;
  prevHash?: string;
  hash?: string;
  hashAlgo?: string;
};

function parseLimit(args: string[]) {
  const arg = args.find((a) => a.startsWith("--limit="));
  if (!arg) return 0;
  const v = Number(arg.split("=")[1] ?? "0");
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function parseDossierId(args: string[]) {
  const arg = args.find((a) => a.startsWith("--dossierId="));
  return arg ? String(arg.split("=")[1] ?? "").trim() : "";
}

function parseTimestamp(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

async function run() {
  const args = process.argv.slice(2);
  const limit = parseLimit(args);
  const dossierIdFilter = parseDossierId(args);
  const dryRun = args.includes("--dry-run");

  const col = await coreCol<RevisionDoc>("dossier_revisions");
  const dossierCol = await coreCol<any>("dossiers");
  const dossiers = dossierIdFilter
    ? [dossierIdFilter]
    : await col.distinct("dossierId", {});

  let processed = 0;
  let updated = 0;

  for (const dossierId of dossiers) {
    if (limit && processed >= limit) break;
    processed += 1;

    const items = await col
      .find({ dossierId })
      .sort({ timestamp: 1, _id: 1 })
      .toArray();

    let prevHash: string | undefined;
    let lastTimestamp: Date | null = null;
    const ops: any[] = [];
    let dossierUpdates = 0;

    for (const rev of items) {
      const timestamp = parseTimestamp(rev.timestamp);
      if (!timestamp) {
        console.warn(`[hash-backfill] skip invalid timestamp`, { dossierId, revId: rev.revId });
        continue;
      }
      lastTimestamp = timestamp;
      const expected = computeRevisionHash({
        prevHash,
        dossierId: rev.dossierId,
        entityType: rev.entityType,
        entityId: rev.entityId,
        action: rev.action,
        diffSummary: rev.diffSummary,
        byRole: rev.byRole,
        byUserId: rev.byUserId ? String(rev.byUserId) : undefined,
        timestamp,
      });

      const needsUpdate =
        rev.prevHash !== prevHash ||
        rev.hash !== expected ||
        rev.hashAlgo !== REVISION_HASH_ALGO;

      if (needsUpdate) {
        dossierUpdates += 1;
        if (!dryRun) {
          const filter = rev._id ? { _id: rev._id } : { revId: rev.revId };
          ops.push({
            updateOne: {
              filter,
              update: {
                $set: {
                  prevHash,
                  hash: expected,
                  hashAlgo: REVISION_HASH_ALGO,
                },
              },
            },
          });
        }
      }

      prevHash = expected;
    }

    if (!dryRun && ops.length > 0) {
      await col.bulkWrite(ops, { ordered: true });
    }

    if (!dryRun && prevHash) {
      await dossierCol.updateOne(
        { dossierId },
        {
          $set: {
            lastRevisionHash: prevHash,
            lastRevisionAt: lastTimestamp ?? new Date(),
            revisionSeq: items.length,
          },
        },
      );
    }

    updated += dossierUpdates;
    console.log(
      `[hash-backfill] dossier=${dossierId} revisions=${items.length} updated=${dossierUpdates} dryRun=${dryRun}`,
    );
  }

  console.log(`[hash-backfill] done dossiers=${processed} updated=${updated} dryRun=${dryRun}`);
}

run().catch((err) => {
  console.error("[hash-backfill] fatal", err);
  process.exit(1);
});
