import { absUrl } from "@/utils/serverBaseUrl";
import { useState } from "react";

export default function QuickRegister({ onSuccess }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleQuickRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(absUrl("/api/quick-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSuccess?.(data.data);
    } catch (err) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleQuickRegister} className="space-y-4">
      <input
        type="text"
        placeholder="Dein Name"
        className="w-full border-2 rounded px-3 py-2"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={loading}
        required
      />
      <button
        type="submit"
        className="w-full bg-[#9333ea] text-white font-semibold rounded py-2 mt-2 hover:bg-[#7c2bd0] transition"
        disabled={loading}
      >
        {loading ? "Wird gespeichert..." : "Teilnehmen"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="text-xs text-gray-500 mt-1">
        Hinweis: Ohne Registrierung wird dein Name nicht dauerhaft gespeichert und du nimmst anonym an dieser Aktion teil.
      </p>
    </form>
  );
}
