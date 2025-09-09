import { NextResponse } from "next/server";
import { readSession } from "@/utils/session";
import { getCol } from "@/utils/mongoClient";

export const runtime = "nodejs";

export async function GET() {
  const sess = readSession();
  if (!sess) return NextResponse.json({ user: null });
  const users = await getCol("users");
  const doc = await users.findOne({ _id: (await import("mongodb")).ObjectId.createFromHexString(sess.uid) }, { projection: { passwordHash: 0 } });
  if (!doc) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: String(doc._id), email: doc.email, name: doc.name, roles: doc.roles ?? ["user"] } });
}
