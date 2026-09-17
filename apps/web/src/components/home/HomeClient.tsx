"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  EDEBATTE_SIGNUP_URL,
  VOG_JOIN_PATH,
  VOG_QUESTIONS_PATH,
  VOG_TRANSPARENCY_PATH,
} from "@/config/links";
import type { SupportedLocale } from "@/config/locales";

type Item = { title: string; body: string };
type StatusItem = Item & { status: string };

export type HomeRelaunchCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  ctaJoin: string;
  ctaModel: string;
  flowTitle: string;
  flowItems: string[];
  whyEyebrow: string;
  whyTitle: string;
  whyLead: string;
  whyItems: Item[];
  bridge: string;
  ecosystemEyebrow: string;
  ecosystemTitle: string;
  ecosystemBody: string;
  ecosystemItems: StatusItem[];
  edebatteTitle: string;
  edebatteBody: string;
  edebatteCta: string;
  regionalTitle: string;
  regionalBody: string;
  regionalItems: StatusItem[];
  trustTitle: string;
  trustBody: string;
  trustItems: string[];
  questionsTitle: string;
  questionsBody: string;
  questionsCta: string;
  joinTitle: string;
  joinBody: string;
  joinCta: string;
  supportTitle: string;
  supportBody: string;
  supportCta: string;
};

