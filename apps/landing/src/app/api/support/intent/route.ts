import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const file = path.join(process.cwd(), "data", "support-intents.json");
    await fs.mkdir(path.dirname(file), { recursive: true });
    let arr: any[] = [];
    try { arr = JSON.parse(await fs.readFile(file, "utf8")); } catch {}
    arr.push({ ...body, ts: new Date().toISOString() });
    await fs.writeFile(file, JSON.stringify(arr, null, 2), "utf8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[support/intent] error", e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
