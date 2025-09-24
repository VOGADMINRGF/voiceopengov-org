// apps/web/src/models/ErrorLog.ts
import mongoose, { Schema, models, model } from "mongoose";

export interface IErrorLog {
  _id: string;
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
  { collection: "error_logs" }
);

export default (models.ErrorLog as mongoose.Model<IErrorLog>) ||
  model<IErrorLog>("ErrorLog", ErrorLogSchema);

export type { IErrorLog };
