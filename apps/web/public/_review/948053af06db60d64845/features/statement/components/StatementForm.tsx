"use client";
import { useState, useRef, useEffect } from "react";
import { MAIN_CATEGORIES, REGIONS } from "./StatementList";
import { FiPlus, FiX, FiCheckCircle, FiLoader } from "react-icons/fi";

export default function StatementForm({ onSubmit, onCancel }) {
  const [category, setCategory] = useState(MAIN_CATEGORIES[0]);
  const [region, setRegion] = useState(REGIONS[1].value);
  const [statement, setStatement] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [alternative, setAlternative] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Autofocus Statement
  const statementRef = useRef(null);
  useEffect(() => { statementRef.current?.focus(); }, []);

  async function handleAnalyze() {
    setAnalyzing(true);
    setError(""); setAnalysis(null);
    try {
      const res = await fetch("/api/contribution/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: statement, userContext: { region } }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Analyse fehlgeschlagen.");
      setAnalysis(data);
    } catch (e) {
      setError(e.message || "Analyse fehlgeschlagen.");
    }
    setAnalyzing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess(false); setSaving(true);
    try {
      const res = await fetch("/api/statements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: statement.slice(0, 80) || "Neues Statement",
          statement,
          category,
          regionScope: [{ name: region, type: "region" }],
          alternatives: alternatives.map(a => ({ text: a })),
          analysis
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Speichern fehlgeschlagen.");
      }
      setSuccess(true);
      setStatement(""); setAlternatives([]); setAlternative(""); setAnalysis(null);
    } catch (e) {
      setError(e.message || "Fehler beim Speichern.");
    }
    setSaving(false);
  }

  function handleAddAlternative() {
    if (alternative.trim()) {
      setAlternatives(prev => [...prev, alternative.trim()]);
      setAlternative("");
    }
  }
  function handleRemoveAlternative(idx) {
    setAlternatives(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl bg-white p-8 rounded-2xl shadow-2xl" aria-label="Neues Statement einreichen">
      <h2 className="text-2xl mb-6 font-bold text-coral">Neues Statement einreichen</h2>
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded mb-3 flex gap-2 items-center">
          <FiCheckCircle /> Erfolgreich gespeichert! <a href="/beitraege" className="underline">Zur Übersicht</a>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-3">{error}</div>
      )}
      <label className="font-bold">Thema / Kategorie</label>
      <select className="block w-full mb-2 border rounded p-2" value={category} onChange={e => setCategory(e.target.value)}>
        {MAIN_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
      </select>
      <label className="font-bold">Regionale Ebene</label>
      <select className="block w-full mb-2 border rounded p-2" value={region} onChange={e => setRegion(e.target.value)}>
        {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
      </select>
      <label className="font-bold">Statement</label>
      <textarea
        className="w-full mb-2 border rounded p-2"
        rows={4}
        maxLength={280}
        value={statement}
        ref={statementRef}
        onChange={e => setStatement(e.target.value)}
        placeholder="Statement eingeben"
        required
        aria-label="Statement"
      />
      <div className="text-xs text-gray-400 text-right mb-2">{statement.length} / 280 Zeichen</div>
      <label className="font-bold">Alternative(n)</label>
      <div className="flex gap-2 mb-2">
        <input
          className="flex-1 border rounded p-2"
          value={alternative}
          onChange={e => setAlternative(e.target.value)}
          placeholder="Kompromiss-/Alternativvorschlag"
        />
        <button type="button" onClick={handleAddAlternative} className="bg-coral text-white px-3 py-1 rounded" disabled={!alternative.trim()}>
          <FiPlus />
        </button>
      </div>
      <ul className="mb-4">
        {alternatives.map((alt, idx) => (
          <li key={idx} className="text-xs flex gap-2 items-center">
            {alt}
            <button type="button" className="text-red-400 text-xs" onClick={() => handleRemoveAlternative(idx)}><FiX /></button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={handleAnalyze}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!statement || analyzing}
        >
          {analyzing ? <FiLoader className="animate-spin" /> : "GPT-Analyse anzeigen"}
        </button>
        <button type="submit" className="bg-turquoise text-white px-4 py-2 rounded" disabled={saving}>{saving ? <FiLoader className="animate-spin" /> : "Speichern"}</button>
        <button type="button" onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded">Abbrechen</button>
      </div>
      {analysis && (
        <div className="bg-gray-50 border rounded-xl p-4 text-sm mt-2">
          <div className="font-bold text-purple-700 mb-1">GPT-Analyse:</div>
          <div><span className="font-semibold">Themen:</span> {analysis.topics?.map((t: any) => t.name).join(", ")}</div>
          <div><span className="font-semibold">Ebene:</span> {analysis.level}</div>
          <div><span className="font-semibold">Statements:</span> {analysis.statements?.map((s: any) => s.text).join(" | ")}</div>
          <div><span className="font-semibold">Vorschläge:</span> {analysis.suggestions?.join(" | ")}</div>
        </div>
      )}
    </form>
  );
}
