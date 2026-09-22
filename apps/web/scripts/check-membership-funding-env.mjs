#!/usr/bin/env node

const PLACEHOLDER = /^(?:__.*__|change-?me|replace-?me|example|todo)$/i;

export const PROFILES = {
  membership: [
    "PUBLIC_BASE_URL",
    "MONGODB_URI",
    "VOG_DB_NAME",
    "PII_MONGODB_URI",
    "PII_DB_NAME",
    "VOG_EDB_AUTH_HANDOFF_SECRET",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "MAIL_FROM",
    "VOG_ADMIN_USER",
    "VOG_ADMIN_PASSWORD",
  ],
  funding: [
    "PUBLIC_BASE_URL",
    "MONGODB_URI",
    "VOG_DB_NAME",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "VOG_SUPPORT_SESSION_SECRET",
    "VOG_PAYMENT_BANK_RECIPIENT",
    "VOG_PAYMENT_BANK_IBAN",
  ],
};

function value(environment, name) {
  const candidate = environment[name]?.trim();
  return candidate && !PLACEHOLDER.test(candidate) ? candidate : undefined;
}

function isHttpsUrl(candidate) {
  try {
    return new URL(candidate).protocol === "https:";
  } catch {
    return false;
  }
}

function mongoHost(candidate) {
  if (!candidate) return undefined;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "mongodb:" && parsed.protocol !== "mongodb+srv:") return undefined;
    return parsed.hostname.toLowerCase() || undefined;
  } catch {
    return undefined;
  }
}

export function validateProductionEnvironment(environment, profile = "full") {
  const selected = profile === "full"
    ? [...new Set([...PROFILES.membership, ...PROFILES.funding])]
    : PROFILES[profile];
  if (!selected) return { ok: false, errors: [`Unknown profile: ${profile}`] };

  const errors = selected
    .filter((name) => !value(environment, name))
    .map((name) => `Missing production value: ${name}`);

  const baseUrl = value(environment, "PUBLIC_BASE_URL");
  if (baseUrl && !isHttpsUrl(baseUrl)) errors.push("PUBLIC_BASE_URL must be an HTTPS URL");

  const publicDb = value(environment, "VOG_DB_NAME");
  const piiDb = value(environment, "PII_DB_NAME");
  if (publicDb && piiDb && publicDb === piiDb) {
    errors.push("VOG_DB_NAME and PII_DB_NAME must be different databases");
  }

  const publicMongoUri = value(environment, "MONGODB_URI");
  const piiMongoUri = value(environment, "PII_MONGODB_URI");
  const publicMongoHost = mongoHost(publicMongoUri);
  const piiMongoHost = mongoHost(piiMongoUri);
  if (publicMongoUri && !publicMongoHost) {
    errors.push("MONGODB_URI must be a valid mongodb:// or mongodb+srv:// URI");
  }
  if (piiMongoUri && !piiMongoHost) {
    errors.push("PII_MONGODB_URI must be a valid mongodb:// or mongodb+srv:// URI");
  }
  if (publicMongoHost && piiMongoHost && publicMongoHost === piiMongoHost) {
    errors.push("MONGODB_URI and PII_MONGODB_URI must use different production cluster hosts");
  }

  const handoffSecret = value(environment, "VOG_EDB_AUTH_HANDOFF_SECRET");
  if (handoffSecret && handoffSecret.length < 32) {
    errors.push("VOG_EDB_AUTH_HANDOFF_SECRET must contain at least 32 characters");
  }

  const adminPassword = value(environment, "VOG_ADMIN_PASSWORD");
  if (adminPassword && adminPassword.length < 24) {
    errors.push("VOG_ADMIN_PASSWORD must contain at least 24 characters");
  }

  const supportSecret = value(environment, "VOG_SUPPORT_SESSION_SECRET");
  if (supportSecret && supportSecret.length < 32) {
    errors.push("VOG_SUPPORT_SESSION_SECRET must contain at least 32 characters");
  }

  const stripeKey = value(environment, "STRIPE_SECRET_KEY");
  if (stripeKey && !/^sk_(?:test|live)_/.test(stripeKey)) {
    errors.push("STRIPE_SECRET_KEY has an unexpected format");
  }
  const webhookSecret = value(environment, "STRIPE_WEBHOOK_SECRET");
  if (webhookSecret && !webhookSecret.startsWith("whsec_")) {
    errors.push("STRIPE_WEBHOOK_SECRET has an unexpected format");
  }

  return { ok: errors.length === 0, errors };
}

function requestedProfile(argv) {
  const argument = argv.find((item) => item.startsWith("--profile="));
  return argument?.slice("--profile=".length) || "full";
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const profile = requestedProfile(process.argv.slice(2));
  const result = validateProductionEnvironment(process.env, profile);
  if (!result.ok) {
    console.error(`VoiceOpenGov ${profile} readiness: FAILED`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`VoiceOpenGov ${profile} readiness: OK`);
  }
}
