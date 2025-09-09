import neo4j, { Driver } from "neo4j-driver";

const uri = process.env.MEMGRAPH_URI as string; // bolt://
const user = process.env.MEMGRAPH_USER || undefined;
const password = process.env.MEMGRAPH_PASSWORD || undefined;

let driver: Driver | null = null;

export function getMemgraphDriver() {
  if (!uri) throw new Error("MEMGRAPH_URI missing");
  if (!driver) {
    driver = user ? neo4j.driver(uri, neo4j.auth.basic(user, password || "")) : neo4j.driver(uri);
  }
  return driver;
}

export async function memgraphPing() {
  const d = getMemgraphDriver();
  const session = d.session();
  try {
    await session.run("RETURN 1 AS ok");
    return true;
  } finally {
    await session.close();
  }
}