import { createHmac, timingSafeEqual } from "crypto";
import { isCheckoutSessionId } from "@/lib/stripeFunding";

type PortalTokenPayload = { customerId: string; checkoutSessionId: string; expiresAt: number };

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createFundingPortalToken(customerId: string, checkoutSessionId: string, secret: string, now = Date.now()) {
  const payload: PortalTokenPayload = { customerId, checkoutSessionId, expiresAt: now + 15 * 60 * 1000 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifyFundingPortalToken(token: unknown, secret: string, now = Date.now()): PortalTokenPayload | null {
  if (typeof token !== "string" || token.length > 900) return null;
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra || !safeEqual(sign(encoded, secret), signature)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as PortalTokenPayload;
    if (!Number.isSafeInteger(payload.expiresAt) || now > payload.expiresAt) return null;
    if (!/^cus_[A-Za-z0-9_]{6,240}$/.test(payload.customerId) || !isCheckoutSessionId(payload.checkoutSessionId)) return null;
    return payload;
  } catch {
    return null;
  }
}
