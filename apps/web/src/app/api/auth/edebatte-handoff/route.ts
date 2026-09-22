import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { MEMBER_SESSION_COOKIE, resolveMemberSession } from "@/lib/memberAuth";
import { membersCol } from "@/lib/vogMongo";
import { createVogEdebatteHandoff } from "@/lib/vogEdebatteHandoff";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EDEBATTE_ORIGIN = "https://www.edebatte.org";

export async function GET(req: NextRequest) {
  const rawToken = req.cookies.get(MEMBER_SESSION_COOKIE)?.value;
  const session = await resolveMemberSession(rawToken);
  if (!session || !ObjectId.isValid(session.memberId)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", "/api/auth/edebatte-handoff?next=/");
    return NextResponse.redirect(loginUrl, 303);
  }

  const members = await membersCol();
  const member = await members.findOne(
    { _id: new ObjectId(session.memberId), status: "active" },
    { projection: { email: 1, firstName: 1, lastName: 1 } },
  );
  if (!member?.email) {
    return NextResponse.json({ ok: false, error: "member_not_found" }, { status: 401 });
  }

  const handoff = createVogEdebatteHandoff({
    memberId: String(member._id),
    email: member.email,
    name: [member.firstName, member.lastName].filter(Boolean).join(" "),
    next: req.nextUrl.searchParams.get("next"),
  });

  const target = new URL("/api/auth/vog/consume", EDEBATTE_ORIGIN);
  target.searchParams.set("token", handoff.token);
  target.searchParams.set("next", handoff.next);

  const response = NextResponse.redirect(target, 303);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
