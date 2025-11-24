import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { registerSwipeForUser, type SwipeDirection } from "@features/swipe/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GUEST_COOKIE_KEY = "guest_swipes";
const GUEST_LIMIT = 3;

export async function POST(req: NextRequest) {
  let payload: { statementId?: string; direction?: SwipeDirection } = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("u_id")?.value ?? null;
  const guestCountRaw = cookieStore.get(GUEST_COOKIE_KEY)?.value ?? "0";
  const guestCount = Number.isFinite(Number(guestCountRaw)) ? Number(guestCountRaw) : 0;

  const direction =
    typeof payload.direction === "string" ? (payload.direction as SwipeDirection) : ("" as SwipeDirection);
  const statementId = typeof payload.statementId === "string" ? payload.statementId : "";

  const result = await registerSwipeForUser(userId, {
    statementId,
    direction,
    guestSwipesUsed: guestCount,
    guestLimit: GUEST_LIMIT,
  });

  if (result.ok) {
    const res = NextResponse.json({ ok: true, stats: result.stats ?? null });
    if (!userId && result.guest) {
      res.cookies.set(GUEST_COOKIE_KEY, String(result.guest.nextCount), {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return res;
  }

  if (result.error === "GUEST_LIMIT_REACHED") {
    return NextResponse.json(
      {
        ok: false,
        error: "GUEST_LIMIT_REACHED",
        count: result.guest?.count ?? guestCount,
        limit: result.guest?.limit ?? GUEST_LIMIT,
      },
      { status: 403 },
    );
  }

  const status = result.error === "USER_NOT_FOUND" ? 401 : 400;
  return NextResponse.json({ ok: false, error: result.error }, { status });
}
