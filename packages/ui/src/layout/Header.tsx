// packages/ui/src/design/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useRole, Role } from "@context/RoleContext";
import Image from "next/image";

const languages = [
  { code: "de", label: "🇩🇪" },
  { code: "en", label: "🇬🇧" },
  { code: "fr", label: "🇫🇷" },
  { code: "es", label: "🇪🇸" },
  { code: "pl", label: "🇵🇱" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { role, setRole } = useRole();
  const [lang, setLang] = useState("de");

  const baseLinks = [
    { href: "/stream", label: "Streams" },
    { href: "/daten", label: "Datenschutz" },
  ];

  const memberLinks = [
    { href: "/beitraege", label: "Beiträge" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const adminLinks = [
    { href: "/dashboard/reporting", label: "Reports" },
    { href: "/dashboard/users", label: "Moderation" },
  ];

  const cta = role === "guest"
    ? { href: "/mitgliedschaft", label: "Jetzt unterstützen" }
    : { href: "/beitraege/neu", label: "Beitrag verfassen" };

  const links = [
    ...baseLinks,
    ...(role === "member" ? memberLinks : []),
    ...(role === "admin" ? adminLinks : []),
  ];

  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50 px-4 md:px-6 h-16 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-coral">
        VoiceOpenGov
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {link.label}
          </Link>
        ))}

        <Link
          href={cta.href}
          className="bg-turquoise text-white font-semibold py-2 px-4 rounded hover:opacity-90"
        >
          {cta.label}
        </Link>

        <div className="flex items-center gap-2">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={lang === l.code ? "opacity-100" : "opacity-50"}
            >
              <span className="text-xl">{l.label}</span>
            </button>
          ))}
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="text-sm border rounded px-2 py-1 text-gray-600"
        >
          <option value="guest">Gast</option>
          <option value="member">Mitglied</option>
          <option value="admin">Admin</option>
        </select>
      </nav>

      {/* Mobile */}
      <div className="md:hidden flex items-center gap-2">
        <Link
          href={cta.href}
          className="bg-turquoise text-white font-semibold py-2 px-4 rounded hover:bg-turquoise/80"
        >
          {cta.label}
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-gray-700">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col gap-4 px-6 py-4 md:hidden z-40">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
