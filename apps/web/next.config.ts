// apps/web/next.config.ts
import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/** Hilfsfunktionen */
const R = (...p: string[]) => path.resolve(__dirname, ...p);
const exists = (...p: string[]) => fs.existsSync(R(...p));

/** Alias-Resolver: nimm den ersten existierenden Pfad */
function firstExisting(...candidates: string[]) {
  for (const c of candidates) {
    const abs = R(c);
    if (fs.existsSync(abs)) return abs;
  }
  // Fallback: auf App-Src zeigen, damit Build nie crasht
  return R("./src");
}

/** Optional: Prompts aus dem Monorepo nur einbinden, wenn vorhanden */
const promptsDir = exists("../../core/prompts") ? R("../../core/prompts") : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  /** <- HIER: typedRoutes gehört unter experimental */
  experimental: {
    typedRoutes: true,
  },

  images: {
    domains: ["localhost", "voiceopengov.org"],
    formats: ["image/webp", "image/avif"],
  },

  // Nur includen, wenn der Ordner existiert
  outputFileTracingIncludes: promptsDir
    ? { "/api/ai/run": [`${promptsDir}/**/*`] }
    : {},

  // Monorepo-Pakete transpilen (nur wenn vorhanden)
  transpilePackages: [
    ...(exists("../../packages/ui") ? ["ui"] : []),
  ],

  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      // Monorepo-Aliasse
      "@core": firstExisting("../../core", "./src"),
      "@features": firstExisting("../../features", "./src"),
      "@ui": firstExisting("../../packages/ui/src", "./src/ui"),
      // App-interne Kurzpfade
      "@": R("./src"),
      "@components": R("./src/components"),
      "@hooks": R("./src/hooks"),
      "@utils": R("./src/utils"),
      "@lib": R("./src/lib"),
    };
    return config;
  },

  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },

  // Robots & Cache für Review-Snapshot
  async headers() {
    return [
      {
        source: "/_review/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
