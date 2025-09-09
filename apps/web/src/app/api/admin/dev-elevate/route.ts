import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCol } from "@/utils/mongoClient";
import { ObjectId } from "mongodb";

export async function POST() {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const uid = cookies().get("u_id")?.value;
  if (!uid || !ObjectId.isValid(uid)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const Users = await getCol<any>("users");
  await Users.updateOne({ _id: new ObjectId(uid) }, { $set: { role: "admin", updatedAt: new Date() } });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("u_role", "admin", { path: "/", sameSite: "lax" });
  return res;
}
