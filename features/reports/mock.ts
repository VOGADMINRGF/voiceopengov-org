import type { RegionReportOverview, TopicReport } from "../reports/types";

const MOCK_TOPICS: TopicReport[] = [
  {
    id: "tier_agri",
    label: "Tierschutz ↔ Agrarwirtschaft",
    description:
      "Wie vereinbaren wir Tierwohl, Ernährungssicherheit und wirtschaftliche Tragfähigkeit der Landwirtschaft?",
    statements: 42,
    evidenceSlots: 118,
    openQuestions: 17,
    countries: ["DE", "NL", "DK", "ES"],
    lastUpdated: "2025-11-12",
    regionCode: "DE-BB",
    rank: 1,
  },
  {
    id: "prices_inflation",
    label: "Preise & Lebenshaltungskosten",
    description:
      "Preiserhöhungen, Energie, Mieten – welche Maßnahmen werden diskutiert und welche Evidenz gibt es?",
    statements: 73,
    evidenceSlots: 204,
    openQuestions: 31,
    countries: ["DE", "FR", "IT", "PL"],
    lastUpdated: "2025-11-10",
    regionCode: "DE-BB",
    rank: 2,
  },
  {
    id: "health_care",
    label: "Gesundheit & Pflege",
    description:
      "Wie sichern wir eine gute Versorgung in Stadt und Land – personell, finanziell und strukturell?",
    statements: 51,
    evidenceSlots: 139,
    openQuestions: 22,
    countries: ["DE", "AT", "CH"],
    lastUpdated: "2025-11-09",
    regionCode: "DE-BB",
    rank: 3,
  },
  {
    id: "climate_energy",
    label: "Klima & Energie",
    description:
      "Energiewende, Netzausbau, lokale Projekte – welche Konflikte und Chancen werden diskutiert?",
    statements: 88,
    evidenceSlots: 260,
    openQuestions: 45,
    countries: ["DE", "DK", "NL"],
    lastUpdated: "2025-11-08",
    regionCode: "DE-BB",
    rank: 4,
  },
];

export function getMockRegionOverview(region: string): RegionReportOverview {
  const topics = MOCK_TOPICS.filter((t) => t.regionCode === region).sort(
    (a, b) => a.rank - b.rank
  );

  return {
    region,
    topics,
    generatedAt: new Date().toISOString(),
  };
}
