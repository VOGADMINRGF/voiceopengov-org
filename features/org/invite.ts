import crypto from "node:crypto";

export function hashInviteToken(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function createInviteToken() {
  const raw = crypto.randomBytes(24).toString("hex");
  const tokenHash = hashInviteToken(raw);
  return { raw, tokenHash };
}
