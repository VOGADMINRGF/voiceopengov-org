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

  // Next 15: typedRoutes ist stabil (nicht mehr unter experimental)
  typedRoutes: true,

  images: {
    domains: ["localhost", "voiceopengov.org"],
    formats: ["image/webp", "image/avif"],
  },

  // Nur includen, wenn der Ordner existiert
  outputFileTracingIncludes: promptsDir
    ? { "/api/ai/run": [`${promptsDir}/**/*`] }
    : {},

  // Wenn ihr externe Pakete im Monorepo transpilen wollt, hier eintragen.
  // (Nur aktiv, wenn die Ordner existieren)
  transpilePackages: [
    ...(exists("../../packages/ui") ? ["ui"] : []),
  ],

  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),

      // Monorepo-Aliasse (werden nur gesetzt, wenn die Ordner existieren)
      "@core": firstExisting("../../core", "./src"),
      "@features": firstExisting("../../features", "./src"),

      // UI: bevorzugt Monorepo, sonst lokale Stubs in apps/web/src/ui
      "@ui": firstExisting("../../packages/ui/src", "./src/ui"),

      // gängige App-interne Kurzpfade
      "@": R("./src"),
      "@components": R("./src/components"),
      "@hooks": R("./src/hooks"),
      "@utils": R("./src/utils"),
      "@lib": R("./src/lib"),
    };
    return config;
  },

  // Build robuster machen (optional; kann auf `false` bleiben, wenn ihr strikt seid)
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },

  // 2) „noindex“ Header für den Review-Pfad
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
