import { NextResponse } from "next/server";
import countries from "world-countries";
import { membersCol } from "@/lib/vogMongo";

type CountryEntry = (typeof countries)[number];

const countryIndex = new Map(
  (countries as CountryEntry[]).map((country) => [country.cca2, country]),
);

export async function GET() {
  const col = await membersCol();

  const pipeline = [
    {
      $match: {
        status: "active",
        isPublic: true,
        country: { $type: "string" },
      },
    },
    {
      $group: {
        _id: { $toLower: "$country" },
        country: { $first: "$country" },
        count: { $sum: 1 },
      },
    },
    { $project: { _id: 0, country: 1, count: 1 } },
    { $sort: { count: -1, country: 1 } },
    { $limit: 300 },
  ];

  const rows = await col.aggregate(pipeline).toArray();
  const mapped = rows.map((row) => {
    const code = String(row.country || "").toUpperCase();
    const meta = countryIndex.get(code);
    return {
      country: meta?.name?.common || row.country,
      count: row.count,
    };
  });

  return NextResponse.json({ ok: true, countries: mapped });
}
