import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashReviewToken } from "@/lib/reviewTokens";
import { findReviewTarget } from "@/lib/review/lookup";
import { getMongoDb } from "@/lib/db/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ReviewSchema = z.object({
  token: z.string().min(10),
});

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = ReviewSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const tokenHash = hashReviewToken(parsed.data.token);
  const target = await findReviewTarget(tokenHash);
  if (!target) {
    return NextResponse.json({ ok: false, error: "invalid_or_expired" }, { status: 404 });
  }

  const db = await getMongoDb();
  const now = new Date();

  if (target.type === "supporter") {
    const result = await db.collection("supporters_pii").updateOne(
      { _id: target.doc._id, status: "pending", reviewTokenHash: tokenHash },
      {
        $set: { status: "approved", approvedAt: now },
        $unset: { reviewTokenHash: "", reviewTokenExpiresAt: "" },
      },
    );
    return NextResponse.json({
      ok: true,
      status: result.modifiedCount ? "approved" : "noop",
    });
  }

  const result = await db.collection("initiative_intake").updateOne(
    { _id: target.doc._id, status: "new", reviewTokenHash: tokenHash },
    {
      $set: { status: "reviewed", reviewedAt: now },
      $unset: { reviewTokenHash: "", reviewTokenExpiresAt: "" },
    },
  );
  return NextResponse.json({
    ok: true,
    status: result.modifiedCount ? "reviewed" : "noop",
  });
}
