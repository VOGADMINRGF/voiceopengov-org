import Link from "next/link";

const mainLinks = [
  { href: "/#mitmachen", label: "Mitmachen" },
  { href: "/dossier", label: "Dossier" },
  { href: "/donate", label: "Spenden" },
];

const initiativeLinks = [
  { href: "/initiatives", label: "Fuer Initiativen" },
];

const legalLinks = [
  { href: "/kontakt", label: "Kontakt" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
];

const currentYear = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer
      className="mt-16 border-t border-slate-200 bg-slate-50/80"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand / Claim */}
          <div>
            <Link
              href="/"
              className="inline-flex text-lg font-extrabold tracking-tight"
              style={{
                backgroundImage:
                  "linear-gradient(120deg,var(--brand-cyan),var(--brand-blue))",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              VoiceOpenGov
            </Link>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              Bewegung fuer robuste, nachvollziehbare Entscheidungen.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              VoiceOpenGov verbindet Menschen, Initiativen und Organisationen,
              die klare Verfahren und transparente Beteiligung aufbauen wollen.
            </p>
          </div>

          {/* Mitmachen */}
          <FooterNav
            title="Mitmachen"
            ariaLabel="Footer Navigation: Mitmachen"
            links={mainLinks}
          />

          {/* Initiativen */}
          <FooterNav
            title="Fuer Initiativen"
            ariaLabel="Footer Navigation: Initiativen"
            links={initiativeLinks}
          />

          {/* Kontakt & Rechtliches */}
          <FooterNav
            title="Kontakt & Rechtliches"
            ariaLabel="Footer Navigation: Kontakt und Rechtliches"
            links={legalLinks}
          />
        </div>

        <div className="mt-8 border-t border-slate-200/70 pt-6 text-xs text-slate-500 md:flex md:items-center md:justify-between">
          <p>© {currentYear} VoiceOpenGov</p>
          <p className="mt-2 text-[11px] text-slate-500 md:mt-0">
            powered by Ricky G. Fleischer
          </p>
        </div>
      </div>
    </footer>
  );
}

type FooterNavProps = {
  title: string;
  ariaLabel: string;
  links: { href: string; label: string; external?: boolean }[];
};

function FooterNav({ title, ariaLabel, links }: FooterNavProps) {
  return (
    <nav aria-label={ariaLabel}>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-slate-900 hover:underline hover:underline-offset-4"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="transition hover:text-slate-900 hover:underline hover:underline-offset-4"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
