import { NextResponse } from "next/server";
import { writeEvent } from "@/libs/analytics/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "";
    const ua = req.headers.get("user-agent") ?? "";
    const body = await req.json().catch(() => ({} as any));
    const { type = "pageview", name = "view", path, locale, payload } = body || {};
    await writeEvent({ type, name, path, locale, payload, ip, ua });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/track] error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
