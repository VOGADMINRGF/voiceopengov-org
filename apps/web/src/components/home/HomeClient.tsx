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

export type HomeRelaunchCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  ctaJoin: string;
  ctaModel: string;
  whyEyebrow: string;
  whyTitle: string;
  whyLead: string;
  whyItems: Item[];
  bridge: string;
  ecosystemEyebrow: string;
  ecosystemTitle: string;
  ecosystemBody: string;
  ecosystemItems: Item[];
  edebatteTitle: string;
  edebatteBody: string;
  edebatteCta: string;
  regionalTitle: string;
  regionalBody: string;
  regionalItems: Item[];
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
    title: "Gemeinsam für informierte demokratische Beteiligung.",
    intro:
      "VoiceOpenGov ist eine politische Bürger- und Mitgliederbewegung im Aufbau. Mitglieder und regionale Communities entwickeln einen dynamischen Programmstand; Mehrheiten, Minderheitenpositionen und Änderungen sollen nachvollziehbar bleiben.",
    ctaJoin: "Mitmachen",
    ctaModel: "Warum das fehlt",
    whyEyebrow: "Gesellschaftliche Lücke",
    whyTitle: "Viele Akteure. Oft fehlt die durchgängige Verbindung.",
    whyLead:
      "Parteien, direkte Demokratie, Wissensplattformen und digitale Bürgerbeteiligung erfüllen jeweils wichtige Aufgaben. Häufig fehlt eine nachvollziehbare Spur vom Verstehen über Beteiligung und eigene Willensbildung bis zur Repräsentation und Wirkung.",
    whyItems: [
      { title: "Parteien", body: "Bündeln Programme, Interessen und Personal." },
      { title: "Direkte Demokratie", body: "Entscheidet konkrete Sachfragen, wo entsprechende Verfahren vorgesehen sind." },
      { title: "Wissensplattformen", body: "Strukturieren Informationen und Quellen." },
      { title: "Bürgerbeteiligung", body: "Organisiert häufig einzelne Verfahren von Verwaltungen oder Institutionen." },
    ],
    bridge: "VoiceOpenGov soll diese Systeme nicht ersetzen. Die Bewegung organisiert eigene demokratische Willensbildung, regionale Präsenz und nachvollziehbare Repräsentation auf einer prüfbaren Informationsbasis.",
    ecosystemEyebrow: "Rollen & Angebote",
    ecosystemTitle: "Eine Bewegung. Getrennte Rollen und Werkzeuge.",
    ecosystemBody:
      "VoiceOpenGov bildet seinen eigenen demokratischen Willen und dynamischen Programmstand. eDebatte ist eine unabhängige offene Infrastruktur für Quellen, Dossiers, Gegenpositionen, Alternativen und Beteiligung; sie entscheidet nicht automatisch für VoiceOpenGov.",
    ecosystemItems: [
      { title: "VoiceOpenGov Bewegung", body: "Mitglieder und regionale Communities entwickeln den eigenen, versionierten Programmstand. Mehrheiten und Minderheitenpositionen bleiben sichtbar; die rechtliche Trägerstruktur befindet sich noch im Aufbau." },
      { title: "eDebatte", body: "Unabhängige offene Infrastruktur für Entscheidungsdossiers, Aussagen, Gegenpositionen, Quellen, Alternativen und Beteiligung – nutzbar auch außerhalb von VoiceOpenGov." },
      { title: "Regionale Präsenz", body: "Im Aufbau: lokale Teams, Treffen und Beteiligungsformate. Hubs und mobile Formate kommen nur dort hinzu, wo sie tatsächlich aufgebaut wurden." },
      { title: "Programm & Wirkung", body: "Im Aufbau: versionierter Programmstand, Entscheidungswege, Mehrheits- und Minderheitenbilder sowie nachvollziehbare Wirkungsverfolgung." },
      { title: "Data & Media Services", body: "Perspektive: APIs, Dashboards und redaktionelle Werkzeuge für nachvollziehbare öffentliche Informationen." },
    ],
    edebatteTitle: "eDebatte bleibt unabhängig – auch wenn VoiceOpenGov es intensiv nutzt.",
    edebatteBody:
      "Aus Quellen werden strukturierte Aussagen, Gegenpositionen, Alternativen und offene Unsicherheiten. Dasselbe Dossier kann von Bürgern, Medien, Wissenschaft, Kommunen oder anderen Organisationen genutzt werden. VoiceOpenGov entscheidet seinen eigenen Programmstand nach den eigenen Governance-Regeln.",
    edebatteCta: "eDebatte öffnen",
    regionalTitle: "Digital reicht nicht. Repräsentation braucht regionale Präsenz.",
    regionalBody:
      "VoiceOpenGov will regionale Communities, Teams und wiederkehrende Formate aufbauen. Beteiligungsorte, Hubs oder mobile Angebote werden erst als verfügbar bezeichnet, wenn sie tatsächlich bestehen.",
    regionalItems: [
      { title: "Teams & Treffen", body: "Lokaler Austausch, Beteiligung und Aufbau regionaler Communities in nachvollziehbar organisierten Formaten." },
      { title: "Beteiligungsorte", body: "Perspektive für wiederkehrende lokale Anlaufpunkte und Formate, sobald sie real aufgebaut und verifiziert sind." },
      { title: "Mobil vor Ort", body: "Perspektive für mobile Formate und Busse – kein flächendeckendes Versprechen, solange die Struktur nicht besteht." },
    ],
    trustTitle: "Vertrauen beginnt bei der eigenen Architektur.",
    trustBody: "Finanzierung, Quellen, KI-Einsatz, Entscheidungen, Programmversionen, Minderheitenpositionen und Governance sollen nachvollziehbar bleiben – einschließlich offener Lücken und Aufbauphasen.",
    trustItems: ["Finanzierung", "Quellen", "KI-Einsatz", "Entscheidungen", "Governance", "Wirkung"],
    questionsTitle: "50 große Fragen. Kein eingefrorenes Programm.",
    questionsBody: "Die Kernfragen strukturieren den Einstieg. Daraus kann ein versionierter VoiceOpenGov-Programmstand entstehen, der sich durch neue Evidenz und neue demokratische Mehrheiten ändern darf.",
    questionsCta: "50 Fragen ansehen",
    joinTitle: "Den passenden Einstieg wählen.",
    joinBody:
      "Mitgliedschaft, aktive Mitarbeit an öffentlichen Fragen und regionale Mitwirkung sind unterschiedliche Wege. Die Mitmachen-Seite erklärt transparent, was heute bereits möglich ist und was noch aufgebaut wird.",
    joinCta: "Mitmachen ansehen",
    supportTitle: "Aufbau ermöglichen, ohne Einfluss zu verkaufen.",
    supportBody: "Freiwillige finanzielle Unterstützung verändert weder Stimmgewicht noch politische oder redaktionelle Rechte und ist von der Mitgliedschaft getrennt.",
    supportCta: "Unterstützen",
  },
  en: {
    eyebrow: "VoiceOpenGov",
    title: "Together for informed democratic participation.",
    intro:
      "VoiceOpenGov is a civic and membership movement being built. Members and regional communities develop a dynamic programme state while majorities, minority positions and later changes remain traceable.",
    ctaJoin: "Participate",
    ctaModel: "Why this matters",
    whyEyebrow: "Societal gap",
    whyTitle: "Many actors. The continuous connection is often missing.",
    whyLead:
      "Parties, direct democracy, knowledge platforms and digital civic participation each serve important roles. What is often missing is a traceable path from understanding through participation and internal democratic will formation to representation and impact.",
    whyItems: [
      { title: "Parties", body: "Bundle programmes, interests and personnel." },
      { title: "Direct democracy", body: "Decides specific public questions where corresponding procedures exist." },
      { title: "Knowledge platforms", body: "Structure information and sources." },
      { title: "Civic participation", body: "Often organises individual procedures run by administrations or institutions." },
    ],
    bridge: "VoiceOpenGov is not intended to replace these systems. The movement organises its own democratic will formation, regional presence and traceable representation on a reviewable information basis.",
    ecosystemEyebrow: "Roles & services",
    ecosystemTitle: "One movement. Separate roles and tools.",
    ecosystemBody:
      "VoiceOpenGov forms its own democratic will and dynamic programme state. eDebatte is an independent open infrastructure for sources, dossiers, counterpositions, alternatives and participation; it does not automatically decide VoiceOpenGov positions.",
    ecosystemItems: [
      { title: "VoiceOpenGov movement", body: "Members and regional communities develop the movement's own versioned programme state. Majorities and minority positions remain visible; the final legal entity structure is still being established." },
      { title: "eDebatte", body: "Independent open infrastructure for decision dossiers, claims, counterpositions, sources, alternatives and participation — usable beyond VoiceOpenGov." },
      { title: "Regional presence", body: "Being built: local teams, meetings and participation formats. Hubs and mobile formats are only presented as available where they actually exist." },
      { title: "Programme & impact", body: "Being built: a versioned programme state, decision paths, majority and minority views, and traceable impact tracking." },
      { title: "Data & Media Services", body: "Planned: APIs, dashboards and newsroom tools for traceable public information." },
    ],
    edebatteTitle: "eDebatte remains independent even when VoiceOpenGov uses it extensively.",
    edebatteBody:
      "Sources become structured claims, counterpositions, alternatives and visible uncertainty. The same dossier can be used by citizens, media, science, municipalities or other organisations. VoiceOpenGov decides its own programme state under its own governance rules.",
    edebatteCta: "Open eDebatte",
    regionalTitle: "Digital is not enough. Representation needs regional presence.",
    regionalBody:
      "VoiceOpenGov intends to build regional communities, teams and recurring formats. Participation venues, hubs or mobile offers are only described as available once they actually exist.",
    regionalItems: [
      { title: "Teams & meetings", body: "Local exchange, participation and regional community building in transparently organised formats." },
      { title: "Participation venues", body: "A future option for recurring local touchpoints and formats once they are genuinely built and verified." },
      { title: "Mobile presence", body: "A future option for mobile formats and buses — not a broad operating claim before the structure exists." },
    ],
    trustTitle: "Trust starts with our own architecture.",
    trustBody: "Funding, sources, AI use, decisions, programme versions, minority positions and governance should remain traceable — including open gaps and work in progress.",
    trustItems: ["Funding", "Sources", "AI use", "Decisions", "Governance", "Impact"],
    questionsTitle: "50 major questions. No frozen programme.",
    questionsBody: "The core questions structure the starting point. They can feed a versioned VoiceOpenGov programme state that may change with new evidence and new democratic majorities.",
    questionsCta: "View 50 questions",
    joinTitle: "Choose the right way to participate.",
    joinBody:
      "Membership, active work on public questions and regional participation are different paths. The participation page explains transparently what is available today and what is still being built.",
    joinCta: "Explore participation",
    supportTitle: "Enable the build without selling influence.",
    supportBody: "Voluntary financial support changes neither voting weight nor political or editorial rights and remains separate from membership.",
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

  const journeyLabels = renderedLocale === "de"
    ? ["Information", "Debatte", "Beteiligung", "Entscheidungsgrundlage", "Wirkung"]
    : ["Information", "Debate", "Participation", "Decision information", "Impact"];

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
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#18cfc8]">Information → Wirkung</p>
            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-200">
              {journeyLabels.map((label, index) => (
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
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {copy.ecosystemItems.map((item, index) => (
              <article key={item.title} className={cardClass}>
                <span className="font-mono text-xs text-[#18cfc8]">0{index + 1}</span>
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
                  <h3 className="font-black">{item.title}</h3>
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
