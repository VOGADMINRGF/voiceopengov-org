export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getCol } from "@/utils/mongoClient";
import { piiCol } from "@/utils/triMongo";
import { sendMail } from "@/utils/mailer";

// gleiche Policy wie im Client
const PWD_OK = (p: string) =>
  p.length >= 12 && /[0-9]/.test(p) && /[!@#$%^&*()_\-+\=\[\]{};:,.?~]/.test(p);

// simple scrypt-Hash (falls du schon eine eigene Hash-Logik hast, kannst du
// diesen Block ersetzen – wichtig ist nur der Verify-Token-Teil unten)
function hashPassword(pw: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(pw, salt, 64).toString("hex");
  return { algo: "scrypt", salt, hash };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || "").trim().toLowerCase();
  const name  = String(body?.name || "").trim() || null;
  const pw    = String(body?.password || "");

  if (!email || !pw) {
    return NextResponse.json({ error: "email_password_required" }, { status: 400 });
  }
  if (!PWD_OK(pw)) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }

  const Users = await getCol<any>("users");
  const existing = await Users.findOne({ email }, { projection: { _id: 1, verifiedEmail: 1 } });
  if (existing && existing.verifiedEmail) {
    return NextResponse.json({ error: "email_in_use" }, { status: 409 });
  }

  const now = new Date();
  let userId = existing?._id;

  if (!userId) {
    const { hash, salt, algo } = hashPassword(pw);
    const ins = await Users.insertOne({
      email,
      name,
      passwordHash: { algo, salt, hash },
      role: "user",
      verifiedEmail: false,
      createdAt: now,
      updatedAt: now,
    });
    userId = ins.insertedId;
  } else {
    // User existiert aber noch nicht verifiziert → Passwort ggf. aktualisieren
    const { hash, salt, algo } = hashPassword(pw);
    await Users.updateOne(
      { _id: userId },
      { $set: { passwordHash: { algo, salt, hash }, updatedAt: now } }
    );
  }

  // 🔑 Verify-Token erzeugen
  const Tokens = await piiCol<any>("tokens");
  const token = crypto.randomBytes(24).toString("base64url");
  const exp   = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48h

  await Tokens.insertOne({
    type: "verify_email",
    userId,
    email,
    token,
    createdAt: now,
    expiresAt: exp,
  });

  const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
  const verifyUrl = new URL(
    `/verify?email=${encodeURIComponent(email)}&token=${token}`,
    base
  ).toString();

  // ✉️ Mail schicken oder im Dev loggen
  await sendMail({
    to: email,
    subject: "Bitte E-Mail verifizieren",
    html: `<p>Hallo${name ? " " + name : ""},</p>
           <p>bitte bestätige deine E-Mail-Adresse:</p>
           <p><a href="${verifyUrl}">${verifyUrl}</a></p>
           <p>Gültig bis: ${exp.toLocaleString()}</p>`,
  });

  // Für deine UI (die 'verifyUrl' auswertet)
  const res = NextResponse.json({ ok: true, verifyUrl }, { status: 201 });
  // Optional: leichtgewichtige Session-Cookies (kein httpOnly), damit Middleware/Pages sie lesen können
  res.cookies.set("u_id", String(userId), { path: "/", sameSite: "lax" });
  res.cookies.set("u_role", "user", { path: "/", sameSite: "lax" });
  res.cookies.set("u_verified", "0", { path: "/", sameSite: "lax" });
  if (name) res.cookies.set("u_name", name, { path: "/", sameSite: "lax" });
  return res;
}
