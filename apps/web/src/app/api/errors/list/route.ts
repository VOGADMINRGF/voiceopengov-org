// apps/web/src/app/api/errors/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import ErrorLogModel from "@/models/ErrorLog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const status = searchParams.get("status"); // "open" | "resolved" | null
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

  const filter: any = {};
  if (status === "open") filter.resolved = false;
  if (status === "resolved") filter.resolved = true;
  if (q) {
    filter.$or = [
      { traceId: new RegExp(q, "i") },
      { code: new RegExp(q, "i") },
      { path: new RegExp(q, "i") },
    ];
  }

  const total = await ErrorLogModel.countDocuments(filter);
  const items = await ErrorLogModel.find(filter)
    .sort({ timestamp: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean()
    .exec();

  return NextResponse.json({ items, total, page, pageSize });
}
