// core/logic/news/topics.ts
//
// Einfaches, rein lokales Topic-Clustering für News-Artikel.
// Ziel: mehrere Artikel zum gleichen Thema bündeln,
// so dass du pro Thema 1 GPT-Call brauchst (statt pro Artikel).

import { stableHash } from "../../utils/hash";
import type { NewsAgencyId } from "./agencyKanon";

export type ParsedArticle = {
  id: string;
  feedUrl: string;
  sourceHost: string;
  title: string;
  url: string;
  publishedAt?: string;
  summary?: string;
  agencyId?: NewsAgencyId;
};

export type TopicCluster = {
  id: string;
  labelGuess: string;
  keywords: string[];
  articles: ParsedArticle[];
};

/** Grobe, mehrsprachige Stopwortliste (de + en, bisschen gemischt) */
const STOPWORDS = new Set<string>([
  // deutsch
  "der", "die", "das", "den", "dem", "des",
  "ein", "eine", "einer", "einem", "eines",
  "und", "oder", "aber", "wenn", "dass",
  "auf", "mit", "von", "im", "in", "am",
  "zu", "zum", "zur", "für", "nach", "über",
  "unter", "an", "bei", "aus", "vor", "hinter",
  "sich", "sind", "war", "wird", "werden",
  "nicht", "kein", "keine", "mehr", "auch",
  "noch", "schon", "wie", "so",
  // englisch
  "the", "a", "an", "and", "or", "but",
  "of", "to", "in", "on", "at", "for", "from",
  "by", "about", "into", "over", "under",
  "is", "are", "was", "were", "be", "been",
  "this", "that", "these", "those",
  "it", "its", "as", "with", "without",
  "more", "most", "no", "not", "than",
  "will", "would", "can", "could",
  "new", "news", "update", "latest", "live"
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/&amp;/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function extractKeywords(text: string, maxKeywords = 6): string[] {
  const norm = normalizeText(text);
  if (!norm) return [];

  const counts = new Map<string, number>();

  for (const raw of norm.split(/\s+/)) {
    const token = raw.trim();
    if (token.length < 4) continue;
    if (STOPWORDS.has(token)) continue;

    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => token);

  return sorted.slice(0, maxKeywords);
}

/**
 * Baut einfache Topic-Cluster aus einer Liste von Artikeln.
 *
 * Heuristik:
 * - Keywords ~ aus Titel + Summary
 * - Primär-Keyword = erstes Keyword
 * - Alle Artikel mit gleichem Primär-Keyword landen in einem Cluster
 * - Nur Cluster mit >= 2 Artikeln werden zurückgegeben
 */
export function buildTopicClusters(
  articles: ParsedArticle[],
  minArticlesPerCluster: number = 2
): TopicCluster[] {
  const clusterMap = new Map<string, ParsedArticle[]>();
  const keywordsMap = new Map<string, string[]>();

  for (const a of articles) {
    const base = `${a.title} ${a.summary ?? ""}`;
    const kws = extractKeywords(base);
    if (!kws.length) continue;

    const primary = kws[0]; // simple Heuristik
    if (!primary) continue;

    if (!clusterMap.has(primary)) {
      clusterMap.set(primary, []);
      keywordsMap.set(primary, kws);
    }
    clusterMap.get(primary)!.push(a);
  }

  const clusters: TopicCluster[] = [];

  for (const [primary, arts] of clusterMap.entries()) {
    if (arts.length < minArticlesPerCluster) continue;

    const kws = keywordsMap.get(primary) ?? [primary];

    // Label = ein paar wichtigste Keywords zusammengesetzt
    const label = kws.slice(0, 3).join(" / ");

    const clusterId = stableHash({
      primary,
      titles: arts.map(a => a.title).sort()
    });

    clusters.push({
      id: clusterId,
      labelGuess: label,
      keywords: kws,
      articles: arts
    });
  }

  return clusters;
}
