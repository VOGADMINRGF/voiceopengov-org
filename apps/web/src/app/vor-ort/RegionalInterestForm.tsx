"use client";

import { useState } from "react";
import Link from "next/link";
import { HumanCheck } from "@/components/security/HumanCheck";
import type { RegionalActivationStrings } from "./strings";

type Notice = { ok: boolean; message: string } | null;

export default function RegionalInterestForm({
  strings,
}: {
  strings: RegionalActivationStrings;
}) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [location, setLocation] = useState("");
  const [topic, setTopic] = useState("");
  const [intents, setIntents] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [matchingConsent, setMatchingConsent] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [humanToken, setHumanToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleIntent = (value: string) => {
    setIntents((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const reset = () => {
    setContactName("");
    setContactEmail("");
    setLocation("");
    setTopic("");
    setIntents([]);
    setNotes("");
    setContactConsent(false);
    setMatchingConsent(false);
    setPrivacyAccepted(false);
    setHumanToken("");
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (intents.length === 0) {
      setNotice({
        ok: false,
        message: strings.form.notices.intentionRequired,
      });
      return;
    }
    if (!contactConsent || !privacyAccepted) {
      setNotice({
        ok: false,
        message: strings.form.notices.consentRequired,
      });
      return;
    }
    if (!humanToken) {
      setNotice({ ok: false, message: strings.form.notices.humanRequired });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/regional-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim(),
          location: location.trim(),
          topic: topic.trim() || undefined,
          intents,
          notes: notes.trim() || undefined,
          contactConsent,
          matchingConsent,
          privacyAccepted,
          humanToken,
          hp_regional: honeypot.trim() || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) {
        throw new Error("regional_interest_failed");
      }

      setNotice({ ok: true, message: strings.form.notices.submitOk });
      reset();
    } catch {
      setNotice({ ok: false, message: strings.form.notices.submitFail });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-[#f4f1e8]/12 bg-[#0b1714] p-6 shadow-2xl shadow-black/20 md:p-8">
      <h2 className="text-2xl font-black tracking-[-0.025em] text-[#f4f1e8]">
        {strings.form.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#f4f1e8]/58">
        {strings.form.subtitle}
      </p>

      {notice ? (
        <div
          role="status"
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm leading-6 ${
            notice.ok
              ? "border-[#d6ff65]/35 bg-[#d6ff65]/10 text-[#e8ffae]"
              : "border-rose-400/35 bg-rose-400/10 text-rose-100"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div
          className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="hp_regional">{strings.form.labels.honeypot}</label>
          <input
            id="hp_regional"
            name="hp_regional"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-[#f4f1e8]/75">
            {strings.form.labels.name}
            <input
              required
              autoComplete="name"
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              className="rounded-2xl border border-[#f4f1e8]/15 bg-[#07110f] px-4 py-3 font-normal text-[#f4f1e8] outline-none transition focus:border-[#d6ff65]/65 focus:ring-2 focus:ring-[#d6ff65]/15"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[#f4f1e8]/75">
            {strings.form.labels.email}
            <input
              required
              type="email"
              autoComplete="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              className="rounded-2xl border border-[#f4f1e8]/15 bg-[#07110f] px-4 py-3 font-normal text-[#f4f1e8] outline-none transition focus:border-[#d6ff65]/65 focus:ring-2 focus:ring-[#d6ff65]/15"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-[#f4f1e8]/75">
          {strings.form.labels.location}
          <input
            required
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder={strings.form.placeholders.location}
            className="rounded-2xl border border-[#f4f1e8]/15 bg-[#07110f] px-4 py-3 font-normal text-[#f4f1e8] outline-none transition placeholder:text-[#f4f1e8]/28 focus:border-[#d6ff65]/65 focus:ring-2 focus:ring-[#d6ff65]/15"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#f4f1e8]/75">
          {strings.form.labels.topic}
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder={strings.form.placeholders.topic}
            className="rounded-2xl border border-[#f4f1e8]/15 bg-[#07110f] px-4 py-3 font-normal text-[#f4f1e8] outline-none transition placeholder:text-[#f4f1e8]/28 focus:border-[#d6ff65]/65 focus:ring-2 focus:ring-[#d6ff65]/15"
          />
        </label>

        <fieldset>
          <legend className="text-sm font-black uppercase tracking-[0.16em] text-[#d6ff65]">
            {strings.form.labels.intentions}
          </legend>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {strings.form.intentionOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#f4f1e8]/10 bg-[#07110f]/70 p-4 transition hover:border-[#d6ff65]/45"
              >
                <input
                  type="checkbox"
                  checked={intents.includes(option.value)}
                  onChange={() => toggleIntent(option.value)}
                  className="mt-1 h-4 w-4 rounded border-[#f4f1e8]/35 bg-[#07110f] text-[#d6ff65] focus:ring-[#d6ff65]"
                />
                <span>
                  <span className="block font-bold text-[#f4f1e8]">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#f4f1e8]/65">
                    {option.hint}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="grid gap-2 text-sm font-bold text-[#f4f1e8]/75">
          {strings.form.labels.notes}
          <textarea
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={strings.form.placeholders.notes}
            className="rounded-2xl border border-[#f4f1e8]/15 bg-[#07110f] px-4 py-3 font-normal text-[#f4f1e8] outline-none transition placeholder:text-[#f4f1e8]/28 focus:border-[#d6ff65]/65 focus:ring-2 focus:ring-[#d6ff65]/15"
          />
        </label>

        <HumanCheck
          formId="regional-interest"
          variant="compact"
          strings={strings.humanCheck}
          onSolved={({ token }) => setHumanToken(token)}
          onError={() => setHumanToken("")}
        />

        <div className="space-y-3 rounded-2xl border border-[#f4f1e8]/10 bg-[#07110f]/65 p-4">
          <label className="flex items-start gap-3 text-sm leading-6 text-[#f4f1e8]/62">
            <input
              type="checkbox"
              checked={contactConsent}
              onChange={(event) => setContactConsent(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#f4f1e8]/35 bg-[#07110f] text-[#d6ff65] focus:ring-[#d6ff65]"
            />
            <span>{strings.form.labels.contactConsent}</span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 text-[#f4f1e8]/62">
            <input
              type="checkbox"
              checked={matchingConsent}
              onChange={(event) => setMatchingConsent(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#f4f1e8]/35 bg-[#07110f] text-[#d6ff65] focus:ring-[#d6ff65]"
            />
            <span>{strings.form.labels.matchingConsent}</span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 text-[#f4f1e8]/62">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#f4f1e8]/35 bg-[#07110f] text-[#d6ff65] focus:ring-[#d6ff65]"
            />
            <span>
              {strings.form.labels.privacy.before}{" "}
              <Link
                href="/datenschutz"
                className="font-bold text-[#d6ff65] underline underline-offset-4"
              >
                {strings.form.labels.privacy.link}
              </Link>{" "}
              {strings.form.labels.privacy.after}
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full justify-center rounded-full bg-[#d6ff65] px-6 py-3.5 font-black text-[#07110f] transition hover:-translate-y-0.5 hover:bg-[#e2ff8a] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          {submitting ? strings.form.submitting : strings.form.submit}
        </button>
      </form>
    </section>
  );
}
