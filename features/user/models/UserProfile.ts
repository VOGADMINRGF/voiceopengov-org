import crypto from "node:crypto";
import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { IUserProfile, RoleObject } from "../types/UserProfile";

export type UserProfileDoc = IUserProfile & Document;

const RoleObjectSchema = new Schema<RoleObject>(
  {
    role: {
      type: String,
      enum: [
        "user",
        "citizen",
        "moderator",
        "admin",
        "superadmin",
        "b2b",
        "ngo",
        "politics",
        "party",
      ],
      required: true,
    },
    subRole: { type: String, default: undefined },
    orgId: { type: String, default: undefined },
    orgName: { type: String, default: undefined },
    region: { type: String, default: undefined },
    verification: {
      type: String,
      enum: ["none", "verified", "legitimized"],
      default: undefined,
    },
    premium: { type: Boolean, default: undefined },
  },
  { _id: false },
);

const UserProfileSchema = new Schema<UserProfileDoc>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 64,
    },
    email: {
      type: String,
      default: null,
      select: false,
      lowercase: true,
      trim: true,
    },
    roles: { type: [RoleObjectSchema], default: [] },
    activeRole: { type: Number, default: 0, min: 0 },
    trustScore: { type: Number, default: 0, min: 0, max: 100 },
    badges: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    regions: { type: [String], default: [] },
    languages: { type: [String], default: ["de"] },
    status: {
      type: String,
      enum: ["active", "banned", "pending"],
      default: "active",
      index: true,
    },
    region: { type: String, default: null },
    city: { type: String, default: null },
    premium: { type: Boolean, default: false },
    verification: {
      type: String,
      enum: ["none", "verified", "legitimized"],
      default: "none",
    },
    onboardingStatus: {
      type: String,
      enum: ["incomplete", "pendingDocs", "complete"],
      default: "incomplete",
    },
    auditTrail: {
      type: [{ date: Date, action: String, details: Schema.Types.Mixed }],
      default: [],
    },
    limits: { type: Schema.Types.Mixed, default: {} },
    quickLogin: { type: Boolean, default: false },
    eventRef: { type: String, default: null },
    questionRef: { type: String, default: null },
    votedStatements: { type: [String], default: [] },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, default: null, select: false },
    mfaBackupCodes: { type: [String], default: [], select: false },
    lastMfaChallengeAt: { type: Date, default: null },
    username_lc: { type: String, select: false },
  },
  { timestamps: true },
);

UserProfileSchema.path("region").validate({
  validator: (v: string | null) => !v || /^[A-Z0-9:-]+$/.test(v),
  message: "region must be a normalized code (e.g., ISO2:DE or ISO2-2:DE-BY)",
});

UserProfileSchema.pre("save", function (next) {
  // @ts-ignore `this` is the doc
  if (this.isModified("username") && typeof this.username === "string") {
    // @ts-ignore
    this.username_lc = this.username.toLowerCase();
  }
  next();
});

UserProfileSchema.pre("save", function (next) {
  // @ts-ignore
  if (this.isModified("mfaBackupCodes") && Array.isArray(this.mfaBackupCodes)) {
    // @ts-ignore
    this.mfaBackupCodes = this.mfaBackupCodes.map((c: string) =>
      crypto.createHash("sha256").update(c).digest("hex"),
    );
  }
  next();
});

UserProfileSchema.index({ username: 1 }, { unique: true });
UserProfileSchema.index(
  { username_lc: 1 },
  {
    unique: true,
    partialFilterExpression: { username_lc: { $type: "string" } },
  },
);
UserProfileSchema.index(
  { email: 1 },
  { partialFilterExpression: { email: { $type: "string" } } },
);
UserProfileSchema.index({ status: 1, premium: 1 });
UserProfileSchema.index({ region: 1 });
UserProfileSchema.index({ "roles.role": 1 });

const UserProfileModel: Model<UserProfileDoc> =
  (mongoose.models.UserProfile as Model<UserProfileDoc>) ||
  mongoose.model<UserProfileDoc>("UserProfile", UserProfileSchema, "user_profiles");

export default UserProfileModel;
