// apps/web/src/app/api/auth/verify/route.ts
import "server-only";
import { NextResponse } from "next/server";
import { getCol } from "@/utils/mongoClient";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const tokens = await getCol("emailTokens");
    const row = await tokens.findOne({ type: "verify", token });
    if (!row) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    if (row.expiresAt && new Date(row.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    const users = await getCol("users");
    await users.updateOne({ _id: new ObjectId(row.userId) }, { $set: { verified: true, updatedAt: new Date() } });
    await tokens.deleteOne({ _id: row._id });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal Error" }, { status: 500 });
  }
}
