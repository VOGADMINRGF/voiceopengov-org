"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"pwd" | "passkey">("pwd");
  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <div className="flex gap-2 mb-4">
        {["pwd", "passkey"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-3 py-1 rounded border ${tab === t ? "bg-black text-white" : "bg-white"}`}
          >
            {t === "pwd"
              ? "E-Mail & Passwort"
              : t === "magic"
                ? "Magic-Link"
                : "Passkey"}
          </button>
        ))}
      </div>
      {tab === "pwd" && <PwdForm />}
      {tab === "passkey" && <PasskeyForm />}
      <p className="text-sm mt-4">
        Noch kein Konto?{" "}
        <Link href="/register" className="underline">
          Registrieren
        </Link>
      </p>
    </div>
  );
}

function PwdForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>();
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(undefined);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setMsg(j?.error || "Login fehlgeschlagen");
    location.href = "/";
  }
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        className="w-full border rounded px-3 py-2"
        type="email"
        required
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        type="password"
        required
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {msg && <p className="text-red-600 text-sm">{msg}</p>}
      <button className="bg-black text-white rounded px-4 py-2">
        Einloggen
      </button>
    </form>
  );
}

function PasskeyForm() {
  return (
    <div className="text-sm text-neutral-600">
      Passkey-Login wird vorbereitet (WebAuthn). Für jetzt bitte E-Mail/Passwort
      nutzen.
    </div>
  );
}
