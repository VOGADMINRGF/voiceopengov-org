import Link from "next/link";
import type { SupportedLocale } from "@/config/locales";
import { getFooterStrings } from "@/components/footerStrings";
import { EDEBATTE_URL, VOTE4GOV_URL } from "@/config/links";

const currentYear = new Date().getFullYear();

type SiteFooterProps = {
  locale: SupportedLocale;
};

const ECOSYSTEM_COPY = {
  de: {
    eyebrow: "Ein Ökosystem. Vier klar getrennte Rollen.",
    title: "Gemeinsame Haltung. Eigenständige Aufgaben.",
    body: "VoiceOpenGov nutzt eDebatte. Es besitzt eDebatte nicht. Vote4Gov denkt gesellschaftliche Entwicklung weiter. Voxy verbindet die Ebenen, ohne Entscheidungen zu treffen.",
    footerLine: "Transparenz ist unser gemeinsames Betriebssystem.",
    items: {
      edebatte: {
        role: "Offene Infrastruktur",
        description: "Für nachvollziehbare Erkenntnis, Orientierung und Beteiligung – offen für Bürger, Kommunen, Unternehmen, Vereine, Parteien, Wissenschaft, Medien und NGOs.",
      },
      voiceopengov: {
        role: "Internationale Mitgliederbewegung",
        description: "Menschen organisieren sich über Grenzen hinweg und übernehmen gemeinsam Verantwortung.",
      },
      vote4gov: {
        role: "Gesellschaftliche Denkwerkstatt",
        description: "Reflektiert, wie demokratische Mitbestimmung im digitalen Zeitalter verantwortungsvoll weiterentwickelt werden kann.",
      },
      voxy: {
        role: "Verbindende Begleiterin",
        description: "Erklärt, strukturiert und übersetzt. Voxy hilft beim Verstehen. Voxy entscheidet nicht.",
      },
    },
  },
  en: {
    eyebrow: "One ecosystem. Four clearly separated roles.",
    title: "Shared principles. Independent responsibilities.",
    body: "VoiceOpenGov uses eDebatte. It does not own eDebatte. Vote4Gov explores how society can evolve. Voxy connects the layers without making decisions.",
    footerLine: "Transparency is our shared operating system.",
    items: {
      edebatte: {
        role: "Open infrastructure",
        description: "For traceable insight, orientation and participation — open to citizens, municipalities, businesses, associations, parties, academia, media and NGOs.",
      },
      voiceopengov: {
        role: "International membership movement",
        description: "People organise across borders and take shared responsibility.",
      },
      vote4gov: {
        role: "Civic think tank",
        description: "Explores how democratic participation can be developed responsibly in the digital age.",
      },
      voxy: {
        role: "Connecting guide",
        description: "Explains, structures and translates. Voxy helps people understand. Voxy does not decide.",
      },
    },
  },
};

export default function SiteFooter({ locale }: SiteFooterProps) {
  const strings = getFooterStrings(locale);
  const ecosystem = locale === "de" ? ECOSYSTEM_COPY.de : ECOSYSTEM_COPY.en;
  const providerStatus = locale === "de"
    ? "Aufbauphase: VoiceOpenGov wird derzeit von Ricky G. Fleischer als natürlicher Person betrieben. Es besteht aktuell keine VOG Holding oder sonstige eigene Gesellschaft als Anbieter, Vertragspartner oder Zahlungsempfänger."
    : "Build phase: VoiceOpenGov is currently operated by Ricky G. Fleischer as a natural person. No VOG Holding or other separate company currently acts as provider, contractual partner or payment recipient.";

  return (
    <footer className="border-t border-[#f4f1e8]/10 bg-[#07110f] text-[#f4f1e8]" role="contentinfo">
      <section aria-labelledby="ecosystem-heading" className="border-b border-[#f4f1e8]/10 bg-[#0b1714]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-18">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d6ff65]">{ecosystem.eyebrow}</p>
              <h2 id="ecosystem-heading" className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{ecosystem.title}</h2>
            </div>
            <p className="max-w-3xl text-base leading-7 text-[#f4f1e8]/58">{ecosystem.body}</p>
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <a href={EDEBATTE_URL} className="group rounded-3xl border border-[#f4f1e8]/10 bg-[#07110f]/70 p-5 transition hover:-translate-y-0.5 hover:border-[#d6ff65]/45">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#d6ff65]">{ecosystem.items.edebatte.role}</span>
              <strong className="mt-3 block text-xl">eDebatte ↗</strong>
              <span className="mt-3 block text-sm leading-6 text-[#f4f1e8]/48 transition group-hover:text-[#f4f1e8]/68">{ecosystem.items.edebatte.description}</span>
            </a>
            <Link href="/" aria-current="page" className="group rounded-3xl border border-[#d6ff65]/45 bg-[#d6ff65]/10 p-5 shadow-[0_20px_55px_rgba(214,255,101,0.06)] transition hover:-translate-y-0.5">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#d6ff65]">{ecosystem.items.voiceopengov.role}</span>
              <strong className="mt-3 block text-xl">VoiceOpenGov</strong>
              <span className="mt-3 block text-sm leading-6 text-[#f4f1e8]/55 transition group-hover:text-[#f4f1e8]/72">{ecosystem.items.voiceopengov.description}</span>
            </Link>
            <a href={VOTE4GOV_URL} className="group rounded-3xl border border-[#f4f1e8]/10 bg-[#07110f]/70 p-5 transition hover:-translate-y-0.5 hover:border-[#d6ff65]/45">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#d6ff65]">{ecosystem.items.vote4gov.role}</span>
              <strong className="mt-3 block text-xl">Vote4Gov ↗</strong>
              <span className="mt-3 block text-sm leading-6 text-[#f4f1e8]/48 transition group-hover:text-[#f4f1e8]/68">{ecosystem.items.vote4gov.description}</span>
            </a>
            <article className="rounded-3xl border border-[#f4f1e8]/10 bg-[#07110f]/70 p-5">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#d6ff65]">{ecosystem.items.voxy.role}</span>
              <strong className="mt-3 block text-xl">Voxy</strong>
              <span className="mt-3 block text-sm leading-6 text-[#f4f1e8]/48">{ecosystem.items.voxy.description}</span>
            </article>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] transition hover:text-[#d6ff65]">VoiceOpenGov</Link>
            <p className="mt-3 font-bold text-[#f4f1e8]">{strings.brand.claim}</p>
            <p className="mt-3 text-sm leading-6 text-[#f4f1e8]/48">{strings.brand.body}</p>
          </div>
          <FooterNav title={strings.columns.main} ariaLabel={strings.aria.main} links={strings.links.main} />
          <FooterNav title={strings.columns.initiatives} ariaLabel={strings.aria.initiatives} links={strings.links.initiatives} />
          <FooterNav title={strings.columns.legal} ariaLabel={strings.aria.legal} links={strings.links.legal} />
        </div>

        <div className="mt-10 border-t border-[#f4f1e8]/10 pt-6 text-xs text-[#f4f1e8]/36 md:flex md:items-start md:justify-between md:gap-8">
          <p>© {currentYear} VoiceOpenGov</p>
          <div className="mt-3 max-w-3xl space-y-2 md:mt-0 md:text-right">
            <p>{providerStatus}</p>
            <p>{ecosystem.footerLine}</p>
          </div>
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
      <p className="text-sm font-bold text-[#f4f1e8]">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm text-[#f4f1e8]/48">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            {link.external ? (
              <a href={link.href} className="transition hover:text-[#d6ff65]">{link.label}</a>
            ) : (
              <Link href={link.href} className="transition hover:text-[#d6ff65]">{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
