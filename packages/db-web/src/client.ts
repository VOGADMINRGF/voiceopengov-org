import { PrismaClient } from "./generated";
export type { Prisma } from "./generated";
export { ContentKind, PublishStatus, RegionMode } from "./generated";

declare global { var __PRISMA_WEB__: PrismaClient | undefined; }

const url = process.env.WEB_DATABASE_URL;
if (!url) throw new Error("WEB_DATABASE_URL is not set.");

export const prisma: PrismaClient =
  global.__PRISMA_WEB__ ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" ? (["warn", "error"] as const) : (["error"] as const),
    datasources: { db: { url } }
  });

if (process.env.NODE_ENV !== "production") global.__PRISMA_WEB__ = prisma;
