// apps/web/src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Header from "@ui/layout/Header";
import Footer from "@ui/layout/Footer";
import ClientProviders from "./providers";

export const metadata = {
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
  return (
    <html lang="de">
      <body className="bg-white text-gray-900">
        <ClientProviders>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}

// 
Using the CSP nonce in your app

To allow any inline <script> (e.g., a small bootstrap or Next’s runtime) you must add the nonce:

// apps/web/src/app/layout.tsx
import { headers } from "next/headers";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-csp-nonce") ?? undefined;

  return (
    <html lang="en">
      <head>
        {/* Example nonced inline bootstrap (avoid if possible) */}
        <Script id="boot" nonce={nonce} dangerouslySetInnerHTML={{ __html: "/* minimal boot code */" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}


Prefer external scripts and avoid inline where you can; but when needed, ensure nonce={nonce} is present.