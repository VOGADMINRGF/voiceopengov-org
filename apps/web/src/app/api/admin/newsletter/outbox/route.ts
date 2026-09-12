import { NextRequest, NextResponse } from "next/server";
import { getNewsletterOutboxSummary, NEWSLETTER_OUTBOX_EXPORT_MODE, reconcileNewsletterOutbox } from "@/lib/newsletterOutbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, exportMode: NEWSLETTER_OUTBOX_EXPORT_MODE, data: await getNewsletterOutboxSummary() }, {
    headers: { "cache-control": "private, no-store" },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { action?: unknown; limit?: unknown } | null;
  if (body?.action !== "reconcile") return NextResponse.json({ ok: false, error: "invalid_action" }, { status: 400 });
  const limit = typeof body.limit === "number" ? body.limit : 100;
  return NextResponse.json({ ok: true, data: await reconcileNewsletterOutbox(limit) }, {
    headers: { "cache-control": "private, no-store" },
  });
}
