// packages/ui/src/layout/Footer.tsx

"use client";

import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import { useLocale } from "@/context/LocaleContext";

export default function Footer() {
  const { role } = useRole();
  const { locale } = useLocale();

  const currentYear = new Date().getFullYear();

  const commonLinks = [
    { href: "/impressum", label: "Impressum" },
    { href: "/daten", label: "Datenschutz" },
    { href: "/kontakt", label: "Kontakt" }
  ];

  const memberLinks = [
    { href: "/mitgliedschaft", label: "Mitgliedschaft" },
    { href: "/unterstuetzen", label: "Unterstützen" }
  ];

  const adminLinks = [
    { href: "/dashboard/reporting", label: "Reports" },
    { href: "/dashboard/settings", label: "Einstellungen" }
  ];

  const links =
    role === "admin"
      ? [...commonLinks, ...adminLinks]
      : role === "member"
      ? [...commonLinks, ...memberLinks]
      : commonLinks;

  const isMachineTranslated = !["de", "en", "fr", "es", "it"].includes(locale);

  return (
    <footer className="bg-gray-100 text-sm text-gray-600 mt-16 py-8 px-6 border-t">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <strong className="text-foreground">VoiceOpenGov</strong>
          <p className="mt-1 text-xs">Initiative für digitale Beteiligung</p>
          <p className="mt-1 text-xs text-gray-400">© {currentYear} – All rights reserved</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {isMachineTranslated && (
        <p className="text-center mt-6 text-xs italic text-gray-400">
          ⚠️ Hinweis: Diese Seite wurde automatisch übersetzt.
        </p>
      )}
    </footer>
  );
}
