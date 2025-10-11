import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prismaWeb: PrismaClient | undefined;
}
export const prisma = globalThis.__prismaWeb ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__prismaWeb = prisma;

export type { Prisma } from "@prisma/client";
export { ContentKind, RegionMode, Locale } from "@prisma/client";
