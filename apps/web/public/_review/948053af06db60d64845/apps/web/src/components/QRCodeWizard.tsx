// components/QRCodeWizard.tsx

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { colors, shadow } from "@ui/theme"; // Passe Pfad ggf. an

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

const STEPS = [
  "Typ wählen",
  "Fragen / Beitrag",
  "Zusammenfassung",
  "QR-Code"
];

const TARGET_TYPES = [
  { key: "statement", label: "Kernbotschaft/Frage", icon: "💬" },
  { key: "contribution", label: "Beitrag", icon: "📝" },
  { key: "stream", label: "Stream/Event", icon: "🎬" },
  { key: "set", label: "Fragen-Set", icon: "🗂️" }
];

export default function QRCodeWizard({ user, onQrCreated }: any) {
  const [step, setStep] = useState(0);
  const [targetType, setTargetType] = useState<string | null>(null);

  // Step 2 State
  const [mode, setMode] = useState<"search" | "text" | "upload">("text");
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [matches, setMatches] = useState<any[]>([]);

  // Step 4 QR
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState("");

  // --- Step 1: Type Selection ---
  function StepTypeSelect() {
    return (
      <section className="max-w-2xl mx-auto flex flex-col items-center mb-14">
        <div style={{ height: 56 }} /> {/* Abstand zum Header */}
        <WizardStepper step={step} />
        <h1 className="text-4xl font-bold text-center mb-2 mt-2" style={{ color: colors.indigo }}>
          Was möchtest du teilen?
        </h1>
        <p className="mb-10 text-center text-gray-600 font-medium text-lg">
          Wähle, wie du starten möchtest.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {TARGET_TYPES.map(type => (
            <button
              key={type.key}
              onClick={() => { setTargetType(type.key); setStep(1); }}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 p-8 min-h-[170px] shadow-lg font-semibold
                hover:shadow-xl hover:border-[#9333ea] transition
                ${targetType === type.key ? "border-[#9333ea] bg-[#f5f3ff]" : "border-gray-200 bg-white"}
              `}
              style={{ boxShadow: shadow.card }}
            >
              <span className="text-5xl mb-2">{type.icon}</span>
              <span className="text-lg font-bold mb-1">{type.label}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  // --- Step 2: Smart Fragen/Beitrag ---
  function handleAnalyze() {
    setMatches([]);
    if (mode === "search") {
      setMatches(input.length > 0 ? [
        { text: input, match: false }
      ] : []);
    }
    if (mode === "text") {
      const questions = input.split("\n").filter(q => q.trim().length > 0);
      setMatches(questions.map(q => ({ text: q, match: false })));
    }
    if (mode === "upload") {
      setMatches([{ text: file?.name || "Datei", match: false }]);
    }
  }

  function StepSmartInput() {
    return (
      <section className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg px-6 py-8 mt-10 mb-20">
        <WizardStepper step={step} />
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 mt-4" style={{ color: colors.indigo }}>
          Fragen oder Beiträge einfügen & prüfen lassen
        </h2>
        <div className="flex justify-center gap-4 mb-6">
          <button className={`px-4 py-2 rounded-lg font-semibold transition ${mode === "search" ? "bg-[#00B3A6] text-white" : "bg-gray-200 text-gray-800"}`} onClick={() => setMode("search")}>Suchen</button>
          <button className={`px-4 py-2 rounded-lg font-semibold transition ${mode === "text" ? "bg-[#9333ea] text-white" : "bg-gray-200 text-gray-800"}`} onClick={() => setMode("text")}>Text einfügen</button>
          <button className={`px-4 py-2 rounded-lg font-semibold transition ${mode === "upload" ? "bg-[#FF6F61] text-white" : "bg-gray-200 text-gray-800"}`} onClick={() => setMode("upload")}>Datei hochladen</button>
        </div>
        {mode === "search" && (
          <input type="text" placeholder="Frage suchen …" className="w-full border-2 rounded-xl px-3 py-2 mb-4"
                 value={input} onChange={e => setInput(e.target.value)} />
        )}
        {mode === "text" && (
          <textarea
            rows={6}
            className="w-full border-2 rounded-xl px-3 py-2 mb-4"
            placeholder="Fragen (eine pro Zeile)"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        )}
        {mode === "upload" && (
          <input type="file" accept=".txt,.pdf" className="mb-4" onChange={e => setFile(e.target.files?.[0] || null)} />
        )}
        <button className="w-full bg-[#00B3A6] text-white font-bold py-2 rounded-xl mt-4" onClick={handleAnalyze}>
          Analysieren & prüfen
        </button>
        {/* Matches-Liste */}
        {matches.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Erkannte Fragen/Einträge:</h3>
            <ul className="space-y-2">
              {matches.map((m, i) =>
                <li key={i} className={`p-3 rounded-lg ${m.match ? "bg-yellow-50" : "bg-green-50"}`}>
                  {m.text}
                  {m.match ? <span className="ml-2 text-yellow-600 text-xs">(Ähnliche Frage existiert)</span> : <span className="ml-2 text-green-600 text-xs">(Neu!)</span>}
                </li>
              )}
            </ul>
          </div>
        )}
        <div className="flex justify-between mt-8">
          <button onClick={() => setStep(0)} className="text-gray-400 hover:text-[#9333ea] font-bold">Zurück</button>
          <button
            onClick={() => setStep(2)}
            className="bg-[#9333ea] text-white rounded-lg px-6 py-2 font-bold shadow hover:bg-[#7c2bd0] transition"
          >Weiter</button>
        </div>
      </section>
    );
  }

  // --- Step 3: Zusammenfassung ---
  function StepSummary() {
    return (
      <section className="w-full max-w-2xl mx-auto flex flex-col items-center mb-14">
        <WizardStepper step={step} />
        <div className="bg-[#f5f3ff] rounded-2xl p-6 shadow-md w-full">
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.indigo }}>Zusammenfassung</h2>
          <div className="mb-4">
            <div className="font-semibold">Typ:</div>
            <div className="mb-2">{TARGET_TYPES.find(t => t.key === targetType)?.label}</div>
            <div className="font-semibold">Einträge:</div>
            <ul className="list-disc pl-6">
              {matches.map((obj, i) => (
                <li key={i}>{obj.text}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-[#9333ea] font-bold">Zurück</button>
            <button
              onClick={() => setStep(3)}
              className="bg-[#00B3A6] text-white rounded-lg px-6 py-2 font-bold shadow hover:bg-[#7c2bd0] transition"
            >QR-Code erzeugen</button>
          </div>
        </div>
      </section>
    );
  }

  // --- Step 4: QR-Code ---
  function StepQRResult() {
    return (
      <section className="w-full max-w-2xl mx-auto flex flex-col items-center mb-14">
        <WizardStepper step={step} />
        <div className="text-center space-y-6 w-full">
          <h2 className="text-xl font-bold mb-4" style={{ color: colors.turquoise }}>Fertig!</h2>
          <QRCode value={qrUrl || "https://voiceopengov.org/qr/yourcode"} size={160} />
          <div className="bg-gray-100 rounded-lg px-6 py-4 mt-4 w-full">
            <div className="font-mono text-lg text-[#44c76e] break-all">{qrUrl || "https://voiceopengov.org/qr/yourcode"}</div>
          </div>
          <div>
            <button
              className="bg-[#00B3A6] text-white rounded-lg px-6 py-2 font-bold shadow hover:bg-[#7c2bd0] transition flex items-center gap-2"
              onClick={() => navigator.clipboard.writeText(qrUrl)}
            >
              <span>Link kopieren</span>
              <span>📋</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // --- Stepper ---
  function WizardStepper({ step }: { step: number }) {
    return (
      <div className="flex justify-center items-center gap-4 mb-10">
        {STEPS.map((label, idx) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-1 shadow transition duration-300
                ${step === idx
                  ? "text-white border-2 border-[#00B3A6]"
                  : "text-[#00B3A6] border-2 border-[#00B3A6] bg-white"}
              `}
              style={{
                background: step === idx ? colors.turquoise : "#fff",
                color: step === idx ? "#fff" : colors.turquoise,
                boxShadow: shadow.card,
              }}
            >
              {idx + 1}
            </div>
            <span className="text-xs text-center font-medium" style={{ color: colors.turquoise, minWidth: 70 }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // --- Render ---
  return (
    <section className="w-full flex flex-col items-center bg-transparent">
      {step === 0 && <StepTypeSelect />}
      {step === 1 && <StepSmartInput />}
      {step === 2 && <StepSummary />}
      {step === 3 && <StepQRResult />}
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
    </section>
  );
}
