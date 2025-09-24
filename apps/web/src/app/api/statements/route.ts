export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { coreCol } from "@/utils/triMongo";
import { readSession } from "@/utils/session";

// --- ENV / Flags -------------------------------------------------------------
const REQUIRE_LOGIN =
  (process.env.REQUIRE_LOGIN_FOR_STATEMENTS || "false").toLowerCase() === "true";

// --- Utils -------------------------------------------------------------------
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const SAFE_LANG = new Set(["de","en","fr","it","es","pl","uk","ru","tr","hi","zh","ar"]);
const safeLang = (v: unknown) => {
  const x = typeof v === "string" ? v.slice(0,2).toLowerCase() : "de";
  return SAFE_LANG.has(x) ? x : "de";
};

type CursorPayload = { t: string | number | Date; id: string };
const enc = (c: CursorPayload) => {
  const t = c.t instanceof Date ? c.t.toISOString() : String(c.t);
  return Buffer.from(JSON.stringify({ t, id: c.id })).toString("base64url");
};
const dec = (s: string): CursorPayload => {
  const j = JSON.parse(Buffer.from(s, "base64url").toString("utf8"));
  if (!j?.t || !j?.id) throw new Error("bad cursor");
  return j as CursorPayload;
};

// --- Validation --------------------------------------------------------------
const CreateSchema = z.object({
  text: z.string().min(1).max(4000),
  title: z.string().trim().max(200).optional(),
  category: z.string().trim().max(80).default("Allgemein").optional(),
  language: z.string().optional(),
  scope: z.string().trim().max(120).optional(),
  timeframe: z.string().trim().max(120).optional(),
}).strict();

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  q: z.string().trim().max(200).optional(),
  category: z.string().trim().max(80).optional(),
  language: z.string().trim().max(2).optional(),
}).strict();

// --- GET (paginiert + optionale Filter) --------------------------------------
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "bad_query", issues: parsed.error.issues }, { status: 400 });
    }
    const { limit, cursor, q, category, language } = parsed.data;

    const filter: Record<string, any> = {};
    // Cursor
    if (cursor) {
      try {
        const { t, id } = dec(cursor);
        const d = new Date(String(t));
        if (!Number.isNaN(d.getTime()) && ObjectId.isValid(String(id))) {
          filter.$or = [
            { createdAt: { $lt: d } },
            { createdAt: d, _id: { $lt: new ObjectId(String(id)) } },
          ];
        }
      } catch { /* ignore bad cursor */ }
    }
    // Filter
    if (category) filter.category = category;
    if (language) filter.language = language;
    if (q) {
      // einfacher Textfilter auf Title/Text/Category
      filter.$text
        ? null
        : Object.assign(filter, {
            $or: [
              { title: { $regex: q, $options: "i" } },
              { text: { $regex: q, $options: "i" } },
              { category: { $regex: q, $options: "i" } },
            ],
          });
    }

    const col = await coreCol<any>("statements");
    const docs = await col
      .find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .toArray();

    const hasMore = docs.length > limit;
    if (hasMore) docs.pop();

    const data = docs.map((d) => ({
      id: String(d._id),
      title: d.title,
      text: d.text,
      category: d.category,
      language: d.language,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      factcheckStatus: d.factcheckStatus ?? null,
      stats: d.stats ?? {
        views: 0,
        votesAgree: 0,
        votesNeutral: 0,
        votesDisagree: 0,
        votesTotal: 0,
      },
    }));

    const last = docs.at(-1);
    const nextCursor = hasMore && last ? enc({ t: last.createdAt ?? new Date(0), id: String(last._id) }) : null;

    const res = NextResponse.json({ ok: true, data, nextCursor });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (err) {
    console.error("[/api/statements] GET error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

// --- Helper: BullMQ (best effort) -------------------------------------------
async function tryEnqueueFactcheck(payload: any) {
  try {
    const { getFactcheckQueue } = await import("@core/queue/factcheckQueue");
    const q = getFactcheckQueue();
    await q.add("factcheck", payload, { jobId: `stmt:${payload.contributionId}` });
  } catch (err: any) {
    console.warn("[factcheck enqueue skipped]", err?.message || err);
  }
}

// --- POST (anlegen + optional Factcheck) -------------------------------------
export async function POST(req: NextRequest) {
  try {
    const sess = readSession();
    if (REQUIRE_LOGIN && !sess) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "validation", issues: parsed.error.issues }, { status: 400 });
    }

    const { title, text, category, language, scope, timeframe } = parsed.data;

    // Titel auto-ableiten, wenn nicht gesetzt
    const autoTitle = (text.split(/\n+/).find(Boolean) || "").slice(0, 120) || "Beitrag";
    const final = {
      title: (title?.trim() || autoTitle).slice(0, 200),
      text: text.trim().slice(0, 4000),
      category: (category || "Allgemein").trim().slice(0, 80),
      language: safeLang(language),
    };

    const now = new Date();
    const doc = {
      ...final,
      author: null,
      userId: sess?.uid ?? null,
      createdAt: now,
      updatedAt: now,
      factcheckStatus: "queued" as const,
      stats: { views: 0, votesAgree: 0, votesNeutral: 0, votesDisagree: 0, votesTotal: 0 },
    };

    const col = await coreCol<any>("statements");
    const ins = await col.insertOne(doc);
    const id = String(ins.insertedId);

    // best effort
    tryEnqueueFactcheck({ contributionId: id, text: final.text, language: final.language, topic: final.category, scope, timeframe }).catch(() => {});

    const resp = NextResponse.json({ ok: true, id }, { status: 201 });
    resp.headers.set("Location", `/api/statements/${id}`);
    return resp;
  } catch (err) {
    console.error("[/api/statements] POST error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
