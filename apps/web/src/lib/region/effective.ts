// apps/web/src/lib/region/effective.ts
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prismaWeb } from "@/lib/dbWeb";

export type RegionLevel = "country" | "state" | "county" | "city" | "nuts" | "custom";

export interface RegionDTO {
  id: string;
  code: string;
  name: string;
  level: RegionLevel | string;
}

export type RegionSource = "profile" | "cookie" | "none";

export interface EffectiveRegionResult {
  region: RegionDTO | null;
  source: RegionSource;
  userId?: string | null;
}

export async function getEffectiveRegion(): Promise<EffectiveRegionResult> {
  // 1) Profil (NextAuth optional, still & freundlich)
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    if (userId) {
      const prof = await prismaWeb.userProfile.findUnique({
        where: { userId },
        include: { region: true },
      });

      if (prof?.region) {
        return {
          region: {
            id: prof.region.id,
            code: prof.region.code,
            name: prof.region.name,
            level: prof.region.level as RegionLevel,
          },
          source: "profile",
          userId,
        };
      }
      // fällt durch zu Cookie
      return { region: await fromCookie(), source: (await hasCookie()) ? "cookie" : "none", userId };
    }
  } catch {
    // NextAuth nicht verkabelt → still und freundlich ignorieren
  }

  // 2) Cookie (auch ohne Login)
  const r = await fromCookie();
  if (r) return { region: r, source: "cookie", userId: null };

  // 3) Nichts gesetzt
  return { region: null, source: "none", userId: null };
}

async function hasCookie() {
  const c = cookies().get("u_region");
  return !!c?.value;
}

async function fromCookie(): Promise<RegionDTO | null> {
  const c = cookies().get("u_region");
  if (!c?.value) return null;

  const region = await prismaWeb.region.findUnique({ where: { code: c.value } });
  if (!region) return null;

  return {
    id: region.id,
    code: region.code,
    name: region.name,
    level: region.level as RegionLevel,
  };
}
