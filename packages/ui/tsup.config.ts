import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    theme: "src/theme.ts",
    "design/badgeColor": "src/design/badgeColor.ts",
    "design/Button": "src/design/Button.tsx",
    "layout/Header": "src/layout/Header.tsx",
    "layout/Footer": "src/layout/Footer.tsx",
  },
  outDir: "dist",
  format: ["esm", "cjs"],          // ← CJS mitbauen
  target: "es2020",
  dts: false,                      // .d.ts macht tsc -p tsconfig.build.json
  splitting: false,
  sourcemap: true,
  minify: true,
  clean: true,
  banner: { js: '"use client";' },
  external: [
    "react",
    "react-dom",
    "next",
    "next/link",
    "next/navigation",
    /^next\//,
    /^@context\//,
  ],
  // ← CJS bekommt .js, ESM .mjs (passt zu require('./dist/*.js'))
  outExtension: ({ format }) => ({ js: format === "cjs" ? ".js" : ".mjs" }),
});
