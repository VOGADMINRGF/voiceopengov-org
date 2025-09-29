// apps/web/src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Header, Footer } from "@ui";           // ← Aggregat-Export statt Subpfade
import ClientProviders from "./providers";
// Wenn du CSP-Nonce brauchst, kannst du headers() einkommentieren:
// import { headers } from "next/headers";
// import Script from "next/script";

export const metadata: Metadata = {
  title: "VoiceOpenGov",
  description:
    "VoiceOpenGov ist die Plattform für echte digitale Beteiligung. Hier können Bürger:innen abstimmen, Statements einbringen und gemeinsam Reports gestalten – unabhängig, transparent, weltweit.",
  openGraph: {
    title: "VoiceOpenGov – Digitale Beteiligung neu gedacht",
    description:
      "Mach mit: Abstimmen, Themen setzen, Reports lesen. Demokratie, direkt in deiner Hand.",
    url: "https://voiceopengov.org",
    siteName: "VoiceOpenGov",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceOpenGov",
    description:
      "Digitale Beteiligung neu gedacht – für Bürger:innen, NGOs, Politik und Medien.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Falls du eine CSP-Nonce verwenden willst:
  // const nonce = headers().get("x-csp-nonce") ?? undefined;

  return (
    <html lang="de">
      <body className="bg-white text-gray-900">
        <ClientProviders /* nonce={nonce} */>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>

        {/*
          Beispiel (auskommentiert), falls du wirklich Inline-Scripts brauchst:
          <Script id="boot" nonce={nonce} dangerouslySetInnerHTML={{ __html: "/* minimal boot code *\/" }} />
        */}
      </body>
    </html>
  );
}
