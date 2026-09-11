import { MongoClient, Db, Collection } from "mongodb";
import type { MapOverrides } from "@/config/mapOverrides.default";
import {
  REGIONAL_INTEREST_COLLECTION,
  REGIONAL_INTEREST_SOURCE_PATH,
  type RegionalInterestIntent,
  type RegionalInterestStatus,
} from "@/lib/regionalInterestContract";

let _client: MongoClient | null = null;
let _db: Db | null = null;

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

/**
 * Use the same Atlas cluster as eDebatte if required, but keep VoiceOpenGov
 * data logically separated by database and collection.
 *
 * Required: MONGODB_URI
 * Optional: VOG_DB_NAME (default: vog_public)
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
  birthDate?: string;
  orgName?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  isPublic: boolean;
  avatarUrl?: string;
  publicSupporter?: boolean;
  supporterImageUrl?: string;
  supporterNote?: string;
  wantsNewsletter: boolean;
  wantsNewsletterEdDebatte?: boolean;
  status: MemberStatus;
  doiToken?: string;
  doiTokenHash?: string;
  doiExpiresAt?: Date;
  doiSentAt?: Date;
  locale?: string;
  acquisition?: {
    landingPath?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
  confirmedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
};

export type FunnelEventName =
  | "landing_viewed"
  | "form_started"
  | "registration_submitted"
  | "doi_sent"
  | "membership_confirmed"
  | "funding_started"
  | "payment_succeeded";

export type FunnelEventDoc = {
  _id?: any;
  event: FunnelEventName;
  occurredAt: Date;
  expiresAt: Date;
  sessionHash?: string;
  memberId?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  country?: string;
  locale?: string;
  landingPath?: string;
};

export async function funnelEventsCol(): Promise<Collection<FunnelEventDoc>> {
  const db = await vogDb();
  const col = db.collection<FunnelEventDoc>("membership_funnel_events");
  await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});
  await col.createIndex({ event: 1, occurredAt: -1 }).catch(() => {});
  await col.createIndex({ campaign: 1, occurredAt: -1 }).catch(() => {});
  await col.createIndex({ locale: 1, country: 1, occurredAt: -1 }).catch(() => {});
  return col;
}

export async function membersCol(): Promise<Collection<MemberDoc>> {
  const db = await vogDb();
  const col = db.collection<MemberDoc>("members");

  await col
    .createIndex(
      { email: 1 },
      {
        unique: true,
        partialFilterExpression: { email: { $type: "string" } },
      },
    )
    .catch(() => {});
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

export type RegionalInterestDoc = {
  _id?: any;
  contactName: string;
  contactEmail: string;
  location: string;
  topic?: string;
  intents: RegionalInterestIntent[];
  notes?: string;
  contactConsent: true;
  matchingConsent: boolean;
  privacyAccepted: true;
  status: RegionalInterestStatus;
  sourcePath: typeof REGIONAL_INTEREST_SOURCE_PATH;
  createdAt: Date;
  reviewedAt?: Date;
  matchedAt?: Date;
  closedAt?: Date;
};

export async function regionalInterestCol(): Promise<
  Collection<RegionalInterestDoc>
> {
  const db = await vogDb();
  const col = db.collection<RegionalInterestDoc>(REGIONAL_INTEREST_COLLECTION);

  await col.createIndex({ status: 1, createdAt: -1 }).catch(() => {});
  await col.createIndex({ location: 1, status: 1 }).catch(() => {});
  await col
    .createIndex({ contactEmail: 1, createdAt: -1 })
    .catch(() => {});
  await col.createIndex({ intents: 1 }).catch(() => {});

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
