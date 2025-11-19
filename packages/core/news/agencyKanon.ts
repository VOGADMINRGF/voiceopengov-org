// packages/core/news/agencyKanon.ts

export type NewsAgencyId =
  | "dpa"
  | "reuters"
  | "afp"
  | "ap"
  | "xinhua"
  | "tass"
  | "efe"
  | "kyodo"
  | "yonhap"
  | "pti"
  | "ansa";

export type NewsAgencyTier = 0 | 1 | 2;

export interface NewsAgencyMeta {
  id: NewsAgencyId;
  name: string;
  shortName: string;
  country: string;
  tier: NewsAgencyTier;
  kind: "wire" | "cooperative" | "state" | "private";
  primaryLanguage: string;
  languages: string[];
  delivery: ("rss" | "api" | "website-headlines")[];
  licenseRequired: boolean;
  isStateOwned: boolean;
}

/**
 * Kanon der Agenturen, die wir für "News → Statement → Vote" berücksichtigen.
 * tier 0: primäre globale Drähte
 * tier 1: starke nationale / regionale Drähte
 */
export const NEWS_AGENCIES: NewsAgencyMeta[] = [
  {
    id: "dpa",
    name: "Deutsche Presse-Agentur",
    shortName: "dpa",
    country: "DE",
    tier: 0,
    kind: "wire",
    primaryLanguage: "de",
    languages: ["de"],
    delivery: ["api"],
    licenseRequired: true,
    isStateOwned: false,
  },
  {
    id: "reuters",
    name: "Reuters",
    shortName: "Reuters",
    country: "GB",
    tier: 0,
    kind: "wire",
    primaryLanguage: "en",
    languages: ["en"],
    delivery: ["api"],
    licenseRequired: true,
    isStateOwned: false,
  },
  {
    id: "afp",
    name: "Agence France-Presse",
    shortName: "AFP",
    country: "FR",
    tier: 0,
    kind: "wire",
    primaryLanguage: "fr",
    languages: ["fr", "en", "es", "de"],
    delivery: ["api"],
    licenseRequired: true,
    isStateOwned: false,
  },
  {
    id: "ap",
    name: "Associated Press",
    shortName: "AP",
    country: "US",
    tier: 0,
    kind: "cooperative",
    primaryLanguage: "en",
    languages: ["en"],
    delivery: ["api"],
    licenseRequired: true,
    isStateOwned: false,
  },
  {
    id: "xinhua",
    name: "Xinhua News Agency",
    shortName: "Xinhua",
    country: "CN",
    tier: 1,
    kind: "state",
    primaryLanguage: "zh",
    languages: ["zh", "en"],
    delivery: ["rss", "website-headlines"],
    licenseRequired: false,
    isStateOwned: true,
  },
  {
    id: "tass",
    name: "TASS Russian News Agency",
    shortName: "TASS",
    country: "RU",
    tier: 1,
    kind: "state",
    primaryLanguage: "ru",
    languages: ["ru", "en"],
    delivery: ["rss", "website-headlines"],
    licenseRequired: false,
    isStateOwned: true,
  },
  {
    id: "efe",
    name: "Agencia EFE",
    shortName: "EFE",
    country: "ES",
    tier: 1,
    kind: "wire",
    primaryLanguage: "es",
    languages: ["es", "en", "pt"],
    delivery: ["rss"],
    licenseRequired: false, // Volltexte ggf. lizenziert, hier nur Headlines
    isStateOwned: false,
  },
  {
    id: "kyodo",
    name: "Kyodo News",
    shortName: "Kyodo",
    country: "JP",
    tier: 1,
    kind: "cooperative",
    primaryLanguage: "ja",
    languages: ["ja", "en"],
    delivery: ["rss", "website-headlines"],
    licenseRequired: false,
    isStateOwned: false,
  },
  {
    id: "yonhap",
    name: "Yonhap News Agency",
    shortName: "Yonhap",
    country: "KR",
    tier: 1,
    kind: "wire",
    primaryLanguage: "ko",
    languages: ["ko", "en"],
    delivery: ["website-headlines"],
    licenseRequired: false,
    isStateOwned: false,
  },
  {
    id: "pti",
    name: "Press Trust of India",
    shortName: "PTI",
    country: "IN",
    tier: 1,
    kind: "cooperative",
    primaryLanguage: "en",
    languages: ["en"],
    delivery: ["api", "website-headlines"],
    licenseRequired: true,
    isStateOwned: false,
  },
  {
    id: "ansa",
    name: "Agenzia Nazionale Stampa Associata",
    shortName: "ANSA",
    country: "IT",
    tier: 1,
    kind: "cooperative",
    primaryLanguage: "it",
    languages: ["it", "en"],
    delivery: ["rss"],
    licenseRequired: false,
    isStateOwned: false,
  },
];

export const NEWS_AGENCY_IDS = NEWS_AGENCIES.map(a => a.id);

export function getNewsAgency(id: NewsAgencyId): NewsAgencyMeta | undefined {
  return NEWS_AGENCIES.find(a => a.id === id);
}
