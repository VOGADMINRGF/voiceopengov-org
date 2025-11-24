// apps/web/src/features/analyze/analyzeContribution.ts
import { AnalyzeResultSchema } from "./schemas";
import type { AnalyzeResult, StatementRecord } from "./schemas";
import { normalizeStatementRecord } from "./normalizeClaim";
import { callE150Orchestrator } from "@features/ai/orchestratorE150";
import type { AiPipelineName } from "@core/telemetry/aiUsageTypes";
export type { AnalyzeResult } from "./schemas";

export type AnalyzeInput = {
  text: string;
  locale?: string; // "de" | "en" | ...
  maxClaims?: number;
  pipeline?: AiPipelineName;
};

// User-Wunsch: MaxClaims wieder auf 20
const DEFAULT_MAX_CLAIMS = 20;

/* ---------- Prompt-Bausteine ---------- */

function buildSystemPrompt(locale: string = "de"): string {
  const isDe = locale.toLowerCase().startsWith("de");

  if (isDe) {
    return [
      "Du bist eine unparteiische redaktionelle KI für eDebatte / VoiceOpenGov.",
      "Du erfüllst einen demokratischen Bildungsauftrag:",
      "- Du hilfst Bürger:innen, komplexe Themen zu verstehen, abzuwägen und fundiert zu entscheiden.",
      "- Du gibst KEINE Empfehlung, wie man abstimmen soll.",
      "",
      "WICHTIG:",
      "- Du arbeitest streng textbasiert.",
      "- Du erfindest keine Fakten und keine Inhalte, die im Text nicht angelegt sind.",
      "- Wenn du unsicher bist, lässt du Felder leer statt zu raten.",
    ].join("\n");
  }

  return [
    "You are an impartial editorial AI for a digital public debate platform.",
    "Your role is educational:",
    "- Help citizens understand complex issues, weigh pros and cons, and decide in an informed way.",
    "- Do NOT recommend how to vote.",
    "",
    "IMPORTANT:",
    "- Work strictly text-based.",
    "- Do NOT invent facts or content that is not grounded in the input text.",
    "- If you are unsure, leave fields empty instead of guessing.",
  ].join("\n");
}

