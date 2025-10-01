import { NextRequest, NextResponse } from "next/server";
import ErrorLogModel from "@/models/ErrorLog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const status = (searchParams.get("status") || "all") as "all" | "open" | "resolved";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));

  const filter: any = {};
  if (status === "open") filter.resolved = false;
  if (status === "resolved") filter.resolved = true;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ traceId: rx }, { code: rx }, { path: rx }];
  }

  const total = await ErrorLogModel.countDocuments(filter);
  const itemsRaw = await ErrorLogModel.find(
    filter,
    { traceId: 1, code: 1, path: 1, status: 1, resolved: 1, timestamp: 1 }
  )
    .sort({ timestamp: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  const items = itemsRaw.map((d: any) => ({
    _id: String(d._id),
    traceId: String(d.traceId ?? ""),
    code: d.code ?? "",
    path: d.path ?? "",
    status: typeof d.status === "number" ? d.status : undefined,
    resolved: Boolean(d.resolved),
    timestamp: d.timestamp ? new Date(d.timestamp).toISOString() : undefined,
  }));

  return NextResponse.json({ ok: true, page, pageSize, total, items });
}
