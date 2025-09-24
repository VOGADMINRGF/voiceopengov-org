"use client";
import { useState } from "react";


export default function ContactForm() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
const [msg, setMsg] = useState("");


async function onSubmit(e: React.FormEvent) {
e.preventDefault();
setState("sending");
setMsg("");
try {
const res = await fetch("/api/contact", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ name, email, message })
});
const j = await res.json();
if (!res.ok || !j.ok) throw new Error("failed");
setState("ok");
setMsg("Danke! Wir haben deine Nachricht erhalten.");
setName(""); setEmail(""); setMessage("");
} catch {
setState("error");
setMsg("Das hat leider nicht geklappt.");
}
}


return (
<form onSubmit={onSubmit} className="card max-w-xl mx-auto">
<h3 className="text-lg font-semibold mb-3">Kontakt</h3>
<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full rounded-xl border border-slate-300 px-3 py-2 mb-3" />
<input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="E‑Mail" className="w-full rounded-xl border border-slate-300 px-3 py-2 mb-3" />
<textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Nachricht" className="w-full rounded-xl border border-slate-300 px-3 py-2 min-h-[140px] mb-3" />
<button disabled={state === "sending"} className="btn-primary">
{state === "sending" ? "Sende…" : "Absenden"}
</button>
{msg && <p className="mt-2 text-sm text-slate-600">{msg}</p>}
</form>
);
}