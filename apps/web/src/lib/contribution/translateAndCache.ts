// apps/web/src/lib/contribution/translateAndCache.ts
import { translationCache } from "@/utils/translationCache";
import { translateWithGPT } from "@/utils/gptTranslator";

type Options = {
  concurrency?: number;   // gleichzeitige Übersetzungen
  from?: string | null;   // Quellsprache (optional)
  skipNoop?: boolean;     // wenn from === target → original übernehmen
};

const DEFAULT_CONCURRENCY = Number(process.env.TRANSLATE_CONCURRENCY ?? 6);

function normLang(tag: string) {
  return tag.toLowerCase().replace(/_/g, "-").trim();
}

/** Einfache Promise-Pool Implementierung */
async function runPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, idx: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function spawn() {
    while (true) {
      const i = next++;
      if (i >= items.length) break;
      results[i] = await worker(items[i], i);
    }
  }

  const runners = Array.from({ length: Math.min(limit, items.length) }, spawn);
  await Promise.all(runners);
  return results;
}

/**
 * Übersetzt Texte in mehrere Zielsprachen mit Cache & Concurrency.
 * Gibt pro Sprache ein Array in Original-Textreihenfolge zurück.
 */
export async function translateAndCache(
  texts: string[],
  languages: string[],
  opts: Options = {}
): Promise<Record<string, string[]>> {
  const concurrency = opts.concurrency ?? DEFAULT_CONCURRENCY;
  const from = opts.from ? normLang(opts.from) : null;
  const langs = Array.from(new Set(languages.map(normLang)));

  // Original-Reihenfolge beibehalten
  const original = texts.slice();
  const uniqTexts = Array.from(new Set(original));

  const out: Record<string, string[]> = {};

  for (const lang of langs) {
    // No-op Shortcut falls Quell=Ziel
    if (opts.skipNoop && from && from === lang) {
      out[lang] = original.slice(); // unverändert
      continue;
    }

    // 1) Cache-Hits für Unique-Texte sammeln
    const cacheMap = new Map<string, string>();
    await Promise.all(
      uniqTexts.map(async (t) => {
        const c = await translationCache.get(t, lang);
        if (c) cacheMap.set(t, c);
      })
    );

    // 2) Misses parallel übersetzen (mit Concurrency)
    const misses = uniqTexts.filter((t) => !cacheMap.has(t));
    if (misses.length > 0) {
      const translated = await runPool(misses, concurrency, async (t) => {
        const res = await translateWithGPT(t, lang);
        await translationCache.set(t, lang, res);
        return res;
      });
      misses.forEach((t, i) => cacheMap.set(t, translated[i]));
    }

    // 3) In Original-Reihenfolge projizieren
    out[lang] = original.map((t) => cacheMap.get(t) ?? t);
  }

  return out;
}

export default translateAndCache;
