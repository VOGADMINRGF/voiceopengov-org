// apps/web/src/models/game/UserGameStats.ts — V3.1 (E150-unified + V2-Ergänzungen)
import mongoose, { Schema, Document, Model } from "mongoose";

//
// ---------- Types ----------
export interface Badge {
  code: string;      // z.B. "FIRST_VOTE", "FIRST_SHARE"
  earnedAt: Date;
}

export interface AwardOpts {
  season?: string;
  badgeCode?: string;
  /** Idempotenz-Schlüssel (z.B. Request-ID, Message-ID). Vergibt XP nur, wenn noch nicht gesehen. */
  eventId?: string;
  /** Für Streak: default true (Aktion zählt für heutigen Tag) */
  countsForStreak?: boolean;
  /** Zeitzone für Tagesgrenzen (default "Europe/Berlin") */
  timezone?: string;
  /** Optionaler Hook: wird aufgerufen, wenn ein neues Level erreicht wurde */
  onMinLevelUp?: (newLevel: number) => void;
  /** Alias (aus V2): minLevelUpCallback */
  minLevelUpCallback?: (newLevel: number) => void;
}

export interface UserGameStatsDoc extends Document {
  userId: string;
  xp: number;
  badges: Badge[];
  lastUpdated: Date;
  // Streaks
  dailyStreak: number;
  lastActionAt?: Date;
  // Season für saisonale Leaderboards
  season?: string;
  // interne Dedupe-Historie (nur die letzten ~100 IDs)
  processedEvents?: string[];

  // virtuals
  level: number;
}

export interface UserGameStatsModel extends Model<UserGameStatsDoc> {
  xpForLevel(level: number): number;
  levelFromXp(xp: number): number;

  awardXp(
    userId: string,
    amount: number,
    opts?: AwardOpts
  ): Promise<{ doc: UserGameStatsDoc; newLevel: number; leveledUp: boolean; idempotent: boolean }>;
}

//
// ---------- Helpers ----------
function xpForLevel(level: number) {
  const n = Math.max(1, Math.floor(level));
  return 100 * (n * n - n); // 100*(n^2 - n) – smooth curve
}
function levelFromXp(xp: number) {
  if (!Number.isFinite(xp) || xp <= 0) return 1;
  // invert: n = (1 + sqrt(1 + 0.04 * xp)) / 2
  const n = (1 + Math.sqrt(1 + 0.04 * xp)) / 2;
  return Math.max(1, Math.floor(n));
}

// Tageskey pro Zeitzone (für Streaks)
function dateKey(d: Date, tz: string) {
  const p = new Intl.DateTimeFormat("de-DE", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(d)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});
  return `${p.year}-${p.month}-${p.day}`; // YYYY-MM-DD
}
// robuster "Gestern"-Key: 24h zurück, erneut im TZ-Formatter normiert
function prevDayKey(d: Date, tz: string) {
  const prev = new Date(d.getTime() - 24 * 60 * 60 * 1000);
  return dateKey(prev, tz);
}

//
// ---------- Schema ----------
const BadgeSchema = new Schema<Badge>(
  {
    code: { type: String, required: true },
    earnedAt: { type: Date, required: true },
  },
  { _id: false }
);

const UserGameStatsSchema = new Schema<UserGameStatsDoc, UserGameStatsModel>(
  {
    userId: { type: String, unique: true, required: true, index: true },
    xp: { type: Number, default: 0, min: 0 },
    badges: { type: [BadgeSchema], default: [] },
    lastUpdated: { type: Date, default: Date.now },

    dailyStreak: { type: Number, default: 0, min: 0 },
    lastActionAt: { type: Date },

    season: { type: String },
    processedEvents: { type: [String], default: [] }, // capped via $slice in updates
  },
  { timestamps: true, versionKey: false }
);

// Virtuals in JSON/Object sichtbar machen (für API/SSR nützlich)
UserGameStatsSchema.set("toJSON", { virtuals: true });
UserGameStatsSchema.set("toObject", { virtuals: true });

// Virtual: Level (abgeleitet)
UserGameStatsSchema.virtual("level").get(function (this: UserGameStatsDoc) {
  return levelFromXp(this.xp);
});

