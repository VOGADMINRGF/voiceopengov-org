import { getNeo4jDriver } from "@/utils/neo4jClient";
import { GraphRepo, Id, Report, Region, Statement, Topic, User, Vote } from "./types";

const repo: GraphRepo = {
  async ensureSchema() {
    const d = getNeo4jDriver();
    const s = d.session();
    try {
      const queries = [
        'CREATE CONSTRAINT IF NOT EXISTS FOR (n:User) REQUIRE n.id IS UNIQUE',
        'CREATE CONSTRAINT IF NOT EXISTS FOR (n:Topic) REQUIRE n.id IS UNIQUE',
        'CREATE CONSTRAINT IF NOT EXISTS FOR (n:Region) REQUIRE n.id IS UNIQUE',
        'CREATE CONSTRAINT IF NOT EXISTS FOR (n:Statement) REQUIRE n.id IS UNIQUE',
        'CREATE CONSTRAINT IF NOT EXISTS FOR (n:Report) REQUIRE n.id IS UNIQUE',
        'CREATE CONSTRAINT IF NOT EXISTS FOR (n:Vote) REQUIRE n.id IS UNIQUE',
        'CREATE INDEX IF NOT EXISTS FOR (n:User) ON (n.name)',
        'CREATE INDEX IF NOT EXISTS FOR (n:Topic) ON (n.name)',
        'CREATE INDEX IF NOT EXISTS FOR (n:Region) ON (n.code)',
        'CREATE INDEX IF NOT EXISTS FOR (n:Statement) ON (n.lang)',
      ];
      for (const q of queries) { await s.run(q); }
    } finally { await s.close(); }
  },

  async upsertUser(u: User) {
    const s = getNeo4jDriver().session();
    try { await s.run('MERGE (n:User {id:$id}) SET n += $props', { id: u.id, props: u }); } finally { await s.close(); }
  },
  async upsertTopic(t: Topic) {
    const s = getNeo4jDriver().session();
    try { await s.run('MERGE (n:Topic {id:$id}) SET n += $props', { id: t.id, props: t }); } finally { await s.close(); }
  },
  async upsertRegion(r: Region) {
    const s = getNeo4jDriver().session();
    try { await s.run('MERGE (n:Region {id:$id}) SET n += $props', { id: r.id, props: r }); } finally { await s.close(); }
  },
  async upsertStatement(st: Statement) {
    const s = getNeo4jDriver().session();
    try { await s.run('MERGE (n:Statement {id:$id}) SET n += $props', { id: st.id, props: st }); } finally { await s.close(); }
  },
  async upsertReport(r: Report) {
    const s = getNeo4jDriver().session();
    try { await s.run('MERGE (n:Report {id:$id}) SET n += $props', { id: r.id, props: r }); } finally { await s.close(); }
  },
  async relateStatementTopic(statementId: Id, topicId: Id) {
    const s = getNeo4jDriver().session();
    try {
      await s.run('MATCH (a:Statement {id:$sid}),(b:Topic {id:$tid}) MERGE (a)-[:HAS_TOPIC]->(b)', { sid: statementId, tid: topicId });
    } finally { await s.close(); }
  },
  async relateStatementRegion(statementId: Id, regionId: Id) {
    const s = getNeo4jDriver().session();
    try {
      await s.run('MATCH (a:Statement {id:$sid}),(b:Region {id:$rid}) MERGE (a)-[:IN_REGION]->(b)', { sid: statementId, rid: regionId });
    } finally { await s.close(); }
  },
  async relateReportStatement(reportId: Id, statementId: Id) {
    const s = getNeo4jDriver().session();
    try {
      await s.run('MATCH (a:Report {id:$rid}),(b:Statement {id:$sid}) MERGE (a)-[:CONTAINS]->(b)', { rid: reportId, sid: statementId });
    } finally { await s.close(); }
  },
  async createVote(v: Vote) {
    const s = getNeo4jDriver().session();
    try {
      await s.run(
        'MERGE (u:User {id:$uid}) WITH u ' +
        'MERGE (st:Statement {id:$sid}) WITH u, st ' +
        'MERGE (v:Vote {id:$id}) SET v += $props ' +
        'MERGE (u)-[:CAST]->(v)-[:ON]->(st)',
        { uid: v.userId, sid: v.statementId, id: v.id, props: v }
      );
    } finally { await s.close(); }
  },
};

export default repo;