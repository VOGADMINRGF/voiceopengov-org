// features/report/components/ReportPage.tsx
import "server-only";
import ReportPageClient from "./ReportPageClient";
import { listReports } from "../data/listReports";
import demoReports from "../data/demoReports";

/**
 * EINZIGE ReportPage:
 * - holt Server-Daten via DAL
 * - fällt auf Demo zurück, wenn leer/Fehler oder USE_DEMO aktiv
 */
export default async function ReportPage() {
  const useDemo = process.env.NEXT_PUBLIC_USE_DEMO === "1";
  let initial = [] as any[];

  if (!useDemo) {
    try {
      initial = await listReports({ limit: 30, includeStatements: true });
    } catch {
      // still fallback to demo
    }
  }
  if (!initial?.length) initial = demoReports as any[];

  return <ReportPageClient initial={initial} />;
}
