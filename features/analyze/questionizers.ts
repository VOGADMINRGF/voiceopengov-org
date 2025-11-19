// features/analyze/questionizers.ts
import type { AnalyzeResult, Question, Knot } from "./schemas";

/**
 * Keine Offline-Generierung von Fragen/Knoten mehr.
 * Wir nehmen ausschließlich das, was aus dem Modell kommt.
 */

export function deriveCriticalQuestions(result: AnalyzeResult): Question[] {
  return Array.isArray(result.questions) ? result.questions : [];
}

export function deriveKnots(result: AnalyzeResult): Knot[] {
  return Array.isArray(result.knots) ? result.knots : [];
}
