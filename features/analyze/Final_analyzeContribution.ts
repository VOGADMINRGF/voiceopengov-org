// features/analyze/analyzeContribution.ts

import type { AnalyzeResult, AnalyzeResultCore } from "./schemas";
import { AnalyzeResultSchema, ANALYZE_JSON_SCHEMA } from "./schemas";
import { needsClarify, clarifyForPrices } from "./clarify";

type AnalyzeInput = {
  text: string;
  locale?: string;   // "de" | "en" | ...
  maxClaims?: number;
};

/* ---------- Prompt ---------- */

function buildPrompt(text: string, locale: string = "de"): string {
  return [
    "Du bist eine unparteiische redaktionelle KI für eDebatte / VoiceOpenGov.",
    "Du erfüllst einen demokratischen Bildungsauftrag:",
    "- Du sollst Bürger:innen helfen, komplexe Themen zu verstehen, abzuwägen und fundiert zu entscheiden.",
    "- Du gibst keine Empfehlung, wie man abstimmen soll.",
    "",
    "AUFGABE:",
    "1) Zerlege den Beitrag in atomare Statements (Claims). Jedes Statement:",
    "   - ist ein einzelner, prüfbarer Satz;",
    "   - hat genau eine Kernforderung oder Behauptung;",
    "   - hat eine eindeutige Zuständigkeit (EU/Bund/Land/Kommune/Global).",
    "",
    "2) Für jedes Statement befüllst du den Block 'core':",
    "   - text (atomarer Satz, Sprache: " + locale + "),",
    "   - topicKanonId (grobes Politikfeld, z.B. TIERSCHUTZ_LANDWIRTSCHAFT),",
    "   - responsibility und responsibilityDetail (z.B. Bundestag, Stadtrat),",
    "   - grobe Zeitangabe (timeframe) falls im Text vorhanden,",
    "   - grobe Ortsangabe (location),",
    "   - betroffene Gruppen (affectedGroups),",
    "   - wichtige Messgrößen (metrics),",
    "   - ggf. uncertaintyNotes.",
    "",
    "3) Kontextkarten (notes):",
    "   - max. 2–3 Sätze pro Karte;",
    "   - jede Karte fasst einen Abschnitt des Beitrags zusammen;",
    "   - KEINE Bewertung, nur Einordnung.",
    "",
    "4) Fragen (questions):",
    "   - formuliere 5–12 DETAILFRAGEN pro Beitrag;",
    "   - sie müssen direkt aus dem Inhalt entstehen (z.B. Übergangsfristen, Kennzahlen, betroffene Gruppen);",
    "   - nutze kind = 'detail' für solche inhaltlichen Fragen;",
    "   - nutze kind = 'clarify', wenn im Text wichtige Infos fehlen (Zeitraum, Region, Zuständigkeit etc.);",
    "   - nutze kind = 'meta' für Fragen zur Abwägung (z.B. Zielkonflikte).",
    "   - WICHTIG: Wenn eine Frage inhaltlich einem eigenen Themenknoten entspricht (z.B. 'Tierschutz vs. Agrarwirtschaft'),",
    "     dann wird daraus ein Knoten (siehe nächster Punkt) und die Frage selbst wird NICHT zusätzlich gelistet.",
    "",
    "5) Knoten (knots):",
    "   - Knoten sind wiederkehrende Themen-Hubs, z.B.:",
    "     * 'Tierschutz ↔ Agrarwirtschaft'",
    "     * 'Nutztier ↔ Haustier'",
    "     * 'Importe ↔ Wettbewerbsfähigkeit'",
    "     * 'Pflegepersonal & Betreuungsschlüssel'",
    "   - Jeder Knoten hat eine kurze Beschreibung, warum er wichtig ist;",
    "   - ordne eine passende category zu (z.B. 'TierschutzAgrar');",
    "   - importance zwischen 0 und 1 (0.8 = sehr wichtig für diesen Beitrag).",
    "",
    "6) Evidenz-Slots (evidence):",
    "   - Du erfindest KEINE Fakten.",
    "   - Du schlägst Suchaufträge vor (searchQuery), die helfen würden, das Statement zu belegen;",
    "   - Du markierst sie als status = 'hypothesis';",
    "   - expectedMetric / expectedYear sind nur Vermutungen, niemals als sicher darstellen.",
    "",
    "7) Perspektiven (perspectives):",
    "   - Pro Statement mind. 3 Items:",
    "     * stance = 'pro' (warum man zustimmen könnte),",
    "     * stance = 'contra' (warum man ablehnen könnte),",
    "     * stance = 'alternative' (konstruktiver Vorschlag / Kompromiss);",
    "   - sachlich, keine persönlichen Angriffe, keine Hetze.",
    "",
    "8) Qualität & Fairness (quality):",
    "   - Schätze precision, checkability, readability, balance, evidenceStrength auf einer Skala 0–1;",
    "   - fairness: wie fair ist das Statement gegenüber betroffenen Gruppen? (0 = problematisch, 1 = sehr fair);",
    "   - fairnessComment / comments kurz ausfüllen.",
    "",
    "9) Lernziele / Lifecycle:",
    "   - learningGoal: wähle 'verstehen', 'abwägen', 'entscheiden' oder 'evaluieren', je nach primärer Funktion;",
    "   - policyStage: grobe reale Phase (agenda/draft/decision/implementation/evaluation), falls aus Text erkennbar.",
    "",
    "10) FORMAT:",
    "   - Antworte ausschließlich mit einem JSON-Objekt, das dem Schema 'AnalyzeResult' entspricht;",
    "   - keine zusätzlichen Felder, keine Kommentare, keine Erklärtexte.",
    "",
    "Sprache des Beitrags: " + locale + ".",
    "Gib alle Texte in derselben Sprache aus.",
    "",
    "Beitrag:",
    text,
  ].join("\n");
}

