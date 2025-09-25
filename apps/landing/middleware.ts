import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const user = process.env.BASIC_AUTH_USERNAME || "";
const pass = process.env.BASIC_AUTH_PASSWORD || "";

export function middleware(req: NextRequest) {
  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, base64] = auth.split(" ");
    if (scheme === "Basic") {
      const [u, p] = Buffer.from(base64, "base64").toString().split(":");
      if (u === user && p === pass) return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
  });
}
