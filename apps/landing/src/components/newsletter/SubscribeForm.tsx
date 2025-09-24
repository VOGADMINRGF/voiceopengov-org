"use client";

import { useRef, useState } from "react";
import { useLocaleAuto } from "@/libs/i18n/locale";

type Status = "idle" | "ok" | "err" | "rate" | "bot";

export default function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const start = useRef<number>(Date.now()); // für _duration
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState(""); // wird mitgeschickt
  const locale = useLocaleAuto(); // erlaubt alle Locales aus der URL

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");

    const elapsed = Date.now() - start.current;

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          locale,
          _duration: elapsed,   // Zeitgating
          website: honeypot,    // Honeypot (muss leer bleiben)
        }),
      });

      if (res.status === 429) {
        setStatus("rate");
        return;
      }

      const json = await res.json().catch(() => ({} as any));

      if (json?.ok) {
        setStatus("ok");
        setEmail("");
      } else if (json?.error === "bot_suspected") {
        setStatus("bot");
      } else if (res.ok) {
        // Falls Server 200 ohne { ok: true } liefert
        setStatus("ok");
        setEmail("");
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  }

  // Visuell verstecktes Honeypot-Feld
  const Honeypot = () => (
    <div
      style={{ position: "absolute", left: "-9999px", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden
    >
      <label>
        Website
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </label>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className={compact ? "flex gap-2" : "space-y-3"}>
      <Honeypot />
      <label className="block text-sm font-medium">
        Deine E-Mail
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border px-3 py-2"
          placeholder="du@example.org"
          autoComplete="email"
          inputMode="email"
        />
      </label>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full px-4 py-2 font-semibold text-white
                   bg-gradient-to-r from-cyan-500 to-indigo-600 shadow"
      >
        Für den Newsletter anmelden
      </button>

      <div aria-live="polite">
        {status === "ok" && (
          <p className="text-sm text-green-700">
            Danke! Bitte prüf deine E-Mails und bestätige die Anmeldung.
          </p>
        )}
        {status === "rate" && (
          <p className="text-sm text-amber-700">
            Zu viele Versuche – bitte kurz warten und erneut versuchen.
          </p>
        )}
        {status === "bot" && (
          <p className="text-sm text-amber-700">
            Hmm, das wirkte wie ein Bot. Versuch’s bitte nochmal.
          </p>
        )}
        {status === "err" && (
          <p className="text-sm text-red-700">
            Uff, da ging was schief. Versuch’s später noch einmal.
          </p>
        )}
      </div>
    </form>
  );
}
