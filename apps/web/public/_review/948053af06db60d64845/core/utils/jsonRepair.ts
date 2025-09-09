// core/utils/jsonRepair.ts

/**
 * Kombinierte, robuste JSON-Reparatur & -Parse Utilities
 * - Entfernt Markdown-Fences/Backticks
 * - Normalisiert Unicode-Quotes, BOM, Whitespace
 * - Extrahiert ersten Top-Level JSON-Block ({} oder [])
 * - Entfernt trailing commas
 * - Bietet sowohl "repair only" als auch "safe parse" API
 *
 * Behalte diese Datei als Single Source of Truth für Web, Mobile, Worker.
 */

/** Schritt 1: Rohtext "reparieren" (ohne zu parsen) */
export function jsonRepair(input: string): string {
  let s = input ?? "";
  if (typeof s !== "string") s = String(s);
  s = s.trim();

  if (!s) return s;

  // Entferne Code-Fences ```...``` (inkl. ```json)
  s = s.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

  // Unicode-Anführungszeichen → ASCII
  s = s.replace(/[“”„”]/g, '"').replace(/[‘’]/g, "'");

  // BOM raus
  s = s.replace(/^\uFEFF/, "");

  // Optional: häufige Präfixe entfernen (z. B. "Here is the JSON:")
  s = s.replace(/^\s*(?:here\s+is\s+the\s+json:?|result:?|output:?)\s*/i, "");

  // Trailing commas vor } oder ]
  s = s.replace(/,\s*([}\]])/g, "$1");

  // Heuristik: ersten zusammenhängenden JSON-Block extrahieren
  s = extractJsonBlock(s);

  return s.trim();
}

/** Schritt 2: Nur den JSON-Block heuristisch extrahieren (deine bestehende Funktion, leicht erweitert) */
export function extractJsonBlock(raw: string): string {
  const s = (raw ?? "")
    .replace(/\uFEFF/g, "") // BOM
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```$/m, "")
    .trim();

  // Finde erstes { oder [
  const brace = s.indexOf("{");
  const bracket = s.indexOf("[");
  const firstIdx = [brace, bracket].filter((x) => x >= 0).sort((a, b) => a - b)[0];

  // Finde letztes } oder ]
  const lastBrace = s.lastIndexOf("}");
  const lastBracket = s.lastIndexOf("]");
  const lastIdx = Math.max(lastBrace, lastBracket);

  if (firstIdx === undefined || firstIdx < 0 || lastIdx < 0 || lastIdx <= firstIdx) {
    // Kein sauberer Block erkannt → gib den String (vorher ohne fences/BOM) zurück
    return s;
  }

  let block = s.slice(firstIdx, lastIdx + 1);

  // Trailing commas vor } oder ]
  block = block.replace(/,\s*([}\]])/g, "$1");

  return block.trim();
}

/** Schritt 3: Sicher parsen – nutzt die Reparaturlogik */
export function safeJsonParse<T = unknown>(
  raw: string
): { ok: true; data: T } | { ok: false; error: Error; repaired?: string } {
  try {
    const repaired = jsonRepair(raw);
    const data = JSON.parse(repaired) as T;
    return { ok: true, data };
  } catch (e: any) {
    return {
      ok: false,
      error: e instanceof Error ? e : new Error(String(e)),
      repaired: (() => {
        try { return extractJsonBlock(raw); } catch { return undefined; }
      })(),
    };
  }
}

/** Convenience: strict parse (throws) */
export function parseJsonOrThrow<T = unknown>(raw: string): T {
  const res = safeJsonParse<T>(raw);
  if (!res.ok) {
    throw new Error(`Model output is not valid JSON. ${res.error?.message ?? ""}`);
  }
  return res.data;
}
