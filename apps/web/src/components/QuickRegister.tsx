"use client";
import { useState } from "react";

export type QuickRegisterSuccess = {
  id: string;
  createdAt: string;            // kommt als ISO-String aus JSON
  name: string | null;
  email: string | null;
  source: string;
};

type QuickRegisterProps = {
  source?: string;
  onSuccess?: (payload: QuickRegisterSuccess) => void;
};

export default function QuickRegister({
  source = "join_page",
  onSuccess,
}: QuickRegisterProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState<"idle" | "ok" | "fail" | "rate">("idle");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMsg("");

    const csrf = document.cookie
      .split("; ")
      .find(c => c.startsWith("csrf-token="))
      ?.split("=")[1];

    try {
      const res = await fetch("/api/quick-register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(csrf ? { "x-csrf-token": csrf } : {}),
        },
        body: JSON.stringify({ email, name, consent, source }),
      });

      if (res.status === 429) {
        setStatus("rate");
        setMsg("Zu viele Versuche. Bitte kurz warten.");
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setStatus("fail");
        setMsg(j?.error ?? "Konnte nicht senden. Versuch’s später erneut.");
        return;
      }

      const j = (await res.json().catch(() => null)) as
        | { data: QuickRegisterSuccess }
        | null;

      setStatus("ok");
      setMsg("Danke! Wir melden uns.");
      setEmail("");
      setName("");

      if (j?.data) onSuccess?.(j.data);
    } catch {
      setStatus("fail");
      setMsg("Netzwerkfehler.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 max-w-sm">
      <input
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="Name (optional)"
        className="border rounded px-2 py-1"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        placeholder="Email"
        type="email"
        required
        className="border rounded px-2 py-1"
      />
      <label className="text-sm flex items-center gap-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.currentTarget.checked)}
        />
        Ich bin einverstanden.
      </label>
      <button type="submit" className="border rounded px-3 py-1">
        Register
      </button>

      {msg && (
        <p className={status === "ok" ? "text-green-600" : "text-red-600"}>{msg}</p>
      )}
    </form>
  );
}
