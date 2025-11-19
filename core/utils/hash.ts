// core/utils/hash.ts
// Kleiner Helfer für stabile IDs (SHA-256 über einen String/JSON).

import crypto from "node:crypto";

/**
 * Erzeugt einen stabilen Hash für beliebige Werte.
 * Für unsere Zwecke reicht: gleiche Eingabe → gleicher Hex-String.
 */
export function stableHash(value: unknown): string {
  const payload =
    typeof value === "string" ? value : JSON.stringify(value);
  return crypto.createHash("sha256").update(payload).digest("hex");
}
