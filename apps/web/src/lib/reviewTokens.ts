import { createHash, randomBytes } from "crypto";

const DEFAULT_TTL_HOURS = 72;

function getSecret() {
  return process.env.REVIEW_TOKEN_SECRET || "dev-review-secret";
}

function getTtlHours() {
  const raw = Number(process.env.REVIEW_TOKEN_TTL_HOURS || DEFAULT_TTL_HOURS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TTL_HOURS;
}

export function hashReviewToken(token: string) {
  const secret = getSecret();
  return createHash("sha256").update(`${token}:${secret}`).digest("hex");
}

export function createReviewToken() {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashReviewToken(token);
  const ttlHours = getTtlHours();
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  return { token, tokenHash, expiresAt };
}
