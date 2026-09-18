"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getCountryOptions } from "@/lib/countries";
import { EDEBATTE_URL, VOG_SUPPORT_PATH } from "@/config/links";
import type { SupportedLocale } from "@/config/locales";
import RegionalInterestForm from "../vor-ort/RegionalInterestForm";
import { getRegionalActivationStrings } from "../vor-ort/strings";

type Notice = { ok: boolean; text: string } | null;
type ParticipationMode = "active" | "member";

const COPY = {
  de: {
    eyebrow: "Mitmachen",
    title: "Hallo Nachbar. Hier kannst du etwas bewegen.",
    intro:
      "VoiceOpenGov verbindet Menschen, die gesellschaftliche Entscheidungen näher an die Menschen bringen wollen – in ihrer Nachbarschaft, ihrem Ort, ihrer Region und darüber hinaus.",
    orientation:
      "Du brauchst kein Parteibuch, keine politische Karriere und keine fertige Ortsgruppe. Wenn du dich in klassischen politischen Angeboten nicht wiederfindest oder Beteiligung unmittelbarer erleben möchtest, kannst du hier einfach anfangen.",
    joinKicker: "Dabei sein",
    joinTitle: "Kostenfrei einsteigen",
    joinBody:
      "Bleib verbunden, bring dich ein, wenn du möchtest, und entscheide später selbst, wie viel Zeit oder Verantwortung du übernehmen willst.",
    regionKicker: "Vor Ort",
    regionTitle: "Für deine Nachbarn etwas bewegen",
    regionBody:
      "Bring Menschen zusammen, ermögliche einen Treffpunkt, teile Wissen oder hilf beim Aufbau einer regionalen eDebatte × VoiceOpenGov-Anlaufstelle.",
    debateKicker: "Themen",
    debateTitle: "Fragen gemeinsam entscheiden",
    debateBody:
      "Thesen, Quellen, Gegenpositionen und Abstimmungen gehören in eDebatte. Dort entsteht der gültige Entscheid, den VoiceOpenGov politisch vertritt.",
    formEyebrow: "Dein Einstieg",
    formTitle: "Sei dabei – so, wie es zu dir passt.",
    formHint:
      "Du kannst zunächst einfach verbunden bleiben oder dich aktiv einbringen. Beides ist kostenfrei und du kannst später jederzeit wechseln.",
    legalHint:
      "Statushinweis: Die Community-Anmeldung ist derzeit keine Vereins- oder Parteimitgliedschaft. Ein späterer formaler Mitgliedschaftsstatus wird separat und transparent ausgewiesen.",
    selectedActive: "Ich möchte aktiv mitgestalten",
    selectedMember: "Ich möchte erst einmal dabei sein",
    modeQuestion: "Wie möchtest du starten?",
    modeActive: "Aktiv mitgestalten",
    modeActiveHint:
      "Ich möchte Aufgaben übernehmen, regional mit aufbauen oder mich regelmäßig einbringen.",
    modeMember: "Dabei sein",
    modeMemberHint:
      "Ich möchte verbunden bleiben, Updates erhalten und selbst entscheiden, wann ich aktiver werde.",
    firstName: "Vorname",
    lastName: "Nachname",
    birthDate: "Geburtsdatum",
    birthDateHint: "Erforderlich, weil die Community-Anmeldung derzeit ab 16 Jahren möglich ist.",
    email: "E-Mail",
    city: "Ort",
    country: "Land",
    countryPlaceholder: "Land wählen",
    privacy: "Ich akzeptiere die Datenschutzhinweise und das Double-Opt-In-Verfahren.",
    newsletter: "Ich möchte Updates zu VoiceOpenGov erhalten.",
    submit: "Kostenfrei dabei sein",
    submitting: "Wird eingetragen …",
    successTitle: "Willkommen – fast geschafft.",
    successBody:
      "Bitte bestätige jetzt deine E-Mail. Danach ist dein Einstieg bei VoiceOpenGov abgeschlossen.",
    successActiveNext:
      "Danach kannst du direkt angeben, wo und wie du aktiv mitwirken möchtest.",
    successMemberNext:
      "Du bleibst verbunden und kannst später jederzeit aktiver mitwirken.",
    validation: "Bitte Geburtsdatum, E-Mail, Ort und Datenschutz vollständig angeben.",
    invalidBirthDate: "Bitte gib ein gültiges Geburtsdatum an.",
    underage: "Die Community-Anmeldung ist derzeit ab 16 Jahren möglich.",
    rateLimited: "Zu viele Versuche in kurzer Zeit. Bitte versuche es später erneut.",
    unavailable: "Die Anmeldung ist vorübergehend nicht erreichbar. Bitte versuche es später erneut.",
    error:
      "Die Anmeldung konnte gerade nicht abgeschlossen werden. Bitte versuche es erneut oder schreibe an members@voiceopengov.org.",
    regionalEyebrow: "Für deine Nachbarschaft",
    regionalLead:
      "VoiceOpenGov soll nicht nur online stattfinden. Regionale Präsenz entsteht dort, wo Menschen ihre Nachbarn zusammenbringen, Fragen aus ihrem Alltag sichtbar machen und Verantwortung vor Ort übernehmen möchten.",
    supportHint: "Du möchtest den Aufbau zusätzlich finanziell unterstützen?",
    supportCta: "Unterstützen",
  },
  en: {
    eyebrow: "Get involved",
    title: "Hello neighbour. This is where you can make a difference.",
    intro:
      "VoiceOpenGov connects people who want public decisions to stay closer to the people affected by them – in their neighbourhood, town, region and beyond.",
    orientation:
      "You do not need a party card, a political career or an existing local group. If traditional political offers do not feel like the right fit, or you want participation to be more direct, you can simply start here.",
    joinKicker: "Join",
    joinTitle: "Start for free",
    joinBody:
      "Stay connected, contribute when you want to and decide later how much time or responsibility you would like to take on.",
    regionKicker: "Locally",
    regionTitle: "Do something for your neighbours",
    regionBody:
      "Bring people together, enable a meeting place, share expertise or help build a regional eDebatte × VoiceOpenGov contact point.",
    debateKicker: "Issues",
    debateTitle: "Decide questions together",
    debateBody:
      "Theses, sources, counterpositions and votes belong in eDebatte. That is where a valid decision is formed for VoiceOpenGov to represent politically.",
    formEyebrow: "Your entry point",
    formTitle: "Join in the way that suits you.",
    formHint:
      "You can simply stay connected at first or contribute actively. Both are free, and you can switch later at any time.",
    legalHint:
      "Status note: Community registration is not currently a legal association or party membership. Any later formal membership status will be shown separately and transparently.",
    selectedActive: "I want to contribute actively",
    selectedMember: "I want to stay connected first",
    modeQuestion: "How would you like to start?",
    modeActive: "Contribute actively",
    modeActiveHint:
      "I would like to take on tasks, help build locally or contribute regularly.",
    modeMember: "Stay connected",
    modeMemberHint:
      "I want updates and the freedom to decide when I become more active.",
    firstName: "First name",
    lastName: "Last name",
    birthDate: "Date of birth",
    birthDateHint: "Required because community registration is currently available from age 16.",
    email: "Email",
    city: "City",
    country: "Country",
    countryPlaceholder: "Choose country",
    privacy: "I accept the privacy notice and double opt-in process.",
    newsletter: "I would like updates about VoiceOpenGov.",
    submit: "Join for free",
    submitting: "Joining …",
    successTitle: "Welcome – almost there.",
    successBody:
      "Please confirm your email. After that, your VoiceOpenGov registration is complete.",
    successActiveNext:
      "You can then tell us where and how you would like to contribute actively.",
    successMemberNext:
      "You stay connected and can become more active at any time later.",
    validation: "Please provide date of birth, email, city and privacy consent.",
    invalidBirthDate: "Please provide a valid date of birth.",
    underage: "Community registration is currently available from age 16.",
    rateLimited: "Too many attempts in a short time. Please try again later.",
    unavailable: "Registration is temporarily unavailable. Please try again later.",
    error:
      "Registration could not be completed right now. Please try again or email members@voiceopengov.org.",
    regionalEyebrow: "For your neighbourhood",
    regionalLead:
      "VoiceOpenGov is not meant to exist only online. Local presence grows where people bring neighbours together, make everyday issues visible and choose to take responsibility locally.",
    supportHint: "Would you also like to support the build financially?",
    supportCta: "Support",
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

export default function MitmachenClient({
  initialLocale,
}: {
  initialLocale: SupportedLocale;
}) {
  const language = initialLocale === "en" ? "en" : "de";
  const copy = COPY[language];
  const regional = getRegionalActivationStrings(initialLocale);
  const countries = useMemo(() => getCountryOptions(initialLocale), [initialLocale]);

  const [participationMode, setParticipationMode] = useState<ParticipationMode>("member");
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
  const [registrationComplete, setRegistrationComplete] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    setRegistrationComplete(false);

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
          participationMode,
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
        if (code === "registration_temporarily_unavailable" || response.status === 503) {
          throw new Error("unavailable");
        }
        throw new Error("registration_failed");
      }

      setRegistrationComplete(true);
      setNotice({ ok: true, text: copy.successBody });
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
        code === "invalid_birthdate"
          ? copy.invalidBirthDate
          : code === "underage"
            ? copy.underage
            : code === "rate_limited"
              ? copy.rateLimited
              : code === "unavailable"
                ? copy.unavailable
                : copy.error;
      setNotice({ ok: false, text });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-clip text-[#f8fafc]">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_80%_10%,rgba(24,207,200,0.12),transparent_34%)]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#18cfc8]">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] md:text-6xl">{copy.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{copy.intro}</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">{copy.orientation}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#mitglied" className="rounded-full bg-gradient-to-r from-[#1a8cff] to-[#18cfc8] px-5 py-3 font-black text-[#071727]">
              {copy.joinTitle}
            </a>
            <a href="#vor-ort" className="rounded-full border border-white/15 px-5 py-3 font-bold text-slate-100 hover:border-[#18cfc8]/60">
              {copy.regionTitle}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <a href="#mitglied" className="group rounded-3xl border border-[#18cfc8]/25 bg-white/[0.045] p-6 transition hover:-translate-y-0.5 hover:border-[#18cfc8]/60">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#18cfc8]">{copy.joinKicker}</p>
            <h2 className="mt-3 text-2xl">{copy.joinTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.joinBody}</p>
          </a>
          <a href="#vor-ort" className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-0.5 hover:border-[#18cfc8]/50">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#18cfc8]">{copy.regionKicker}</p>
            <h2 className="mt-3 text-2xl">{copy.regionTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.regionBody}</p>
          </a>
          <Link href={EDEBATTE_URL} className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-0.5 hover:border-[#18cfc8]/50">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#18cfc8]">{copy.debateKicker}</p>
            <h2 className="mt-3 text-2xl">{copy.debateTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{copy.debateBody}</p>
          </Link>
        </div>
      </section>

      <section id="mitglied" className="scroll-mt-24 border-t border-white/10 bg-[#0b1220]/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">{copy.formEyebrow}</p>
            <h2 className="mt-4 text-4xl">{copy.formTitle}</h2>
            <p className="mt-5 text-base leading-7 text-slate-300">{copy.formHint}</p>
            <div className="mt-6 rounded-2xl border border-[#18cfc8]/20 bg-[#18cfc8]/[0.06] p-4">
              <p className="text-sm font-black text-[#bff7f3]">
                {participationMode === "active" ? copy.selectedActive : copy.selectedMember}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {participationMode === "active" ? copy.modeActiveHint : copy.modeMemberHint}
              </p>
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-400">{copy.legalHint}</p>
          </div>

          {registrationComplete ? (
            <section aria-live="polite" className="rounded-3xl border border-[#18cfc8]/30 bg-[#18cfc8]/[0.07] p-7 md:p-9">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#18cfc8]">E-Mail bestätigen</p>
              <h3 className="mt-3 text-3xl">{copy.successTitle}</h3>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">{copy.successBody}</p>
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">
                {participationMode === "active" ? copy.successActiveNext : copy.successMemberNext}
              </p>
            </section>
          ) : (
            <form onSubmit={submit} className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
              <fieldset>
                <legend className="text-sm font-black uppercase tracking-[0.16em] text-[#18cfc8]">{copy.modeQuestion}</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button type="button" aria-pressed={participationMode === "member"} onClick={() => setParticipationMode("member")} className={`rounded-2xl border p-4 text-left transition ${participationMode === "member" ? "border-[#18cfc8]/70 bg-[#18cfc8]/10" : "border-white/10 bg-[#020617]"}`}>
                    <span className="font-bold">{copy.modeMember}</span>
                    <span className="mt-2 block text-xs leading-5 text-slate-400">{copy.modeMemberHint}</span>
                  </button>
                  <button type="button" aria-pressed={participationMode === "active"} onClick={() => setParticipationMode("active")} className={`rounded-2xl border p-4 text-left transition ${participationMode === "active" ? "border-[#18cfc8]/70 bg-[#18cfc8]/10" : "border-white/10 bg-[#020617]"}`}>
                    <span className="font-bold">{copy.modeActive}</span>
                    <span className="mt-2 block text-xs leading-5 text-slate-400">{copy.modeActiveHint}</span>
                  </button>
                </div>
              </fieldset>

              <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
                <input aria-label={copy.firstName} autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder={copy.firstName} className="min-w-0 w-full rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />
                <input aria-label={copy.lastName} autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder={copy.lastName} className="min-w-0 w-full rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />

                <label className="grid min-w-0 gap-2 text-sm font-bold text-slate-300">
                  {copy.birthDate}
                  <input type="date" required aria-label={copy.birthDate} autoComplete="bday" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className="min-w-0 w-full rounded-xl border border-white/15 bg-[#020617] px-4 py-3 font-normal outline-none focus:border-[#18cfc8]" />
                  <span className="text-xs font-normal leading-5 text-slate-400">{copy.birthDateHint}</span>
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  {copy.email}
                  <input type="email" required aria-label={copy.email} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={copy.email} className="min-w-0 w-full rounded-xl border border-white/15 bg-[#020617] px-4 py-3 font-normal outline-none focus:border-[#18cfc8]" />
                </label>

                <input required aria-label={copy.city} autoComplete="address-level2" value={city} onChange={(event) => setCity(event.target.value)} placeholder={copy.city} className="min-w-0 w-full rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]" />
                <select aria-label={copy.country} autoComplete="country" value={country} onChange={(event) => setCountry(event.target.value)} className="min-w-0 w-full rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]">
                  <option value="">{copy.countryPlaceholder}</option>
                  {countries.map((option) => (
                    <option key={option.code} value={option.code}>{option.label}</option>
                  ))}
                </select>
              </div>

              <label className="mt-6 flex items-start gap-3 text-sm text-slate-300">
                <input type="checkbox" required checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} className="mt-1 shrink-0" />
                <span>{copy.privacy}</span>
              </label>
              <label className="mt-3 flex items-start gap-3 text-sm text-slate-300">
                <input type="checkbox" checked={newsletter} onChange={(event) => setNewsletter(event.target.checked)} className="mt-1 shrink-0" />
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
          )}
        </div>
      </section>

      <section id="vor-ort" className="scroll-mt-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">{copy.regionalEyebrow}</p>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">{copy.regionalLead}</p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
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

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-slate-400 md:px-8 sm:flex-row sm:items-center sm:justify-between">
          <span>{copy.supportHint}</span>
          <Link href={VOG_SUPPORT_PATH} className="font-bold text-[#18cfc8] hover:underline">{copy.supportCta} →</Link>
        </div>
      </section>
    </main>
  );
}