export const HOME_RELAUNCH_COPY: Record<"de" | "en", HomeRelaunchCopy> = {
  de: {
    eyebrow: "VoiceOpenGov",
    title: "Menschen, Informationen und Beteiligung nachvollziehbar verbinden.",
    intro:
      "VoiceOpenGov ist eine offene zivilgesellschaftliche Initiative in der Aufbauphase. Sie organisiert Community und Beteiligung und nutzt eDebatte als eigenständige offene Infrastruktur, um Themen, Quellen und Optionen nachvollziehbar aufzubereiten.",
    ctaJoin: "Mitmachen",
    ctaModel: "Worum es geht",
    flowTitle: "Information → Wirkung",
    flowItems: ["Information", "Debatte", "Beteiligung", "Entscheidungsgrundlage", "Wirkung"],
    whyEyebrow: "Gesellschaftliche Lücke",
    whyTitle: "Viele Akteure. Oft fehlt die durchgängige Verbindung.",
    whyLead:
      "Parteien, direkte Demokratie, Wissensplattformen und digitale Bürgerbeteiligung erfüllen jeweils wichtige Aufgaben. Was häufig fehlt, ist eine nachvollziehbare Spur vom Verstehen über Beteiligung bis zur späteren Wirkung.",
    whyItems: [
      { title: "Parteien", body: "Bündeln Programme, Interessen und Personal." },
      { title: "Direkte Demokratie", body: "Entscheidet konkrete Sachfragen, wo entsprechende Verfahren vorgesehen sind." },
      { title: "Wissensplattformen", body: "Strukturieren Informationen, Quellen und Zusammenhänge." },
      { title: "Bürgerbeteiligung", body: "Organisiert häufig einzelne Verfahren von Verwaltungen oder Institutionen." },
    ],
    bridge:
      "VoiceOpenGov soll diese Akteure nicht ersetzen. Die Initiative will Menschen, nachvollziehbare Entscheidungsgrundlagen und Beteiligung besser miteinander verbinden.",
    ecosystemEyebrow: "Klare Rollen",
    ecosystemTitle: "Drei Ebenen. Keine vermischten Zuständigkeiten.",
    ecosystemBody:
      "VoiceOpenGov organisiert Community und Beteiligung. eDebatte ist die eigenständige offene Entscheidungsinfrastruktur. Voxy unterstützt beim Verstehen. Entscheidungen bleiben bei Menschen und den jeweils zuständigen demokratischen Verfahren.",
    ecosystemItems: [
      {
        title: "VoiceOpenGov",
        status: "Aufbauphase",
        body: "Community, regionale Mitwirkung, Beteiligungsformate und transparente Verantwortungsstrukturen.",
      },
      {
        title: "eDebatte",
        status: "Eigenständig",
        body: "Entscheidungsdossiers, Aussagen, Gegenpositionen, Quellen, Alternativen und offene Unsicherheiten.",
      },
      {
        title: "Voxy",
        status: "Im Aufbau",
        body: "Erklärt, strukturiert und übersetzt. Voxy unterstützt beim Verstehen und entscheidet nicht.",
      },
    ],
    edebatteTitle: "eDebatte bereitet Entscheidungsgrundlagen nachvollziehbar auf.",
    edebatteBody:
      "Aus Quellen werden strukturierte Aussagen, Gegenpositionen, Alternativen und offene Unsicherheiten, ohne politische Entscheidungen vorwegzunehmen. eDebatte ist eigenständig; VoiceOpenGov nutzt diese Infrastruktur.",
    edebatteCta: "eDebatte öffnen",
    regionalTitle: "Digital reicht nicht. Regionale Beteiligung braucht reale Anknüpfungspunkte.",
    regionalBody:
      "Regionale Gruppen und Treffen werden schrittweise aufgebaut. Mobile Formate und feste Orte sind Zielbilder und werden erst als verfügbar bezeichnet, wenn sie tatsächlich bereitstehen.",
    regionalItems: [
      {
        title: "Regionale Gruppen",
        status: "Im Aufbau",
        body: "Interesse erfassen, Menschen zusammenbringen und erste lokale Treffen ermöglichen.",
      },
      {
        title: "Mobile Formate",
        status: "Geplant",
        body: "Workshops, Dialog- und Beteiligungsformate, die temporär vor Ort stattfinden können.",
      },
      {
        title: "Hubs & Orte",
        status: "Perspektive",
        body: "Feste Anlaufpunkte für Community, Veranstaltungen und öffentlich sichtbare Beteiligung.",
      },
    ],
    trustTitle: "Vertrauen beginnt bei der eigenen Architektur.",
    trustBody:
      "Finanzierung, Quellen, KI-Einsatz, Governance und der jeweilige Aufbauzustand müssen nachvollziehbar bleiben.",
    trustItems: ["Finanzierung", "Quellen", "KI-Einsatz", "Entscheidungen", "Governance", "Wirkung"],
    questionsTitle: "50 große Fragen. Keine 50 fertigen Antworten.",
    questionsBody:
      "Öffentliche Räume starten mit Zielkonflikten, Evidenz und offenen Fragen – nicht mit vorgegebenen politischen Antworten.",
    questionsCta: "50 Fragen ansehen",
    joinTitle: "Finde den Einstieg, der zu dir passt.",
    joinBody:
      "Community, aktive Mitarbeit an VoiceOpenGov und regionale Mitwirkung sind unterschiedliche Wege. Die Community-Anmeldung ist in der Aufbauphase ausdrücklich keine Vereins- oder gesellschaftsrechtliche Mitgliedschaft.",
    joinCta: "Einstieg wählen",
    supportTitle: "Aufbau ermöglichen, ohne Einfluss zu verkaufen.",
    supportBody: "Finanzielle Unterstützung verändert weder Stimmgewicht noch redaktionelle Rechte.",
    supportCta: "Unterstützen",
  },
  en: {
    eyebrow: "VoiceOpenGov",
    title: "Connect people, information and participation in a traceable way.",
    intro:
      "VoiceOpenGov is an open civic initiative in its build-up phase. It organises community and participation and uses eDebatte as an independent open infrastructure for structuring topics, sources and options transparently.",
    ctaJoin: "Participate",
    ctaModel: "What this is about",
    flowTitle: "Information → impact",
    flowItems: ["Information", "Debate", "Participation", "Decision basis", "Impact"],
    whyEyebrow: "Societal gap",
    whyTitle: "Many actors. The continuous connection is often missing.",
    whyLead:
      "Parties, direct democracy, knowledge platforms and digital civic participation each serve important roles. What is often missing is a traceable path from understanding through participation to later impact.",
    whyItems: [
      { title: "Parties", body: "Bundle programmes, interests and personnel." },
      { title: "Direct democracy", body: "Decides specific public questions where corresponding procedures exist." },
      { title: "Knowledge platforms", body: "Structure information, sources and context." },
      { title: "Civic participation", body: "Often organises individual procedures run by administrations or institutions." },
    ],
    bridge:
      "VoiceOpenGov is not intended to replace these actors. The initiative aims to connect people, traceable decision bases and participation more effectively.",
    ecosystemEyebrow: "Clear roles",
    ecosystemTitle: "Three layers. No blurred responsibilities.",
    ecosystemBody:
      "VoiceOpenGov organises community and participation. eDebatte is the independent open decision infrastructure. Voxy supports understanding. Decisions remain with people and the democratic procedures responsible for them.",
    ecosystemItems: [
      {
        title: "VoiceOpenGov",
        status: "Build-up phase",
        body: "Community, regional engagement, participation formats and transparent responsibility structures.",
      },
      {
        title: "eDebatte",
        status: "Independent",
        body: "Decision dossiers, claims, counterpositions, sources, alternatives and open uncertainty.",
      },
      {
        title: "Voxy",
        status: "In development",
        body: "Explains, structures and translates. Voxy supports understanding and does not decide.",
      },
    ],
    edebatteTitle: "eDebatte prepares decision bases in a traceable way.",
    edebatteBody:
      "Sources become structured claims, counterpositions, alternatives and visible uncertainty without pre-empting political decisions. eDebatte is independent; VoiceOpenGov uses this infrastructure.",
    edebatteCta: "Open eDebatte",
    regionalTitle: "Digital is not enough. Regional participation needs real-world touchpoints.",
    regionalBody:
      "Regional groups and meetings are being built step by step. Mobile formats and permanent locations are target concepts and are only described as available once they actually exist.",
    regionalItems: [
      {
        title: "Regional groups",
        status: "In development",
        body: "Capture interest, connect people and enable first local meetings.",
      },
      {
        title: "Mobile formats",
        status: "Planned",
        body: "Workshops, dialogue and participation formats that can take place temporarily on site.",
      },
      {
        title: "Hubs & locations",
        status: "Future concept",
        body: "Permanent touchpoints for community, events and visible public participation.",
      },
    ],
    trustTitle: "Trust starts with our own architecture.",
    trustBody:
      "Funding, sources, AI use, governance and the actual build status need to remain traceable.",
    trustItems: ["Funding", "Sources", "AI use", "Decisions", "Governance", "Impact"],
    questionsTitle: "50 major questions. Not 50 finished answers.",
    questionsBody:
      "Public spaces start with trade-offs, evidence and open questions — not predetermined political answers.",
    questionsCta: "View 50 questions",
    joinTitle: "Choose the way in that fits you.",
    joinBody:
      "Community participation, active work on VoiceOpenGov and regional engagement are different paths. During the build-up phase, community registration is explicitly not membership in a legal association or company.",
    joinCta: "Choose an entry point",
    supportTitle: "Enable the build without selling influence.",
    supportBody: "Financial support changes neither voting weight nor editorial rights.",
    supportCta: "Support",
  },
};

