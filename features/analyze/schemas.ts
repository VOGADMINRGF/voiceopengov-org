// apps/web/src/features/analyze/schemas.ts
import { z } from "zod";

/* ---------- Statements / Claims ---------- */

export const StatementRecordSchema = z.object({
  id: z.string(),
  text: z.string(),

  // NEU: kurzer Oberbegriff / Titel des Claims
  title: z.string().nullable().optional(),

  // Grobe Zuständigkeit, z.B. "EU", "Bund", "Land", "Kommune", "privat", "unbestimmt"
  responsibility: z.string().nullable().optional(),

  importance: z.number().int().min(1).max(5).optional(),
  topic: z.string().nullable().optional(),
  domain: z.string().nullable().optional(),
  stance: z.enum(["pro", "neutral", "contra"]).nullable().optional(),
});

export type StatementRecord = z.infer<typeof StatementRecordSchema>;

/* ---------- Notes / Fragen / Knoten ---------- */

export const NoteRecordSchema = z.object({
  id: z.string(),
  text: z.string(),
  kind: z.string().nullable().optional(),
});
export type NoteRecord = z.infer<typeof NoteRecordSchema>;

export const QuestionRecordSchema = z.object({
  id: z.string(),
  text: z.string(),
  dimension: z.string().nullable().optional(),
});
export type QuestionRecord = z.infer<typeof QuestionRecordSchema>;

export const KnotRecordSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
});
export type KnotRecord = z.infer<typeof KnotRecordSchema>;

const responsibilityLevelEnum = z.enum([
  "municipality",
  "district",
  "state",
  "federal",
  "eu",
  "ngo",
  "private",
  "unknown",
]);

export const ConsequenceRecordSchema = z.object({
  id: z.string(),
  scope: z.enum(["local_short", "local_long", "national", "global", "systemic"]),
  statementIndex: z.number().int().min(0),
  text: z.string(),
  confidence: z.number().min(0).max(1).optional(),
});
export type ConsequenceRecord = z.infer<typeof ConsequenceRecordSchema>;

export const ResponsibilityRecordSchema = z.object({
  id: z.string(),
  level: responsibilityLevelEnum,
  actor: z.string().nullable().optional(),
  text: z.string(),
  relevance: z.number().min(0).max(1),
});
export type ResponsibilityRecord = z.infer<typeof ResponsibilityRecordSchema>;

export const ResponsibilityPathNodeSchema = z.object({
  level: responsibilityLevelEnum,
  actorKey: z.string(),
  displayName: z.string(),
  description: z.string().nullable().optional(),
  contactUrl: z.string().nullable().optional(),
  processHint: z.string().nullable().optional(),
  relevance: z.number().min(0).max(1).optional(),
});
export type ResponsibilityPathNode = z.infer<typeof ResponsibilityPathNodeSchema>;

export const ResponsibilityPathSchema = z.object({
  id: z.string(),
  statementId: z.string(),
  locale: z.string(),
  nodes: z.array(ResponsibilityPathNodeSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type ResponsibilityPath = z.infer<typeof ResponsibilityPathSchema>;

export const ConsequenceBundleSchema = z.object({
  consequences: z.array(ConsequenceRecordSchema),
  responsibilities: z.array(ResponsibilityRecordSchema),
});
export type ConsequenceBundle = z.infer<typeof ConsequenceBundleSchema>;

/* ---------- Eventualities & Decision Trees ---------- */

const ScenarioOptionEnum = z.enum(["pro", "neutral", "contra"]);
export type ScenarioOption = z.infer<typeof ScenarioOptionEnum>;

export type EventualityNode = {
  id: string;
  statementId: string;
  label: string;
  narrative: string;
  stance?: ScenarioOption | null;
  likelihood?: number;
  impact?: number;
  consequences: ConsequenceRecord[];
  responsibilities: ResponsibilityRecord[];
  children: EventualityNode[];
};

export const EventualityNodeSchema: z.ZodType<EventualityNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    statementId: z.string(),
    label: z.string(),
    narrative: z.string(),
    stance: ScenarioOptionEnum.nullable().optional(),
    likelihood: z.number().min(0).max(1).optional(),
    impact: z.number().min(0).max(1).optional(),
    consequences: z.array(ConsequenceRecordSchema).default([]),
    responsibilities: z.array(ResponsibilityRecordSchema).default([]),
    children: z.array(EventualityNodeSchema).default([]),
  })
);

export const DecisionTreeSchema = z.object({
  id: z.string().optional(),
  rootStatementId: z.string(),
  locale: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().optional(),
  options: z.object({
    pro: EventualityNodeSchema,
    neutral: EventualityNodeSchema.optional(),
    contra: EventualityNodeSchema,
  }),
});
export type DecisionTree = z.infer<typeof DecisionTreeSchema>;

/* ---------- AnalyzeResult ---------- */

export const AnalyzeResultSchema = z.object({
  mode: z.literal("E150"),
  sourceText: z.string(),
  language: z.string(),
  claims: z.array(StatementRecordSchema),
  notes: z.array(NoteRecordSchema),
  questions: z.array(QuestionRecordSchema),
  knots: z.array(KnotRecordSchema),
  consequences: ConsequenceBundleSchema.optional(),
  responsibilityPaths: z.array(ResponsibilityPathSchema).optional(),
  eventualities: z.array(EventualityNodeSchema).optional(),
  decisionTrees: z.array(DecisionTreeSchema).optional(),
});

