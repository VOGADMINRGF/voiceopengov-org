"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCountryOptions } from "@/lib/countries";
import { VOG_QUESTIONS_PATH } from "@/config/links";
import type { SupportedLocale } from "@/config/locales";
import RegionalInterestForm from "../vor-ort/RegionalInterestForm";
import { getRegionalActivationStrings } from "../vor-ort/strings";

type Notice = { ok: boolean; text: string } | null;

const COPY = {
  de: {
    eyebrow: "Mitmachen",
    title: "Ein Einstieg. Drei klare Wege.",
    intro:
      "Mitglied werden, an öffentlichen Fragen arbeiten oder vor Ort aktiv werden. Alles beginnt hier – ohne parallele Anmeldestrecken.",
    member: "Kostenfrei Mitglied werden",
    memberBody:
      "Mitgliedschaft schafft Zugang zu VoiceOpenGov. Geld oder Status verändern niemals dein Stimmgewicht.",
    questions: "An öffentlichen Fragen mitarbeiten",
    questionsBody:
      "Wähle eine der 50 Fragen und steige direkt in die inhaltliche Arbeit ein.",
    region: "Vor Ort aktiv werden",
    regionBody:
      "Menschen in deiner Region finden, Treffen anstoßen oder mit Raum, Kontakten und Erfahrung helfen.",
    formTitle: "Mitgliedschaft starten",
    formHint: "Kostenfrei. Double Opt-in. Mindestalter 16 Jahre.",
    firstName: "Vorname",
    lastName: "Nachname",
    birthDate: "Geburtsdatum",
    email: "E-Mail",
    city: "Ort",
    country: "Land",
    countryPlaceholder: "Land wählen",
    privacy: "Ich akzeptiere die Datenschutzhinweise und das Double-Opt-In-Verfahren.",
    newsletter: "Ich möchte Updates zu VoiceOpenGov erhalten.",
    submit: "Kostenfrei Mitglied werden",
    submitting: "Wird eingetragen …",
    success: "Fast geschafft. Bitte bestätige jetzt die E-Mail.",
    validation: "Bitte Geburtsdatum, E-Mail, Ort und Datenschutz vollständig angeben.",
    invalidBirthDate: "Bitte gib ein gültiges Geburtsdatum an.",
    underage: "Die Mitgliedschaft ist derzeit ab 16 Jahren möglich.",
    rateLimited: "Zu viele Versuche in kurzer Zeit. Bitte versuche es später erneut.",
    unavailable: "Die Anmeldung ist vorübergehend nicht erreichbar. Bitte versuche es später erneut.",
    error: "Die Anmeldung konnte gerade nicht abgeschlossen werden. Bitte versuche es erneut oder schreibe an members@voiceopengov.org.",
    regionalEyebrow: "Vor Ort",
  },
  en: {
    eyebrow: "Participate",
    title: "One entry point. Three clear paths.",
    intro:
      "Become a member, work on public questions or get active locally. Everything starts here without parallel registration journeys.",
    member: "Become a member for free",
    memberBody:
      "Membership gives access to VoiceOpenGov. Money or status never changes your voting weight.",
    questions: "Work on public questions",
    questionsBody:
      "Choose one of the 50 questions and enter the substantive work directly.",
    region: "Get active locally",
    regionBody:
      "Find people nearby, help start a meetup or contribute space, contacts and experience.",
    formTitle: "Start membership",
    formHint: "Free. Double opt-in. Minimum age 16.",
    firstName: "First name",
    lastName: "Last name",
    birthDate: "Date of birth",
    email: "Email",
    city: "City",
    country: "Country",
    countryPlaceholder: "Choose country",
    privacy: "I accept the privacy notice and double opt-in process.",
    newsletter: "I would like updates about VoiceOpenGov.",
    submit: "Join for free",
    submitting: "Joining …",
    success: "Almost there. Please confirm your email now.",
    validation: "Please provide date of birth, email, city and privacy consent.",
    invalidBirthDate: "Please provide a valid date of birth.",
    underage: "Membership is currently available from age 16.",
    rateLimited: "Too many attempts in a short time. Please try again later.",
    unavailable: "Registration is temporarily unavailable. Please try again later.",
    error: "Registration could not be completed right now. Please try again or email members@voiceopengov.org.",
    regionalEyebrow: "Locally",
  },
} as const;

