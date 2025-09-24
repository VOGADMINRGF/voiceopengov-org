// apps/web/src/lib/contribution/extractStatements.ts
import type { AnalyzedStatement } from "@/types/contribution";

const DEFAULT_MAX = Number(process.env.EXTRACT_MAX_STATEMENTS ?? 8);
const MIN_CHARS = Number(process.env.EXTRACT_MIN_CHARS ?? 12);

// Cues (quick & dirty, DE-zentriert; erweiterbar)
const BINARY_CUES = [
  "soll", "sollen", "sollte", "muss", "müssen",
  "verbot", "verbieten", "verboten",
  "erlaubt", "erlauben", "genehmigen", "pflicht"
];
const POL_HIGH = ["dringend", "sofort", "katastrophe", "akut", "krise", "unbedingt", "nicht hinnehmbar"];
const POL_MID  = ["sollte", "könnte", "wünschenswert", "empfehlenswert", "relevant", "bedeutsam"];

function normalize(s: string) {
  return s.replace(/\s+/g, " ").replace(/\s([,;:.!?])/g, "$1").trim();
}

function splitSentences(text: string): string[] {
  const t = (text || "").replace(/[\r\n]+/g, "\n");

  // Bullet/Zeilen-Trennung grob
  const lines = t
    .split(/\n+/)
    .map(x => x.replace(/^[\-\*\u2022]\s+/, "").trim())
    .filter(Boolean);

  const raw = lines.join(" ");

  // Prefer Intl.Segmenter wenn verfügbar
  // @ts-ignore Node 18+/20+ hat das
  const Seg = (typeof Intl !== "undefined" && (Intl as any).Segmenter) ? (Intl as any).Segmenter : null;
  if (Seg) {
    const seg = new Seg("de", { granularity: "sentence" });
    const out: string[] = [];
    // @ts-ignore
    for (const { segment } of seg.segment(raw)) out.push(segment);
    return out.map(normalize).filter(Boolean);
  }

  // Fallback: Regex-Segmentierung
  return raw
    .split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ])/)
    .map(normalize)
    .filter(Boolean);
}

function isBinaryType(s: string) {
  const lc = s.toLowerCase();
  return BINARY_CUES.some(c => lc.includes(c));
}

function pickPolarity(s: string): "hoch" | "mittel" | "niedrig" {
  const lc = s.toLowerCase();
  if (POL_HIGH.some(c => lc.includes(c))) return "hoch";
  if (POL_MID.some(c => lc.includes(c))) return "mittel";
  return "niedrig";
}

export function extractStatementsFromText(
  text: string,
  opts?: { max?: number; minChars?: number }
): AnalyzedStatement[] {
  const max = opts?.max ?? DEFAULT_MAX;
  const min = opts?.minChars ?? MIN_CHARS;

  const sentences = splitSentences(text);

  // Normalisieren, kürzen, deduplizieren
  const seen = new Set<string>();
  const candidates = sentences
    .map(normalize)
    .filter(s => s.length >= min)
    .filter(s => {
      const key = s.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, max);

  return candidates.map((s) => ({
    text: s,
    type: isBinaryType(s) ? "ja/nein" : "frei",
    polarity: pickPolarity(s),
  }));
}

export default extractStatementsFromText;
