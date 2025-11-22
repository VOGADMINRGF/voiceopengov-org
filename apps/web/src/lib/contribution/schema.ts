// features/analyze/schemas.ts
import { z } from "zod";

export const TopicScoreZ = z.object({
  name: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

export const UserProfileHintZ = z.object({
  region: z.string().min(1).optional(),
  interests: z.array(z.string()).optional(),
  roles: z.array(z.string()).optional(),
});

export const AnalyzeBodyZ = z.object({
  text: z.string().min(1),
  userProfile: UserProfileHintZ.optional(),
  region: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  translateTo: z.array(z.string().min(2)).optional(),
});

export const LLMStatementZ = z.object({
  text: z.string().min(1),
  type: z.enum(["ja/nein", "skala", "frei"]),
  polarity: z.enum(["niedrig", "mittel", "hoch"]),
});

export const LLMAnalysisZ = z.object({
  region: z.string().nullable().optional(),
  topics: z.array(TopicScoreZ).default([]),
  statements: z.array(LLMStatementZ).default([]),
  suggestions: z.array(z.string()).default([]),
  isNewContext: z.boolean().default(true),
});

export type AnalyzeBody = z.infer<typeof AnalyzeBodyZ>;
export type LLMAnalysis = z.infer<typeof LLMAnalysisZ>;

/**
 * Lockere Schemas – sie akzeptieren auch Strings und teil-strukturierte Objekte.
 * Die eigentliche Normalisierung passiert in analyzeContribution.ts.
 */

export const QualitySchema = z
  .object({
    precision: z.number().optional(),
    testability: z.number().optional(),
    readability: z.number().optional(),
    balance: z.number().optional(),
  })
  .partial();

export const StatementRecordSchema = z
  .object({
    id: z.string().optional(),
    text: z.string().optional(),
    statement: z.string().optional(), // manche Modelle nutzen "statement"
    responsibility: z.string().optional(),
    topic: z.string().optional(),
    domain: z.string().optional(),
    cluster: z.string().optional(),
    quality: QualitySchema.optional(),
  })
  .passthrough();

const NoteSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
    heading: z.string().optional(),
    label: z.string().optional(),
    body: z.string().optional(),
    text: z.string().optional(),
    content: z.string().optional(),
  })
  .passthrough();

const QuestionSchema = z
  .object({
    id: z.string().optional(),
    label: z.string().optional(),
    kind: z.string().optional(),
    type: z.string().optional(),
    category: z.string().optional(),
    topic: z.string().optional(),
    domain: z.string().optional(),
    body: z.string().optional(),
    text: z.string().optional(),
    content: z.string().optional(),
  })
  .passthrough();

const KnotSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
    label: z.string().optional(),
    topic: z.string().optional(),
    category: z.string().optional(),
    cluster: z.string().optional(),
    domain: z.string().optional(),
    body: z.string().optional(),
    text: z.string().optional(),
    content: z.string().optional(),
  })
  .passthrough();

export const AnalyzeResultSchema = z
  .object({
    mode: z.string().optional(),
    sourceText: z.string().optional(),
    language: z.string().optional(),
    claims: z
      .array(z.union([StatementRecordSchema, z.string()]))
      .optional(),
    // notes/questions/knots werden nicht mehr vom Modell erwartet,
    // sondern in der Route abgeleitet – deshalb hier nur "locker".
    notes: z.array(z.union([NoteSchema, z.string()])).optional(),
    questions: z.array(z.union([QuestionSchema, z.string()])).optional(),
    knots: z.array(z.union([KnotSchema, z.string()])).optional(),
  })
  .passthrough();

/** Interner Typ, mit dem der Rest der App arbeitet. */
export type StatementRecord = {
  id: string;
  text: string;
  responsibility: string;
  topic: string;
  quality: {
    precision: number;
    testability: number;
    readability: number;
    balance: number;
  };
};

export type AnalyzeResult = {
  mode: string;
  sourceText: string;
  language: string;
  claims: StatementRecord[];
  notes: any[];
  questions: any[];
  knots: any[];
};

// Für alte Importe
export const ANALYZE_JSON_SCHEMA = AnalyzeResultSchema;
