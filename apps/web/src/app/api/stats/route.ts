import { NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const collection = await membersCol();
  const statusFilter = { $in: ["pending", "active"] };

  const [people, orgs, countries] = await Promise.all([
    collection.countDocuments({ status: statusFilter, type: "person" }),
    collection.countDocuments({ status: statusFilter, type: "organisation" }),
    collection.distinct("country", {
      status: statusFilter,
      country: { $type: "string", $ne: "" },
    }),
  ]);

  const uniqueCountries = countries.filter(
    (code) => typeof code === "string" && code.trim().length > 0
  );

  return NextResponse.json({
    people,
    orgs,
    countries: uniqueCountries.length,
  });
}
