// apps/web/src/app/api/translate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { translationCache } from "@/utils/translationCache";
import { translateWithGPT } from "@/utils/gptTranslator";
import { rateLimit } from "@/utils/rateLimiter";
import { normLang } from "@/utils/lang";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ---------- Config (ENV-override) ---------- */
const MAX_CHARS = num(process.env.TRANSLATE_MAX_CHARS, 5000);
const MAX_BATCH = num(process.env.TRANSLATE_MAX_BATCH, 50);
const TIMEOUT_MS = num(process.env.TRANSLATE_TIMEOUT_MS, 25_000);
const RPM_LIMIT  = num(process.env.TRANSLATE_RPM,       60);
const WINDOW_MS  = 60_000;

/* ---------- Zod: Single oder Batch ---------- */
const SingleZ = z.object({
  text: z.string().min(1).max(MAX_CHARS),
  to: z.union([z.string().min(2), z.array(z.string().min(2)).min(1)]),
  from: z.string().optional().nullable(),
});
const BatchZ = z.object({
  texts: z.array(z.string().min(1).max(MAX_CHARS)).min(1).max(MAX_BATCH),
  to: z.union([z.string().min(2), z.array(z.string().min(2)).min(1)]),
  from: z.string().optional().nullable(),
});
const BodyZ = z.union([SingleZ, BatchZ]);

/* ---------- Helpers ---------- */
function num(v: string | undefined, fb: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fb;
}
function rid() { return crypto.randomUUID(); }
function ipOf(req: NextRequest) { return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.ip || "unknown"; }
function sha1Hex(s: string) { return crypto.createHash("sha1").update(s).digest("hex"); }
async function withTimeout<T>(p: Promise<T>, ms: number) {
  let t: NodeJS.Timeout;
  const killer = new Promise<never>((_, rej) => { t = setTimeout(() => rej(new Error("timeout")), ms); });
  try { return await Promise.race([p, killer]); } finally { clearTimeout(t!); }
}

/* ---------- Preflight ---------- */
export async function HEAD() { return new NextResponse(null, { status: 204 }); }
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

/* ---------- POST ---------- */
export async function POST(req: NextRequest) {
  const requestId = rid();
  const ip = ipOf(req);

  // Content-Type
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return err(415, { error: "unsupported_media_type", detail: "Use application/json" }, requestId);
  }

  // Rate-Limit (cluster-safe)
  const rl = await rateLimit(ip, "translate", RPM_LIMIT, WINDOW_MS / 1000);
  if (!rl.ok) {
    return err(429, { error: "rate_limited", retry_after: rl.retryAfterSec }, requestId, {
      "Retry-After": String(rl.retryAfterSec ?? 60),
      "X-RateLimit-Limit": String(RPM_LIMIT),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(rl.resetSec),
    });
  }

  // Body
  let body: z.infer<typeof BodyZ>;
  try {
    body = BodyZ.parse(await withTimeout(req.json(), TIMEOUT_MS));
  } catch (e: any) {
    if (e?.name === "ZodError") return err(400, { error: "invalid_request", issues: e.issues }, requestId);
    if (String(e) === "Error: timeout") return err(408, { error: "request_timeout" }, requestId);
    return err(400, { error: "invalid_json" }, requestId);
  }

  const toList = Array.isArray((body as any).to) ? (body as any).to : [(body as any).to];
  const toNorm = toList.map((t: string) => normLang(t)!).filter(Boolean);
  const from = normLang((body as any).from ?? undefined);
  const started = Date.now();

  try {
    if ("text" in body) {
      const original = body.text;
      // Multi-target („to“ kann Array sein)
      const results = await translateMulti(original, toNorm, from);
      return ok({ results, requestId, took_ms: Date.now() - started }, requestId, cacheHeader(results));
    }

    // Batch
    const texts = body.texts;
    const uniq = Array.from(new Set(texts));
    const perTo: Record<string, { text: string; result: string; cached: boolean }[]> = {};

    for (const to of toNorm) {
      const cacheMap = new Map<string, string>();
      // Cache-Warmup
      await Promise.all(
        uniq.map(async t => {
          if (from && from === to) { cacheMap.set(t, t); return; }
          const c = await translationCache.get(t, to);
          if (c) cacheMap.set(t, c);
        })
      );
      // Misses übersetzen
      const misses = uniq.filter(t => !cacheMap.has(t));
      if (misses.length) {
        const outs = await Promise.all(misses.map(t => withTimeout(translateWithGPT(t, to), TIMEOUT_MS)));
        await Promise.all(misses.map((t, i) => translationCache.set(t, to, outs[i])));
        misses.forEach((t, i) => cacheMap.set(t, outs[i]));
      }
      // Reihenfolge beibehalten
      perTo[to] = texts.map(t => ({
        text: t,
        result: cacheMap.get(t)!,
        cached: cacheMap.get(t)! === t ? Boolean(from && from === to) : true, // no-op zählt als cached
      }));
    }

    const payload = {
      results: perTo, // { [to]: Array<{text,result,cached}> }
      to: toNorm,
      from,
      requestId,
      took_ms: Date.now() - started,
    };

    const any = Object.values(perTo).flat();
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        ...stdHeaders(requestId),
        "X-RateLimit-Limit": String(RPM_LIMIT),
        "X-RateLimit-Remaining": String(rl.remaining),
        "X-RateLimit-Reset": String(rl.resetSec),
        "X-Cache": cacheHeader(any),
        ...corsHeaders(),
      },
    });
  } catch (e: any) {
    const detail = typeof e?.message === "string" ? e.message : String(e);
    const status = /timeout|AbortError/i.test(detail) ? 504 : 500;
    return err(status, { error: "translation_failed", detail }, requestId);
  }
}

