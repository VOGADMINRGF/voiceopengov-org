import { MongoClient, Db, Collection } from "mongodb";
import type { MapOverrides } from "@/config/mapOverrides.default";

let _client: MongoClient | null = null;
let _db: Db | null = null;

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

/**
 * Use same Atlas cluster as eDebatte if you want,
 * but keep data logically separated by DB name.
 *
 * Required:
 *   MONGODB_URI
 * Optional:
 *   VOG_DB_NAME (default: vog_public)
 */
export async function vogDb(): Promise<Db> {
  if (_db) return _db;
  const uri = env("MONGODB_URI");
  const dbName = process.env.VOG_DB_NAME || "vog_public";
  _client = _client ?? new MongoClient(uri);
  await _client.connect();
  _db = _client.db(dbName);
  return _db;
}

export type MemberType = "person" | "organisation";
export type MemberStatus = "pending" | "active";

export type MemberDoc = {
  _id?: any;

  type: MemberType;
  email: string;

  firstName?: string;
  lastName?: string;
  orgName?: string;

  city?: string;
  country?: string;
  lat?: number;
  lng?: number;

  isPublic: boolean;
  avatarUrl?: string; // optional logo/photo url

  publicSupporter?: boolean;
  supporterImageUrl?: string;

  wantsNewsletter: boolean;
  wantsNewsletterEdDebatte?: boolean;

  status: MemberStatus;
  doiToken?: string;
  doiExpiresAt?: Date;
  confirmedAt?: Date;

  createdAt: Date;
  updatedAt?: Date;
};

export async function membersCol(): Promise<Collection<MemberDoc>> {
  const db = await vogDb();
  const col = db.collection<MemberDoc>("members");

  // indexes (best-effort)
  await col.createIndex(
    { email: 1 },
    { unique: true, partialFilterExpression: { email: { $type: "string" } } }
  ).catch(() => {});

  await col.createIndex({ status: 1 }).catch(() => {});
  await col.createIndex({ isPublic: 1 }).catch(() => {});
  await col.createIndex({ publicSupporter: 1 }).catch(() => {});
  await col.createIndex({ city: 1 }).catch(() => {});
  await col.createIndex({ lat: 1, lng: 1 }).catch(() => {});

  return col;
}

export type ChapterIntakeStatus = "new" | "reviewed";

export type ChapterIntakeDoc = {
  _id?: any;

  contactName: string;
  contactEmail: string;
  orgName?: string;

  location?: string;
  interests: string[];
  spaceAvailable?: "yes" | "maybe" | "no";
  spaceNotes?: string;
  notes?: string;

  privacyAccepted: boolean;
  status: ChapterIntakeStatus;

  createdAt: Date;
  reviewedAt?: Date;
};

export async function chapterIntakeCol(): Promise<Collection<ChapterIntakeDoc>> {
  const db = await vogDb();
  const col = db.collection<ChapterIntakeDoc>("chapter_intake");

  await col.createIndex({ status: 1 }).catch(() => {});
  await col.createIndex({ createdAt: -1 }).catch(() => {});
  await col.createIndex({ contactEmail: 1 }).catch(() => {});

  return col;
}

export type MapOverridesDoc = MapOverrides & {
  _id: "default";
  updatedAt?: Date;
};

export async function mapOverridesCol(): Promise<Collection<MapOverridesDoc>> {
  const db = await vogDb();
  return db.collection<MapOverridesDoc>("map_overrides");
}