function buildUserPrompt(
  text: string,
  locale: string = "de",
  maxClaims: number = DEFAULT_MAX_CLAIMS
): string {
  const isDe = locale.toLowerCase().startsWith("de");

  if (isDe) {
    return [
      "AUFGABE:",
      `1) Zerlege den Beitrag in maximal ${maxClaims} atomare Aussagen (Claims). Jede Aussage:`,
      "   - ist ein einzelner, prüfbarer Satz;",
      "   - hat genau eine Kernforderung oder Behauptung;",
      "   - ist so formuliert, dass man später zustimmen oder ablehnen kann.",
      "   - ist nach Möglichkeit positiv und konstruktiv formuliert (z.B. „X sollte eingeführt werden“ statt „X wird abgelehnt“).",
      "   - vermeidet Dopplungen: eng verwandte Inhalte und Kontexte fasst du zu EINEM Claim zusammen.",
      "",
      "   Ziel: eher 3–8 gut unterscheidbare Kern-Claims statt sehr vieler ähnlicher Aussagen.",
      "",
      "2) Für jeden Claim bestimmst du zusätzlich (sofern möglich):",
      '   - title: ein sehr kurzer Oberbegriff (max. 6–8 Wörter), z.B. „Stufe 4 als Tierwohl-Standard“.',
      '   - responsibility: grobe Zuständigkeit, z.B. "EU", "Bund", "Land", "Kommune", "privat", "unbestimmt".',
      "   Wenn die Ebene unklar ist, nutze „unbestimmt“ oder lasse das Feld weg.",
      "",
      "3) Kontext-Notizen (mindestens 2, maximal 5):",
      "   - Erkenne thematische Abschnitte im Beitrag und fasse sie als `notes` zusammen.",
      "   - Jede Note: { id, kind, text } – kind ist ein kurzer Label wie „Faktenlage“, „Beispiel“, „Emotion“. Text ist ein prägnanter Absatz aus dem Beitrag bzw. eine saubere Paraphrase.",
      "",
      "4) Fragen zum Weiterdenken (2–4 Einträge):",
      "   - Zeige Lücken oder Prüf-Aufgaben auf (z.B. „Welche Kosten entstehen dadurch?“).",
      "   - Jede Frage: { id, text, dimension } – dimension benennt das Themenfeld („Finanzen“, „Recht“, „Betroffene“).",
      "",
      "5) Thematische Knoten / Schwerpunkte (mindestens 1):",
      "   - Zeige Spannungsfelder oder harte Zielkonflikte.",
      "   - Jeder Knoten: { id, label, description } – label kurz (z.B. „Tierwohl vs. Kosten“), description mit 1–2 Sätzen.",
      "",
      "   Wichtig: Erfinde keine Inhalte – nur was im Beitrag angelegt ist.",
      "",
      "6) Eventualitäten & Entscheidungsbäume (Part08, falls im Text Hinweise enthalten sind):",
      "   - Baue für jede relevante Aussage einen DecisionTree mit den drei Optionen pro/neutral/contra.",
      "   - DecisionTree: { rootStatementId, createdAt (ISO), options: { pro, neutral?, contra } }.",
      "   - Jede Option ist ein EventualityNode: { id, statementId, label, narrative, stance, consequences[], responsibilities[], children[] }.",
      "   - Konsequenzen spiegeln regionale Tragweiten (local_short, local_long, national, global, systemic) wider; Zuständigkeiten nutzen Part06/10-Level.",
      "   - Zusätzliche What-if-Hinweise, die nicht direkt in die drei Optionen passen, gehen in `eventualities` (freistehende EventualityNodes).",
      "   - Wenn es keine Hinweise auf Eventualitäten gibt, liefere leere Arrays für decisionTrees/eventualities.",
      "",
      "7) Gib das Ergebnis ausschließlich als JSON mit diesem Shape zurück (keine Markdown-Formatierung, keine ```-Blöcke):",
      "   {",
      '     "mode": "E150",',
      '     "sourceText": "...",',
      '     "language": "de",',
      '     "claims": [ { "id": "...", "title": "...", "text": "...", "responsibility": "Bund" } ],',
      '     "notes": [ { "id": "...", "kind": "Faktenlage", "text": "..." } ],',
      '     "questions": [ { "id": "...", "dimension": "Finanzen", "text": "..." } ],',
      '     "knots": [ { "id": "...", "label": "...", "description": "..." } ],',
      '     "decisionTrees": [ { "rootStatementId": "...", "createdAt": "ISO", "options": { "pro": { ...EventualityNode }, "neutral": { ... }, "contra": { ... } } } ],',
      '     "eventualities": [ { "id": "...", "statementId": "...", "label": "...", "narrative": "..." } ]',
      "   }",
      "",
      "8) Gib NUR den JSON-Text zurück – keine Erklärungen, keine Kommentare, keine Markdown-Formatierung.",
      "",
      "BEITRAG:",
      text,
    ].join("\n");
  }

  return [
    "TASK:",
    `1) Split the contribution into at most ${maxClaims} atomic statements (claims). Each claim:`,
    "   - is a single, verifiable sentence;",
    "   - contains exactly one actionable demand or assertion;",
    "   - can later receive a pro/neutral/contra vote;",
    "   - avoids duplicates by merging near-identical content.",
    "",
    "   Target 3–8 distinct core claims rather than dozens of small variations.",
    "",
    "2) For each claim also provide (when possible):",
    '   - title: concise label (≤8 words).',
    '   - responsibility: one of "EU", "Bund", "Land", "Kommune", "privat", "unbestimmt".',
    "",
    "3) Context notes (≥2, ≤5):",
    "   - { id, kind, text } with kind such as FACTS / EXAMPLE / MOTIVATION.",
    "",
    "4) Critical questions (2–4 items):",
    "   - highlight gaps or checks citizens should raise; payload { id, dimension, text }.",
    "",
    "5) Knots / topic hotspots (≥1):",
    "   - describe tensions/trade-offs in 1–2 sentences.",
    "   - stay strictly grounded in the provided text (never invent facts).",
    "",
    "6) Eventualities & Decision Trees (Part08, optional but preferred when hints exist):",
    "   - Build `decisionTrees` for each vote-relevant claim with options pro/neutral/contra.",
    "   - Each tree: { rootStatementId, createdAt (ISO string), options: { pro, neutral?, contra } }.",
    "   - Each option is an EventualityNode describing the narrative, consequences[], responsibilities[], and child branches.",
    "   - Additional what-if branches outside the triad go into `eventualities` (array of EventualityNodes).",
    "   - Use empty arrays when the source text contains no scenario information.",
    "",
    "7) Return ONLY raw JSON (no markdown fences) using:",
    "   {",
    '     "mode": "E150",',
    '     "sourceText": "...",',
    '     "language": "en" or "de",',
    '     "claims": [ { "id": "...", "title": "...", "text": "...", "responsibility": "Bund" } ],',
    '     "notes": [ { "id": "...", "kind": "FACTS", "text": "..." } ],',
    '     "questions": [ { "id": "...", "dimension": "Finance", "text": "..." } ],',
    '     "knots": [ { "id": "...", "label": "...", "description": "..." } ],',
    '     "decisionTrees": [ { "rootStatementId": "...", "createdAt": "ISO", "options": { "pro": { ... }, "neutral": { ... }, "contra": { ... } } } ],',
    '     "eventualities": [ { "id": "...", "statementId": "...", "label": "...", "narrative": "..." } ]',
    "   }",
    "",
    "CONTRIBUTION:",
    text,
  ].join("\n");
}

/* ---------- Hauptfunktion ---------- */

export type AnalyzeResultWithMeta = AnalyzeResult & {
  _meta?: {
    provider?: string;
    model?: string;
    durationMs?: number;
    tokensInput?: number;
    tokensOutput?: number;
    costEur?: number;
    pipeline?: AiPipelineName;
    contributionId?: string;
    eventualitiesReviewed?: boolean;
    eventualitiesReviewedAt?: string | null;
  };
};

