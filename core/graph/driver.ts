import neo4j, { Driver } from "neo4j-driver";

let driver: Driver | null = null;

function hasGraphConfig() {
  return Boolean(process.env.NEO4J_URL && process.env.NEO4J_USER && process.env.NEO4J_PASSWORD);
}

export function getGraphDriver(): Driver | null {
  if (!hasGraphConfig()) return null;
  if (!driver) {
    driver = neo4j.driver(
      process.env.NEO4J_URL!,
      neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!),
      {
        disableLosslessIntegers: true,
      },
    );
  }
  return driver;
}

export async function closeGraphDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
