// apps/web/src/app/api/region/effective/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prismaWeb } from "@/lib/dbWeb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // <-- stelle sicher, dass dieser Pfad stimmt

// WICHTIG: Next.js auf Node-Runtime halten (Prisma + NextAuth)
export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // keine statische Caches

export async function GET(_req: NextRequest) {
  // 1) Profil (falls eingeloggt)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      const prof = await prismaWeb.userProfile.findUnique({
        where: { userId: session.user.id },
        include: { region: true },
      });
      if (prof?.region) {
        return NextResponse.json({
          region: {
            id: prof.region.id,
            code: prof.region.code,
            name: prof.region.name,
            level: prof.region.level,
          },
          source: "profile",
        });
      }
    }
  } catch {
    // still und freundlich ignorieren (z.B. wenn NextAuth nicht wired ist)
  }

  // 2) Cookie
  const c = cookies().get("u_region");
  if (c?.value) {
    const r = await prismaWeb.region.findUnique({ where: { code: c.value } });
    if (r) {
      return NextResponse.json({
        region: { id: r.id, code: r.code, name: r.name, level: r.level },
        source: "cookie",
      });
    }
  }

  // 3) Nichts gesetzt
  return NextResponse.json({ region: null, source: "none" });