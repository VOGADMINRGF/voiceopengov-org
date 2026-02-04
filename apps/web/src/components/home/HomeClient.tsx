"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WorldPanoramaMap } from "@/components/home/WorldPanoramaMap";
import { SupporterBanner } from "@/components/home/SupporterBanner";
import { MomentumAndCtas } from "@/components/home/MomentumAndCtas";
import { SupporterSection } from "@/components/join/SupporterSection";
import { COUNTRY_OPTIONS } from "@/lib/countries";

type Stats = {
  people: number;
  countries: number;
  chapters: number;
};

type Notice = { ok: boolean; msg: string } | null;

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const DONATION_URL = "https://startnext.com/mehrheit";

export default function HomeClient() {
  const [stats, setStats] = useState<Stats>({ people: 0, countries: 0, chapters: 0 });
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
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [publicSupporter, setPublicSupporter] = useState(false);
  const [supporterMode, setSupporterMode] = useState<"reuse" | "separate">("reuse");
  const [supporterImageUrl, setSupporterImageUrl] = useState("");
  const [supporterImageDataUrl, setSupporterImageDataUrl] = useState<string | null>(null);
  const [supporterImageFileName, setSupporterImageFileName] = useState("");
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [wantsNewsletterEdDebatte, setWantsNewsletterEdDebatte] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const avatarFileRef = useRef<HTMLInputElement | null>(null);
  const supporterFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (
          typeof data?.people === "number" &&
          typeof data?.countries === "number" &&
          typeof data?.chapters === "number"
        ) {
          setStats({ people: data.people, countries: data.countries, chapters: data.chapters });
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

  const handleImageFile = (
    file: File | null,
    setDataUrl: (value: string | null) => void,
    setFileName: (value: string) => void,
  ) => {
    if (!file) {
      setDataUrl(null);
      setFileName("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setNotice({ ok: false, msg: "Bitte eine Bilddatei auswählen." });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setNotice({ ok: false, msg: "Bitte ein Bild unter 2 MB hochladen." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setDataUrl(result || null);
      setFileName(file.name);
    };
    reader.onerror = () => {
      setNotice({ ok: false, msg: "Bild konnte nicht gelesen werden." });
    };
    reader.readAsDataURL(file);
  };

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
    setAvatarDataUrl(null);
    setAvatarFileName("");
    setPublicSupporter(false);
    setSupporterMode("reuse");
    setSupporterImageUrl("");
    setSupporterImageDataUrl(null);
    setSupporterImageFileName("");
    setWantsNewsletter(false);
    setWantsNewsletterEdDebatte(false);
    setPrivacyAccepted(false);
    if (avatarFileRef.current) avatarFileRef.current.value = "";
    if (supporterFileRef.current) supporterFileRef.current.value = "";
  };

  useEffect(() => {
    setAvatarUrl("");
    setAvatarDataUrl(null);
    setAvatarFileName("");
    setSupporterMode("reuse");
    setSupporterImageUrl("");
    setSupporterImageDataUrl(null);
    setSupporterImageFileName("");
    if (avatarFileRef.current) avatarFileRef.current.value = "";
    if (supporterFileRef.current) supporterFileRef.current.value = "";
  }, [memberType]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!privacyAccepted) {
      setNotice({ ok: false, msg: "Bitte Datenschutzhinweis akzeptieren." });
      return;
    }

    if (isPublic && !city.trim()) {
      setNotice({ ok: false, msg: "Bitte gib deinen Ort an (für die Orts-Summen)." });
      return;
    }

    setIsSubmitting(true);
    try {
      const avatarValue =
        memberType === "person" ? avatarDataUrl || undefined : avatarUrl.trim() || undefined;

      if (publicSupporter && supporterMode === "reuse" && !avatarValue) {
        setNotice({
          ok: false,
          msg: "Bitte Profilfoto/Logo hochladen oder 'Anderes Bild' wählen.",
        });
        return;
      }

      const supporterImageValue = publicSupporter
        ? supporterMode === "reuse"
          ? avatarValue
          : memberType === "person"
            ? supporterImageDataUrl || undefined
            : supporterImageUrl.trim() || undefined
        : undefined;

      const payload: Record<string, unknown> = {
        type: memberType,
        email: email.trim(),
        firstName: memberType === "person" ? firstName.trim() || undefined : undefined,
        lastName: memberType === "person" ? lastName.trim() || undefined : undefined,
        orgName: memberType === "organisation" ? orgName.trim() || undefined : undefined,
        city: city.trim() || undefined,
        country: countryCode || undefined,
        isPublic,
        avatarUrl: isPublic ? avatarValue : undefined,
        publicSupporter,
        supporterImageUrl: supporterImageValue,
        wantsNewsletter,
        wantsNewsletterEdDebatte,
      };

      const res = await fetch("/api/members/public-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

        if (res.ok && data?.ok) {
          setNotice({ ok: true, msg: "Bitte E-Mail bestätigen – wir haben dir einen Link geschickt." });
          setStats((prev) => ({
            ...prev,
            people: prev.people + (memberType === "person" ? 1 : 0),
          }));
          resetForm();
        } else {
        setNotice({ ok: false, msg: "Das hat nicht geklappt. Bitte später erneut versuchen." });
      }
    } catch {
      setNotice({ ok: false, msg: "Das hat nicht geklappt. Bitte später erneut versuchen." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--brand-from)] via-white to-white pb-16">
      <section
        id="hero"
        className="border-b border-slate-200/60 bg-gradient-to-b from-[var(--brand-from)] via-white to-[var(--brand-to)]"
      >
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                Mehrheitsprinzip zuerst
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
                  <span className="block bg-gradient-to-r from-cyan-500 to-sky-600 bg-clip-text text-transparent">
                    Mehrheitsprinzip. Weltweit.
                  </span>
                  <span className="block text-slate-900">Nachvollziehbar statt parteitaktisch.</span>
                </h1>
                <p className="max-w-2xl text-lg text-slate-700 md:text-xl">
                  Viele Menschen erleben Politik als intransparent, folgenlos und
                  korruptionsanfällig – während Krisen, Konflikte, Sanktionen, Preise und soziale
                  Spannungen den Alltag prägen. VoiceOpenGov baut eine unabhängige Infrastruktur,
                  damit Entscheidungen wieder prüfbar, fair und mehrheitsfähig werden – über
                  Grenzen hinweg.
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-3 text-sm text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    Nicht links, nicht rechts – sondern überprüfbar: Quellen, Begriffe und Optionen
                    sind offen dokumentiert.
                  </li>
                  <li className="flex gap-3 text-sm text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    Keine Partei, kein Verein: Inhalte entstehen mit der Gemeinschaft – unabhängig
                    von Lagerdenken und Förderlogik.
                  </li>
                  <li className="flex gap-3 text-sm text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600" />
                    Ein Werkzeug, ein Prüfpfad: eDebatte macht Mehrheiten nachvollziehbar – von der
                    Frage bis zur Umsetzung.
                  </li>
                </ul>

                <MomentumAndCtas
                  members={stats.people}
                  chapters={stats.chapters}
                  countries={stats.countries}
                />
                {statsError && (
                  <p className="mt-2 text-xs text-slate-500">
                    Live-Zahlen werden später nachgeladen.
                  </p>
                )}
              </div>
            </div>

            <WorldPanoramaMap />
          </div>
        </div>
      </section>

      <section id="trust" className="mx-auto mt-12 max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Vertrauen & Prüfpfade
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Vertrauen entsteht nicht durch Versprechen – sondern durch Prüfpfade.
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            Wir behaupten nicht, die Wahrheit zu besitzen. Wir machen sie prüfbar: Jede Aussage
            bekommt Kontext, Quellen und Gegenargumente. Jede Entscheidung zeigt, wer was wann
            vorgeschlagen hat, welche Optionen zur Wahl standen – und warum eine Mehrheit sich so
            entschieden hat.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              {
                title: "Quellenpflicht & Standards",
                body: "Begriffe, Quellen, Annahmen und offene Fragen werden sichtbar.",
              },
              {
                title: "Mehrheiten mit Kontext",
                body: "Nicht nur Stimmung, sondern begründete Entscheidungen.",
              },
              {
                title: "Umsetzung sichtbar",
                body: "Zuständigkeiten, Status und nächste Schritte (wo möglich).",
              },
              {
                title: "Datenschutz & Unabhängigkeit",
                body: "Kein Datenverkauf, keine Werbung, Double-Opt-In.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="chapter" className="mx-auto mt-12 max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Chapters
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Ein Chapter in jedem Land. In jedem Bundesland. Ein offener Anlaufpunkt – digital und
            analog.
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            Politikverdrossenheit entsteht oft, weil Menschen nicht wissen, wo sie ihr Anliegen
            wirksam adressieren können – und weil Prozesse im Zuständigkeits-Nebel verschwinden.
            Darum bauen wir Chapters: lokale, offene Sprechstunden (z. B. in Stadtteilen, Kommunen,
            Regionen), in denen Anliegen analog aufgenommen werden – und anschließend digital so
            strukturiert werden, dass sie prüfbar und abstimmbar sind.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              "Anliegen aufnehmen (vor Ort oder online)",
              "Dossier erstellen (Begriffe, Quellen, Optionen, offene Fragen)",
              "Mehrheiten bilden (Abstimmen + transparente Ergebnis- und Umsetzungsübersicht)",
            ].map((step) => (
              <div
                key={step}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-700"
              >
                {step}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/chapter" className="btn btn-primary">
              Chapter starten
            </Link>
            <Link href="#mitmachen" className="btn btn-ghost">
              Mitmachen
            </Link>
            <Link
              href="/initiatives?kind=org"
              className="btn btn-ghost"
            >
              Organisation anmelden
            </Link>
          </div>
        </div>
      </section>

      <section id="dossier-beispiel" className="mx-auto mt-12 max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Beispiel-Dossier
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Beispiel-Dossier: Direkte Demokratie
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Ein Dossier bündelt Behauptungen, Quellen, Gegenpositionen, offene Fragen und
            Varianten – damit Mehrheiten auf belastbaren Grundlagen entscheiden.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              "Was braucht direkte Demokratie, damit sie fair bleibt – auch bei Kampagnen?",
              "Welche Mindest-Standards müssen Abstimmungen erfüllen (Identität, Transparenz, Schutz vor Manipulation)?",
              "Wie bleibt Verantwortung sichtbar: Wer setzt Mehrheiten um – und was passiert bei Nichterfüllung?",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/dossier/direkte-demokratie" className="btn btn-primary">
              Dossier öffnen
            </Link>
            <Link
              href="/initiatives"
              className="btn btn-ghost"
            >
              Beitrag einreichen
            </Link>
          </div>
        </div>
      </section>

      <section id="vergleich" className="mx-auto mt-12 max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Systemvergleich
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Warum das heutige System oft blockiert – und was wir anders machen
          </h2>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Heute (parlamentarisch)
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Zuständigkeiten verschwimmen (Kommune/Land/Bund/EU).</li>
                <li>Debatten belohnen Taktik statt Nachvollziehbarkeit.</li>
                <li>Konsequenzen wirken unklar oder folgenlos.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-sky-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                Neu (Mehrheitsprinzip mit Dossier)
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Optionen & Quellen sind offen (prüfbar statt „Glauben“).</li>
                <li>Mehrheiten sind dokumentiert (mit Kontext, nicht nur Prozent).</li>
                <li>Umsetzung wird sichtbar (Status, Zuständigkeit, nächste Schritte).</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-sky-700">
                {[
                  "1. Check",
                  "2. Dossier",
                  "3. Beteiligung",
                ].map((step) => (
                  <span
                    key={step}
                    className="rounded-full border border-sky-200 bg-white px-3 py-1"
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mitmachen" className="mx-auto mt-12 max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mitgliedschaft
              </p>
              <h2 className="text-2xl font-bold text-slate-900">Kostenfrei beitreten</h2>
              <p className="mt-1 text-xs text-slate-600">
                Double-Opt-In: Bitte E-Mail bestätigen. Spenden aktuell via Startnext.
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
                  <option value="">Bitte wählen</option>
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
                  Öffentlich
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
                Öffentlich zeigt nur Orts-Summen. Keine Einzelprofile oder Rohdaten.
              </p>
            </div>

            {(isPublic || publicSupporter) && memberType === "organisation" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Logo-Link (optional)</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="https://"
                />
              </div>
            )}

            {(isPublic || publicSupporter) && memberType === "person" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Profilfoto hochladen (optional)
                </label>
                <input
                  ref={avatarFileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageFile(e.target.files?.[0] ?? null, setAvatarDataUrl, setAvatarFileName)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                {avatarFileName && (
                  <p className="text-[11px] text-slate-500">Ausgewählt: {avatarFileName}</p>
                )}
                <p className="text-[11px] text-slate-500">Max. 2 MB, JPG/PNG.</p>
              </div>
            )}

            <div className="space-y-3">
              <SupporterSection
                enabled={publicSupporter}
                mode={supporterMode}
                onEnabledChange={(value) => {
                  setPublicSupporter(value);
                  if (!value) {
                    setSupporterMode("reuse");
                    setSupporterImageUrl("");
                    setSupporterImageDataUrl(null);
                    setSupporterImageFileName("");
                    if (supporterFileRef.current) supporterFileRef.current.value = "";
                  }
                }}
                onModeChange={(mode) => {
                  setSupporterMode(mode);
                  if (mode === "reuse") {
                    setSupporterImageUrl("");
                    setSupporterImageDataUrl(null);
                    setSupporterImageFileName("");
                    if (supporterFileRef.current) supporterFileRef.current.value = "";
                  }
                }}
              />

              {publicSupporter && supporterMode === "separate" && memberType === "organisation" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Unterstützer-Bild (optional)
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

              {publicSupporter && supporterMode === "separate" && memberType === "person" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Unterstützer-Bild (optional)
                  </label>
                  <input
                    ref={supporterFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageFile(
                        e.target.files?.[0] ?? null,
                        setSupporterImageDataUrl,
                        setSupporterImageFileName,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                  {supporterImageFileName && (
                    <p className="text-[11px] text-slate-500">
                      Ausgewählt: {supporterImageFileName}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500">Max. 2 MB, JPG/PNG.</p>
                </div>
              )}
            </div>

            <label id="newsletter" className="flex items-start gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={wantsNewsletter}
                onChange={(e) => setWantsNewsletter(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600"
              />
              <span>Newsletter-Updates zu VoiceOpenGov (optional)</span>
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={wantsNewsletterEdDebatte}
                onChange={(e) => setWantsNewsletterEdDebatte(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600"
              />
              <span>Updates zu eDebatte (Werkzeug) (optional)</span>
            </label>

            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="text-xs font-medium text-slate-700">Spenden (aktuell über Startnext)</p>
              <p className="text-xs text-slate-500">
                Wir modernisieren den Spendenprozess. Bis dahin sammeln wir über Startnext.
              </p>
              <button
                type="button"
                onClick={() => setShowDonationPopup(true)}
                className="btn btn-ghost"
              >
                Zu Startnext
              </button>
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
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? "Senden ..." : "Jetzt eintragen"}
              </button>
              {notice && (
                <span
                  className={`text-xs ${notice.ok ? "text-sky-700" : "text-red-600"}`}
                  role="status"
                >
                  {notice.msg}
                </span>
              )}
            </div>
          </form>

          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <p>Mitgliedschaft ist kostenfrei.</p>
            <p>
              Spenden sind freiwillig und helfen beim Aufbau von Chapters, Moderation, Dossiers und
              Infrastruktur. Aktuell über Startnext – Fragen gern an members@voiceopengov.org.
            </p>
            <p>Öffentlich/Privat: Öffentlich zeigt nur Orts-Summen (keine Einzelprofile, keine Rohdaten).</p>
          </div>
        </div>
      </section>


      <section id="spenden" className="mx-auto mt-14 max-w-6xl px-4 pb-10">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Spenden</p>
              <h3 className="text-xl font-semibold text-slate-900">
                Unterstütze Aufbau, Recherche und Community.
              </h3>
              <p className="text-sm text-slate-700">
                Spenden halten Infrastruktur, Recherche, Übersetzung und Transparenz am Laufen.
                Aktuell über Startnext – wir modernisieren den Prozess.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setShowDonationPopup(true)} className="btn btn-primary">
                Spenden via Startnext
              </button>
              <Link
                href="/kontakt"
                className="btn btn-ghost"
              >
                Fragen stellen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {showDonationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Spendenhinweis
            </p>
            <h4 className="mt-2 text-lg font-semibold text-slate-900">
              Spenden aktuell über Startnext
            </h4>
            <p className="mt-2 text-sm text-slate-700">
              Wir sammeln Spenden derzeit über Startnext und modernisieren den Prozess. Bei Fragen
              erreichst du uns unter{" "}
              <a href="mailto:members@voiceopengov.org" className="font-semibold text-slate-900">
                members@voiceopengov.org
              </a>
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={DONATION_URL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Zu Startnext
              </a>
              <button
                type="button"
                onClick={() => setShowDonationPopup(false)}
                className="btn btn-ghost"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      <SupporterBanner />
    </main>
  );
}
