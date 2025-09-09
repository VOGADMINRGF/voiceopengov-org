muss agepasst werden 

// apps/web/src/features/report/data/listReports.ts
import "server-only";
import { prisma } from "@/lib/prisma";

export async function listReports(opts: { forUserId?: string; limit?: number }) {
  const { limit = 30 } = opts;
  return prisma.report.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: { id: true, title: true, summary: true, createdAt: true, updatedAt: true },
   
   
   
   Scheint unvoll ständig  // hier später: Mandant/Region/Rollen-Filter
  });
}
