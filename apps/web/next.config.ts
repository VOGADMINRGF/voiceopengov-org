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

  // Workspace-Pakete transpilen
  transpilePackages: ["@vog/ui", "@vog/features", "@vog/core"],

  outputFileTracingIncludes: promptsDir
    ? { "/api/ai/run": [`${promptsDir}/**/*`] }
    : {},

  webpack(config) {
    config.resolve ??= {};

    // UI-Ziel: bevorzugt dist, dann src, dann lokaler Fallback
    const uiTarget = firstExisting(
      "../../packages/ui/dist",
      "../../packages/ui/src",
      "./src/ui"
    );

    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),

      // Monorepo-Aliasse
      "@core": firstExisting("../../core", "./src"),
      "@features": firstExisting("../../features", "./src"),
      "@context": firstExisting("../../core/context", "./src/context"),

      // Graph-Feature (liegt in dieser App)
      "@features/graph": firstExisting("./src/graph"),

      // UI: EIN Ziel. @ui zeigt exakt auf dasselbe wie @vog/ui
      "@vog/ui": uiTarget,
      "@ui": uiTarget,

      // App-interne Kurzpfade
      "@": R("./src"),
      "@components": R("./src/components"),
      "@hooks": R("./src/hooks"),
      "@utils": R("./src/utils"),
      "@lib": R("./src/lib"),
      "@models": R("./src/models"),
      "@data": R("./src/data"),

      // ⭐ Explizite Bridges (lösen aktuelle "module not found"-Fehler)
      "@core/prisma": R("./src/core/prisma"),
      "@lib/validation/contentValidation": R("./src/lib/validation/contentValidation"),
      "@lib/api": R("./src/lib/api"),
      "@/prisma": R("./src/prisma"),
      "@core/utils/errors": R("./src/utils/errors"),
    };

    return config;
  },

  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
