import { aql } from "arangojs";
import { getArango } from "@/utils/arangoClient";
import { GraphRepo, Id, Report, Region, Statement, Topic, User, Vote } from "./types";

const VCOLS = ["users", "topics", "regions", "statements", "reports", "votes"] as const;
const ECOLS = ["has_topic", "in_region", "contains", "cast", "on"] as const;
const GRAPH = "vog";

async function ensureCollections() {
  const db = getArango();
  for (const name of VCOLS) {
    if (!(await db.collection(name).exists())) await db.collection(name).create();
  }
  for (const name of ECOLS) {
    if (!(await db.edgeCollection(name).exists())) await db.edgeCollection(name).create();
  }
}

async function ensureGraph() {
  const db = getArango();
  const g = db.graph(GRAPH);
  const exists = await g.exists();
  if (!exists) {
    await db.createGraph(GRAPH, [
      { collection: "has_topic", from: ["statements"], to: ["topics"] },
      { collection: "in_region", from: ["statements"], to: ["regions"] },
      { collection: "contains", from: ["reports"], to: ["statements"] },
      { collection: "cast", from: ["users"], to: ["votes"] },
      { collection: "on", from: ["votes"], to: ["statements"] },
    ]);
  }
}

async function upsertVertex(col: string, key: string, doc: any) {
  const db = getArango();
  const c = db.collection(col);
  const _key = key;
  const exists = await c.documentExists(_key);
  if (exists) await c.update(_key, doc, { keepNull: false }); else await c.save({ _key, ...doc });
}

async function upsertEdge(col: string, _from: string, _to: string, data: any = {}) {
  const db = getArango();
  const c = db.edgeCollection(col);
  await c.save({ _from, _to, ...data }, { overwriteMode: "ignore" });
}

const repo: GraphRepo = {
  async ensureSchema() { await ensureCollections(); await ensureGraph(); },
  async upsertUser(u: User) { await upsertVertex("users", u.id, u); },
  async upsertTopic(t: Topic) { await upsertVertex("topics", t.id, t); },
  async upsertRegion(r: Region) { await upsertVertex("regions", r.id, r); },
  async upsertStatement(s: Statement) { await upsertVertex("statements", s.id, s); },
  async upsertReport(r: Report) { await upsertVertex("reports", r.id, r); },
  async relateStatementTopic(statementId: Id, topicId: Id) {
    await upsertEdge("has_topic", `statements/${statementId}`, `topics/${topicId}`);
  },
  async relateStatementRegion(statementId: Id, regionId: Id) {
    await upsertEdge("in_region", `statements/${statementId}`, `regions/${regionId}`);
  },
  async relateReportStatement(reportId: Id, statementId: Id) {
    await upsertEdge("contains", `reports/${reportId}`, `statements/${statementId}`);
  },
  async createVote(v: Vote) {
    await upsertVertex("votes", v.id, v);
    await upsertEdge("cast", `users/${v.userId}`, `votes/${v.id}`);
    await upsertEdge("on", `votes/${v.id}`, `statements/${v.statementId}`);
  },
};

export default repo;