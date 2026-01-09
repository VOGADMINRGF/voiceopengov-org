import { coreCol } from "@core/db/triMongo";
import type { GraphRepairDoc } from "./types";

const REPAIRS_COLLECTION = "graph_repairs";

let ensured = false;

async function ensureRepairIndexes() {
  if (ensured) return;
  const col = await coreCol<GraphRepairDoc>(REPAIRS_COLLECTION);
  await col.createIndex({ status: 1, createdAt: -1 });
  await col.createIndex({ type: 1, createdAt: -1 });
  ensured = true;
}

export async function graphRepairsCol() {
  await ensureRepairIndexes();
  return coreCol<GraphRepairDoc>(REPAIRS_COLLECTION);
}
