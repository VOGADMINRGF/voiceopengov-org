export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { redisPing } from "@/utils/redisPing";

export async function GET() {
  const r = await redisPing();
  return NextResponse.json(r, { status: r.ok ? 200 : 500 });
}
