export const DOSSIER_LIMITS = {
  title: 240,
  publisher: 160,
  snippet: 320,
  quote: 280,
  locator: 160,
  rationale: 180,
  note: 360,
} as const;

export function clampText(value: unknown, maxLen: number) {
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned) return undefined;
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned;
}

export const clampTitle = (value: unknown) => clampText(value, DOSSIER_LIMITS.title);
export const clampPublisher = (value: unknown) => clampText(value, DOSSIER_LIMITS.publisher);
export const clampSnippet = (value: unknown) => clampText(value, DOSSIER_LIMITS.snippet);
export const clampQuote = (value: unknown) => clampText(value, DOSSIER_LIMITS.quote);
export const clampLocator = (value: unknown) => clampText(value, DOSSIER_LIMITS.locator);
export const clampRationaleItem = (value: unknown) => clampText(value, DOSSIER_LIMITS.rationale);
export const clampNote = (value: unknown) => clampText(value, DOSSIER_LIMITS.note);
