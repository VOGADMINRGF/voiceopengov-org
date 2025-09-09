import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCol } from "@/utils/mongoClient";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const uid = cookies().get("u_id")?.value;
  if (!uid || !ObjectId.isValid(uid)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const city = String(body?.city || "");
  const zip = body?.zip ? String(body.zip) : undefined;
  const country = body?.country ? String(body.country).toUpperCase() : undefined;
  const lat = typeof body?.lat === "number" ? body.lat : undefined;
  const lng = typeof body?.lng === "number" ? body.lng : undefined;
  if (!city) return NextResponse.json({ error: "city required" }, { status: 400 });

  const Users = await getCol<any>("users");
  await Users.updateOne({ _id: new ObjectId(uid) }, { $set: { "profile.location": { city, zip, country, lat, lng }, updatedAt: new Date() } });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("u_loc", "1", { path: "/", sameSite: "lax" });
  return res;
}
