// apps/web/src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { canViewRouteEdge } from "@features/access/checkRouteAccessEdge";
import { matchRoute } from "@features/access/routeMatchers";
import type { AccessUser } from "@features/access/types";
import type { AccessTier } from "@features/pricing/types";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Statics und Next-Interna durchlassen
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/static")) {
    return allowNext();
  }

  // Nur /api/* prüfen
  if (!pathname.startsWith("/api")) {
    return allowNext();
  }

  // Auth-Endpoints immer durchlassen
  if (pathname.startsWith("/api/auth")) {
    return allowNext();
  }

  const routeId = matchRoute(pathname);
  if (!routeId) {
    return allowNext();
  }

  const user = extractUser(req);
  const decision = canViewRouteEdge(routeId, user);

  if (decision.allowed) {
    return allowNext();
  }

  if (decision.requireLogin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

function allowNext() {
  return (NextResponse as any).next();
}

function extractUser(req: NextRequest): AccessUser | null {
  const userId = req.cookies.get("u_id")?.value;
  if (!userId) return null;
  const tier = req.cookies.get("u_tier")?.value as AccessTier | undefined;
  const primaryRole = req.cookies.get("u_role")?.value;
  const groupsCookie = req.cookies.get("u_groups")?.value;
  const groups = groupsCookie ? (groupsCookie.split(",").map((s) => s.trim()).filter(Boolean) as AccessUser["groups"]) : [];
  const roles = primaryRole ? [primaryRole] : undefined;

  return {
    id: userId,
    accessTier: tier ?? null,
    roles,
    groups: groups ?? [],
  };
}

// Nur echte Seiten, keine statics
export const config = {
  matcher: ["/api/:path*"],
};