const sectionClass = "mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20";
const cardClass = "rounded-3xl border border-white/10 bg-white/[0.04] p-6";

export default function HomeClient({
  copy = HOME_RELAUNCH_COPY.de,
  renderedLocale,
}: {
  copy: HomeRelaunchCopy;
  renderedLocale: SupportedLocale;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    const params = new URLSearchParams(window.location.search);
    void fetch("/api/funnel/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event: "landing_viewed",
        sessionId: sessionStorage.getItem("vog_funnel_session") || undefined,
        source: params.get("utm_source") || undefined,
        medium: params.get("utm_medium") || undefined,
        campaign: params.get("utm_campaign") || undefined,
        locale: renderedLocale,
        landingPath: window.location.pathname,
      }),
    }).catch(() => undefined);
  }, [renderedLocale]);

  return (
    <main className="min-h-screen overflow-hidden text-[#f8fafc]">
      <section className="relative isolate border-b border-white/10">
        <div className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-10 px-5 py-20 md:px-8 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#18cfc8]">{copy.eyebrow}</p>
            <h1 className="mt-5 max-w-5xl text-5xl leading-[0.98] md:text-7xl">{copy.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">{copy.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={VOG_JOIN_PATH} className="rounded-full bg-gradient-to-r from-[#1a8cff] to-[#18cfc8] px-6 py-3 font-black text-[#071727]">
                {copy.ctaJoin}
              </Link>
              <a href="#warum" className="rounded-full border border-white/15 px-6 py-3 font-bold text-slate-200 hover:border-[#18cfc8]/55 hover:text-[#18cfc8]">
                {copy.ctaModel}
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#18cfc8]/20 bg-white/[0.035] p-7 shadow-2xl shadow-black/20">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#18cfc8]">{copy.flowTitle}</p>
            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-200">
              {copy.flowItems.map((label, index) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3">
                  <span className="font-mono text-xs text-[#18cfc8]">0{index + 1}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="warum" className={sectionClass}>
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#18cfc8]">{copy.whyEyebrow}</p>
          <h2 className="mt-4 text-4xl md:text-6xl">{copy.whyTitle}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{copy.whyLead}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {copy.whyItems.map((item) => (
            <article key={item.title} className={cardClass}>
              <h3 className="text-lg font-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 border-l-2 border-[#18cfc8] pl-5 text-xl font-semibold leading-8 text-slate-200">{copy.bridge}</p>
      </section>

      <section className="border-y border-white/10 bg-[#0b1220]/75">
        <div className={sectionClass}>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#18cfc8]">{copy.ecosystemEyebrow}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <h2 className="text-4xl md:text-6xl">{copy.ecosystemTitle}</h2>
            <p className="text-lg leading-8 text-slate-300">{copy.ecosystemBody}</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.ecosystemItems.map((item, index) => (
              <article key={item.title} className={cardClass}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[#18cfc8]">0{index + 1}</span>
                  <span className="rounded-full border border-[#18cfc8]/25 bg-[#18cfc8]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#18cfc8]">
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="grid gap-5 lg:grid-cols-2">
          <article className={`${cardClass} p-8`}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">eDebatte</p>
            <h2 className="mt-4 text-3xl md:text-4xl">{copy.edebatteTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">{copy.edebatteBody}</p>
            <a href={EDEBATTE_SIGNUP_URL} className="mt-7 inline-flex rounded-full border border-[#18cfc8]/45 px-5 py-2.5 font-black text-[#18cfc8] hover:bg-[#18cfc8]/10">
              {copy.edebatteCta} ↗
            </a>
          </article>
          <article className={`${cardClass} p-8`}>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">Regional</p>
            <h2 className="mt-4 text-3xl md:text-4xl">{copy.regionalTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">{copy.regionalBody}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {copy.regionalItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                    {item.status}
                  </span>
                  <h3 className="mt-3 font-black">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#f8fafc] text-[#071727]">
        <div className={sectionClass}>
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-4xl md:text-5xl">{copy.trustTitle}</h2>
              <p className="mt-5 text-lg leading-8 text-[#071727]/65">{copy.trustBody}</p>
              <Link href={VOG_TRANSPARENCY_PATH} className="mt-6 inline-flex font-black text-[#0e8e91]">Transparenz →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {copy.trustItems.map((item) => (
                <div key={item} className="rounded-2xl border border-[#071727]/10 px-4 py-4 font-bold">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-4xl md:text-5xl">{copy.questionsTitle}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{copy.questionsBody}</p>
          </div>
          <Link href={VOG_QUESTIONS_PATH} className="inline-flex rounded-full border border-white/15 px-5 py-3 font-black hover:border-[#18cfc8]/55 hover:text-[#18cfc8]">{copy.questionsCta} →</Link>
        </div>
      </section>

      <section id="mitmachen" className="scroll-mt-24 border-t border-white/10 bg-[#0b1220]/75">
        <div className={`${sectionClass} grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center`}>
          <div>
            <h2 className="text-4xl md:text-5xl">{copy.joinTitle}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{copy.joinBody}</p>
          </div>
          <Link href={VOG_JOIN_PATH} className="inline-flex rounded-full bg-gradient-to-r from-[#1a8cff] to-[#18cfc8] px-6 py-3.5 font-black text-[#071727]">{copy.joinCta} →</Link>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className={`${sectionClass} flex flex-col gap-5 md:flex-row md:items-center md:justify-between`}>
          <div>
            <h2 className="text-2xl">{copy.supportTitle}</h2>
            <p className="mt-2 text-slate-400">{copy.supportBody}</p>
          </div>
          <Link href="/unterstuetzen" className="inline-flex rounded-full border border-white/15 px-5 py-3 font-bold hover:border-[#18cfc8]/55 hover:text-[#18cfc8]">{copy.supportCta}</Link>
        </div>
      </section>
    </main>
  );
}
