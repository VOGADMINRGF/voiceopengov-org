import { Schema, Document, Types } from "mongoose";
import { coreConn } from "@/lib/db/core";
import { modelOn } from "@/lib/db/modelOn";

export type StreamKind = "EVENT" | "METRIC" | "LOG";
export type StreamStatus = "ACCEPTED" | "APPLIED" | "REJECTED";

export interface IStreamEvent extends Document {
  kind: StreamKind;
  type: string;
  ts: Date;
  provider?: string;
  extId?: string;
  sourceId?: Types.ObjectId;

  partitionKey?: string;
  seq?: number;
  idempotencyKey?: string;

  status: StreamStatus;
  error?: string | null;

  topicRef?: string | null;
  statementRef?: string | null;
  userRef?: string | null;
  domainRef?: string | null;

  payload: any;
  meta?: any;
}

const StreamEventSchema = new Schema<IStreamEvent>(
  {
    provider: {
      type: String,
      default: undefined,
      index: true,
      set: (v: any) => (v == null || String(v).trim() === "" ? undefined : String(v)),
    },
    extId: {
      type: String,
      default: undefined,
      index: true,
      set: (v: any) => (v == null || String(v).trim() === "" ? undefined : String(v)),
    },

    kind: { type: String, enum: ["EVENT", "METRIC", "LOG"], default: "EVENT", index: true },
    type: { type: String, required: true, trim: true, index: true },
    ts: { type: Date, default: Date.now },

    sourceId: { type: Schema.Types.ObjectId, ref: "Source", index: true },

    partitionKey: { type: String, default: undefined, set: (v: any) => (v === null || v === "" ? undefined : v) },
    seq:          { type: Number, default: undefined, set: (v: any) => (v === null ? undefined : v) },
    idempotencyKey: { type: String, default: undefined, set: (v: any) => (v === null || v === "" ? undefined : v) },

    status: { type: String, enum: ["ACCEPTED", "APPLIED", "REJECTED"], default: "ACCEPTED", index: true },
    error:  { type: String, default: null },

    topicRef:     { type: String, default: null },
    statementRef: { type: String, default: null },
    userRef:      { type: String, default: null },
    domainRef:    { type: String, default: null },

    payload: { type: Schema.Types.Mixed, required: true },
    meta:    { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: false, strict: true, minimize: false }
);

// Zeit & typische Query-Pfade
StreamEventSchema.index({ ts: 1 });
StreamEventSchema.index({ kind: 1, type: 1, ts: -1 });
StreamEventSchema.index({ sourceId: 1, ts: -1 });

// Sequencer: nur indexieren, wenn Typen korrekt
StreamEventSchema.index(
  { partitionKey: 1, seq: 1 },
  { unique: true, partialFilterExpression: { partitionKey: { $type: "string" }, seq: { $type: "number" } } }
);

// Harte Idempotenz
StreamEventSchema.index(
  { idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } }
);

// Häufige Lookups
StreamEventSchema.index(
  { provider: 1, type: 1, ts: -1 },
  { partialFilterExpression: { provider: { $type: "string" }, type: { $type: "string" } } }
);
StreamEventSchema.index(
  { provider: 1, extId: 1, ts: -1 },
  { partialFilterExpression: { provider: { $type: "string" }, extId: { $type: "string" } } }
);
// Optional, nützlich wenn oft “nur provider” + Zeitraum:
StreamEventSchema.index(
  { provider: 1, ts: -1 },
  { partialFilterExpression: { provider: { $type: "string" } } }
);

const conn = coreConn();
export default modelOn<IStreamEvent>(conn, "StreamEvent", StreamEventSchema, "stream_events");
