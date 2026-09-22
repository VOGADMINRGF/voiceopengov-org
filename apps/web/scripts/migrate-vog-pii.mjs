#!/usr/bin/env node

import { MongoClient } from "mongodb";

const APPLY = process.argv.includes("--apply");
const PURGE_SOURCE = process.argv.includes("--purge-source");
const BATCH_SIZE = 250;
const COLLECTIONS = ["members", "chapter_intake", "regional_interest_intake"];

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
    return { collection: collectionName, sourceCount, copied: 0, destinationBefore };
  }

  let copied = 0;
  let operations = [];
  let ids = [];
  const cursor = source.find({}, { batchSize: BATCH_SIZE });

  for await (const document of cursor) {
    operations.push({
      replaceOne: {
        filter: { _id: document._id },
        replacement: document,
        upsert: true,
      },
    });
    ids.push(document._id);

    if (operations.length >= BATCH_SIZE) {
      await destination.bulkWrite(operations, { ordered: false });
      await verifyBatch(destination, ids, collectionName);
      copied += operations.length;
      operations = [];
      ids = [];
    }
  }

  if (operations.length) {
    await destination.bulkWrite(operations, { ordered: false });
    await verifyBatch(destination, ids, collectionName);
    copied += operations.length;
  }

  const destinationAfter = await destination.countDocuments({});
  log("collection copied", {
    collection: collectionName,
    sourceCount,
    copied,
    destinationAfter,
  });

  return { collection: collectionName, sourceCount, copied, destinationBefore, destinationAfter };
}

async function purgeCollection(sourceDb, destinationDb, collectionName) {
  const source = sourceDb.collection(collectionName);
  const destination = destinationDb.collection(collectionName);
  const sourceCount = await source.countDocuments({});
  if (sourceCount === 0) return { collection: collectionName, purged: 0 };

  const sourceIds = await source.find({}, { projection: { _id: 1 } }).toArray();
  const ids = sourceIds.map((entry) => entry._id);
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

  log("source purged", { collection: collectionName, purged: result.deletedCount });
  return { collection: collectionName, purged: result.deletedCount };
}

async function main() {
  if (PURGE_SOURCE && !APPLY) {
    throw new Error("--purge-source requires --apply");
  }

  const publicUri = required("MONGODB_URI");
  const piiUri = required("PII_MONGODB_URI");
  const publicDbName = safeDbName("VOG_DB_NAME", "vog_public");
  const piiDbName = safeDbName("PII_DB_NAME", "vog_pii");

  if (publicDbName === piiDbName) {
    throw new Error("VOG_DB_NAME and PII_DB_NAME must be different databases");
  }

  const sharedClient = publicUri === piiUri;
  const publicClient = new MongoClient(publicUri);
  const piiClient = sharedClient ? publicClient : new MongoClient(piiUri);

  try {
    await publicClient.connect();
    if (!sharedClient) await piiClient.connect();

    const sourceDb = publicClient.db(publicDbName);
    const destinationDb = piiClient.db(piiDbName);

    log("starting", {
      sourceDb: publicDbName,
      destinationDb: piiDbName,
      sharedCluster: sharedClient,
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
        copied: result.copied,
      })),
    });
  } finally {
    await publicClient.close().catch(() => {});
    if (!sharedClient) await piiClient.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(`[vog-pii-migration] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