export async function analyzeContribution(
  input: AnalyzeInput
): Promise<AnalyzeResultWithMeta> {
  const sourceText = input.text?.trim() ?? "";
  if (!sourceText) {
    throw new Error("analyzeContribution: input.text ist leer");
  }

  const language = (input.locale || "de").toLowerCase();
  const maxClaims =
    typeof input.maxClaims === "number" && input.maxClaims > 0
      ? Math.min(input.maxClaims, DEFAULT_MAX_CLAIMS)
      : DEFAULT_MAX_CLAIMS;

  const orchestration = await callE150Orchestrator({
    systemPrompt: buildSystemPrompt(language),
    userPrompt: buildUserPrompt(sourceText, language, maxClaims),
    locale: language,
    maxClaims,
    maxTokens: 1800,
    telemetry: {
      pipeline: input.pipeline ?? "contribution_analyze",
    },
  });

  const rawText = orchestration.rawText;

  let raw: any;
  try {
    let cleaned = rawText.trim();

    if (cleaned.startsWith("```")) {
      const firstNewline = cleaned.indexOf("\n");
      if (firstNewline !== -1) {
        cleaned = cleaned.slice(firstNewline + 1);
      }
      const lastFence = cleaned.lastIndexOf("```");
      if (lastFence !== -1) {
        cleaned = cleaned.slice(0, lastFence);
      }
      cleaned = cleaned.trim();
    }

    raw = JSON.parse(cleaned);
  } catch (err) {
    console.error("[analyzeContribution] JSON-Parse-Fehler:", err, rawText);
    throw new Error(
      "AnalyzeContribution: KI-Antwort war kein gültiges JSON. Bitte später erneut versuchen."
    );
  }

  const rawClaims = Array.isArray(raw?.claims)
    ? raw.claims.slice(0, maxClaims)
    : [];
  const rawNotes = Array.isArray(raw?.notes) ? raw.notes : [];
  const rawQuestions = Array.isArray(raw?.questions) ? raw.questions : [];
  const rawKnots = Array.isArray(raw?.knots) ? raw.knots : [];
  const rawEventualities = Array.isArray(raw?.eventualities) ? raw.eventualities : [];
  const rawDecisionTrees = Array.isArray(raw?.decisionTrees) ? raw.decisionTrees : [];
  const rawConsequenceBundle = raw?.consequences;
  const rawResponsibilityPaths = Array.isArray(raw?.responsibilityPaths)
    ? raw.responsibilityPaths
    : [];

  const normalizedRawClaims: StatementRecord[] = rawClaims
    .map((c: any, idx: number) =>
      normalizeStatementRecord(c, { fallbackId: `claim-${idx + 1}` })
    )
    .filter(
      (c: StatementRecord | null): c is StatementRecord => c !== null
    );

  const parsed = AnalyzeResultSchema.safeParse({
    mode: "E150",
    sourceText,
    language,
    claims: normalizedRawClaims,
    notes: rawNotes,
    questions: rawQuestions,
    knots: rawKnots,
    consequences: rawConsequenceBundle,
    responsibilityPaths: rawResponsibilityPaths,
    eventualities: rawEventualities,
    decisionTrees: rawDecisionTrees,
  } as any);

  if (!parsed.success) {
    console.error(
      "[analyzeContribution] Zod-Validierung fehlgeschlagen:",
      parsed.error?.message
    );
    throw new Error(
      "AnalyzeContribution: KI-Antwort entsprach nicht dem erwarteten Schema."
    );
  }

  const base: AnalyzeResult = {
    ...parsed.data,
    consequences: ensureConsequenceBundle(parsed.data.consequences),
    responsibilityPaths: Array.isArray(parsed.data.responsibilityPaths)
      ? parsed.data.responsibilityPaths
      : [],
    eventualities: parsed.data.eventualities ?? [],
    decisionTrees: parsed.data.decisionTrees ?? [],
  };

  const meta = {
    provider: orchestration.best?.provider,
    model: orchestration.best?.modelName,
    durationMs: orchestration.best?.durationMs,
    tokensInput: orchestration.best?.tokensIn ?? 0,
    tokensOutput: orchestration.best?.tokensOut ?? 0,
    costEur: orchestration.best?.costEur ?? 0,
    pipeline: input.pipeline ?? "contribution_analyze",
  };

  return {
    ...base,
    claims: base.claims ?? [],
    notes: base.notes ?? [],
    questions: base.questions ?? [],
    knots: base.knots ?? [],
    eventualities: base.eventualities ?? [],
    decisionTrees: base.decisionTrees ?? [],
    _meta: meta,
  };
}

function ensureConsequenceBundle(
  bundle: AnalyzeResult["consequences"] | undefined,
): AnalyzeResult["consequences"] {
  if (!bundle) {
    return { consequences: [], responsibilities: [] };
  }
  return {
    consequences: Array.isArray(bundle.consequences) ? bundle.consequences : [],
    responsibilities: Array.isArray(bundle.responsibilities) ? bundle.responsibilities : [],
  };
}
