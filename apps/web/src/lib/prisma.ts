import { PrismaClient } from "@/db/web";
import { __wbindgen_bigint_get_as_i64 } from "@/db/web/query_engine_bg";

declare global {
  // eslint-disable-next-line no-var
  var __web_prisma: PrismaClient | undefined;
}

export const prisma =
  global.__web_prisma ?? new PrismaClient({ log: ["warn", "error"] });

if (process.env.NODE_ENV !== "production") {
  global.__web_prisma = prisma;
}

