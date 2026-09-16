"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCountryOptions } from "@/lib/countries";
import { VOG_QUESTIONS_PATH, VOG_ROLES_PATH } from "@/config/links";
import type { SupportedLocale } from "@/config/locales";

type Notice = { ok: boolean; text: string } | null;

const COPY = {
  de: {
    eyebrow: "Mitmachen",
    title: "Ein Einstieg. Nicht fünf Formulare.",
    intro: "Wähle zuerst, wie du mitwirken möchtest. Mitgliedschaft, öffentliche Fragen und regionale Mitarbeit bleiben bewusst getrennte Wege.",
    member: "Kostenfrei Mitglied werden",
    memberBody: "Mitgliedschaft schafft Zugang zur Bewegung, aber kein höheres Stimmgewicht durch Geld oder Status.",
    questions: "An öffentlichen Fragen mitarbeiten",
    questionsBody: "Wähle eine der 50 Fragen und steige dort in die inhaltliche Arbeit ein.",
    region: "Regional mitwirken",
    regionBody: "Quellen beitragen, moderieren, erklären oder vor Ort Menschen zusammenbringen.",
    formTitle: "Mitgliedschaft starten",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail",
    city: "Ort",
    country: "Land",
    countryPlaceholder: "Land wählen",
    privacy: "Ich akzeptiere die Datenschutzhinweise und das Double-Opt-In-Verfahren.",
    newsletter: "Ich möchte Updates zu VoiceOpenGov erhalten.",
    submit: "Kostenfrei Mitglied werden",
    submitting: "Wird eingetragen …",
    success: "Fast geschafft. Bitte bestätige jetzt die E-Mail.",
    error: "Die Anmeldung konnte gerade nicht abgeschlossen werden. Bitte versuche es erneut oder schreibe an members@voiceopengov.org.",
    validation: "Bitte E-Mail, Ort und Datenschutz bestätigen.",
  },
  en: {
    eyebrow: "Participate",
    title: "One entry point. Not five forms.",
    intro: "Choose how you want to participate first. Membership, public questions and regional contribution remain deliberately separate paths.",
    member: "Become a member for free",
    memberBody: "Membership gives access to the movement, but money or status never creates more voting weight.",
    questions: "Work on public questions",
    questionsBody: "Choose one of the 50 questions and enter the substantive work there.",
    region: "Contribute regionally",
    regionBody: "Add sources, moderate, explain or bring people together locally.",
    formTitle: "Start membership",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    city: "City",
    country: "Country",
    countryPlaceholder: "Choose country",
    privacy: "I accept the privacy notice and double opt-in process.",
    newsletter: "I would like updates about VoiceOpenGov.",
    submit: "Join for free",
    submitting: "Joining …",
    success: "Almost there. Please confirm your email now.",
    error: "Registration could not be completed right now. Please try again or email members@voiceopengov.org.",
    validation: "Please provide email, city and privacy consent.",
  },
} as const;

export default function MitmachenClient({ initialLocale }: { initialLocale: SupportedLocale }) {
  const language = initialLocale === "en" ? "en" : "de";
  const copy = COPY[language];
  const countries = useMemo(() => getCountryOptions(initialLocale), [initialLocale]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    if (!email.trim() || !city.trim() || !privacy) {
      setNotice({ ok: false, text: copy.validation });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/members/public-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "person",
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          city: city.trim(),
          country: country || undefined,
          isPublic: true,
          wantsNewsletter: newsletter,
          wantsNewsletterEdDebatte: false,
          locale: initialLocale,
          acquisition: {
            landingPath: "/mitmachen",
            referrer: document.referrer || undefined,
            utmSource: new URLSearchParams(window.location.search).get("utm_source") || undefined,
            utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
            utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) throw new Error("registration_failed");
      setNotice({ ok: true, text: copy.success });
      setFirstName("");
      setLastName("");
      setEmail("");
      setCity("");
      setCountry("");
      setPrivacy(false);
      setNewsletter(false);
    } catch {
      setNotice({ ok: false, text: copy.error });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen text-[#f8fafc]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#18cfc8]">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl md:text-6xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{copy.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <a href="#mitglied" className="rounded-3xl border border-[#18cfc8]/25 bg-white/[0.045] p-6 transition hover:border-[#18cfc8]/60">
            <span className="font-mono text-xs text-[#18cfc8]">01</span>
            <h2 className="mt-4 text-2xl">{copy.member}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.memberBody}</p>
          </a>
          <Link href={VOG_QUESTIONS_PATH} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-[#18cfc8]/50">
            <span className="font-mono text-xs text-[#18cfc8]">02</span>
            <h2 className="mt-4 text-2xl">{copy.questions}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.questionsBody}</p>
          </Link>
          <Link href={VOG_ROLES_PATH} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-[#18cfc8]/50">
            <span className="font-mono text-xs text-[#18cfc8]">03</span>
            <h2 className="mt-4 text-2xl">{copy.region}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.regionBody}</p>
          </Link>
        </div>
      </section>

      <section id="mitglied" className="scroll-mt-24 border-t border-white/10 bg-[#0b1220]/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">01 · Mitgliedschaft</p>
            <h2 className="mt-4 text-4xl">{copy.formTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-400">Kostenfrei. Double Opt-in. Keine stärkere Stimme durch höhere Beiträge.</p>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <input aria-label={copy.firstName} autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={copy.firstName} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />
              <input aria-label={copy.lastName} autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={copy.lastName} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />
              <input type="email" required aria-label={copy.email} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={copy.email} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />
              <input required aria-label={copy.city} autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} placeholder={copy.city} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />
              <select aria-label={copy.country} autoComplete="country" value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8] sm:col-span-2">
                <option value="">{copy.countryPlaceholder}</option>
                {countries.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
              </select>
            </div>

            <label className="mt-6 flex items-start gap-3 text-sm text-slate-300">
              <input type="checkbox" required checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-1 shrink-0" />
              <span>{copy.privacy}</span>
            </label>
            <label className="mt-3 flex items-start gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="mt-1 shrink-0" />
              <span>{copy.newsletter}</span>
            </label>

            {notice ? (
              <p role={notice.ok ? "status" : "alert"} aria-live="polite" className={`mt-5 rounded-xl px-4 py-3 text-sm ${notice.ok ? "bg-emerald-400/15 text-emerald-200" : "bg-red-400/15 text-red-200"}`}>
                {notice.text}
              </p>
            ) : null}

            <button disabled={submitting} className="mt-6 w-full rounded-full bg-gradient-to-r from-[#1a8cff] to-[#18cfc8] px-5 py-3.5 font-black text-[#071727] disabled:opacity-60">
              {submitting ? copy.submitting : copy.submit}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
