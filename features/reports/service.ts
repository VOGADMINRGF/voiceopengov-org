// features/reports/service.ts
import type {
    RegionReportOverview,
    TopicReport,
  } from "@features/report/data/types";
  import { getMockRegionOverview } from "./mock";

/**
 * Später:
 *  - hier Prisma/SQL/Neo4j/triMongo-Abfragen einbauen
 *  - E150-Aggregate (Claims, EvidenceSlots, Question-Knoten) pro Region zusammensetzen
 */
export async function getRegionReportOverview(
  region: string
): Promise<RegionReportOverview> {
  // TODO: durch echte DB-Logik ersetzen
  return getMockRegionOverview(region || "DE-BB");
}
