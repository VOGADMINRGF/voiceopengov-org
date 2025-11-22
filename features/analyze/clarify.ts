// features/analyze/clarify.ts
import type { AnalyzeResult } from "./schemas";

export type ClarifyOption = { key: string; label: string };

export type ClarifyCTA = {
  type: "clarify";
  ask: string[];                // Fragen / Hinführung
  options: ClarifyOption[];     // Click-Optionen
  quickSources?: string[];      // optionale Schnell-Quellen
};

/** einfache Erkennung: „generische Preis-Aussage“ */
function isGenericPriceStatement(text: string): boolean {
  const t = text.toLowerCase();
  if (!/preis|preise|preiserh[oö]hung|teurer|teuerung/.test(t)) return false;
  // Wenn schon konkrete Subtypen vorkommen, keine Clarify-CTA
  if (/(miete|nebenco?sten|kaltmiete|warmmiete)/.test(t)) return false;
  if (/(strom|gas|energie|heiz|kraftstoff|benzin|diesel)/.test(t)) return false;
  if (/(lebensmittel|essen|nahrungsmittel)/.test(t)) return false;
  if (/(fahrkarte|ticket|öpnv|bahn|bus|tarif|handyvertrag|mobilfunk|telekom)/.test(t)) return false;
  return true;
}

/**
 * Baut – falls sinnvoll – eine Clarify-CTA
 * (z.B. „Welche Preisart meinst du genau?“).
 */
export function buildClarifyCTA(result: AnalyzeResult): ClarifyCTA | null {
  const firstClaim = result.claims?.[0];
  if (!firstClaim) return null;

  const text = firstClaim.text ?? "";
  if (!text.trim()) return null;

  if (!isGenericPriceStatement(text)) {
    return null;
  }

  const ask: string[] = [
    "Du hast allgemein über steigende Preise gesprochen.",
    "Damit wir es politisch sauber zuordnen können: Welche Preisart meinst du vor allem?",
  ];

  const options: ClarifyOption[] = [
    { key: "food",     label: "Lebensmittelpreise" },
    { key: "energy",   label: "Energiepreise (Strom/Gas/Fernwärme)" },
    { key: "fuel",     label: "Kraftstoffpreise" },
    { key: "rent",     label: "Mieten / Nebenkosten" },
    { key: "tariffs",  label: "ÖPNV / Telekom-Tarife" },
  ];

  const quickSources = [
    "destatis.de",
    "bundeskartellamt.de",
    "bnetza.de",
  ];

  return {
    type: "clarify",
    ask,
    options,
    quickSources,
  };
}
