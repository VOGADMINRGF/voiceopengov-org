import { getGraphDriver } from "../driver";

export type GraphReportSummary = {
  statements: number;
  eventualities: number;
  consequences: number;
  responsibilities: number;
  byLevel: Array<{ level: string; responsibilityCount: number }>;
};

export async function getTopicReportData(topicSlug: string): Promise<GraphReportSummary> {
  const driver = getGraphDriver();
  if (!driver) {
    throw new Error("Graph driver unavailable");
  }

  const session = driver.session();
  try {
    const res = await session.run(
      `
      CALL {
        MATCH (s:Statement {topic: $topic})
        RETURN count(DISTINCT s) AS statements
      }
      CALL {
        MATCH (s:Statement {topic: $topic})-[:LEADS_TO]->(e:Eventuality)
        RETURN count(DISTINCT e) AS eventualities
      }
      CALL {
        MATCH (s:Statement {topic: $topic})-[:HAS_CONSEQUENCE]->(c:Consequence)
        RETURN count(DISTINCT c) AS consequences
      }
      CALL {
        MATCH (s:Statement {topic: $topic})-[:HAS_RESPONSIBILITY_PATH]->(:ResponsibilityPath)-[:HAS_STEP]->(st:ResponsibilityStep)
        RETURN count(DISTINCT st) AS responsibilities
      }
      CALL {
        MATCH (s:Statement {topic: $topic})-[:HAS_RESPONSIBILITY_PATH]->(:ResponsibilityPath)-[:HAS_STEP]->(st:ResponsibilityStep)
        WITH coalesce(st.level, "unknown") AS level, count(st) AS responsibilityCount
        RETURN collect({ level, responsibilityCount }) AS byLevel
      }
      RETURN statements, eventualities, consequences, responsibilities, byLevel
      `,
      { topic: topicSlug },
    );

    const record = res.records[0];
    return {
      statements: record?.get("statements") ?? 0,
      eventualities: record?.get("eventualities") ?? 0,
      consequences: record?.get("consequences") ?? 0,
      responsibilities: record?.get("responsibilities") ?? 0,
      byLevel: (record?.get("byLevel") as Array<any>) ?? [],
    };
  } finally {
    await session.close();
  }
}

export async function getRegionReportData(regionId: string): Promise<GraphReportSummary> {
  const driver = getGraphDriver();
  if (!driver) {
    throw new Error("Graph driver unavailable");
  }

  const session = driver.session();
  try {
    const res = await session.run(
      `
      CALL {
        MATCH (s:Statement {regionId: $regionId})
        RETURN count(DISTINCT s) AS statements
      }
      CALL {
        MATCH (s:Statement {regionId: $regionId})-[:LEADS_TO]->(e:Eventuality)
        RETURN count(DISTINCT e) AS eventualities
      }
      CALL {
        MATCH (s:Statement {regionId: $regionId})-[:HAS_CONSEQUENCE]->(c:Consequence)
        RETURN count(DISTINCT c) AS consequences
      }
      CALL {
        MATCH (s:Statement {regionId: $regionId})-[:HAS_RESPONSIBILITY_PATH]->(:ResponsibilityPath)-[:HAS_STEP]->(st:ResponsibilityStep)
        RETURN count(DISTINCT st) AS responsibilities
      }
      CALL {
        MATCH (s:Statement {regionId: $regionId})-[:HAS_RESPONSIBILITY_PATH]->(:ResponsibilityPath)-[:HAS_STEP]->(st:ResponsibilityStep)
        WITH coalesce(st.level, "unknown") AS level, count(st) AS responsibilityCount
        RETURN collect({ level, responsibilityCount }) AS byLevel
      }
      RETURN statements, eventualities, consequences, responsibilities, byLevel
      `,
      { regionId },
    );

    const record = res.records[0];
    return {
      statements: record?.get("statements") ?? 0,
      eventualities: record?.get("eventualities") ?? 0,
      consequences: record?.get("consequences") ?? 0,
      responsibilities: record?.get("responsibilities") ?? 0,
      byLevel: (record?.get("byLevel") as Array<any>) ?? [],
    };
  } finally {
    await session.close();
  }
}
