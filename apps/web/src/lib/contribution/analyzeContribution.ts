// apps/web/src/lib/contribution/analyzeAndTranslate.ts
import { analyzeContribution } from "@/lib/contribution/analyzeContribution";
import { extractStatementsFromText } from "@/lib/contribution/extractStatements";
import { translateAndCache } from "@/lib/contribution/translateAndCache";
import type { AnalyzedStatement, TopicScore } from "@/types/contribution";
import type { ContributionAnalysisRequest } from "@/types/contribution";

export type AnalyzeAndTranslateOutput = {
  region: string | null;
  topics: TopicScore[];
  statements: AnalyzedStatement[];
  suggestions: string[];
  translations?: Record<string, string[]>; // pro Sprache: Liste in der Reihenfolge von statements
  saved?: { id: string } | null;
};

function dedupeStatements(items: AnalyzedStatement[], cap = 10) {
  const seen = new Set<string>(); const out: AnalyzedStatement[] = [];
  for (const s of items) {
    const k = s.text.trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k); out.push(s);
    if (out.length >= cap) break;
  }
  return out;
}

/** end-to-end helper für routes, workers, tests */
export async function analyzeAndTranslate(
  body: ContributionAnalysisRequest & {
    translateTo?: string[];
    fromLang?: string | null;
    extractMax?: number;
    extractMinChars?: number;
    translateConcurrency?: number;
    skipNoop?: boolean;
  }
): Promise<AnalyzeAndTranslateOutput> {
  // 1) Analyse (GPT-Boost + Heuristik-Merge)
  const base = await analyzeContribution(body);

  // 2) zusätzliche Sätze aus Originaltext ziehen
  const extra = extractStatementsFromText(body.text, {
    max: body.extractMax ?? Number(process.env.EXTRACT_MAX_STATEMENTS ?? 8),
    minChars: body.extractMinChars ?? Number(process.env.EXTRACT_MIN_CHARS ?? 12),
  });

  // 3) zusammenführen & deckeln
  const statements = dedupeStatements([...(base.statements ?? []), ...extra], 10);

  // 4) Übersetzen (optional)
  let translations: Record<string, string[]> | undefined;
  const langs = body.translateTo && body.translateTo.length ? body.translateTo : [];
  if (langs.length) {
    translations = await translateAndCache(
      statements.map(s => s.text),
      langs,
      {
        from: body.fromLang ?? null,
        skipNoop: true,
        concurrency: body.translateConcurrency ?? Number(process.env.TRANSLATE_CONCURRENCY ?? 6),
      }
    );
  }

  return {
    region: base.region ?? null,
    topics: base.topics,
    statements,
    suggestions: base.suggestions,
    translations,
    saved: (base as any).saved ?? null,
  };
}
