import { NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });

  const col = await membersCol();
  const now = new Date();

  const member = await col.findOne({ doiToken: token });
  if (!member) return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 400 });

  if (member.doiExpiresAt && member.doiExpiresAt < now) {
    return NextResponse.json({ ok: false, error: "token_expired" }, { status: 400 });
  }

  await col.updateOne(
    { _id: member._id },
    { $set: { status: "active", confirmedAt: now }, $unset: { doiToken: "", doiExpiresAt: "" } }
  );

  const base = process.env.PUBLIC_BASE_URL || "http://localhost:3000";
  return NextResponse.redirect(`${base}/?confirmed=1`);
}
