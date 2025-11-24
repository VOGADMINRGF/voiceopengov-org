import { NextRequest, NextResponse } from "next/server";
import { markEventualitySnapshotReviewed } from "@core/eventualities";
import { logger } from "@core/observability/logger";
import { maskUserId } from "@core/pii/redact";
import { getStaffContext, serializeSnapshot } from "../helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const staff = await getStaffContext();
  if (!staff) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  const reviewed = typeof body?.reviewed === "boolean" ? body.reviewed : true;
  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  const snapshot = await markEventualitySnapshotReviewed(
    id,
    reviewed,
    maskUserId(staff.userId),
  );
  if (!snapshot) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  logger.info(
    {
      zone: "PII_ZONES_E150",
      action: "eventualities_mark_reviewed",
      contributionId: id,
      reviewed,
      userIdMasked: maskUserId(staff.userId),
    },
    "Admin toggled eventuality review",
  );

  return NextResponse.json({
    ok: true,
    snapshot: serializeSnapshot(snapshot),
  });
}