function apiErrorCode(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const record = data as Record<string, unknown>;
  if (typeof record.error === "string") return record.error;
  if (record.error && typeof record.error === "object") {
    const message = (record.error as Record<string, unknown>).message;
    if (typeof message === "string") return message;
  }
  return undefined;
}

export default function MitmachenClient({ initialLocale }: { initialLocale: SupportedLocale }) {
  const language = initialLocale === "en" ? "en" : "de";
  const copy = COPY[language];
  const regional = getRegionalActivationStrings(initialLocale);
  const countries = useMemo(() => getCountryOptions(initialLocale), [initialLocale]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
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
    if (!birthDate || !email.trim() || !city.trim() || !privacy) {
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
          birthDate,
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
      if (!response.ok || !data?.ok) {
        const code = apiErrorCode(data);
        if (code === "invalid_birthdate") throw new Error("invalid_birthdate");
        if (code === "underage") throw new Error("underage");
        if (code === "rate_limited" || response.status === 429) throw new Error("rate_limited");
        if (code === "registration_temporarily_unavailable" || response.status === 503) throw new Error("unavailable");
        throw new Error("registration_failed");
      }
      setNotice({ ok: true, text: copy.success });
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setEmail("");
      setCity("");
      setCountry("");
      setPrivacy(false);
      setNewsletter(false);
    } catch (error) {
      const code = error instanceof Error ? error.message : "registration_failed";
      const text =
        code === "invalid_birthdate" ? copy.invalidBirthDate :
        code === "underage" ? copy.underage :
        code === "rate_limited" ? copy.rateLimited :
        code === "unavailable" ? copy.unavailable :
        copy.error;
      setNotice({ ok: false, text });
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
          <a href="#vor-ort" className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-[#18cfc8]/50">
            <span className="font-mono text-xs text-[#18cfc8]">03</span>
            <h2 className="mt-4 text-2xl">{copy.region}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.regionBody}</p>
          </a>
        </div>
      </section>

      <section id="mitglied" className="scroll-mt-24 border-t border-white/10 bg-[#0b1220]/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">01 · Mitgliedschaft</p>
            <h2 className="mt-4 text-4xl">{copy.formTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-400">{copy.formHint}</p>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <input aria-label={copy.firstName} autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={copy.firstName} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />
              <input aria-label={copy.lastName} autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={copy.lastName} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />
              <label className="grid gap-2 text-sm font-bold text-slate-300">
                {copy.birthDate}
                <input type="date" required aria-label={copy.birthDate} autoComplete="bday" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 font-normal outline-none focus:border-[#18cfc8]" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-300">
                {copy.email}
                <input type="email" required aria-label={copy.email} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={copy.email} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 font-normal outline-none focus:border-[#18cfc8]" />
              </label>
              <input required aria-label={copy.city} autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} placeholder={copy.city} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />
              <select aria-label={copy.country} autoComplete="country" value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]">
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

      <section id="vor-ort" className="scroll-mt-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">03 · {copy.regionalEyebrow}</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div>
              <h2 className="text-4xl md:text-5xl">{regional.page.title}</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">{regional.page.intro}</p>
              <p className="mt-5 rounded-2xl border border-[#18cfc8]/20 bg-[#18cfc8]/[0.06] px-5 py-4 text-sm leading-7 text-slate-300">{regional.page.promise}</p>
              <div className="mt-6 grid gap-3">
                {regional.page.steps.map((step) => (
                  <div key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h3 className="font-bold text-[#18cfc8]">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <RegionalInterestForm strings={regional} />
          </div>
        </div>
      </section>
    </main>
  );
}
