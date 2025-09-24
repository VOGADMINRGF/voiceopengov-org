// apps/web/src/lib/contribution/regionLookup.ts
import { prismaWeb } from "@/lib/dbWeb";

export async function findRegionByCodeOrName(codeOrName?: string) {
  if (!codeOrName) return null;
  const byCode = await prismaWeb.region.findUnique({ where: { code: codeOrName } });
  if (byCode) return byCode;
  const byName = await prismaWeb.region.findFirst({ where: { name: codeOrName } });
  return byName;
}
