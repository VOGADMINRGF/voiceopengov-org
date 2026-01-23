import { NextResponse } from "next/server";
import countries from "world-countries";
import { getMongoDb } from "@/lib/db/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CountryEntry = (typeof countries)[number];

const countryIndex = new Map(
  (countries as CountryEntry[]).map((country) => [country.cca2, country]),
);

export async function GET() {
  const db = await getMongoDb();
  const collection = db.collection("supporters_pii");

  const rows = await collection
    .aggregate([
      {
        $match: {
          status: "approved",
          countryCode: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: { countryCode: "$countryCode", kind: "$kind" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const byCountry = new Map<
    string,
    { peopleCount: number; orgCount: number }
  >();

  for (const row of rows) {
    const code = String(row?._id?.countryCode || "").toUpperCase();
    if (!code) continue;
    const kind = row?._id?.kind;
    const count = Number(row?.count || 0);
    const entry = byCountry.get(code) || { peopleCount: 0, orgCount: 0 };
    if (kind === "person") entry.peopleCount += count;
    if (kind === "org") entry.orgCount += count;
    byCountry.set(code, entry);
  }

  const payload = Array.from(byCountry.entries()).map(([code, counts]) => {
    const country = countryIndex.get(code);
    const latlng = Array.isArray(country?.latlng) ? country?.latlng : null;
    return {
      countryCode: code,
      countryName: country?.name?.common || code,
      lat: latlng ? latlng[0] : 0,
      lng: latlng ? latlng[1] : 0,
      peopleCount: counts.peopleCount,
      orgCount: counts.orgCount,
      totalCount: counts.peopleCount + counts.orgCount,
    };
  });

  return NextResponse.json({ points: payload });
}
