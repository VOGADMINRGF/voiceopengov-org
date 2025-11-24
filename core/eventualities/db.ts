import { coreCol } from "@core/db/triMongo";
import type {
  DecisionTreeDoc,
  EventualityNodeDoc,
  EventualitySnapshotDoc,
} from "./types";

const EVENTUALITY_NODES_COLLECTION = "eventuality_nodes";
const DECISION_TREES_COLLECTION = "eventuality_decision_trees";
const EVENTUALITY_SNAPSHOTS_COLLECTION = "eventuality_snapshots";

const ensured = {
  nodes: false,
  trees: false,
  snapshots: false,
};

async function ensureNodeIndexes() {
  if (ensured.nodes) return;
  const col = await coreCol<EventualityNodeDoc>(EVENTUALITY_NODES_COLLECTION);
  await col.createIndex({ nodeId: 1 }, { unique: true });
  await col.createIndex({ contributionId: 1, statementId: 1 });
  await col.createIndex({ statementId: 1, option: 1 });
  ensured.nodes = true;
}

async function ensureTreeIndexes() {
  if (ensured.trees) return;
  const col = await coreCol<DecisionTreeDoc>(DECISION_TREES_COLLECTION);
  await col.createIndex({ treeId: 1 }, { unique: true });
  await col.createIndex({ contributionId: 1, rootStatementId: 1 });
  ensured.trees = true;
}

async function ensureSnapshotIndexes() {
  if (ensured.snapshots) return;
  const col = await coreCol<EventualitySnapshotDoc>(EVENTUALITY_SNAPSHOTS_COLLECTION);
  await col.createIndex({ contributionId: 1 }, { unique: true });
  await col.createIndex({ reviewed: 1, createdAt: -1 });
  ensured.snapshots = true;
}

export async function eventualityNodesCol() {
  await ensureNodeIndexes();
  return coreCol<EventualityNodeDoc>(EVENTUALITY_NODES_COLLECTION);
}

export async function decisionTreesCol() {
  await ensureTreeIndexes();
  return coreCol<DecisionTreeDoc>(DECISION_TREES_COLLECTION);
}

export async function eventualitySnapshotsCol() {
  await ensureSnapshotIndexes();
  return coreCol<EventualitySnapshotDoc>(EVENTUALITY_SNAPSHOTS_COLLECTION);
}
