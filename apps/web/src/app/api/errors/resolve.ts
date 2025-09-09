import { NextRequest } from "next/server";
import { connectDB } from "@/lib/connectDB";
import ErrorLogModel from "@/models/ErrorLog";

export async function POST(req: NextRequest) {
  await connectDB();
  const { traceId, resolved } = await req.json();

  const updated = await ErrorLogModel.findOneAndUpdate(
    { traceId },
    { resolved: Boolean(resolved) },
    { new: true }
  );

  if (!updated) {
    return new Response(JSON.stringify({ error: "Fehler nicht gefunden" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
