// apps/web/src/app/api/map/points/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type Source = "core" | "votes"; // ⚠️ PII absichtlich ausgeschlossen

function parseBbox(param: string | null): [number, number, number, number] | null {
  if (!param) return null;
  const a = param.split(",").map(Number);
  if (a.length !== 4 || a.some(Number.isNaN)) return null;
  const [w, s, e, n] = a;
  return [Math.max(-180, w), Math.max(-90, s), Math.min(180, e), Math.min(90, n)];
}

function bboxToPolygon([w, s, e, n]: [number, number, number, number]) {
  // GeoJSON Polygon (anti-clockwise), 2dsphere-kompatibel
  return {
    type: "Polygon" as const,
    coordinates: [[
      [w, s], [e, s], [e, n], [w, n], [w, s]
    ]]
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bbox = parseBbox(searchParams.get("bbox"));
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 200), 1), 1000);
    const tags = (searchParams.get("tags") || "").split(",").map(s => s.trim()).filter(Boolean);
    const status = searchParams.get("status") || undefined;
    const lang = searchParams.get("lang") || undefined;
    const source = (searchParams.get("source") || "core") as Source;

    // PII im öffentlichen Endpunkt bewusst nicht erlaubt
    if (!["core", "votes"].includes(source)) {
      return NextResponse.json({ ok: false, error: "source_not_allowed" }, { status: 403 });
    }

    const db = await getDb(source);
    // Collection-Namen zentral: ggf. angleichen, falls bei dir anders benannt
    const colName = source === "core" ? "statements" : "votes";
    const col = db.collection(colName);

    const q: any = {};
    if (bbox) {
      // 2dsphere-freundlich: $geoWithin + $geometry (Polygon)
      q.location = { $geoWithin: { $geometry: bboxToPolygon(bbox) } };
    }
    if (tags.length) q.tags = { $in: tags };
    if (status) q.status = status;
    if (lang) q.lang = lang;

    // Vorsichtige Projektion (nur Karten-relevante Felder)
    const projection = { title: 1, tags: 1, status: 1, location: 1 };

    const cursor = col.find(q, { projection }).limit(limit);
    const docs = await cursor.toArray();

    return NextResponse.json({
      ok: true,
      count: docs.length,
      points: docs,
      source,
      col: colName,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "err" }, { status: 500 });
  }
}
