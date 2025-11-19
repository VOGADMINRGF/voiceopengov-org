/**
 * Zentraler Zugriff auf GPT/ARI Provider.
 * Wir nutzen intern die Responses API über den OpenAI-Provider.
 */
import { callOpenAI } from "./providers/openai";

/**
 * Shape, wie `analyzeContribution` aktuell `callOpenAIJson` aufruft:
 *   callOpenAIJson({
 *     system: "...",
 *     user: "...",
 *     model: "gpt-4.1-mini",
 *     temperature: 0.25,
 *     max_tokens: 1800,
 *     response_format: { ...json_schema... }
 *   })
 */
export type JsonCallArgs = {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: any;
};

/**
 * Vereinheitlichter JSON-Call:
 *
 * - Variante A (alt): callOpenAIJson("prompt", maxTokens?)
 * - Variante B (E150): callOpenAIJson({ system, user, ... })
 *
 * In beiden Fällen:
 *  -> wir bauen einen Textprompt
 *  -> schicken ihn als JSON-Mode über die Responses API
 *  -> und geben { text } zurück.
 */
export async function callOpenAIJson(
  promptOrArgs: string | JsonCallArgs,
  maxOutputTokens?: number
): Promise<{ text: string }> {
  // --- Variante A: simpler String-Prompt ---
  if (typeof promptOrArgs === "string") {
    const prompt = promptOrArgs;
    const { text } = await callOpenAI({
      prompt,
      asJson: true,
      maxOutputTokens: maxOutputTokens ?? 1200,
    });
    return { text };
  }

  // --- Variante B: Objekt aus analyzeContribution.ts ---
  const { system, user, max_tokens } = promptOrArgs;

  // Wir ignorieren model/temperature/response_format vorerst – wichtig ist,
  // dass wir stabil JSON bekommen. Fein-Tuning kannst du später ergänzen.
  const parts: string[] = [];

  if (system && system.trim()) {
    parts.push(system.trim());
  }

  if (user && user.trim()) {
    parts.push(
      "",
      "==== Nutzerbeitrag / Aufgabe ====",
      user.trim()
    );
  }

  const combinedPrompt = parts.join("\n");

  const { text } = await callOpenAI({
    prompt: combinedPrompt,
    asJson: true,
    maxOutputTokens: max_tokens ?? maxOutputTokens ?? 1800,
  });

  return { text };
}

/* ------------------------------------------------------------------ */
/*  ARI / YOU.COM Platzhalter – wie im alten Code                      */
/* ------------------------------------------------------------------ */

export async function youcomResearch(_args: any) {
  throw new Error("ARI not configured (YOUCOM_ARI_API_KEY missing)");
}

export async function youcomSearch(_args: any) {
  throw new Error("ARI search not configured");
}

export function extractNewsFromSearch() {
  return [];
}
