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

/* ---------- AnalyzeResult ---------- */

export const AnalyzeResultSchema = z.object({
  mode: z.literal("E150"),
  sourceText: z.string(),
  language: z.string(),
  claims: z.array(StatementRecordSchema),
  notes: z.array(NoteRecordSchema),
  questions: z.array(QuestionRecordSchema),
  knots: z.array(KnotRecordSchema),
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
    },
    required: ["mode", "sourceText", "language", "claims", "notes", "questions", "knots"],
  },
  strict: true,
} as const;
