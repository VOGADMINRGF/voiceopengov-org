#!/usr/bin/env node

import { MongoClient } from "mongodb";

const APPLY = process.argv.includes("--apply");
const PURGE_SOURCE = process.argv.includes("--purge-source");
const BATCH_SIZE = 250;
const COLLECTIONS = ["members", "chapter_intake", "regional_interest_intake"];
const PURGE_CONFIRMATION = "I_HAVE_DEPLOYED_AND_VERIFIED_VOG_PII_CUTOVER";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function safeDbName(name, fallback) {
  const value = process.env[name]?.trim() || fallback;
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(value)) {
    throw new Error(`Invalid database name in ${name}`);
  }
  return value;
}

function mongoHost(uri, envName) {
  try {
    const host = new URL(uri).hostname.toLowerCase();
    if (!host) throw new Error("missing hostname");
    return host;
  } catch {
    throw new Error(`${envName} must be a valid MongoDB URI with a hostname`);
  }
}

function log(message, meta = {}) {
  // Never log connection strings or document contents from this migration.
  console.log(`[vog-pii-migration] ${message}`, meta);
}

async function verifyBatch(destination, ids, collectionName) {
  if (!ids.length) return;
  const copied = await destination.countDocuments({ _id: { $in: ids } });
  if (copied !== ids.length) {
    throw new Error(
      `Verification failed for ${collectionName}: expected ${ids.length}, found ${copied}`,
    );
  }
}

async function flushInsertOnlyBatch(destination, operations, ids, collectionName) {
  if (!operations.length) return;
  await destination.bulkWrite(operations, { ordered: false });
  await verifyBatch(destination, ids, collectionName);
}

async function copyCollection(sourceDb, destinationDb, collectionName) {
  const source = sourceDb.collection(collectionName);
  const destination = destinationDb.collection(collectionName);
  const sourceCount = await source.countDocuments({});
  const destinationBefore = await destination.countDocuments({});

  log("collection scan", {
    collection: collectionName,
    sourceCount,
    destinationBefore,
    mode: APPLY ? "apply" : "dry-run",
  });

  if (!APPLY || sourceCount === 0) {
    return { collection: collectionName, sourceCount, processed: 0, destinationBefore };
  }

  let processed = 0;
  let operations = [];
  let ids = [];
  const cursor = source.find({}, { batchSize: BATCH_SIZE });

  for await (const document of cursor) {
    const { _id, ...insertFields } = document;
    operations.push({
      updateOne: {
        filter: { _id },
        update: { $setOnInsert: insertFields },
        upsert: true,
      },
    });
    ids.push(_id);

    if (operations.length >= BATCH_SIZE) {
      await flushInsertOnlyBatch(destination, operations, ids, collectionName);
      processed += operations.length;
      operations = [];
      ids = [];
    }
  }

  if (operations.length) {
    await flushInsertOnlyBatch(destination, operations, ids, collectionName);
    processed += operations.length;
  }

  const destinationAfter = await destination.countDocuments({});
  log("collection copied", {
    collection: collectionName,
    sourceCount,
    processed,
    destinationAfter,
  });

  return {
    collection: collectionName,
    sourceCount,
    processed,
    destinationBefore,
    destinationAfter,
  };
}

async function purgeCollection(sourceDb, destinationDb, collectionName) {
  const source = sourceDb.collection(collectionName);
  const destination = destinationDb.collection(collectionName);
  const initialSourceCount = await source.countDocuments({});
  if (initialSourceCount === 0) return { collection: collectionName, purged: 0 };

  let purged = 0;
  let ids = [];
  const cursor = source.find({}, { projection: { _id: 1 }, batchSize: BATCH_SIZE });

  async function purgeBatch() {
    if (!ids.length) return;
    const destinationCount = await destination.countDocuments({ _id: { $in: ids } });
    if (destinationCount !== ids.length) {
      throw new Error(
        `Refusing purge for ${collectionName}: destination has ${destinationCount}/${ids.length} source ids`,
      );
    }
    const result = await source.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount !== ids.length) {
      throw new Error(
        `Purge verification failed for ${collectionName}: deleted ${result.deletedCount}/${ids.length}`,
      );
    }
    purged += result.deletedCount;
    ids = [];
  }

  for await (const entry of cursor) {
    ids.push(entry._id);
    if (ids.length >= BATCH_SIZE) await purgeBatch();
  }
  await purgeBatch();

  const remaining = await source.countDocuments({});
  if (remaining !== 0) {
    throw new Error(
      `Source ${collectionName} still contains ${remaining} records after purge; rerun copy verification before any further purge`,
    );
  }

  log("source purged", { collection: collectionName, purged });
  return { collection: collectionName, purged };
}

async function main() {
  if (PURGE_SOURCE && !APPLY) {
    throw new Error("--purge-source requires --apply");
  }
  if (PURGE_SOURCE && process.env.VOG_PII_PURGE_CONFIRM !== PURGE_CONFIRMATION) {
    throw new Error(
      `Refusing purge: set VOG_PII_PURGE_CONFIRM=${PURGE_CONFIRMATION} only after deploy and smoke verification`,
    );
  }

  const publicUri = required("MONGODB_URI");
  const piiUri = required("PII_MONGODB_URI");
  const publicDbName = safeDbName("VOG_DB_NAME", "vog_public");
  const piiDbName = safeDbName("PII_DB_NAME", "vog_pii");

  if (publicDbName === piiDbName) {
    throw new Error("VOG_DB_NAME and PII_DB_NAME must be different databases");
  }

  const publicHost = mongoHost(publicUri, "MONGODB_URI");
  const piiHost = mongoHost(piiUri, "PII_MONGODB_URI");
  if (publicHost === piiHost) {
    throw new Error(
      "MONGODB_URI and PII_MONGODB_URI must use different MongoDB cluster hosts for the VOG PII cutover",
    );
  }

  const publicClient = new MongoClient(publicUri);
  const piiClient = new MongoClient(piiUri);

  try {
    await publicClient.connect();
    await piiClient.connect();

    const sourceDb = publicClient.db(publicDbName);
    const destinationDb = piiClient.db(piiDbName);

    log("starting", {
      sourceDb: publicDbName,
      destinationDb: piiDbName,
      physicalIsolation: true,
      apply: APPLY,
      purgeSource: PURGE_SOURCE,
    });

    const results = [];
    for (const collectionName of COLLECTIONS) {
      results.push(await copyCollection(sourceDb, destinationDb, collectionName));
    }

    if (APPLY) {
      await destinationDb.collection("system_migrations").updateOne(
        { _id: "vog-pii-cutover-v1" },
        {
          $set: {
            completedAt: new Date(),
            sourceDb: publicDbName,
            destinationDb: piiDbName,
            collections: COLLECTIONS,
            sourceCounts: Object.fromEntries(
              results.map((result) => [result.collection, result.sourceCount]),
            ),
            mode: PURGE_SOURCE ? "apply+purge" : "apply",
          },
        },
        { upsert: true },
      );
    }

    if (PURGE_SOURCE) {
      for (const collectionName of COLLECTIONS) {
        await purgeCollection(sourceDb, destinationDb, collectionName);
      }
    }

    log("complete", {
      mode: APPLY ? (PURGE_SOURCE ? "apply+purge" : "apply") : "dry-run",
      collections: results.map((result) => ({
        collection: result.collection,
        sourceCount: result.sourceCount,
        processed: result.processed,
      })),
    });
  } finally {
    await publicClient.close().catch(() => {});
    await piiClient.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(`[vog-pii-migration] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
