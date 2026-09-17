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
    eyebrow: "Vier Rollen. Klare Trennung.",
    title: "Was VoiceOpenGov ist – und was nicht.",
    body: "VoiceOpenGov ist die Initiative und Community. Sie nutzt eDebatte als eigenständige offene Entscheidungsinfrastruktur. Voxy unterstützt beim Verstehen. Vote4Gov bleibt ein eigenständiges Projekt und spricht nicht für VoiceOpenGov.",
    footerLine: "Rollen, Finanzierung, KI-Einsatz und Entscheidungen sollen nachvollziehbar bleiben.",
    items: {
      edebatte: {
        role: "Eigenständige offene Infrastruktur",
        description: "Bereitet Themen, Quellen, Aussagen, Gegenpositionen, Alternativen und offene Unsicherheiten nachvollziehbar auf. Die Entscheidung bleibt beim Menschen.",
      },
      voiceopengov: {
        role: "Offene Initiative & Community",
        description: "Organisiert Menschen, Beteiligung und regionale Mitwirkung. VoiceOpenGov befindet sich derzeit in der Aufbauphase.",
      },
      vote4gov: {
        role: "Eigenständiges Projekt",
        description: "Wird getrennt von VoiceOpenGov geführt. Inhalte oder Positionen dort sind keine Beschlüsse oder verbindlichen Positionen von VoiceOpenGov.",
      },
      voxy: {
        role: "Assistenz",
        description: "Erklärt, strukturiert und übersetzt. Voxy unterstützt beim Verstehen und trifft keine Entscheidungen für Menschen.",
      },
    },
  },
  en: {
    eyebrow: "Four roles. Clear separation.",
    title: "What VoiceOpenGov is — and what it is not.",
    body: "VoiceOpenGov is the initiative and community. It uses eDebatte as an independent open decision infrastructure. Voxy supports understanding. Vote4Gov remains a separate project and does not speak for VoiceOpenGov.",
    footerLine: "Roles, funding, AI use and decisions should remain traceable.",
    items: {
      edebatte: {
        role: "Independent open infrastructure",
        description: "Structures topics, sources, claims, counterpositions, alternatives and open uncertainty in a traceable way. Decisions remain human.",
      },
      voiceopengov: {
        role: "Open initiative & community",
        description: "Organises people, participation and regional engagement. VoiceOpenGov is currently in its build-up phase.",
      },
      vote4gov: {
        role: "Separate project",
        description: "Operates separately from VoiceOpenGov. Content or positions there are not decisions or binding positions of VoiceOpenGov.",
      },
      voxy: {
        role: "Assistant",
        description: "Explains, structures and translates. Voxy supports understanding and does not make decisions for people.",
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
              <span className="mt-3 block text-sm leading-6 text-slate-300 transition group-hover:text-slate-200">{ecosystem.items.voiceopengov.description}</span>
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
            <p className="mt-3 font-bold text-[#f8fafc]">{ecosystem.items.voiceopengov.role}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{ecosystem.items.voiceopengov.description}</p>
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
