import { PrismaClient } from "./generated";
export type { Prisma } from "./generated";

const g = globalThis as unknown as { __web?: PrismaClient };
let clientSingleton: PrismaClient | undefined = g.__web;

function createClient() {
  const url = process.env.WEB_DATABASE_URL;
  if (!url) {
    throw new Error("WEB_DATABASE_URL missing");
  }
  return new PrismaClient({ datasources: { db: { url } } });
}

export function getPrismaClient() {
  if (clientSingleton) {
    return clientSingleton;
  }
  const client = createClient();
  clientSingleton = client;
  if (process.env.NODE_ENV !== "production") {
    g.__web = client;
  }
  return client;
}

export const prisma = new Proxy(
  {},
  {
    get(_target, prop, receiver) {
      const client = getPrismaClient();
      const value = Reflect.get(client as object, prop, receiver) as unknown;
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
) as PrismaClient;

export { ContentKind, RegionMode, Locale } from "./generated";
