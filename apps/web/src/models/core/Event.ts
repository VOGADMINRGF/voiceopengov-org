//apps/web/src/models/core/Event.ts

import mongoose, { Schema, Document } from "mongoose";
import { coreConn } from "src/lib/db/core";

export interface EventDoc extends Document {
  title: string;
  description?: string;
  startAt: Date;
  endAt?: Date;
  tags?: string[];
  organizationId?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  createdAt: Date;
  updatedAt: Date;
}

const conn = coreConn();

const EventSchema = new Schema<EventDoc>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 4000 },
  startAt: { type: Date, required: true, index: true },
  endAt: { type: Date },
  tags: [String],
  organizationId: { type: String, index: true },
  location: {
    type: { type: String, enum: ["Point"] },
    coordinates: { type: [Number], validate: (v: number[]) => v.length === 2 }
  },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

EventSchema.index({ "location": "2dsphere" });

export default (conn.models.Event as mongoose.Model<EventDoc>) ||
  conn.model<EventDoc>("Event", EventSchema);
