import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    // TODO: Persist ContributionBundle; for now, acknowledge receipt.
    const id = body?.id ?? `draft-${randomUUID()}`;
    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Finalize failed" },
      { status: 500 },
    );
  }
}
