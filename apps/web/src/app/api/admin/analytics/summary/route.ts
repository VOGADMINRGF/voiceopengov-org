import { NextResponse } from "next/server";
import { getFunnelSummary } from "@/lib/funnelSummary";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, data: await getFunnelSummary(30) }, {
    headers: { "cache-control": "private, no-store" },
  });
}
