import crypto from "node:crypto";

export const VOG_EDB_HANDOFF_COOKIE = "vog_edebatte_handoff";
const HANDOFF_TTL_SECONDS = 90;

type HandoffPayload = {
  iss: "voiceopengov.org";
  aud: "edebatte.org";
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  jti: string;
};

function secret() {
  const value = process.env.VOG_EDB_AUTH_HANDOFF_SECRET?.trim();
  if (!value || value.length < 32) {
    throw new Error("VOG_EDB_AUTH_HANDOFF_SECRET must contain at least 32 characters");
  }
  return value;
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(input: string) {
  return crypto.createHmac("sha256", secret()).update(input).digest("base64url");
}

export function sanitizeHandoffNext(raw?: string | null) {
  if (!raw) return "/";
  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\r\n]/.test(value)) {
    return "/";
  }
  return value;
}

export function createVogEdebatteHandoff(input: {
  memberId: string;
  email: string;
  name: string;
  next?: string | null;
}) {
  const now = Math.floor(Date.now() / 1000);
  const payload: HandoffPayload = {
    iss: "voiceopengov.org",
    aud: "edebatte.org",
    sub: input.memberId,
    email: input.email.trim().toLowerCase(),
    name: input.name.trim() || input.email.trim().toLowerCase(),
    iat: now,
    exp: now + HANDOFF_TTL_SECONDS,
    jti: crypto.randomBytes(24).toString("base64url"),
  };
  const body = encode(JSON.stringify(payload));
  return {
    token: body + "." + sign(body),
    expiresAt: new Date((now + HANDOFF_TTL_SECONDS) * 1000),
    next: sanitizeHandoffNext(input.next),
  };
}
