// apps/web/next.config.ts
import path from "path";
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },  // temporär
  transpilePackages: ["@db/web", "@vog/ui", "@vog/ui", "@vog/core", "@vog/features"],
  webpack: (config: any) => {
    const path = require("path");
    config.resolve.alias ||= {};
    const r = (p) => path.resolve(__dirname, p);
    // ROOT-Aliasse auf echte Ordner
    config.resolve.alias["@features"] = r("../../features");
    config.resolve.alias["@core"] = r("../../core");

    const r = (p: string) => path.resolve(__dirname, p);
    config.resolve.alias["@" ] = r("src");
    config.resolve.alias["@db/web"] = r("src/shims/db-web.ts");
    config.resolve.alias["@core/triMongo"] = r("src/shims/core/db/triMongo.ts");
    config.resolve.alias["@core/db/triMongo"] = r("src/shims/core/db/triMongo.ts");
    config.resolve.alias["@models"] = r("src/models");
    config.resolve.alias["@ui"] = r("src/ui");
    return config;
  },
};
export default nextConfig;
