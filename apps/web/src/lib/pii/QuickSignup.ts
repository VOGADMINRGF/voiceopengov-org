import { Connection, Model, Schema } from "mongoose";

export type QuickSignupDoc = {
  _id: any;
  createdAt: Date;
  name?: string | null;
  email?: string | null;
  consent: boolean;
  source: string;
  ip?: string | null;
  userAgent?: string | null;
  userId?: string | null;
};

const QuickSignupSchema = new Schema<QuickSignupDoc>(
  {
    name: String,
    email: String,
    consent: { type: Boolean, required: true },
    source: { type: String, default: "quick" },
    ip: String,
    userAgent: String,
    userId: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export function getQuickSignupModel(conn: Connection): Model<QuickSignupDoc> {
  return (conn.models.QuickSignup as Model<QuickSignupDoc>) ||
    conn.model<QuickSignupDoc>("QuickSignup", QuickSignupSchema, "quick_signups");
}