/* ---------- Helpers ---------- */
async function translateMulti(text: string, toList: string[], from?: string | undefined) {
  const out: { to: string; result: string; cached: boolean; etag: string }[] = [];
  for (const to of toList) {
    if (from && from === to) {
      out.push({ to, result: text, cached: true, etag: sha1Hex(text) });
      continue;
    }
    const cached = await translationCache.get(text, to);
    if (cached) {
      out.push({ to, result: cached, cached: true, etag: sha1Hex(cached) });
      continue;
    }
    const translated = await translateWithGPT(text, to);
    await translationCache.set(text, to, translated);
    out.push({ to, result: translated, cached: false, etag: sha1Hex(translated) });
  }
  return out;
}

function stdHeaders(requestId: string) {
  return {
    "cache-control": "no-store",
    "x-request-id": requestId,
    "content-type": "application/json; charset=utf-8",
  };
}
function corsHeaders() {
  // Standard: same-origin sicher. Falls nötig: ENV erlauben.
  const origin = process.env.CORS_ORIGIN ?? "";
  return origin ? { "access-control-allow-origin": origin, "access-control-allow-headers": "content-type" } : {};
}
function cacheHeader(items: { cached?: boolean }[] | any) {
  const arr = Array.isArray(items) ? items : [items];
  const hits = arr.filter(x => x.cached).length;
  if (hits === arr.length) return "HIT";
  if (hits > 0) return "MIXED";
  return "MISS";
}
function err(code: number, payload: Record<string, unknown>, requestId: string, extra?: Record<string,string>) {
  return new NextResponse(JSON.stringify(payload), {
    status: code,
    headers: { ...stdHeaders(requestId), ...(extra || {}), ...corsHeaders() },
  });
}
function ok(payload: any, requestId: string, xcache: "HIT"|"MISS"|"MIXED") {
  const res = payload?.results?.[0]?.result ?? payload?.results?.result;
  const etag = typeof res === "string" ? sha1Hex(res) : undefined;
  return new NextResponse(JSON.stringify(payload), {
    status: 200,
    headers: { ...stdHeaders(requestId), "x-cache": xcache, ...(etag ? { etag } : {}), ...corsHeaders() },
  });
}
