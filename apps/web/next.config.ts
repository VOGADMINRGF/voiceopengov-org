// apps/web/next.config.ts
import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/** Pfad-Utils */
const R = (...p: string[]) => path.resolve(__dirname, ...p);
const exists = (...p: string[]) => fs.existsSync(R(...p));

/** Nimm den ersten existierenden Pfad (für Aliasse/Fallbacks) */
function firstExisting(...candidates: string[]) {
  for (const c of candidates) {
    const abs = R(c);
    if (fs.existsSync(abs)) return abs;
  }
  return R("./src"); // Fallback, damit Builds nicht crashen
}

/** Optional: Prompts nur einbinden, wenn vorhanden */
const promptsDir = exists("../../core/prompts") ? R("../../core/prompts") : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  images: {
    domains: ["localhost", "app.voiceopengov.org"],
    formats: ["image/webp", "image/avif"],
  },

  experimental: {
    typedRoutes: true,
    externalDir: true,
  },

  // Wichtig: das UI-Paket wird aus SOURCE transpiliert (kein dist nötig)
  // -> erhält "use client" und vermeidet Server/Client-Hook-Konflikte
  transpilePackages: [
    "@vog/ui",    // kompatibel, falls noch irgendwo verwendet
    "@vog/features",
    "@vog/core",
  ],

  outputFileTracingIncludes: promptsDir
    ? { "/api/ai/run": [`${promptsDir}/**/*`] }
    : {},

  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),

      // Monorepo-Aliasse
      "@core": firstExisting("../../core", "./src"),
      "@features": firstExisting("../../features", "./src"),

      // UI: **Source-first** (src bevorzugen, dist nur Fallback),
      // zusätzlich kompatibler Alias für @vog/ui
      "@ui": firstExisting("../../packages/ui/src", "../../packages/ui/dist", "./src/ui"),
      "@vog/ui": firstExisting("../../packages/ui/src", "../../packages/ui/dist", "./src/ui"),

      // Context (Locale etc.)
      "@context": firstExisting("../../core/context", "./src/context"),

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
};

export default nextConfig;
