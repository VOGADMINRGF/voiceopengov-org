// features/analyze/normalize.ts
import type { AnalyzeResult, Question, Knot } from "./schemas";

/**
 * Kleine Utility, um Fragen & Knoten zu harmonisieren:
 *
 * - Wenn eine Frage inhaltlich einem Knoten entspricht,
 *   wird sie an diesen Knoten „angehängt“ (relatesToKnotId, promotedToKnotId)
 *   und NICHT mehr in der normalen Fragenliste gelistet.
 *
 * - Ziel: keine Dopplung von „großen Hub-Themen“,
 *   d.h. entweder Knoten ODER Frage – nicht beides.
 */
export function normalizeQuestionsAndKnots(base: AnalyzeResult): AnalyzeResult {
  if (!base.knots?.length || !base.questions?.length) return base;

  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[?:!.,;]+$/g, "")
      .trim();

  const knotByKey = new Map<string, Knot>();
  for (const knot of base.knots) {
    if (!knot?.label) continue;
    knotByKey.set(clean(knot.label), knot);
  }

  const normalizedQuestions: Question[] = [];
  for (const q of base.questions) {
    if (!q?.text) continue;
    const key = clean(q.text);
    const matchingKnot = knotByKey.get(key);

    if (matchingKnot) {
      // Frage entspricht inhaltlich einem vorhandenen Knoten:
      // -> nur noch als Verweis, nicht mehr als eigenständige Frage anzeigen.
      normalizedQuestions.push({
        ...q,
        relatesToKnotId: matchingKnot.id,
        promotedToKnotId: matchingKnot.id,
      });
    } else {
      normalizedQuestions.push(q);
    }
  }

  // Anzeige-Logik: nur Fragen ohne promotedToKnotId
  const visibleQuestions = normalizedQuestions.filter(
    (q) => !q.promotedToKnotId
  );

  return {
    ...base,
    questions: visibleQuestions,
  };
}
