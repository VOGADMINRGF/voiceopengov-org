import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,md,mdx}",
    "./src/app/**/*.{ts,tsx,md,mdx}",
    "./src/components/**/*.{ts,tsx,md,mdx}",
  ],
  theme: {
    // falls du DEIN .container beibehältst, Tailwinds Container deaktivieren:
    // corePlugins unten beachten
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "1.5rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1200px", "2xl": "1200px" },
    },
    extend: {
      boxShadow: { soft: "0 8px 30px rgba(2,6,23,.06)" },
      colors: {
        brand: { mint: "#dff7ef", turquoise: "#22c1c3", violet: "#4b6bff" },
        token: {
          from: "var(--brand-from)",
          to: "var(--brand-to)",
          chipBorder: "var(--chip-border)",
          chipBg: "var(--chip-bg)",
          chipText: "var(--chip-text)",
        },
      },
      typography: {},
    },
  },
  // VERMEIDE Konflikte mit deiner .container-Klasse:
  corePlugins: { container: false },
  plugins: [
    typography(),
    forms(),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".bg-brand-grad": {
          backgroundImage:
            "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
        },
        ".text-brand-grad": {
          backgroundImage:
            "linear-gradient(90deg,var(--brand-accent-1),var(--brand-accent-2))",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          color: "transparent",
          "-webkit-text-fill-color": "transparent",
        },
      });
    }),
  ],
} satisfies Config;
