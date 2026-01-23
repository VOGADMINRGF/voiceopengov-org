import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/db/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getMongoDb();
  const collection = db.collection("supporters_pii");

  const [people, orgs, countries] = await Promise.all([
    collection.countDocuments({ status: "approved", kind: "person" }),
    collection.countDocuments({ status: "approved", kind: "org" }),
    collection.distinct("countryCode", {
      status: "approved",
      countryCode: { $exists: true, $ne: "" },
    }),
  ]);

  const uniqueCountries = countries.filter((code) => typeof code === "string" && code.trim().length > 0);

  return NextResponse.json({
    people,
    orgs,
    countries: uniqueCountries.length,
  });
}
