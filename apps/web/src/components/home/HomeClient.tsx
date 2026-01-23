"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WorldPanoramaMap } from "@/components/home/WorldPanoramaMap";
import { WorldMiniGlobe } from "@/components/home/WorldMiniGlobe";
import { SupporterBanner } from "@/components/home/SupporterBanner";
import { COUNTRY_OPTIONS } from "@/lib/countries";

type Stats = {
  people: number;
  orgs: number;
  countries: number;
};

type Notice = { ok: boolean; msg: string } | null;

function formatNumber(value: number | null | undefined) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("de-DE").format(value);
}

export default function HomeClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState(false);

  const [memberType, setMemberType] = useState<"person" | "organisation">("person");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [publicSupporter, setPublicSupporter] = useState(false);
  const [supporterImageUrl, setSupporterImageUrl] = useState("");
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (
          typeof data?.people === "number" &&
          typeof data?.orgs === "number" &&
          typeof data?.countries === "number"
        ) {
          setStats({ people: data.people, orgs: data.orgs, countries: data.countries });
        } else {
          setStatsError(true);
        }
      })
      .catch(() => {
        if (!active) return;
        setStatsError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const statItems = useMemo(
    () => [
      { label: "Mitglieder", value: formatNumber(stats?.people ?? null) },
      { label: "Organisationen", value: formatNumber(stats?.orgs ?? null) },
      { label: "Laender", value: formatNumber(stats?.countries ?? null) },
    ],
    [stats],
  );

  const resetForm = () => {
    setMemberType("person");
    setFirstName("");
    setLastName("");
    setOrgName("");
    setEmail("");
    setCity("");
    setCountryCode("");
    setIsPublic(true);
    setAvatarUrl("");
    setPublicSupporter(false);
    setSupporterImageUrl("");
    setWantsNewsletter(false);
    setDonationAmount("");
    setPrivacyAccepted(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!privacyAccepted) {
      setNotice({ ok: false, msg: "Bitte Datenschutzhinweis akzeptieren." });
      return;
    }

    if (isPublic && !city.trim()) {
      setNotice({ ok: false, msg: "Bitte gib deinen Ort an (fuer die Orts-Summen)." });
      return;
    }

    const donationRaw = donationAmount.trim();
    let donationCents = 0;
    if (donationRaw) {
      const normalized = donationRaw.replace(",", ".");
      const parsed = Number(normalized);
      if (!Number.isFinite(parsed)) {
        setNotice({ ok: false, msg: "Bitte gib einen gueltigen Spendenbetrag ein." });
        return;
      }
      donationCents = Math.round(parsed * 100);
      if (donationCents > 0 && donationCents < 500) {
        setNotice({ ok: false, msg: "Spendenbetrag mindestens 5 EUR." });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        type: memberType,
        email: email.trim(),
        firstName: memberType === "person" ? firstName.trim() || undefined : undefined,
        lastName: memberType === "person" ? lastName.trim() || undefined : undefined,
        orgName: memberType === "organisation" ? orgName.trim() || undefined : undefined,
        city: city.trim() || undefined,
        country: countryCode || undefined,
        isPublic,
        avatarUrl: isPublic ? avatarUrl.trim() || undefined : undefined,
        publicSupporter,
        supporterImageUrl: publicSupporter ? supporterImageUrl.trim() || undefined : undefined,
        wantsNewsletterEdDebatte: wantsNewsletter,
        donationCents: donationCents || undefined,
      };

      const res = await fetch("/api/members/public-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.ok) {
        setNotice({ ok: true, msg: "Bitte E-Mail bestaetigen - wir haben dir einen Link geschickt." });
        resetForm();
      } else if (data?.error === "donation_min_5_eur") {
        setNotice({ ok: false, msg: "Spendenbetrag mindestens 5 EUR." });
      } else {
        setNotice({ ok: false, msg: "Das hat nicht geklappt. Bitte spaeter erneut versuchen." });
      }
    } catch {
      setNotice({ ok: false, msg: "Das hat nicht geklappt. Bitte spaeter erneut versuchen." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--brand-from)] via-white to-white pb-16">
      <section id="globe" className="mx-auto max-w-6xl px-4 pt-10">
        <div className="grid gap-4 lg:grid-cols-2">
          <WorldPanoramaMap />
          <WorldMiniGlobe />
        </div>
      </section>

      <section
        id="hero"
        className="border-b border-slate-200/60 bg-gradient-to-b from-[var(--brand-from)] via-white to-[var(--brand-to)]"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {[
                "Mitgliedschaft im Fokus",
                "Globale Initiative",
                "Gemeinwohl vor Grenzen",
                "Direkte Demokratie",
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    border: "1px solid var(--chip-border)",
                    background: "var(--chip-bg)",
                    color: "var(--chip-text)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
                Eine weltweite Initiative fuer eine neue gesellschaftliche Ordnung.
              </h1>
              <p className="max-w-2xl text-lg text-slate-700 md:text-xl">
                VoiceOpenGov steht im Auftrag der Menschen aller Voelker. Politik und direkte
                Demokratie muessen grenzuebergreifend funktionieren, damit wir voneinander lernen
                und gemeinsam gewinnen.
              </p>
              <p className="max-w-2xl text-sm text-slate-700">
                Regeln sollen dem Gemeinwohl dienen - nicht Herkunft oder aktuelle Grenzen. Wir
                rufen jede Initiative, jeden Verein, jeden Verband, jede Genossenschaft, jede NGO,
                jede Stiftung sowie jede Politikerin und jeden Politiker auf, sich diesem Auftrag
                anzuschliessen.
              </p>

              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                {statItems.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              {statsError && (
                <p className="text-xs text-slate-500">Live-Zahlen werden spaeter nachgeladen.</p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Link href="#mitmachen" className="btn btn-primary">
                  Kostenfrei beitreten
                </Link>
                <Link href="/dossier/world-democracy" className="btn btn-ghost">
                  Dossier lesen
                </Link>
              </div>
            </div>
          </div>

          <div
            id="mitmachen"
            className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mitgliedschaft
                </p>
                <h2 className="text-2xl font-bold text-slate-900">Kostenfrei beitreten</h2>
                <p className="mt-1 text-xs text-slate-600">
                  Double-Opt-In: Bitte E-Mail bestaetigen. Spende optional ab 5 EUR.
                </p>
              </div>
              <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold text-slate-600">
                {(["person", "organisation"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMemberType(value)}
                    className={`rounded-full px-3 py-1 ${
                      memberType === value ? "bg-sky-600 text-white" : "hover:bg-slate-100"
                    }`}
                  >
                    {value === "person" ? "Person" : "Organisation"}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-700">
              Kostenloser Beitritt ohne Vorbestellung. Wir senden dir einen Bestaetigungslink per E-Mail.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {memberType === "person" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Vorname</label>
                    <input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Nachname</label>
                    <input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>
              )}

              {memberType === "organisation" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-slate-700">Organisation</label>
                    <input
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">E-Mail</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Ort</label>
                  <input
                    required={isPublic}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Land (optional)</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="">Bitte waehlen</option>
                    {COUNTRY_OPTIONS.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Orts-Sichtbarkeit</label>
                <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`rounded-full px-3 py-1 ${isPublic ? "bg-sky-600 text-white" : "hover:bg-slate-100"}`}
                  >
                    Oeffentlich
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`rounded-full px-3 py-1 ${!isPublic ? "bg-sky-600 text-white" : "hover:bg-slate-100"}`}
                  >
                    Privat
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Oeffentlich zeigt nur Orts-Summen. Keine Einzelprofile oder Rohdaten.
                </p>
              </div>

              {isPublic && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Avatar/Logo URL (optional)</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    placeholder="https://"
                  />
                </div>
              )}

              <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
                <label className="text-xs font-medium text-slate-700">
                  Unterstuetzer-Banner (optional)
                </label>
                <label className="flex items-start gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={publicSupporter}
                    onChange={(e) => setPublicSupporter(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>
                    Ich moechte als Unterstuetzer genannt werden (Name gekuerzt, Logo optional).
                  </span>
                </label>
                {publicSupporter && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Foto/Logo URL (optional)
                    </label>
                    <input
                      type="url"
                      value={supporterImageUrl}
                      onChange={(e) => setSupporterImageUrl(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                      placeholder="https://"
                    />
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={wantsNewsletter}
                  onChange={(e) => setWantsNewsletter(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600"
                />
                <span>Newsletter-Updates zu VoiceOpenGov erhalten (optional).</span>
              </label>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Spende (optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    step="1"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-32 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    placeholder="5"
                  />
                  <span className="text-xs text-slate-500">EUR</span>
                </div>
                <p className="text-xs text-slate-500">Mindestens 5 EUR (Zahlung erfolgt spaeter).</p>
              </div>

              <label className="flex items-start gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600"
                  required
                />
                <span>
                  Ich akzeptiere die{" "}
                  <Link href="/datenschutz" className="font-semibold text-slate-900 underline underline-offset-2">
                    Datenschutzhinweise
                  </Link>{" "}
                  und den Double-Opt-In Hinweis.
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? "Senden ..." : "Jetzt eintragen"}
                </button>
                {notice && (
                  <span
                    className={`text-xs ${notice.ok ? "text-emerald-700" : "text-red-600"}`}
                    role="status"
                  >
                    {notice.msg}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="infrastruktur" className="mx-auto mt-14 max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Neue Infrastruktur
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Unsere eigene Loesung fuer fairen Journalismus und Politik
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            VoiceOpenGov entwickelt eine Infrastruktur, die Beteiligung, Quellenarbeit und
            Mehrheiten transparent macht. Nur gemeinsam, fuer die Sache - nicht fuer Fraktionszwang,
            kurzfristige Opportunitaeten oder Machtspiele einzelner Gruppen.
          </p>
          <p className="mt-3 text-sm text-slate-700">
            Wir sind in der Lage, Probleme gemeinschaftlich zu loesen, ohne dass wir gefuehrt werden
            muessen. Jedes Mitglied entscheidet, jede Stimme wird nachvollziehbar dokumentiert.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Aufklaeren",
                body: "Begriffe, Quellen und Standards werden offen dokumentiert.",
              },
              {
                title: "Optionen",
                body: "Moegliche Wege werden strukturiert, vergleichbar und fair bewertet.",
              },
              {
                title: "Mehrheiten",
                body: "Entscheidungen bleiben pruefbar, nachvollziehbar und global anschlussfaehig.",
              },
            ].map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-sky-700">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-sky-800">
                    {index + 1}
                  </span>
                  <span>Schritt {index + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-xs text-slate-600">{step.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            Frage an uns alle: Ist das parlamentarische Konstrukt in Zeiten von Werkzeugen wie
            VoiceOpenGov wirklich das zeitgemaesseste Modell?
          </div>
        </div>
      </section>

      <section id="dossier" className="mx-auto mt-14 max-w-6xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Dossier</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              Weltpolitische Neuordnung
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Ein neutraler Einstieg in internationale Standards, Quellen und offene Fragen rund um
              demokratische Prozesse.
            </p>
            <Link
              href="/dossier/world-democracy"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700"
            >
              Dossier oeffnen
              <span aria-hidden="true">→</span>
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Mitmachen</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Deine Stimme zaehlt</h3>
            <p className="mt-2 text-sm text-slate-600">
              Sichtbar werden, Prozesse testen, Feedback geben.
            </p>
            <Link
              href="#mitmachen"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700"
            >
              Jetzt eintragen
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </section>

      <section id="initiativen" className="mx-auto mt-14 max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fuer Initiativen/Vereine
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                Bringt euer Thema - wir helfen beim sauberen Prozess.
              </h3>
              <p className="text-sm text-slate-700">
                Wir strukturieren Fragen, Quellen und Beteiligung so, dass Ergebnisse belastbar
                bleiben.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/initiatives" className="btn btn-primary">
                Initiative einreichen
              </Link>
              <Link href="/dossier" className="btn btn-ghost">
                Mehr ueber die Plattform
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="spenden" className="mx-auto mt-14 max-w-6xl px-4 pb-10">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Spenden</p>
              <h3 className="text-xl font-semibold text-slate-900">
                Unterstuetze Aufbau, Recherche und Community.
              </h3>
              <p className="text-sm text-slate-700">
                Spenden halten Infrastruktur, Recherche, Uebersetzung und Transparenz am Laufen.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/donate" className="btn btn-primary">
                Spenden
              </Link>
              <Link href="/kontakt" className="btn btn-ghost">
                Fragen stellen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SupporterBanner />
    </main>
  );
}
