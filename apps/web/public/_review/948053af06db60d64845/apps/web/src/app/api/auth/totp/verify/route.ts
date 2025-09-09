import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCol } from "@/utils/mongoClient";
import { ObjectId } from "mongodb";
import { authenticator } from "otplib";

export async function POST(req: NextRequest) {
  const uid = cookies().get("u_id")?.value;
  if (!uid || !ObjectId.isValid(uid)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { code } = await req.json().catch(() => ({}));
  if (!code) return NextResponse.json({ error: "code_required" }, { status: 400 });

  const Users = await getCol<any>("users");
  const u = await Users.findOne({ _id: new ObjectId(uid) }, { projection: { verification: 1, role: 1 } });
  const secret = u?.verification?.twoFA?.temp;
  if (!secret) return NextResponse.json({ error: "no_pending_2fa" }, { status: 400 });

  const ok = authenticator.check(String(code), String(secret));
  if (!ok) return NextResponse.json({ error: "invalid_code" }, { status: 400 });

  await Users.updateOne(
    { _id: new ObjectId(uid) },
    {
      $set: {
        "verification.twoFA.enabled": true,
        "verification.twoFA.method": "totp",
        role: "verified",
        updatedAt: new Date()
      },
      $unset: { "verification.twoFA.temp": "" }
    }
  );

  const res = NextResponse.json({ ok: true });
  res.cookies.set("u_role", "verified", { path: "/", sameSite: "lax" });
  res.cookies.set("u_verified", "1", { path: "/", sameSite: "lax" });
  return res;
}
