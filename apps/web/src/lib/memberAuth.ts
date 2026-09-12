import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { MongoClient, type Collection, type Db } from "mongodb";

export const MEMBER_SESSION_COOKIE = "vog_member_session";
export const MEMBER_SESSION_MAX_AGE_SECONDS = sessionTtlSeconds();

const PASSWORD_SETUP_TTL_MS = 2 * 60 * 60 * 1000;
const DEFAULT_BCRYPT_ROUNDS = 11;
// A valid hash keeps the negative login path close to the positive path and
// makes response timing less useful for discovering registered addresses.
const DUMMY_PASSWORD_HASH = "$2b$11$lMY7cHS6PMjDzjbE6OKdrONf4y.Zfw20zUIwERXkwwaaaPQqY3nkO";

export type PasswordValidation =
  | { ok: true }
  | { ok: false; error: "password_too_short" | "password_too_long" | "password_needs_number" | "password_needs_special" };

type MemberCredentialDoc = {
  memberId: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

type MemberSessionDoc = {
  tokenHash: string;
  memberId: string;
  createdAt: Date;
  expiresAt: Date;
};

type PasswordSetupDoc = {
  tokenHash: string;
  memberId: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date;
};

type AuthGlobal = typeof globalThis & {
  __vogPiiClientPromise?: Promise<MongoClient>;
  __vogAuthIndexesPromise?: Promise<void>;
};

const authGlobal = globalThis as AuthGlobal;

function requiredMongoUri() {
  const uri = process.env.PII_MONGODB_URI ||
    (process.env.NODE_ENV === "production" ? undefined : process.env.MONGODB_URI);
  if (!uri) throw new Error("PII_MONGODB_URI is not set");
  return uri;
}

function authDbName() {
  return process.env.PII_DB_NAME || "vog_pii";
}

function bcryptRounds() {
  const parsed = Number.parseInt(process.env.BCRYPT_ROUNDS || "", 10);
  if (!Number.isFinite(parsed)) return DEFAULT_BCRYPT_ROUNDS;
  return Math.min(14, Math.max(10, parsed));
}

function sessionTtlSeconds() {
  const parsedDays = Number.parseInt(process.env.SESSION_TTL_DAYS || "", 10);
  const days = Number.isFinite(parsedDays) ? Math.min(90, Math.max(1, parsedDays)) : 7;
  return days * 24 * 60 * 60;
}

function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function normalizeMemberEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateMemberPassword(password: string): PasswordValidation {
  if (password.length < 12) return { ok: false, error: "password_too_short" };
  if (password.length > 128) return { ok: false, error: "password_too_long" };
  if (!/\d/.test(password)) return { ok: false, error: "password_needs_number" };
  if (!/[^A-Za-z0-9]/.test(password)) return { ok: false, error: "password_needs_special" };
  return { ok: true };
}

async function authDb(): Promise<Db> {
  if (!authGlobal.__vogPiiClientPromise) {
    const client = new MongoClient(requiredMongoUri());
    authGlobal.__vogPiiClientPromise = client.connect();
  }
  const client = await authGlobal.__vogPiiClientPromise;
  return client.db(authDbName());
}

async function collections(): Promise<{
  credentials: Collection<MemberCredentialDoc>;
  sessions: Collection<MemberSessionDoc>;
  passwordSetup: Collection<PasswordSetupDoc>;
}> {
  const db = await authDb();
  const credentials = db.collection<MemberCredentialDoc>("member_credentials");
  const sessions = db.collection<MemberSessionDoc>("member_sessions");
  const passwordSetup = db.collection<PasswordSetupDoc>("member_password_setup_tokens");

  if (!authGlobal.__vogAuthIndexesPromise) {
    authGlobal.__vogAuthIndexesPromise = (async () => {
      await Promise.all([
        credentials.createIndex({ email: 1 }, { unique: true }),
        credentials.createIndex({ memberId: 1 }, { unique: true }),
        sessions.createIndex({ tokenHash: 1 }, { unique: true }),
        sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
        sessions.createIndex({ memberId: 1 }),
        passwordSetup.createIndex({ tokenHash: 1 }, { unique: true }),
        passwordSetup.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
        passwordSetup.createIndex({ memberId: 1 }),
      ]).then(() => undefined);
    })().catch((error) => {
      authGlobal.__vogAuthIndexesPromise = undefined;
      throw error;
    });
  }
  await authGlobal.__vogAuthIndexesPromise;

  return { credentials, sessions, passwordSetup };
}

export async function hasMemberCredential(email: string) {
  const { credentials } = await collections();
  const existing = await credentials.findOne(
    { email: normalizeMemberEmail(email) },
    { projection: { _id: 1 } },
  );
  return Boolean(existing);
}

export async function setMemberPassword(memberId: string, email: string, password: string) {
  const validation = validateMemberPassword(password);
  if ("error" in validation) throw new Error(validation.error);

  const { credentials } = await collections();
  const normalizedEmail = normalizeMemberEmail(email);
  const passwordHash = await bcrypt.hash(password, bcryptRounds());
  const now = new Date();

  await credentials.updateOne(
    { memberId },
    {
      $set: { email: normalizedEmail, passwordHash, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
}

export async function verifyMemberCredential(email: string, password: string) {
  const { credentials } = await collections();
  const credential = await credentials.findOne({ email: normalizeMemberEmail(email) });
  const ok = await bcrypt.compare(password, credential?.passwordHash || DUMMY_PASSWORD_HASH);
  if (!credential?.passwordHash) return { ok: false as const };
  if (!ok) return { ok: false as const };
  return { ok: true as const, memberId: credential.memberId };
}

export async function createMemberSession(memberId: string) {
  const { sessions } = await collections();
  const token = crypto.randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + MEMBER_SESSION_MAX_AGE_SECONDS * 1000);

  await sessions.insertOne({
    tokenHash: hashToken(token),
    memberId,
    createdAt: now,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function resolveMemberSession(rawToken: string | undefined) {
  if (!rawToken) return null;
  const { sessions } = await collections();
  const session = await sessions.findOne({ tokenHash: hashToken(rawToken) });
  if (!session || session.expiresAt.getTime() <= Date.now()) return null;
  return { memberId: session.memberId, expiresAt: session.expiresAt };
}

export async function revokeMemberSession(rawToken: string | undefined) {
  if (!rawToken) return;
  const { sessions } = await collections();
  await sessions.deleteOne({ tokenHash: hashToken(rawToken) });
}

export async function revokeAllMemberSessions(memberId: string) {
  const { sessions } = await collections();
  await sessions.deleteMany({ memberId });
}

export async function createPasswordSetupToken(memberId: string) {
  const { passwordSetup } = await collections();
  const token = crypto.randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + PASSWORD_SETUP_TTL_MS);

  await passwordSetup.deleteMany({ memberId, usedAt: { $exists: false } });
  await passwordSetup.insertOne({
    tokenHash: hashToken(token),
    memberId,
    createdAt: now,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function consumePasswordSetupToken(rawToken: string) {
  const { passwordSetup } = await collections();
  const now = new Date();
  const tokenHash = hashToken(rawToken);
  const token = await passwordSetup.findOne({
    tokenHash,
    usedAt: { $exists: false },
    expiresAt: { $gt: now },
  });
  if (!token) return null;

  const result = await passwordSetup.updateOne(
    { tokenHash, usedAt: { $exists: false } },
    { $set: { usedAt: now } },
  );
  if (result.modifiedCount !== 1) return null;
  return { memberId: token.memberId };
}
