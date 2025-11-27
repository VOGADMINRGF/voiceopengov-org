import { z } from "zod";
import {
  AnalyzeResultSchema as E150AnalyzeResultSchema,
  type AnalyzeResult as E150AnalyzeResult,
  type StatementRecord as E150StatementRecord,
} from "@features/analyze/schemas";

export { E150AnalyzeResultSchema, E150AnalyzeResult };
/**
 * DEPRECATED: Use E150AnalyzeResultSchema/E150AnalyzeResult directly.
 * Kept as a thin alias for legacy imports.
 */
export const AnalyzeResultSchema = E150AnalyzeResultSchema;
export type AnalyzeResult = E150AnalyzeResult;
export type StatementRecord = E150StatementRecord;
export const ANALYZE_JSON_SCHEMA = AnalyzeResultSchema;

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

const ResponsibilityLevelEnum = z.enum([
  "municipality",
  "district",
  "state",
  "federal",
  "eu",
  "ngo",
  "private",
  "unknown",
]);

const ConsequenceSchema = z
  .object({
    id: z.string().optional(),
    scope: z.string().optional(),
    statementIndex: z.number().optional(),
    text: z.string().optional(),
    confidence: z.number().optional(),
  })
  .passthrough();

const ResponsibilitySchema = z
  .object({
    id: z.string().optional(),
    level: ResponsibilityLevelEnum.optional(),
    actor: z.string().optional(),
    text: z.string().optional(),
    relevance: z.number().optional(),
  })
  .passthrough();

const ResponsibilityPathNodeSchema = z
  .object({
    level: ResponsibilityLevelEnum.optional(),
    actorKey: z.string().optional(),
    displayName: z.string().optional(),
    description: z.string().optional(),
    contactUrl: z.string().optional(),
    processHint: z.string().optional(),
    relevance: z.number().optional(),
  })
  .passthrough();

const ResponsibilityPathSchema = z
  .object({
    id: z.string().optional(),
    statementId: z.string().optional(),
    locale: z.string().optional(),
    nodes: z.array(ResponsibilityPathNodeSchema).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

const ScenarioOptionEnum = z.enum(["pro", "neutral", "contra"]);

const EventualityNodeSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().optional(),
      statementId: z.string().optional(),
      label: z.string().optional(),
      narrative: z.string().optional(),
      stance: ScenarioOptionEnum.nullable().optional(),
      likelihood: z.number().optional(),
      impact: z.number().optional(),
      consequences: z.array(z.any()).optional(),
      responsibilities: z.array(z.any()).optional(),
      children: z.array(EventualityNodeSchema).optional(),
    })
    .passthrough(),
);

const DecisionTreeSchema = z
  .object({
    id: z.string().optional(),
    rootStatementId: z.string().optional(),
    locale: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    options: z
      .object({
        pro: EventualityNodeSchema.optional(),
        neutral: EventualityNodeSchema.optional(),
        contra: EventualityNodeSchema.optional(),
      })
      .passthrough(),
  })
  .passthrough();
