import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";

export type ConfirmedVogIdentity = {
  externalMemberId: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  participationMode: "active" | "member";
  locale?: string;
  address: {
    street: string;
    houseNumber: string;
    line2?: string;
    postalCode: string;
    city: string;
    country: string;
  };
};

type ProvisioningResult = {
  userId: string;
  created: boolean;
};

let coreClient: MongoClient | null = null;
let piiClient: MongoClient | null = null;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

async function coreDb() {
  const uri = requiredEnv("CORE_MONGODB_URI");
  const dbName = requiredEnv("CORE_DB_NAME");
  coreClient = coreClient ?? new MongoClient(uri);
  await coreClient.connect();
  return coreClient.db(dbName);
}

async function piiDb() {
  const uri = requiredEnv("PII_MONGODB_URI");
  const dbName = requiredEnv("PII_DB_NAME");
  piiClient = piiClient ?? new MongoClient(uri);
  await piiClient.connect();
  return piiClient.db(dbName);
}

export async function provisionConfirmedVogMember(
  identity: ConfirmedVogIdentity,
): Promise<ProvisioningResult> {
  const email = identity.email.trim().toLowerCase();
  const displayName = `${identity.firstName} ${identity.lastName}`.trim();
  const now = new Date();
  const core = await coreDb();
  const users = core.collection("users");

  let existing = await users.findOne(
    { $or: [{ email }, { email_lc: email }] },
    { projection: { _id: 1 } },
  );

  let created = false;
  if (!existing?._id) {
    const inserted = await users.insertOne({
      email,
      email_lc: email,
      name: displayName,
      role: "user",
      verifiedEmail: true,
      emailVerified: true,
      accessTier: "citizenBasic",
      profile: {
        displayName,
        locale: identity.locale ?? "de",
        onboarding: {
          source: "voiceopengov",
          registeredAt: now,
        },
      },
      settings: {
        preferredLocale: identity.locale ?? "de",
      },
      verification: {
        level: "none",
        methods: ["email"],
        lastVerifiedAt: now,
        preferredRegionCode: null,
      },
      membership: {
        status: "active",
        source: "voiceopengov",
        externalMemberId: identity.externalMemberId,
        participationMode: identity.participationMode,
        confirmedAt: now,
        syncedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    });
    existing = { _id: inserted.insertedId };
    created = true;
  } else {
    await users.updateOne(
      { _id: existing._id },
      {
        $set: {
          email,
          email_lc: email,
          verifiedEmail: true,
          emailVerified: true,
          "membership.status": "active",
          "membership.source": "voiceopengov",
          "membership.externalMemberId": identity.externalMemberId,
          "membership.participationMode": identity.participationMode,
          "membership.confirmedAt": now,
          "membership.syncedAt": now,
          updatedAt: now,
        },
      },
    );
  }

  const userId =
    existing._id instanceof ObjectId
      ? existing._id
      : new ObjectId(String(existing._id));

  const pii = await piiDb();
  const profiles = pii.collection("user_profiles");
  const street = [
    identity.address.street,
    identity.address.houseNumber,
    identity.address.line2,
  ]
    .filter(Boolean)
    .join(" ");

  await profiles.updateOne(
    { userId },
    {
      $set: {
        userId,
        "contacts.emailPrimary": email,
        "personal.givenName": identity.firstName,
        "personal.familyName": identity.lastName,
        "personal.fullName": displayName,
        "personal.birthDate": identity.birthDate,
        "address.street": street,
        "address.postalCode": identity.address.postalCode,
        "address.city": identity.address.city,
        "address.country": identity.address.country,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
        username: `uid-${userId.toHexString()}`,
      },
    },
    { upsert: true },
  );

  return { userId: String(userId), created };
}

export async function initializeEdebateCredentialFromVogPassword(opts: {
  userId: string;
  email: string;
  password: string;
}) {
  if (!ObjectId.isValid(opts.userId)) {
    return { ok: false as const, reason: "invalid_user_id" as const };
  }

  const pii = await piiDb();
  const credentials = pii.collection("user_credentials");
  const coreUserId = new ObjectId(opts.userId);
  const existing = await credentials.findOne(
    { coreUserId },
    { projection: { passwordHash: 1 } },
  );

  if (existing?.passwordHash) {
    return { ok: true as const, created: false as const, preservedExistingCredential: true as const };
  }

  const rounds = Math.min(14, Math.max(10, Number.parseInt(process.env.BCRYPT_ROUNDS || "12", 10) || 12));
  const passwordHash = await bcrypt.hash(opts.password, rounds);
  const now = new Date();
  await credentials.updateOne(
    { coreUserId },
    {
      $set: {
        coreUserId,
        email: opts.email.trim().toLowerCase(),
        passwordHash,
        twoFactorEnabled: false,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  return { ok: true as const, created: true as const, preservedExistingCredential: false as const };
}
