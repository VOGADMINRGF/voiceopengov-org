import { PrismaClient } from "./generated";
export type { Prisma } from "./generated";

// Node-only; in Edge nie importieren
declare global { var __PRISMA_CORE__: PrismaClient | undefined; }

const url = process.env.CORE_DATABASE_URL;
if (!url) throw new Error("CORE_DATABASE_URL is not set.");

export const prisma: PrismaClient =
  global.__PRISMA_CORE__ ?? new PrismaClient({ datasources: { db: { url } } });

if (process.env.NODE_ENV !== "production") global.__PRISMA_CORE__ = prisma;
