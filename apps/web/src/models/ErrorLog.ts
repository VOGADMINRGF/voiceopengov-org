// apps/web/src/models/ErrorLog.ts
import mongoose, { Schema, models, model } from "mongoose";

export interface IErrorLog {
  _id: string;           // Hinweis: Runtime ist ObjectId – für Client i.d.R. als string genutzt
  traceId: string;
  code?: string;
  path?: string;
  status?: number;
  resolved: boolean;
  timestamp: Date;
}

const ErrorLogSchema = new Schema<IErrorLog>(
  {
    traceId: { type: String, index: true, required: true },
    code: String,
    path: String,
    status: Number,
    resolved: { type: Boolean, default: false, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    collection: "error_logs",
    versionKey: false,
  }
);

/**
 * 🔎 Zusätzlicher, praxisrelevanter Index:
 * Für Listen mit Filter (open/resolved) und Sortierung "neueste zuerst"
 * beschleunigt dieser Index deutlich: find({ resolved }).sort({ timestamp: -1 })
 */
ErrorLogSchema.index({ resolved: 1, timestamp: -1 }, { background: true, name: "by_resolved_ts_desc" });

// Optional – wenn du _id in JSONs als string haben willst (wirkt NICHT bei .lean()):
// ErrorLogSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform(_doc, ret) {
//     if (ret._id?.toString) ret._id = ret._id.toString();
//     return ret;
//   },
// });
// ErrorLogSchema.set("toObject", { ...ErrorLogSchema.get("toJSON") });

const ErrorLogModel =
  (models.ErrorLog as mongoose.Model<IErrorLog>) ||
  model<IErrorLog>("ErrorLog", ErrorLogSchema);

export default ErrorLogModel;
export type { IErrorLog };

// Optionaler Hinweis (z.B. in connectDB() aufrufbar):
// if (process.env.MONGOOSE_SYNC_INDEXES === "1") {
//   await ErrorLogModel.syncIndexes();
// }
