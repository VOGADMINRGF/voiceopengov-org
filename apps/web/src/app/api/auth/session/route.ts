import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { MEMBER_SESSION_COOKIE, resolveMemberSession } from "@/lib/memberAuth";
import { membersCol } from "@/lib/vogMongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const rawToken = req.cookies.get(MEMBER_SESSION_COOKIE)?.value;
  const session = await resolveMemberSession(rawToken);
  if (!session || !ObjectId.isValid(session.memberId)) {
    return NextResponse.json(
      { authenticated: false },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const members = await membersCol();
  const member = await members.findOne(
    { _id: new ObjectId(session.memberId), status: "active" },
    {
      projection: {
        type: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        orgName: 1,
        city: 1,
        country: 1,
        status: 1,
        isPublic: 1,
        publicSupporter: 1,
        wantsNewsletter: 1,
        wantsNewsletterEdDebatte: 1,
        confirmedAt: 1,
      },
    },
  );

  if (!member) {
    return NextResponse.json(
      { authenticated: false },
      { headers: { "cache-control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      member: {
        id: String(member._id),
        type: member.type,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        orgName: member.orgName,
        city: member.city,
        country: member.country,
        status: member.status,
        isPublic: member.isPublic,
        publicSupporter: Boolean(member.publicSupporter),
        wantsNewsletter: member.wantsNewsletter,
        wantsNewsletterEdDebatte: Boolean(member.wantsNewsletterEdDebatte),
        confirmedAt: member.confirmedAt,
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
