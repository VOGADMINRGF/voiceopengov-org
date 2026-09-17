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
    eyebrow: "Klare Rollen im Umfeld von VoiceOpenGov",
    title: "Verbunden, aber nicht gleichgesetzt.",
    body: "VoiceOpenGov organisiert eigene demokratische Willensbildung, einen dynamischen Programmstand, regionale Präsenz und Repräsentation. eDebatte ist eine unabhängige offene Infrastruktur, die VoiceOpenGov nutzt, ohne für VoiceOpenGov zu entscheiden. Vote4Gov ist Ricky Gerd Fleischers persönliche öffentliche Stimme. Voxy erklärt, strukturiert und übersetzt, ohne Entscheidungen zu treffen.",
    footerLine: "Transparenz über Rollen, Finanzierung, Programmstände und Zuständigkeiten ist Teil des Aufbaus.",
    items: {
      edebatte: {
        role: "Unabhängige Evidenz- & Beteiligungsinfrastruktur",
        description: "Für Dossiers, Quellen, Gegenpositionen, Alternativen und Beteiligung – offen für unterschiedliche gesellschaftliche Akteure und nicht im Eigentum von VoiceOpenGov.",
      },
      voiceopengov: {
        role: "Bürgerbewegung & regionale Repräsentation",
        description: "Mitglieder und regionale Communities bilden den eigenen demokratischen Willen und einen versionierten Programmstand. Die rechtliche Trägerstruktur befindet sich noch im Aufbau.",
      },
      vote4gov: {
        role: "Persönliche öffentliche Stimme",
        description: "Ricky Gerd Fleischers persönlicher Blick auf Geschichte, Systemkritik, internationale Vergleiche und seinen politischen Ordnungsentwurf – nicht automatisch eine VoiceOpenGov-Position.",
      },
      voxy: {
        role: "Assistenz",
        description: "Erklärt, strukturiert und übersetzt. Voxy unterstützt beim Verstehen und trifft keine politischen oder organisatorischen Entscheidungen.",
      },
    },
  },
  en: {
    eyebrow: "Clear roles around VoiceOpenGov",
    title: "Connected, but not conflated.",
    body: "VoiceOpenGov organises its own democratic will formation, a dynamic programme state, regional presence and representation. eDebatte is an independent open infrastructure used by VoiceOpenGov without deciding VoiceOpenGov positions. Vote4Gov is Ricky Gerd Fleischer's personal public voice. Voxy explains, structures and translates without making decisions.",
    footerLine: "Transparency about roles, funding, programme states and responsibilities is part of the build-up.",
    items: {
      edebatte: {
        role: "Independent evidence & participation infrastructure",
        description: "For dossiers, sources, counterpositions, alternatives and participation — open to different parts of society and not owned by VoiceOpenGov.",
      },
      voiceopengov: {
        role: "Civic movement & regional representation",
        description: "Members and regional communities form the movement's own democratic will and a versioned programme state. The final legal entity structure is still being established.",
      },
      vote4gov: {
        role: "Personal public voice",
        description: "Ricky Gerd Fleischer's personal view on history, system criticism, international comparisons and his political order design — not automatically a VoiceOpenGov position.",
      },
      voxy: {
        role: "Assistant",
        description: "Explains, structures and translates. Voxy supports understanding and does not make political or organisational decisions.",
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
  const brandCopy = locale === "de"
    ? {
        claim: "Bürgerbeteiligung & regionale Repräsentation.",
        body: "Für einen dynamischen, nachvollziehbaren Programmstand mit sichtbaren Mehrheiten, Minderheitenpositionen und Änderungen.",
      }
    : locale === "en"
      ? {
          claim: "Civic participation & regional representation.",
          body: "For a dynamic, traceable programme state with visible majorities, minority positions and changes.",
        }
      : strings.brand;

  return (
    <footer className="border-t border-white/10 bg-[#020617] text-[#f8fafc]" role="contentinfo">
      <section aria-labelledby="ecosystem-heading" className="border-b border-white/10 bg-[#0b1220]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-18">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">{ecosystem.eyebrow}</p>
              <h2 id="ecosystem-heading" className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{ecosystem.title}</h2>
            </div>
            <p className="max-w-3xl text-base leading-7 text-slate-300">{ecosystem.body}</p>
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <a href={EDEBATTE_URL} className="group rounded-3xl border border-white/10 bg-[#020617]/70 p-5 transition hover:-translate-y-0.5 hover:border-[#18cfc8]/45">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#18cfc8]">{ecosystem.items.edebatte.role}</span>
              <strong className="mt-3 block text-xl">eDebatte ↗</strong>
              <span className="mt-3 block text-sm leading-6 text-slate-400 transition group-hover:text-slate-300">{ecosystem.items.edebatte.description}</span>
            </a>
            <Link href="/" aria-current="page" className="group rounded-3xl border border-[#18cfc8]/45 bg-[#18cfc8]/10 p-5 shadow-[0_20px_55px_rgba(24,207,200,0.06)] transition hover:-translate-y-0.5">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#18cfc8]">{ecosystem.items.voiceopengov.role}</span>
              <strong className="mt-3 block text-xl">VoiceOpenGov</strong>
              <span className="mt-3 block text-sm leading-6 text-slate-300 transition group-hover:text-white">{ecosystem.items.voiceopengov.description}</span>
            </Link>
            <a href={VOTE4GOV_URL} className="group rounded-3xl border border-white/10 bg-[#020617]/70 p-5 transition hover:-translate-y-0.5 hover:border-[#18cfc8]/45">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#18cfc8]">{ecosystem.items.vote4gov.role}</span>
              <strong className="mt-3 block text-xl">Vote4Gov ↗</strong>
              <span className="mt-3 block text-sm leading-6 text-slate-400 transition group-hover:text-slate-300">{ecosystem.items.vote4gov.description}</span>
            </a>
            <article className="rounded-3xl border border-white/10 bg-[#020617]/70 p-5">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#18cfc8]">{ecosystem.items.voxy.role}</span>
              <strong className="mt-3 block text-xl">Voxy</strong>
              <span className="mt-3 block text-sm leading-6 text-slate-400">{ecosystem.items.voxy.description}</span>
            </article>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] transition hover:text-[#18cfc8]">VoiceOpenGov</Link>
            <p className="mt-3 font-bold text-[#f8fafc]">{brandCopy.claim}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{brandCopy.body}</p>
          </div>
          <FooterNav title={strings.columns.main} ariaLabel={strings.aria.main} links={strings.links.main} />
          <FooterNav title={strings.columns.initiatives} ariaLabel={strings.aria.initiatives} links={strings.links.initiatives} />
          <FooterNav title={strings.columns.legal} ariaLabel={strings.aria.legal} links={strings.links.legal} />
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex md:items-start md:justify-between md:gap-8">
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
      <p className="text-sm font-bold text-[#f8fafc]">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            {link.external ? (
              <a href={link.href} className="transition hover:text-[#18cfc8]">{link.label}</a>
            ) : (
              <Link href={link.href} className="transition hover:text-[#18cfc8]">{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
