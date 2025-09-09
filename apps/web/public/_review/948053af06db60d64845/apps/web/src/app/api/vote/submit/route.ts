// apps/web/src/app/api/votes/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Vote from "@/models/Vote";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { statementId, vote, userHash, region, device } = await req.json();

  if (!statementId || !vote || !userHash) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    // Nur ein Vote je statementId/userHash-Kombi
    await Vote.findOneAndUpdate(
      { statementId, userHash },
      { $set: { vote, region, device, createdAt: new Date() } },
      { upsert: true, new: true }
    );
    // Optional: Aggregation direkt mitschicken, damit Frontend nicht neu laden muss
    const votes = await Vote.aggregate([
      { $match: { statementId } },
      { $group: { _id: "$vote", count: { $sum: 1 } } }
    ]);
    const summary = { agree: 0, neutral: 0, disagree: 0 };
    votes.forEach(v => { summary[v._id] = v.count; });

    return NextResponse.json({ success: true, summary });
  } catch (err) {
    return NextResponse.json({ error: "Database error.", details: err.message }, { status: 500 });
  }
}
