// features/analyze/context.ts
import type { AnalyzeResult, Note } from "./schemas";

/**
 * Keine Heuristik mehr:
 * - Wenn das Modell Notes liefert, geben wir sie zurück.
 * - Sonst: leeres Array.
 */
export function deriveContextNotes(result: AnalyzeResult): Note[] {
  return Array.isArray(result.notes) ? result.notes : [];
}
