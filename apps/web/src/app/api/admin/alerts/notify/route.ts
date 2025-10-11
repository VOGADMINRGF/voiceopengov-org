export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getDb } from "@core/db/triMongo";
import { sendAlertEmail } from "@/utils/email";

const TOKEN = process.env.INTERNAL_HEALTH_TOKEN || "";

export async function POST(req: Request) {
  const auth = req.headers.get("x-internal-token") || "";
  if (!TOKEN || auth !== TOKEN)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const payload = await req.json(); // { subject, html, text }
  const db = await getDb();
  const doc = await db.collection("settings").findOne({ _id: "global" });
  const cfg = doc?.alerts ?? { enabled: true, recipients: [] };

  if (!cfg.enabled || !cfg.recipients?.length)
    return NextResponse.json({ skipped: true });

  await sendAlertEmail(payload as any);
  return NextResponse.json({ ok: true });
}
