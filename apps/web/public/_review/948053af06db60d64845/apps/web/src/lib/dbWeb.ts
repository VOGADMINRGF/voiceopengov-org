// apps/web/src/lib/dbWeb.ts  (Postgres)
import { PrismaClient } from "@/db/web";
const g = globalThis as any;
export const prismaWeb = g.__prismaWeb ?? new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["warn","error"] : ["error"] });
if (process.env.NODE_ENV !== "production") g.__prismaWeb = prismaWeb;
