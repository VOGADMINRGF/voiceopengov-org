import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "index": "src/index.ts",
    "design/badgeColor": "src/design/badgeColor.ts"
  },
  outDir: "dist",
  format: ["esm"],
  sourcemap: true,
  treeshake: true,
  clean: true,
  dts: false,              // d.ts macht tsc (build:types)
  target: "es2020",
  external: [
    "react",
    "react-dom",
    /^@context\//,
    /^@core\//
  ]
});
