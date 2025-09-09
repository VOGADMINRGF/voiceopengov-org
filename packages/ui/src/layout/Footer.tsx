"use client";

import Link from "next/link";
import { useUser } from "@features/user/context/UserContext";
import { useLocale } from "@context/LocaleContext";

export default function Footer() {
  const { user, role, roleCompat } = useUser();
  const { locale } = useLocale();
  const currentYear = new Date().getFullYear();

  const commonLinks = [
    { href: "/impressum", label: "Impressum" },
    { href: "/datenschutz", label: "Datenschutz" },
    { href: "/kontakt", label: "Kontakt" },
    { href: "/hilfe", label: "Hilfe" },
  ];
  const memberLinks = [
    { href: "/mitgliedschaft", label: "Mitgliedschaft" },
    { href: "/unterstuetzen", label: "Unterstützen" },
  ];
  const adminLinks = [
    { href: "/dashboard/reporting", label: "Reports" },
    { href: "/dashboard/settings", label: "Einstellungen" },
    { href: "/pages", label: "Seitenindex" },
  ];

  const links =
    role === "admin"
      ? [...commonLinks, ...adminLinks]
      : roleCompat === "member" // 👈 robust für Alt-/Neu-Rollen
      ? [...commonLinks, ...memberLinks]
      : commonLinks;

  const isMachineTranslated = !["de", "en", "fr", "es", "it"].includes(locale);

  return (
    <footer className="w-full border-t border-neutral-200 bg-gray-50 text-sm text-neutral-700">
      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <strong className="text-neutral-900">VoiceOpenGov</strong>
            <p className="mt-1 text-xs text-neutral-500">
              Initiative für digitale Beteiligung · © {currentYear}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between pt-2 border-t border-neutral-200">
          <div className="opacity-90">
            {user ? (
              <span>
                Angemeldet als <strong>{user.name ?? (user as any)?.email ?? "Nutzer"}</strong>
                {" · "}Rolle: <strong>{role}</strong>
                {user.locale ? ` · Sprache: ${user.locale}` : locale ? ` · Sprache: ${locale}` : ""}
              </span>
            ) : (
              <span>Nicht angemeldet{locale ? ` · Sprache: ${locale}` : ""}</span>
            )}
          </div>

          {isMachineTranslated && (
            <p className="text-xs italic text-neutral-500">⚠️ Hinweis: Diese Seite wurde automatisch übersetzt.</p>
          )}
        </div>
      </div>
    </footer>
  );
}
