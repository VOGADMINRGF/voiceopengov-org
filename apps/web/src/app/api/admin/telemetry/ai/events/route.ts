// apps/web/src/app/api/admin/telemetry/ai/events/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { recentEvents, summarizeTelemetry } from "@features/ai/telemetry";

export const runtime = "nodejs";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("u_role")?.value === "admin";
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const events = recentEvents(200);
  const summary = summarizeTelemetry(events);

  return NextResponse.json({
    ok: true,
    summary,
    events,
  });
}
