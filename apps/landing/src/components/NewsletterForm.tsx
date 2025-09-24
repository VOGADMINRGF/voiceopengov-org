"use client";
import { useState } from "react";


export default function NewsletterForm() {
const [email, setEmail] = useState("");
const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
const [msg, setMsg] = useState<string>("");


async function onSubmit(e: React.FormEvent) {
e.preventDefault();
setState("sending");
setMsg("");
try {
const res = await fetch("/api/newsletter/subscribe", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email })
});
const j = await res.json();
if (!res.ok || !j.ok) throw new Error(j.error || "unknown_error");
setState("ok");
setMsg("Danke! Bitte prüfe dein Postfach.");
setEmail("");
} catch (err: any) {
setState("error");
setMsg("Das hat leider nicht geklappt.");
}
}


return (
<form id="newsletter" onSubmit={onSubmit} className="card max-w-xl mx-auto mt-4">
<label className="block text-sm font-medium">E‑Mail</label>
<div className="mt-2 flex gap-2">
<input
type="email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
placeholder="you@example.org"
/>
<button disabled={state === "sending"} className="btn-primary">
{state === "sending" ? "Sende…" : "Abonnieren"}
</button>
</div>
{msg && <p className="mt-2 text-sm text-slate-600">{msg}</p>}
</form>
);
}