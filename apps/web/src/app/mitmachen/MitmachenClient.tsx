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
    title: "Wie möchtest du Teil von VoiceOpenGov werden?",
    intro:
      "Drei Wege, ein Einstieg: aktiv mitwirken, der Community beitreten oder vor Ort konkret ermöglichen.",
    active: "Aktiv mitwirken",
    activeKicker: "Zeit & Verantwortung",
    activeBody:
      "Du möchtest regelmäßig mitarbeiten, Verantwortung übernehmen oder VoiceOpenGov regional und organisatorisch mit aufbauen.",
    member: "Community beitreten",
    memberKicker: "Verbunden bleiben",
    memberBody:
      "Du möchtest zur VoiceOpenGov-Community gehören, informiert bleiben und dich beteiligen können – ohne eine feste Aufgabe übernehmen zu müssen.",
    region: "Vor Ort ermöglichen",
    regionKicker: "Ressourcen & Infrastruktur",
    regionBody:
      "Du kannst Raum, Treffpunkt, Technik, Kontakte, Expertise, Logistik oder eine Gastgeberrolle beitragen – auch ohne Community-Anmeldung.",
    contentHint: "Inhaltlich an Themen und Entscheidungsräumen arbeiten?",
    contentCta: "eDebatte öffnen",
    supportHint: "Du möchtest den Aufbau finanziell unterstützen?",
    supportCta: "Unterstützen",
    formEyebrow: "Community-Anmeldung",
    formTitle: "Teil der Community werden",
    formHint:
      "VoiceOpenGov befindet sich in der Aufbauphase. Mit dieser Anmeldung wirst du Teil der VoiceOpenGov-Community. Dies ist derzeit ausdrücklich keine Vereins- oder gesellschaftsrechtliche Mitgliedschaft. Eine spätere rechtliche Träger- oder Mitgliedschaftsstruktur wird separat und transparent angeboten, sobald sie feststeht.",
    dataHint:
      "Geburtsdatum wird zur Altersprüfung verarbeitet; Ort und Land dienen der regionalen Zuordnung. Öffentliche Standortzahlen werden nur aggregiert dargestellt.",
    selectedActive: "Aktiv mitwirken",
    selectedMember: "Community beitreten",
    modeQuestion: "Wie möchtest du starten?",
    modeActive: "Aktiv mitwirken",
    modeActiveHint:
      "Wir melden uns, wenn konkrete Aufgaben, regionale Möglichkeiten oder Aufbaurollen zu deinem Profil passen.",
    modeMember: "Community beitreten",
    modeMemberHint:
      "Du wirst Teil der Community, bleibst informiert und kannst später jederzeit aktiver mitwirken.",
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
    submit: "Kostenfrei der Community beitreten",
    submitting: "Wird eingetragen …",
    successTitle: "Fast geschafft.",
    successBody:
      "Bitte bestätige jetzt die E-Mail. Erst danach ist deine Community-Anmeldung abgeschlossen.",
    successActiveNext:
      "Als nächstes kannst du angeben, wo und wie du aktiv mitwirken möchtest.",
    successMemberNext:
      "Du kannst später jederzeit zu einer aktiveren Mitwirkung wechseln.",
    validation: "Bitte Geburtsdatum, E-Mail, Ort und Datenschutz vollständig angeben.",
    invalidBirthDate: "Bitte gib ein gültiges Geburtsdatum an.",
    underage: "Die Community-Anmeldung ist derzeit ab 16 Jahren möglich.",
    rateLimited: "Zu viele Versuche in kurzer Zeit. Bitte versuche es später erneut.",
    unavailable: "Die Anmeldung ist vorübergehend nicht erreichbar. Bitte versuche es später erneut.",
    error:
      "Die Anmeldung konnte gerade nicht abgeschlossen werden. Bitte versuche es erneut oder schreibe an members@voiceopengov.org.",
    regionalEyebrow: "Vor Ort ermöglichen",
    regionalLead:
      "Hier geht es nicht um die Community-Anmeldung, sondern um konkrete Unterstützung mit Ressourcen, Orten und Infrastruktur.",
  },
  en: {
    eyebrow: "Participate",
    title: "How would you like to be part of VoiceOpenGov?",
    intro:
      "Three paths, one entry point: contribute actively, join the community or enable participation locally.",
    active: "Contribute actively",
    activeKicker: "Time & responsibility",
    activeBody:
      "You would like to contribute regularly, take responsibility or help build VoiceOpenGov regionally and operationally.",
    member: "Join the community",
    memberKicker: "Stay connected",
    memberBody:
      "You want to be part of the VoiceOpenGov community, stay informed and participate without taking on a fixed role.",
    region: "Enable locally",
    regionKicker: "Resources & infrastructure",
    regionBody:
      "You can contribute space, a venue, technology, contacts, expertise, logistics or a host role – even without community registration.",
    contentHint: "Want to work on topics and decision spaces?",
    contentCta: "Open eDebatte",
    supportHint: "Want to support the build financially?",
    supportCta: "Support",
    formEyebrow: "Community registration",
    formTitle: "Join the community",
    formHint:
      "VoiceOpenGov is currently in its build-up phase. This registration makes you part of the VoiceOpenGov community. It is explicitly not membership in a legal association or company at this stage. Any future legal entity or formal membership structure will be offered separately and transparently once established.",
    dataHint:
      "Your date of birth is processed for the age check; city and country are used for regional allocation. Public location figures are shown only in aggregate.",
    selectedActive: "Contribute actively",
    selectedMember: "Join the community",
    modeQuestion: "How would you like to start?",
    modeActive: "Contribute actively",
    modeActiveHint:
      "We will contact you when concrete tasks, regional opportunities or build-up roles fit your profile.",
    modeMember: "Join the community",
    modeMemberHint:
      "You become part of the community, stay informed and can contribute more actively at any time later.",
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
    submit: "Join the community for free",
    submitting: "Joining …",
    successTitle: "Almost there.",
    successBody:
      "Please confirm the email now. Your community registration is only complete after confirmation.",
    successActiveNext:
      "Next, you can tell us where and how you would like to contribute actively.",
    successMemberNext:
      "You can switch to more active participation at any time later.",
    validation: "Please provide date of birth, email, city and privacy consent.",
    invalidBirthDate: "Please provide a valid date of birth.",
    underage: "Community registration is currently available from age 16.",
    rateLimited: "Too many attempts in a short time. Please try again later.",
    unavailable: "Registration is temporarily unavailable. Please try again later.",
    error:
      "Registration could not be completed right now. Please try again or email members@voiceopengov.org.",
    regionalEyebrow: "Enable locally",
    regionalLead:
      "This is not about community registration. It is about practical support with resources, places and infrastructure.",
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
  const countries = useMemo(
    () => getCountryOptions(initialLocale),
    [initialLocale],
  );

  const [participationMode, setParticipationMode] =
    useState<ParticipationMode>("member");
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

  const chooseMembership = (mode: ParticipationMode) => {
    setParticipationMode(mode);
    setRegistrationComplete(false);
    setNotice(null);
    requestAnimationFrame(() =>
      document
        .getElementById("mitglied")
        ?.scrollIntoView({ behavior: "smooth" }),
    );
  };

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
            utmSource:
              new URLSearchParams(window.location.search).get("utm_source") ||
              undefined,
            utmMedium:
              new URLSearchParams(window.location.search).get("utm_medium") ||
              undefined,
            utmCampaign:
              new URLSearchParams(window.location.search).get("utm_campaign") ||
              undefined,
          },
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) {
        const code = apiErrorCode(data);
        if (code === "invalid_birthdate") throw new Error("invalid_birthdate");
        if (code === "underage") throw new Error("underage");
        if (code === "rate_limited" || response.status === 429)
          throw new Error("rate_limited");
        if (
          code === "registration_temporarily_unavailable" ||
          response.status === 503
        )
          throw new Error("unavailable");
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
      const code =
        error instanceof Error ? error.message : "registration_failed";
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
    <main className="min-h-screen text-[#f8fafc]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#18cfc8]">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl md:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => chooseMembership("active")}
            className="group rounded-3xl border border-[#18cfc8]/25 bg-white/[0.045] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#18cfc8]/60"
          >
            <span className="font-mono text-xs text-[#18cfc8]">01</span>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {copy.activeKicker}
            </p>
            <h2 className="mt-2 text-2xl">{copy.active}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {copy.activeBody}
            </p>
          </button>

          <button
            type="button"
            onClick={() => chooseMembership("member")}
            className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#18cfc8]/50"
          >
            <span className="font-mono text-xs text-[#18cfc8]">02</span>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {copy.memberKicker}
            </p>
            <h2 className="mt-2 text-2xl">{copy.member}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {copy.memberBody}
            </p>
          </button>

          <a
            href="#vor-ort"
            className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-0.5 hover:border-[#18cfc8]/50"
          >
            <span className="font-mono text-xs text-[#18cfc8]">03</span>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {copy.regionKicker}
            </p>
            <h2 className="mt-2 text-2xl">{copy.region}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {copy.regionBody}
            </p>
          </a>
        </div>
      </section>

      <section
        id="mitglied"
        className="scroll-mt-24 border-t border-white/10 bg-[#0b1220]/70"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-8 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">
              {copy.formEyebrow}
            </p>
            <h2 className="mt-4 text-4xl">{copy.formTitle}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              {copy.formHint}
            </p>
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-6 text-slate-400">
              {copy.dataHint}
            </p>
            <div className="mt-6 rounded-2xl border border-[#18cfc8]/20 bg-[#18cfc8]/[0.06] p-4">
              <p className="text-sm font-black text-[#bff7f3]">
                {participationMode === "active"
                  ? copy.selectedActive
                  : copy.selectedMember}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {participationMode === "active"
                  ? copy.modeActiveHint
                  : copy.modeMemberHint}
              </p>
            </div>
          </div>

          {registrationComplete ? (
            <section
              aria-live="polite"
              className="rounded-3xl border border-[#18cfc8]/30 bg-[#18cfc8]/[0.07] p-7 md:p-9"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#18cfc8]">
                E-Mail bestätigen
              </p>
              <h3 className="mt-3 text-3xl">{copy.successTitle}</h3>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                {copy.successBody}
              </p>
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">
                {participationMode === "active"
                  ? copy.successActiveNext
                  : copy.successMemberNext}
              </p>
            </section>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 md:p-8"
            >
              <fieldset>
                <legend className="text-sm font-black uppercase tracking-[0.16em] text-[#18cfc8]">
                  {copy.modeQuestion}
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    aria-pressed={participationMode === "active"}
                    onClick={() => setParticipationMode("active")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      participationMode === "active"
                        ? "border-[#18cfc8]/70 bg-[#18cfc8]/10"
                        : "border-white/10 bg-[#020617]"
                    }`}
                  >
                    <span className="font-bold">{copy.modeActive}</span>
                    <span className="mt-2 block text-xs leading-5 text-slate-400">
                      {copy.modeActiveHint}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={participationMode === "member"}
                    onClick={() => setParticipationMode("member")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      participationMode === "member"
                        ? "border-[#18cfc8]/70 bg-[#18cfc8]/10"
                        : "border-white/10 bg-[#020617]"
                    }`}
                  >
                    <span className="font-bold">{copy.modeMember}</span>
                    <span className="mt-2 block text-xs leading-5 text-slate-400">
                      {copy.modeMemberHint}
                    </span>
                  </button>
                </div>
              </fieldset>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input
                  aria-label={copy.firstName}
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder={copy.firstName}
                  className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]"
                />
                <input
                  aria-label={copy.lastName}
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder={copy.lastName}
                  className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]"
                />

                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  {copy.birthDate}
                  <input
                    type="date"
                    required
                    aria-label={copy.birthDate}
                    autoComplete="bday"
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                    className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 font-normal outline-none focus:border-[#18cfc8]"
                  />
                  <span className="text-xs font-normal leading-5 text-slate-500">
                    {copy.birthDateHint}
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate-300">
                  {copy.email}
                  <input
                    type="email"
                    required
                    aria-label={copy.email}
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={copy.email}
                    className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 font-normal outline-none focus:border-[#18cfc8]"
                  />
                </label>

                <input
                  required
                  aria-label={copy.city}
                  autoComplete="address-level2"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder={copy.city}
                  className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]"
                />

                <select
                  aria-label={copy.country}
                  autoComplete="country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="rounded-xl border border-white/15 bg-[#020617] px-4 py-3 outline-none focus:border-[#18cfc8]"
                >
                  <option value="">{copy.countryPlaceholder}</option>
                  {countries.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="mt-6 flex items-start gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={privacy}
                  onChange={(event) => setPrivacy(event.target.checked)}
                  className="mt-1 shrink-0"
                />
                <span>{copy.privacy}</span>
              </label>

              <label className="mt-3 flex items-start gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(event) => setNewsletter(event.target.checked)}
                  className="mt-1 shrink-0"
                />
                <span>{copy.newsletter}</span>
              </label>

              {notice ? (
                <p
                  role={notice.ok ? "status" : "alert"}
                  aria-live="polite"
                  className={`mt-5 rounded-xl px-4 py-3 text-sm ${
                    notice.ok
                      ? "bg-emerald-400/15 text-emerald-200"
                      : "bg-red-400/15 text-red-200"
                  }`}
                >
                  {notice.text}
                </p>
              ) : null}

              <button
                disabled={submitting}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-[#1a8cff] to-[#18cfc8] px-5 py-3.5 font-black text-[#071727] disabled:opacity-60"
              >
                {submitting ? copy.submitting : copy.submit}
              </button>
            </form>
          )}
        </div>
      </section>

      <section id="vor-ort" className="scroll-mt-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18cfc8]">
            03 · {copy.regionalEyebrow}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            {copy.regionalLead}
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div>
              <h2 className="text-4xl md:text-5xl">{regional.page.title}</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                {regional.page.intro}
              </p>
              <p className="mt-5 rounded-2xl border border-[#18cfc8]/20 bg-[#18cfc8]/[0.06] px-5 py-4 text-sm leading-7 text-slate-300">
                {regional.page.promise}
              </p>
              <div className="mt-6 grid gap-3">
                {regional.page.steps.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <h3 className="font-bold text-[#18cfc8]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <RegionalInterestForm strings={regional} />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-slate-400 md:px-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <span>
            {copy.contentHint}{" "}
            <Link
              href={EDEBATTE_URL}
              className="font-bold text-[#18cfc8] hover:underline"
            >
              {copy.contentCta} ↗
            </Link>
          </span>
          <span>
            {copy.supportHint}{" "}
            <Link
              href={VOG_SUPPORT_PATH}
              className="font-bold text-[#18cfc8] hover:underline"
            >
              {copy.supportCta}
            </Link>
          </span>
        </div>
      </section>
    </main>
  );
}
