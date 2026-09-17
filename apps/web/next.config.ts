// apps/web/next.config.ts
import path from "path";
import type { NextConfig } from "next";

const resolveAlias = {
  "@lib": path.join(__dirname, "src/lib"),
  "@config": path.join(__dirname, "src/config"),
  "@features": path.join(__dirname, "../../features"),
  "@core": path.join(__dirname, "../../core"),
  "@packages": path.join(__dirname, "../../packages"),
};

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
] as const;

const config = {
  experimental: {
    externalDir: true,
  },
  typedRoutes: true,
  turbopack: {
    resolveAlias,
  },
  webpack: (cfg) => {
    cfg.resolve = cfg.resolve || {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias ?? {}),
      ...resolveAlias,
    };
    return cfg;
  },

  // Dev-Origin für HMR/Fast Refresh (Next 15)
  allowedDevOrigins:
    process.env.ALLOWED_DEV_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [
      "http://localhost:3000",
      "http://192.168.178.22:3000",
    ],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...SECURITY_HEADERS],
      },
    ];
  },

  // 🔒 WICHTIG: Keine Redirects mehr – so bleibt /contributions/analyze erreichbar.
  async redirects() {
    return [
      // Beispiel – AUSGESCHALTET:
      // { source: "/", destination: "/contributions/new", permanent: false },
      // KEIN redirect von /contributions/analyze nach /contributions/new!
    ];
  },
} satisfies NextConfig & { allowedDevOrigins?: string[] };

export default config;
