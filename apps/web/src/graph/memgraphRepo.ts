import { getMemgraphDriver } from "@/utils/memgraphClient";
import { GraphRepo, Id, Report, Region, Statement, Topic, User, Vote } from "./types";

const repo: GraphRepo = {
  async ensureSchema() {
    const s = getMemgraphDriver().session();
    try {
      const queries = [
        'CREATE INDEX IF NOT EXISTS ON :User(id)',
        'CREATE INDEX IF NOT EXISTS ON :Topic(id)',
        'CREATE INDEX IF NOT EXISTS ON :Region(id)',
        'CREATE INDEX IF NOT EXISTS ON :Statement(id)',
        'CREATE INDEX IF NOT EXISTS ON :Report(id)',
        'CREATE INDEX IF NOT EXISTS ON :Vote(id)'
      ];
      for (const q of queries) { await s.run(q); }
    } finally { await s.close(); }
  },
  async upsertUser(u: User) {
    const s = getMemgraphDriver().session();
    try { await s.run('MERGE (n:User {id:$id}) SET n += $props', { id: u.id, props: u }); } finally { await s.close(); }
  },
  async upsertTopic(t: Topic) {
    const s = getMemgraphDriver().session();
    try { await s.run('MERGE (n:Topic {id:$id}) SET n += $props', { id: t.id, props: t }); } finally { await s.close(); }
  },
  async upsertRegion(r: Region) {
    const s = getMemgraphDriver().session();
    try { await s.run('MERGE (n:Region {id:$id}) SET n += $props', { id: r.id, props: r }); } finally { await s.close(); }
  },
  async upsertStatement(st: Statement) {
    const s = getMemgraphDriver().session();
    try { await s.run('MERGE (n:Statement {id:$id}) SET n += $props', { id: st.id, props: st }); } finally { await s.close(); }
  },
  async upsertReport(r: Report) {
    const s = getMemgraphDriver().session();
    try { await s.run('MERGE (n:Report {id:$id}) SET n += $props', { id: r.id, props: r }); } finally { await s.close(); }
  },
  async relateStatementTopic(statementId: Id, topicId: Id) {
    const s = getMemgraphDriver().session();
    try { await s.run('MATCH (a:Statement {id:$sid}),(b:Topic {id:$tid}) MERGE (a)-[:HAS_TOPIC]->(b)', { sid: statementId, tid: topicId }); } finally { await s.close(); }
  },
  async relateStatementRegion(statementId: Id, regionId: Id) {
    const s = getMemgraphDriver().session();
    try { await s.run('MATCH (a:Statement {id:$sid}),(b:Region {id:$rid}) MERGE (a)-[:IN_REGION]->(b)', { sid: statementId, rid: regionId }); } finally { await s.close(); }
  },
  async relateReportStatement(reportId: Id, statementId: Id) {
    const s = getMemgraphDriver().session();
    try { await s.run('MATCH (a:Report {id:$rid}),(b:Statement {id:$sid}) MERGE (a)-[:CONTAINS]->(b)', { rid: reportId, sid: statementId }); } finally { await s.close(); }
  },
  async createVote(v: Vote) {
    const s = getMemgraphDriver().session();
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