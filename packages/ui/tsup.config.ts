import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "index": "src/index.ts",
    "theme": "src/theme.ts",
    "design/badgeColor": "src/design/badgeColor.ts",
    "design/Button": "src/design/Button.tsx",
    "layout/Header": "src/layout/Header.tsx",
    "layout/Footer": "src/layout/Footer.tsx",
  },
  outDir: "dist",
  format: ["esm"],
  target: "es2020",
  sourcemap: true,
  minify: true,
  clean: true,
  dts: false,                 // .d.ts macht tsc in tsconfig.build.json
  splitting: false,           // ⬅️ verhindert Side-Chunks (Problemursache)
  banner: { js: '"use client";' }, // ⬅️ setzt die Client-Directive in JEDER Output-Datei
  external: [
    "react",
    "react-dom",
    "next/link",
    "next/navigation",
    /^next\//,
    /^@context\//,
  ],
});
