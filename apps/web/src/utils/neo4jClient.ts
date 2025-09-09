import "server-only";
import neo4j from "neo4j-driver";
import type { Driver } from "neo4j-driver";

const URL  = process.env.NEO4J_URI      || "bolt://localhost:7687";
const USER = process.env.NEO4J_USER     || "neo4j";
const PASS = process.env.NEO4J_PASSWORD || "neo4j";

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(URL, neo4j.auth.basic(USER, PASS), { disableLosslessIntegers: true });
  }
  return driver!;
}

export async function neo4jPing() {
  try {
    const s = getNeo4jDriver().session();
    const r = await s.run("RETURN 1 AS ok");
    await s.close();
    return { name: "neo4j:bolt", ok: r.records?.[0]?.get("ok") === 1 };
  } catch (e:any) {
    return { name: "neo4j:bolt", ok: false, error: e?.message ?? String(e) };
  }
}
