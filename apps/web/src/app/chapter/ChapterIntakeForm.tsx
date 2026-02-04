"use client";

import { useState } from "react";
import Link from "next/link";
import { HumanCheck } from "@/components/security/HumanCheck";

type Notice = { ok: boolean; msg: string } | null;

const INTEREST_OPTIONS = [
  {
    value: "start",
    label: "Chapter starten",
    hint: "Ich möchte vor Ort vertreten.",
  },
  {
    value: "join",
    label: "Mithelfen",
    hint: "Ich möchte mich anschließen.",
  },
  {
    value: "space",
    label: "Räumlichkeiten anbieten",
    hint: "Ich habe Zugang zu einem Ort.",
  },
  {
    value: "info",
    label: "Erstmal Infos",
    hint: "Ich bin interessiert, aber offen.",
  },
] as const;

export default function ChapterIntakeForm({
  id,
  className,
}: {
  id?: string;
  className?: string;
}) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [spaceAvailable, setSpaceAvailable] = useState("");
  const [spaceNotes, setSpaceNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [humanToken, setHumanToken] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const resetForm = () => {
    setContactName("");
    setContactEmail("");
    setOrgName("");
    setLocation("");
    setInterests([]);
    setSpaceAvailable("");
    setSpaceNotes("");
    setNotes("");
    setPrivacyAccepted(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (interests.length === 0) {
      setNotice({ ok: false, msg: "Bitte mindestens eine Interessen-Option auswählen." });
      return;
    }

    if (!privacyAccepted) {
      setNotice({ ok: false, msg: "Bitte Datenschutzhinweis akzeptieren." });
      return;
    }

    if (!humanToken) {
      setNotice({ ok: false, msg: "Bitte den kurzen Human-Check abschliessen." });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        orgName: orgName.trim() || undefined,
        location: location.trim() || undefined,
        interests,
        spaceAvailable: spaceAvailable || undefined,
        spaceNotes: spaceNotes.trim() || undefined,
        notes: notes.trim() || undefined,
        privacyAccepted,
        humanToken,
        hp_chapter: honeypot.trim() || undefined,
      };

      const res = await fetch("/api/chapters/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.ok) {
        setNotice({
          ok: true,
          msg: "Danke! Wir melden uns mit den nächsten Schritten. Die Anfrage ist unverbindlich.",
        });
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
    <section
      id={id}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${
        className ?? ""
      }`}
    >
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Sich vormerken lassen</h2>
        <p className="text-sm text-slate-700">
          Wir melden uns mit dem Chapter-Launch-Kit und den nächsten Schritten.
        </p>
      </div>

      {notice && (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            notice.ok
              ? "border-sky-100 bg-sky-50/80 text-sky-800"
              : "border-rose-100 bg-rose-50/80 text-rose-700"
          }`}
        >
          {notice.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="hp_chapter">Bitte dieses Feld frei lassen</label>
          <input
            id="hp_chapter"
            name="hp_chapter"
            type="text"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="contactName" className="block text-xs font-semibold text-slate-700">
              Name
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              autoComplete="name"
              required
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="contactEmail" className="block text-xs font-semibold text-slate-700">
              E-Mail
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              autoComplete="email"
              required
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="orgName" className="block text-xs font-semibold text-slate-700">
              Organisation (optional)
            </label>
            <input
              id="orgName"
              name="orgName"
              type="text"
              value={orgName}
              onChange={(event) => setOrgName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Name der Organisation/Initiative"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="location" className="block text-xs font-semibold text-slate-700">
              Ort / Region
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="z. B. Berlin, Leipzig, Rhein-Main"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Interesse
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {INTEREST_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-sky-200"
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={option.value}
                  checked={interests.includes(option.value)}
                  onChange={() => toggleInterest(option.value)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>
                  <span className="block font-semibold text-slate-900">{option.label}</span>
                  <span className="text-[11px] text-slate-500">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="spaceAvailable" className="block text-xs font-semibold text-slate-700">
              Räumlichkeiten vorhanden?
            </label>
            <select
              id="spaceAvailable"
              name="spaceAvailable"
              value={spaceAvailable}
              onChange={(event) => setSpaceAvailable(event.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">Bitte auswählen ...</option>
              <option value="yes">Ja, Raum vorhanden</option>
              <option value="maybe">Vielleicht / später</option>
              <option value="no">Kein Raum</option>
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="spaceNotes" className="block text-xs font-semibold text-slate-700">
              Raum-Details (optional)
            </label>
            <input
              id="spaceNotes"
              name="spaceNotes"
              type="text"
              value={spaceNotes}
              onChange={(event) => setSpaceNotes(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="z. B. Kapazität, Verfügbarkeit"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="notes" className="block text-xs font-semibold text-slate-700">
            Weitere Hinweise (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Mitstreiter, lokale Besonderheiten, Zeithorizont ..."
          />
        </div>

        <HumanCheck
          formId="chapter-intake"
          variant="compact"
          onSolved={({ token }) => setHumanToken(token)}
          onError={() => setHumanToken("")}
        />

        <div className="flex items-start gap-2 pt-1">
          <input
            id="privacyAccepted"
            name="privacyAccepted"
            type="checkbox"
            checked={privacyAccepted}
            onChange={(event) => setPrivacyAccepted(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <label htmlFor="privacyAccepted" className="text-[11px] leading-snug text-slate-600">
            Ich akzeptiere die{" "}
            <Link href="/datenschutz" className="font-semibold text-sky-700 underline underline-offset-4">
              Datenschutzhinweise
            </Link>
            .
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(14,116,144,0.35)] transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto md:px-10"
          >
            {isSubmitting ? "Sende..." : "Vormerken lassen"}
          </button>

          <a
            href="mailto:kontakt@voiceopengov.org"
            className="w-full rounded-full border border-sky-200 bg-sky-50/60 px-4 py-3 text-center text-sm font-semibold text-sky-700 shadow-[0_6px_18px_rgba(14,165,233,0.15)] transition hover:border-sky-400 hover:bg-white hover:text-sky-900 md:w-auto"
          >
            Oder per E-Mail
          </a>
        </div>
      </form>
    </section>
  );
}
