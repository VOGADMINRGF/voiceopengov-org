// apps/web/src/models/core/Event.ts
import { mongoose, mongo } from "@core/mongoose";

/** Plain-Datenform (kein Document-Mix, damit die Typen klar bleiben) */
export interface EventDoc {
  title: string;
  description?: string;
  startAt: Date;
  endAt?: Date;
  tags?: string[];
  organizationId?: string;
  /** GeoJSON Point (lng, lat) */
  location?: { type: "Point"; coordinates: [number, number] };
  createdAt?: Date;
  updatedAt?: Date;
}

const EventSchema = new mongoose.Schema<EventDoc>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 4000 },

    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date },

    tags: { type: [String], default: undefined },
    organizationId: { type: String, index: true },

    // GeoJSON (optional)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: undefined // optionales Feld
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (v: number[]) => Array.isArray(v) && v.length === 2,
          message: "coordinates must be [lng, lat]"
        },
        default: undefined // optional
      }
    }
  },
  {
    timestamps: true, // createdAt/updatedAt automatisch
    minimize: true,
    versionKey: false
  }
);

// Indizes
EventSchema.index({ location: "2dsphere" });
EventSchema.index({ organizationId: 1, startAt: -1 });

// Optional: JSON-Output hübscher
EventSchema.set("toJSON", { versionKey: false, virtuals: true });

/** Idempotentes Model (nutzt bestehende Connection, baut sie bei Bedarf auf) */
export async function EventModel(): Promise<mongoose.Model<EventDoc>> {
  await mongo(); // stellt sicher, dass verbunden ist
  const existing = mongoose.models.Event as mongoose.Model<EventDoc> | undefined;
  return existing ?? mongoose.model<EventDoc>("Event", EventSchema);
}
