import { NextResponse } from "next/server";
import { membersCol } from "@/lib/vogMongo";

function displayNameFor(member: {
  type: "person" | "organisation";
  firstName?: string;
  lastName?: string;
  orgName?: string;
}) {
  if (member.type === "organisation") return member.orgName?.trim() || "Organisation";
  const first = member.firstName?.trim();
  const last = member.lastName?.trim();
  if (first && last) return `${first} ${last.slice(0, 1).toUpperCase()}.`;
  if (first) return first;
  return "Unterstuetzer";
}

export async function GET() {
  const col = await membersCol();

  const rows = await col
    .find({ status: "active", publicSupporter: true })
    .sort({ createdAt: -1 })
    .limit(120)
    .toArray();

  const supporters = rows.map((member) => ({
    name: displayNameFor(member),
    type: member.type,
    imageUrl: member.supporterImageUrl || member.avatarUrl || null,
  }));

  return NextResponse.json({ ok: true, supporters });
}
