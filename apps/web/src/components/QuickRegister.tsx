// apps/web/src/components/QuickRegister.tsx
"use client";

import { useState, ReactElement } from "react";

type Props = {
  onSuccess?: (data: any) => void;
  endpoint?: string;
  placeholder?: string;
  buttonLabel?: string;
};

export default function QuickRegister({
  onSuccess,
  endpoint = "/api/quick-register",
  placeholder = "Dein Name",
  buttonLabel = "Teilnehmen",
}: Props): ReactElement {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const username = name.trim();
    if (!username) return setError("Bitte einen Namen eingeben.");

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ username }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Registrierung fehlgeschlagen");
      onSuccess?.(json?.data ?? json);
      setName("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-live="polite">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full border-2 rounded px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        required
      />

      <button
        type="submit"
        className="w-full bg-[#9333ea] text-white font-semibold rounded py-2 mt-1 hover:bg-[#7c2bd0] transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Wird gespeichert…" : buttonLabel}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <p className="text-xs text-gray-500">
        Hinweis: Ohne Registrierung wird dein Name nicht dauerhaft gespeichert
        und du nimmst anonym an dieser Aktion teil.
      </p>
    </form>
  );
}
