import { NextRequest, NextResponse } from "next/server";
import { publishVoteDraft } from "@features/feeds/publishVoteDraft";
import { isStaffRequest } from "../../../utils";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!isStaffRequest(req)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const result = await publishVoteDraft(id);
  if (!result.ok) {
    const status = result.error === "draft_not_found" ? 404 : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
