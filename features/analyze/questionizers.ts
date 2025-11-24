// features/analyze/questionizers.ts
import type {
  AnalyzeResult,
  QuestionRecord,
  KnotRecord,
} from "./schemas";

/**
 * Keine Offline-Generierung von Fragen/Knoten mehr.
 * Wir nehmen ausschließlich das, was aus dem Modell kommt.
 */

export function deriveCriticalQuestions(
  result: AnalyzeResult
): QuestionRecord[] {
  return Array.isArray(result.questions) ? result.questions : [];
}

export function deriveKnots(result: AnalyzeResult): KnotRecord[] {
  return Array.isArray(result.knots) ? result.knots : [];
}
