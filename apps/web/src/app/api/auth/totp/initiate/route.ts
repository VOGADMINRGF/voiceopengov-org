import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCol } from "@/utils/mongoClient";
import { ObjectId } from "mongodb";
import { authenticator } from "otplib";
import { publicHost } from "@/utils/publicOrigin";

export async function POST() {
  const uid = cookies().get("u_id")?.value;
  if (!uid || !ObjectId.isValid(uid)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const Users = await getCol<any>("users");
  const user = await Users.findOne({ _id: new ObjectId(uid) }, { projection: { email: 1 } });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const secret = authenticator.generateSecret();
  const issuer = encodeURIComponent("VoiceOpenGov");
  const label = encodeURIComponent(`${publicHost()}:${user.email}`);
  const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}&digits=6&period=30`;

  await Users.updateOne({ _id: new ObjectId(uid) }, { $set: { "verification.twoFA.temp": secret, updatedAt: new Date() } });
  return NextResponse.json({ ok: true, otpauth });
}
