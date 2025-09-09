// apps/web/src/utils/session.ts
import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "session";
const TTL_DAYS = Number(process.env.SESSION_TTL_DAYS ?? 7);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET missing");

function b64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function sign(payload: Record<string, any>) {
  const header = { alg: "HS256", typ: "JWT" };
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(payload));
  const data = `${h}.${p}`;
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(data).digest();
  return `${data}.${b64url(sig)}`;
}

function verify(token: string): any | null {
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) return null;
  const data = `${h}.${p}`;
  const expected = b64url(crypto.createHmac("sha256", JWT_SECRET).update(data).digest());
  if (expected !== s) return null;
  try {
    const obj = JSON.parse(Buffer.from(p, "base64").toString("utf8"));
    if (obj.exp && Date.now() >= obj.exp) return null;
    return obj;
  } catch {
    return null;
  }
}

export type SessionPayload = { uid: string; roles?: string[]; iat: number; exp: number };

export function createSession(uid: string, roles: string[] = []) {
  const now = Date.now();
  const exp = now + TTL_DAYS * 24 * 60 * 60 * 1000;
  const token = sign({ uid, roles, iat: now, exp });
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor((exp - now) / 1000),
  });
  return token;
}

export function readSession(): SessionPayload | null {
  const t = cookies().get(COOKIE_NAME)?.value;
  if (!t) return null;
  return verify(t);
}

export function clearSession() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}
