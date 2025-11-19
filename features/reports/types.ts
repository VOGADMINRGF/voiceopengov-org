// apps/web/src/features/reports/types.ts

export type RegionCode = string; // z.B. "DE-BB", "DE-BE", ...

export type TopicReport = {
  id: string;
  label: string;
  description: string;
  statements: number;
  evidenceSlots: number;
  openQuestions: number;
  countries: string[];
  lastUpdated: string; // ISO-Date
  regionCode: RegionCode;
  rank: number; // 1 = meist diskutiert
};

export type RegionReportOverview = {
  region: RegionCode;
  topics: TopicReport[];
  generatedAt: string;
};
