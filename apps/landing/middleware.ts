import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const user = process.env.BASIC_AUTH_USERNAME;
  const pass = process.env.BASIC_AUTH_PASSWORD;

  // Wenn keine Credentials gesetzt sind -> kein Schutz
  if (!user || !pass) return NextResponse.next();

  const header = req.headers.get("authorization");
  if (header && header.startsWith("Basic ")) {
    const encoded = header.split(" ")[1]!;
    const [u, p] = atob(encoded).split(":");
    if (u === user && p === pass) return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' }
  });
}

// Statische Assets vom Schutz ausnehmen
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
