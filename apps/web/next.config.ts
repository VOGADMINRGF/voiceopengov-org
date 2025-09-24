// apps/web/next.config.ts
import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const R = (...p: string[]) => path.resolve(__dirname, ...p);
const exists = (...p: string[]) => fs.existsSync(R(...p));

function firstExisting(...candidates: string[]) {
  for (const c of candidates) {
    const abs = R(c);
    if (fs.existsSync(abs)) return abs;
  }
  return R("./src");
}

const promptsDir = exists("../../core/prompts") ? R("../../core/prompts") : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  experimental: {
    typedRoutes: true,
    externalDir: true,
  },

  images: {
    domains: ["localhost", "voiceopengov.org"],
    formats: ["image/webp", "image/avif"],
  },

  outputFileTracingIncludes: promptsDir ? { "/api/ai/run": [`${promptsDir}/**/*`] } : {},

  transpilePackages: [...(exists("../../packages/ui") ? ["ui"] : [])],

  webpack(config) {
    // WICHTIG: erst resolve sicherstellen, dann Aliasse setzen
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@features": firstExisting("../../features", "./src/features"),
      "@/features": firstExisting("../../features", "./src/features"),
      "@core": firstExisting("../../core", "./src"),
      "@ui": firstExisting("../../packages/ui/src", "./src/ui"),
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
