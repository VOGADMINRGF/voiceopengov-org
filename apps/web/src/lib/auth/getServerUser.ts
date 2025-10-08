// apps/web/src/lib/auth/getServerUser.ts
export const runtime = "nodejs";

import { getCookie, getHeader } from "@/lib/http/typedCookies";
import { jwtVerify, JWTPayload } from "jose";

export type ServerUser = { id: string; verified?: boolean };

/** Helper: Cookie/Header-Helper können string ODER { value } liefern. */
function toVal(v: unknown): string | undefined {
  if (!v) return undefined;
  return typeof v === "string" ? v : (v as any)?.value;
}

export async function getServerUser(): Promise<ServerUser | null> {
  // --- Dev-Fallback via Header (nur nicht-Prod) ---
  if (process.env.NODE_ENV !== "production") {
    const devId = toVal(await getHeader("x-dev-user-id"));
    if (devId) {
      const devVerified = toVal(await getHeader("x-dev-verified")) === "true";
      return { id: devId, verified: devVerified };
    }
  }

  // --- JWT aus Cookie lesen ---
  const token = toVal(await getCookie("auth_token"));
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    // id aus sub bevorzugen, sonst fallback auf id
    const id = String((payload as JWTPayload & { id?: string }).sub ?? (payload as any).id ?? "");
    if (!id) return null;

    const verified = Boolean((payload as any).verified);
    return { id, verified };
  } catch {
    // ungültig/abgelaufen o.ä.
    return null;
  }
}