export type AnalyzeResult = z.infer<typeof AnalyzeResultSchema>;

/* ---------- JSON-Schema (für Responses API) ---------- */

export const ANALYZE_JSON_SCHEMA = {
  name: "AnalyzeResult",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      mode: {
        type: "string",
        enum: ["E150"],
      },
      sourceText: { type: "string" },
      language: { type: "string" },
      claims: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            text: { type: "string" },

            // NEU auch im JSON-Schema
            title: { type: "string", nullable: true },
            responsibility: { type: "string", nullable: true },

            importance: { type: "integer" },
            topic: { type: "string", nullable: true },
            domain: { type: "string", nullable: true },
            stance: {
              type: "string",
              enum: ["pro", "neutral", "contra"],
              nullable: true,
            },
          },
          required: ["id", "text"],
        },
      },
      notes: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            text: { type: "string" },
            kind: { type: "string", nullable: true },
          },
          required: ["id", "text"],
        },
      },
      questions: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            text: { type: "string" },
            dimension: { type: "string", nullable: true },
          },
          required: ["id", "text"],
        },
      },
      knots: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            label: { type: "string" },
            description: { type: "string" },
          },
          required: ["id", "label", "description"],
        },
      },
      consequences: {
        type: "object",
        additionalProperties: false,
        properties: {
          consequences: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string" },
                scope: {
                  type: "string",
                  enum: ["local_short", "local_long", "national", "global", "systemic"],
                },
                statementIndex: { type: "integer", minimum: 0 },
                text: { type: "string" },
                confidence: { type: "number", minimum: 0, maximum: 1 },
              },
              required: ["id", "scope", "statementIndex", "text"],
            },
          },
          responsibilities: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string" },
                level: {
                  type: "string",
                  enum: [
                    "municipality",
                    "district",
                    "state",
                    "federal",
                    "eu",
                    "ngo",
                    "private",
                    "unknown",
                  ],
                },
                actor: { type: "string", nullable: true },
                text: { type: "string" },
                relevance: { type: "number", minimum: 0, maximum: 1 },
              },
              required: ["id", "level", "text", "relevance"],
            },
          },
        },
        required: ["consequences", "responsibilities"],
      },
      responsibilityPaths: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            statementId: { type: "string" },
            locale: { type: "string" },
            nodes: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  level: {
                    type: "string",
                    enum: [
                      "municipality",
                      "district",
                      "state",
                      "federal",
                      "eu",
                      "ngo",
                      "private",
                      "unknown",
                    ],
                  },
                  actorKey: { type: "string" },
                  displayName: { type: "string" },
                  description: { type: "string", nullable: true },
                  contactUrl: { type: "string", nullable: true },
                  processHint: { type: "string", nullable: true },
                  relevance: { type: "number", minimum: 0, maximum: 1 },
                },
                required: ["level", "actorKey", "displayName"],
              },
            },
            createdAt: { type: "string", nullable: true },
            updatedAt: { type: "string", nullable: true },
          },
          required: ["id", "statementId", "locale", "nodes"],
        },
      },
      eventualities: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            statementId: { type: "string" },
            label: { type: "string" },
            narrative: { type: "string" },
            stance: {
              type: "string",
              enum: ["pro", "neutral", "contra"],
              nullable: true,
            },
            likelihood: { type: "number", minimum: 0, maximum: 1 },
            impact: { type: "number", minimum: 0, maximum: 1 },
            consequences: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  id: { type: "string" },
                  scope: {
                    type: "string",
                    enum: [
                      "local_short",
                      "local_long",
                      "national",
                      "global",
                      "systemic",
                    ],
                  },
                  statementIndex: { type: "integer", minimum: 0 },
                  text: { type: "string" },
                  confidence: { type: "number", minimum: 0, maximum: 1 },
                },
                required: ["id", "scope", "statementIndex", "text"],
              },
            },
            responsibilities: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  id: { type: "string" },
                  level: {
                    type: "string",
                    enum: [
                      "municipality",
                      "district",
                      "state",
                      "federal",
                      "eu",
                      "ngo",
                      "private",
                      "unknown",
                    ],
                  },
                  actor: { type: "string", nullable: true },
                  text: { type: "string" },
                  relevance: { type: "number", minimum: 0, maximum: 1 },
                },
                required: ["id", "level", "text", "relevance"],
              },
            },
            children: {
              type: "array",
              items: { $ref: "#/properties/eventualities/items" },
            },
          },
          required: ["id", "statementId", "label", "narrative"],
        },
      },
      decisionTrees: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string", nullable: true },
            rootStatementId: { type: "string" },
            locale: { type: "string", nullable: true },
            createdAt: { type: "string" },
            updatedAt: { type: "string", nullable: true },
            options: {
              type: "object",
              additionalProperties: false,
              properties: {
                pro: { $ref: "#/properties/eventualities/items" },
                neutral: { $ref: "#/properties/eventualities/items", nullable: true },
                contra: { $ref: "#/properties/eventualities/items" },
              },
              required: ["pro", "contra"],
            },
          },
          required: ["rootStatementId", "createdAt", "options"],
        },
      },
    },
    required: ["mode", "sourceText", "language", "claims", "notes", "questions", "knots"],
  },
  strict: true,
} as const;