// Indizes für Leaderboards/Queries
UserGameStatsSchema.index({ xp: -1 });                  // globales Leaderboard
UserGameStatsSchema.index({ season: 1, xp: -1 });       // saisonales Leaderboard
UserGameStatsSchema.index({ "badges.code": 1 });        // Badge-Queries
// Optional: schneller Dedupe-Check auf userId+processedEvents
// UserGameStatsSchema.index({ userId: 1, processedEvents: 1 });

// Statics
UserGameStatsSchema.statics.xpForLevel = xpForLevel;
UserGameStatsSchema.statics.levelFromXp = levelFromXp;

UserGameStatsSchema.statics.awardXp = async function (
  userId: string,
  amount: number,
  opts?: AwardOpts
) {
  const now = new Date();
  const tz = opts?.timezone || "Europe/Berlin";
  const safeAmount = Math.max(0, Math.floor(amount || 0));
  const countsForStreak = opts?.countsForStreak !== false;

  // --- 1) Atomische XP-Vergabe (idempotent via eventId) ---
  const filter: any = { userId };
  if (opts?.eventId) filter.processedEvents = { $ne: opts.eventId };

  const update: any = {
    $inc: { xp: safeAmount },
    $set: { lastUpdated: now, ...(opts?.season ? { season: opts.season } : {}) },
    $setOnInsert: { userId },
  };

  if (opts?.badgeCode) {
    update.$addToSet = {
      ...(update.$addToSet || {}),
      badges: { code: opts.badgeCode, earnedAt: now },
    };
  }
  if (opts?.eventId) {
    update.$push = {
      ...(update.$push || {}),
      processedEvents: { $each: [opts.eventId], $slice: -100 },
    };
  }

  // Wenn eventId bereits vorhanden ist, gibt findOneAndUpdate(null) zurück → idempotent
  const afterInc = await this.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  }).lean<UserGameStatsDoc | null>();

  let idempotent = false;
  let baseDoc: UserGameStatsDoc | null = afterInc;

  if (!afterInc) {
    // idempotenter Hit: nichts geändert, aktuelles Doc laden
    idempotent = true;
    baseDoc = await this.findOne({ userId }).lean<UserGameStatsDoc | null>();
    if (!baseDoc) {
      // extrem selten (Race bei sofortigem Erstaufruf)
      baseDoc = await this.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, lastUpdated: now } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean<UserGameStatsDoc>();
    }
  }

  // --- 2) Streaks (2. super schneller Update-Pass nur wenn notwendig) ---
  let newStreak = baseDoc!.dailyStreak || 0;
  const today = dateKey(now, tz);
  const yesterday = prevDayKey(now, tz);
  const lastKey = baseDoc!.lastActionAt ? dateKey(new Date(baseDoc!.lastActionAt), tz) : null;

  if (countsForStreak) {
    if (lastKey === today) {
      // schon heute aktiv → Streak bleibt
    } else if (lastKey === yesterday) {
      newStreak = (newStreak || 0) + 1;
    } else {
      newStreak = 1; // Reset auf 1 (heute)
    }

    if (newStreak !== baseDoc!.dailyStreak || lastKey !== today) {
      await this.updateOne(
        { userId },
        { $set: { dailyStreak: newStreak, lastActionAt: now } }
      );
      baseDoc = { ...baseDoc!, dailyStreak: newStreak, lastActionAt: now } as UserGameStatsDoc;
    }
  }

  // --- 3) Level berechnen + optionaler Hook ---
  const newLevel = levelFromXp(baseDoc!.xp);
  const prevLevel = levelFromXp((baseDoc!.xp || 0) - safeAmount);
  const leveledUp = !idempotent && newLevel > prevLevel;

  const cb = opts?.onMinLevelUp || opts?.minLevelUpCallback;
  if (leveledUp && cb) {
    try { cb(newLevel); } catch {}
  }

  return { doc: baseDoc!, newLevel, leveledUp, idempotent };
};

const UserGameStats =
  (mongoose.models.UserGameStats as UserGameStatsModel) ||
  mongoose.model<UserGameStatsDoc, UserGameStatsModel>("UserGameStats", UserGameStatsSchema);

export default UserGameStats;

