import { NextResponse } from "next/server";
import { mapOverridesCol } from "@/lib/vogMongo";
import { mapOverridesDefault, type MapOverrides } from "@/config/mapOverrides.default";

function mergeOverrides(input?: Partial<MapOverrides> | null): MapOverrides {
  return {
    countryFills: {
      ...mapOverridesDefault.countryFills,
      ...(input?.countryFills ?? {}),
    },
    start: input?.start ?? mapOverridesDefault.start,
    manualPoints: input?.manualPoints ?? mapOverridesDefault.manualPoints,
  };
}

export async function GET() {
  const col = await mapOverridesCol();
  const doc = await col.findOne({ _id: "default" });
  const merged = mergeOverrides(doc ?? null);
  return NextResponse.json({ ok: true, overrides: merged });
}

export async function POST(req: Request) {
  const token = process.env.VOG_ADMIN_TOKEN;
  const auth = req.headers.get("authorization") || "";
  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Partial<MapOverrides> | null;
  const merged = mergeOverrides(body);

  const col = await mapOverridesCol();
  await col.updateOne(
    { _id: "default" },
    { $set: { ...merged, _id: "default", updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, overrides: merged });
}
