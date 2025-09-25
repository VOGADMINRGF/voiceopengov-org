"use client";

import { useState, useCallback } from "react";

type Props = { locale: string };

export default function ClientSubscribeForm({ locale }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // optional
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);

  // Honeypot gegen Bots (unsichtbar via CSS)
  const [hp, setHp] = useState("");

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);

    if (hp) {
      // Wenn Bots das Feld füllen, brechen wir einfach ab
      return;
    }

    // simpler Client-Check
    const em = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Bitte eine gültige E-Mail eingeben.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: em,
          name: name.trim() || undefined,
          locale,
          source: "landing",
          // UTM minimal, damit du im Backend mitloggen kannst
          utm: { source: "landing", medium: "newsletter", campaign: "subscribe" },
        }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({} as any));
      if (res.ok && data?.ok) {
        setOk(true);
        setEmail("");
        setName("");
      } else {
        setOk(false);
        setError(data?.error || "Anmeldung fehlgeschlagen. Bitte später erneut versuchen.");
      }
    } catch {
      setOk(false);
      setError("Netzwerkfehler. Bitte später erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }, [email, name, hp, locale]);

  if (ok) {
    return (
      <div
        className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
        role="status"
        aria-live="polite"
      >
        <p className="font-medium">Fast geschafft!</p>
        <p className="mt-1 text-sm">
          Wir haben dir eine E-Mail gesendet. Bitte klicke auf den Bestätigungs-Link, um
          deine Anmeldung abzuschließen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="hidden">
        {/* Honeypot-Feld (Bots füllen es häufig automatisch) */}
        <label>
          Telefon (leer lassen)
          <input value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          E-Mail-Adresse
        </label>
        <input
          type="email"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.org"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-0 focus:border-gray-400"
          aria-label="E-Mail-Adresse für den Newsletter"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Name <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Vorname (optional)"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-0 focus:border-gray-400"
        />
      </div>

      {error && (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Sende…" : "Anmelden"}
        </button>
        <p className="text-xs text-gray-500">
          Double-Opt-In. Abmeldung jederzeit möglich.
        </p>
      </div>
    </form>
  );
}
