import { NextResponse } from "next/server";
import { chapterIntakeCol, membersCol, type MemberStatus } from "@/lib/vogMongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const collection = await membersCol();
  const chapterCollection = await chapterIntakeCol();
  const statusFilter: readonly MemberStatus[] = ["pending", "active"];

  const [people, countries, chapters] = await Promise.all([
    collection.countDocuments({ status: { $in: statusFilter }, type: "person" }),
    collection.distinct("country", {
      status: { $in: statusFilter },
      country: { $type: "string", $ne: "" },
    }),
    chapterCollection.countDocuments({ status: { $in: ["new", "reviewed"] } }),
  ]);

  const uniqueCountries = countries.filter(
    (code) => typeof code === "string" && code.trim().length > 0
  );

  return NextResponse.json({
    people,
    countries: uniqueCountries.length,
    chapters,
  });
}