/* ---------- OpenAI Responses-Call (autark, ohne callOpenAIJson) ---------- */

async function callOpenAiE150(prompt: string): Promise<unknown> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set");
  }

  const model =
    process.env.OPENAI_RESPONSES_MODEL ||
    "gpt-4.1-mini"; // bei Bedarf anpassen

  const body = {
    model,
    input: prompt,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "AnalyzeResult",
        schema: ANALYZE_JSON_SCHEMA,
        strict: true,
      },
    },
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data: any = await res.json();

  if (!res.ok) {
    const msg = data?.error?.message || JSON.stringify(data);
    throw new Error(`OpenAI error ${res.status}: ${msg}`);
  }

  // Responses-API: data.output[0].content[0].text
  const firstOutput = data.output?.[0]?.content?.[0];
  if (!firstOutput || firstOutput.type !== "output_text") {
    throw new Error("Unexpected Responses output shape");
  }

  const text = String(firstOutput.text || "{}");
  return JSON.parse(text);
}

/* ---------- Hauptfunktion ---------- */

export async function analyzeContribution(
  input: AnalyzeInput
): Promise<AnalyzeResult> {
  const { text, locale = "de" } = input;
  if (!text || !text.trim()) {
    throw new Error("Empty text");
  }

  const prompt = buildPrompt(text, locale);

  const raw = await callOpenAiE150(prompt);

  const core: AnalyzeResultCore = AnalyzeResultSchema.parse(raw);

  const cta = buildClarifyCta(core);

  return { ...core, cta };
}

/* ---------- Clarify-CTA (auf Basis deiner alten Logik) ---------- */

function buildClarifyCta(core: AnalyzeResultCore): any | null {
  try {
    if (!core.claims?.length) return null;

    const first = core.claims[0]; // StatementRecord
    const text = first.core?.text ?? "";
    const categoryMain = first.core?.topicKanonId ?? null;
    const region =
      first.core?.location?.region ?? first.core?.location?.country ?? null;

    if (
      typeof needsClarify !== "function" ||
      typeof clarifyForPrices !== "function"
    ) {
      return null;
    }

    const shouldClarify = needsClarify({
      text,
      categoryMain,
      region,
    });

    if (!shouldClarify) return null;

    const preset = clarifyForPrices() || {};
    return { type: "clarify", ...preset };
  } catch (e) {
    console.warn("buildClarifyCta failed", e);
    return null;
  }
}
