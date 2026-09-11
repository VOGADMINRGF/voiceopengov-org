import { NextRequest, NextResponse } from "next/server";
import { getFunnelSummary } from "@/lib/funnelSummary";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const days = Number(request.nextUrl.searchParams.get("days") || 30);
  const summary = await getFunnelSummary(days);
  return NextResponse.json({ ok: true, data: summary }, {
    headers: { "cache-control": "private, no-store" },
  });
}
