import { cookies, headers } from "next/headers";
import { jwtVerify } from "jose";

type User = { id: string; verified?: boolean };

export async function getServerUser(): Promise<User | null> {
  // 1) JWT aus Cookie
  const token = cookies().get("auth_token")?.value;
  const secret = process.env.JWT_SECRET;
  if (token && secret) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
      const id = String(payload.sub || payload.id);
      return { id, verified: Boolean(payload.verified) };
    } catch {}
  }
  // 2) Dev-Fallback über Header (nur nicht-Prod)
  if (process.env.NODE_ENV !== "production") {
    const h = headers().get("x-dev-user-id");
    if (h) return { id: h, verified: headers().get("x-dev-verified") === "true" };
  }
  return null;
}
