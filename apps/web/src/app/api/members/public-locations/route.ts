import { NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";

export async function GET() {
  const col = await membersCol();

  // Active members with a city + coordinates. Aggregated by (city, lat, lng).
  const pipeline = [
    {
      $match: {
        status: "active",
        isPublic: true,
        city: { $type: "string" },
        lat: { $type: "number" },
        lng: { $type: "number" },
      },
    },
    { $group: { _id: { city: "$city", lat: "$lat", lng: "$lng" }, count: { $sum: 1 } } },
    { $project: { _id: 0, city: "$_id.city", lat: "$_id.lat", lng: "$_id.lng", count: 1 } },
    { $sort: { count: -1, city: 1 } },
    { $limit: 500 },
  ];

  const points = await col.aggregate(pipeline).toArray();
  return NextResponse.json({ ok: true, points });
}
