// apps/web/src/app/api/errors/resolve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/connectDB";
import ErrorLogModel from "@/models/ErrorLog";

export async function POST(req: NextRequest) {
  try {
    const { _id, traceId, resolved } = await req.json();

    if (typeof resolved !== "boolean") {
      return NextResponse.json({ error: "resolved must be boolean" }, { status: 400 });
    }

    await connectDB();

    const filter =
      _id ? { _id } :
      traceId ? { traceId } :
      null;

    if (!filter) {
      return NextResponse.json({ error: "Missing _id or traceId" }, { status: 400 });
    }

    const doc = await ErrorLogModel
      .findOneAndUpdate(filter, { $set: { resolved } }, { new: true })
      .lean();

    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Seite im App Router neu validieren
    revalidatePath("/admin/errors");

    return NextResponse.json({ ok: true, doc });
  } catch (err) {
    console.error("[api/errors/resolve]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
