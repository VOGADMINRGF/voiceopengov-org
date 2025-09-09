// apps/web/src/app/api/admin/settings/save/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/utils/mongoClient";

function isAdmin() { return cookies().get("u_role")?.value === "admin"; }
type Patch = Partial<{ requireLocation:boolean; requireEmailVerified:boolean; require2FAForReports:boolean }>;

export async function POST(req: Request) {
  if (!isAdmin()) return NextResponse.json({ error:"unauthorized" }, { status:401 });
  const patch: Patch = await req.json().catch(()=> ({}));
  const db = await getDb(); const col = db.collection("settings");
  const current = (await col.findOne({ _id:"global" }))?.onboardingFlags ?? {};
  const next = { ...current, ...patch };
  await col.updateOne({ _id:"global" }, { $set:{ onboardingFlags: next } }, { upsert:true });
  return NextResponse.json({ ok:true, settings: next });
}
