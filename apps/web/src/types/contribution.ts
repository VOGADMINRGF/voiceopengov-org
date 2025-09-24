// apps/web/src/types/contribution.ts
export type Polarity = "niedrig" | "mittel" | "hoch";
export type StatementType = "ja/nein" | "skala" | "frei";

export interface TopicScore {
  name: string;
  confidence: number; // 0..1
}

export interface UserProfileHint {
  region?: string;      // z.B. "Sachsen-Anhalt" oder Code
  interests?: string[]; // z.B. ["Umwelt", "Teilhabe"]
  roles?: string[];     // z.B. ["Bürgerin"]
}

export interface ContributionAnalysisRequest {
  text: string;
  userProfile?: UserProfileHint;
  region?: string;            // optional explizit
  userId?: string | null;     // optional, falls aus Session nicht gelesen wird
  translateTo?: string[];     // z.B. ["de","en"]
}

export interface AnalyzedStatement {
  text: string;
  type: StatementType;
  polarity: Polarity;
}

export interface ContributionAnalysisResponse {
  region: string | null;            // z.B. "Sachsen-Anhalt" oder Code
  topics: TopicScore[];
  statements: AnalyzedStatement[];
  suggestions: string[];
  isNewContext: boolean;
  saved?: { id: string } | null;    // falls gespeichert
}
