import mongoose, { Schema, Document } from "mongoose";
import { coreConn } from "src/lib/db/core";

export interface VotesSummary {
  agree: number;
  neutral: number;
  disagree: number;
  requiredMajority: number;
}

// ---- Factcheck Typen ----
export type FactcheckVerdict = "true" | "false" | "uncertain";

export interface FactcheckClaim {
  text: string;
  verdict: FactcheckVerdict;
  evidence: Array<{ title: string; url: string; snippet: string }>;
}

export interface FactcheckResult {
  verdict: FactcheckVerdict;
  confidence?: number;
  claims?: FactcheckClaim[];
  summary?: string;
}

export interface FactcheckError {
  message?: string;
  code?: string;
}

export interface FactcheckMeta {
  jobId?: string;
  provider?: string;       // z.B. "openai:gpt-4o-mini"
  startedAt?: Date;
  finishedAt?: Date;
  progress?: number;       // 0..100
  error?: FactcheckError;
  result?: FactcheckResult;
}

export interface StatementDoc extends Document {
  title: string;
  text: string;
  plainStatement?: string;
  shortText?: string;
  context?: string;
  category: string;
  tags?: string[];
  language: string;
  regionScope?: any[];

  source?: { name: string; url?: string; trustScore?: number };
  impactLogic?: Array<{
    type: string;
    description: { einfach: string; eloquent?: string };
  }>;
  alternatives?: Array<{
    text: string;
    type: string;
    impact: string;
    votes?: { agree?: number; neutral?: number; disagree?: number };
  }>;
  arguments?: { pro?: string[]; contra?: string[] };
  summary?: { einfach?: string; eloquent?: string };
  recommendation?: { einfach?: string; eloquent?: string };
  facts?: Array<{ text: string; source?: { name: string; url?: string; trustScore?: number } }>;

  // GeoJSON
  location?: { type: "Point"; coordinates: [number, number] };

  aiAnnotations?: { toxicity?: number; sentiment?: string; subjectAreas?: string[] };
  accessibilityStatus?: string;
  barrierescore?: number;

  relatedStatements?: string[];
  relatedReports?: string[];

  visibility?: string;   // public / private
  status?: string;       // active / archived / draft
  importance?: string;   // low/medium/high

  votes: VotesSummary;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  factcheckStatus?: "queued" | "running" | "done" | "failed";

  // ---- Neu: Factcheck vollständige Struktur ----
  factcheck?: FactcheckMeta;
}

const conn = coreConn();

const StatementSchema = new Schema<StatementDoc>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  text: { type: String, required: true, trim: true, maxlength: 4000 },
  plainStatement: { type: String, trim: true },
  shortText: { type: String, trim: true },
  context: { type: String, trim: true },
  category: { type: String, index: true, trim: true, maxlength: 80 },
  tags: [{ type: String, trim: true }],
  language: { type: String, trim: true, maxlength: 5, default: "de", index: true },
  regionScope: [Schema.Types.Mixed],

  source: { name: String, url: String, trustScore: Number },
  impactLogic: [{
    type: { type: String, trim: true },
    description: { einfach: String, eloquent: String }
  }],
  alternatives: [{
    text: String,
    type: String,
    impact: String,
    votes: { agree: Number, neutral: Number, disagree: Number }
  }],
  arguments: { pro: [String], contra: [String] },
  summary: { einfach: String, eloquent: String },
  recommendation: { einfach: String, eloquent: String },
  facts: [{ text: String, source: { name: String, url: String, trustScore: Number } }],

  location: {
    type: { type: String, enum: ["Point"] },
    coordinates: { type: [Number], validate: (v: number[]) => v.length === 2 }
  },

  aiAnnotations: { toxicity: Number, sentiment: String, subjectAreas: [String] },
  accessibilityStatus: String,
  barrierescore: Number,

  relatedStatements: [String],
  relatedReports: [String],
  visibility: { type: String, default: "public" },
  status: { type: String, default: "active", index: true },
  importance: String,

  votes: {
    agree: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    disagree: { type: Number, default: 0 },
    requiredMajority: { type: Number, default: 50 }
  },

  userId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: Date,

  factcheckStatus: { type: String, enum: ["queued", "running", "done", "failed"], default: "queued" },

  // ---- Neu: Factcheck vollständige Struktur ----
  factcheck: {
    jobId: { type: String },
    provider: { type: String },   // z.B. "openai:gpt-4o-mini"
    startedAt: { type: Date },
    finishedAt: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    error: {
      message: { type: String },
      code: { type: String },
    },
    result: {
      verdict: { type: String, enum: ["true", "false", "uncertain"] },
      confidence: { type: Number },
      claims: [{
        text: { type: String },
        verdict: { type: String, enum: ["true", "false", "uncertain"] },
        evidence: [{ title: String, url: String, snippet: String }]
      }],
      summary: { type: String }
    }
  }
});

// Indizes
StatementSchema.index({ category: 1, createdAt: -1 });
StatementSchema.index({ language: 1, createdAt: -1 });
StatementSchema.index({ status: 1, publishedAt: -1 });
StatementSchema.index({ factcheckStatus: 1, "factcheck.startedAt": -1 });
StatementSchema.index({ "factcheck.provider": 1, createdAt: -1 });
StatementSchema.index({ location: "2dsphere" });

export default (conn.models.Statement as mongoose.Model<StatementDoc>) ||
  conn.model<StatementDoc>("Statement", StatementSchema);
