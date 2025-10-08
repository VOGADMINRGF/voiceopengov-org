// apps/web/src/app/api/admin/settings/get/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@core/db/triMongo";

async function isAdmin() {
  const c = await cookies();
  return c.get("u_role")?.value === "admin";
}

const DEFAULTS = {
  requireLocation: true,
  requireEmailVerified: true,
  require2FAForReports: false,
};

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const db = await getDb();
  const doc = await db.collection("settings").findOne({ _id: "global" });
  const settings = doc?.onboardingFlags ?? DEFAULTS;
  return NextResponse.json({ settings });
}
