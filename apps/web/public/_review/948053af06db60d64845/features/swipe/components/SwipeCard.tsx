//Finale Version 04. August 2025
"use client";
import React, { useState, useMemo } from "react";
import ImpactIndicator from "./ImpactIndicator";
import VoteBar from "@features/vote/components/VoteBar";
import CountryAccordion from "@features/vote/components/CountryAccordion";
import { badgeColors } from "@ui/design/badgeColor";
import clsx from "clsx";

const TYPE_CONFIG = {
  community: { label: "Community", color: "bg-turquoise-100 text-turquoise-800" },
  ki: { label: "KI", color: "bg-violet-100 text-violet-700" },
  redaktion: { label: "Redaktion", color: "bg-coral-100 text-coral-700" }
};

const VOTE_MAP = [
  { value: "agree", icon: "👍", label: "Zustimmen", color: "border-turquoise-500 text-turquoise-600" },
  { value: "neutral", icon: "🤔", label: "Neutral", color: "border-violet-500 text-violet-700" },
  { value: "disagree", icon: "👎", label: "Ablehnen", color: "border-coral-500 text-coral-600" }
];

export default function SwipeCard({ statement, userHash, onVote, userCountry = "Deutschland", language = "de" }) {
  if (!statement) return null;

  // Übersetzung und barrierefreie Grundlogik
  const translated = useMemo(() => statement.translations?.[language] ?? {}, [statement, language]);
  const plainStatement = statement.plainStatement || statement.statement;
  const regionScope = statement.regionScope || [];
  const barrierescore = statement.barrierescore;
  const accessibilityStatus = statement.accessibilityStatus;
  const ai = statement.aiAnnotations || {};
  const hasAI = ai && (
    ai.toxicity != null ||
    ai.sentiment != null ||
    (Array.isArray(ai.subjectAreas) && ai.subjectAreas.length > 0)
  );

  // State
  const [mainVote, setMainVote] = useState("");
  const [showAlt, setShowAlt] = useState(false);
  const [altVotes, setAltVotes] = useState<Record<number, string>>({});

  function handleVote(type: string) {
    setMainVote(type);
    onVote?.(type);
    if ((type === "neutral" || type === "disagree") && statement.alternatives?.length) {
      setTimeout(() => setShowAlt(true), 200);
    }
  }

  function handleAltVote(idx: number, val: string) {
    setAltVotes((old) => ({ ...old, [idx]: old[idx] === val ? "" : val }));
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-7 max-w-2xl mx-auto my-10 relative">
      {/* Header: Tags & Kategorie */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {statement.tags?.map((t, i) => (
          <span key={t} className={clsx(
            "px-3 py-1 rounded-full text-xs font-bold border",
            badgeColors[i % badgeColors.length]
          )}>{t}</span>
        ))}
        {statement.category && (
          <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
            {statement.category}
          </span>
        )}
      </div>
      {/* Farbverlauf-Titel */}
      <h2 className="text-3xl font-bold mb-1 leading-snug"
        style={{
          background: "linear-gradient(90deg, #2396F3 10%, #00B3A6 60%, #FF6F61 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
        {translated.title || statement.title}
      </h2>
      {plainStatement !== statement.statement && (
        <div className="italic text-xs text-gray-500 mb-2">{plainStatement}</div>
      )}
      {/* Länder-Kontext */}
      <CountryAccordion countries={report.analytics.geoDistribution} userCountry="DE" /> 
      <CountryAccordion regionScope={regionScope} userCountry="DE" />      {/* Kontext */}
      {statement.context && (
        <div className="mb-3">
          <button
            className="underline text-indigo-600 text-sm"
            onClick={() => alert(statement.context)}
          >
            Mehr Kontext
          </button>
        </div>
      )}
      {/* VoteBar */}
      <VoteBar votes={statement.votes || {}} />
      {/* Impact-Indicators */}
      {Array.isArray(statement.impactLogic) && statement.impactLogic.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {statement.impactLogic.map((impact, i) => (
            <ImpactIndicator impact={impact} key={i} />
          ))}
        </div>
      )}
      {/* Abstimmungs-Buttons */}
      <div className="flex gap-6 mb-6 mt-3 justify-center items-center">
        {VOTE_MAP.map((btn) => (
          <button
            key={btn.value}
            className={clsx(
              "w-48 h-16 flex items-center justify-center border-2 rounded-full font-bold text-lg gap-2 bg-white",
              btn.color,
              mainVote === btn.value && "scale-110 shadow-md"
            )}
            onClick={() => handleVote(btn.value)}
          >
            <span className="text-2xl">{btn.icon}</span>
            {btn.label}
          </button>
        ))}
      </div>
      {/* Alternativen (Eventualziele) */}
      {showAlt && statement.alternatives?.length > 0 && (
        <div className="mb-3">
          <b className="block mb-2">Eventualziele & Alternativen:</b>
          <div className="flex flex-col gap-2">
            {statement.alternatives.map((alt, idx) => (
              <div key={alt.text} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
                <span className={clsx(
                  "px-2 py-1 rounded-full text-xs font-semibold",
                  TYPE_CONFIG[alt.type as keyof typeof TYPE_CONFIG]?.color || "bg-gray-100"
                )}>
                  {TYPE_CONFIG[alt.type as keyof typeof TYPE_CONFIG]?.label || alt.type}
                </span>
                <span className="flex-1">{alt.text}</span>
                <span className="flex gap-1">
                  {VOTE_MAP.map((v) => (
                    <button
                      key={v.value}
                      className={clsx(
                        "w-8 h-8 rounded-full border-2 text-lg font-bold flex items-center justify-center",
                        v.color,
                        altVotes[idx] === v.value ? "bg-gray-200 scale-110" : "bg-white"
                      )}
                      onClick={() => handleAltVote(idx, v.value)}
                    >
                      {v.icon}
                    </button>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility / Barrierefreiheits-Score */}
      {(accessibilityStatus || typeof barrierescore === "number") && (
        <div className="flex gap-2 items-center text-xs mb-1" aria-label="Barrierefreiheit">
          {accessibilityStatus && (
            <span className="rounded bg-green-50 text-green-700 px-2 py-1 font-bold">
              Accessibility: {accessibilityStatus}
            </span>
          )}
          {typeof barrierescore === "number" && (
            <span>
              Barrierefreiheits-Score: {barrierescore}/100
            </span>
          )}
        </div>
      )}

      {/* KI-Analyse */}
      {hasAI && (
        <div className="text-xs text-gray-500 mt-1" aria-label="KI-Analyse">
          {ai.toxicity != null && <>Toxizität: {(ai.toxicity * 100).toFixed(2)} % </>}
          {ai.sentiment != null && <>Stimmung: {ai.sentiment} </>}
          {Array.isArray(ai.subjectAreas) && ai.subjectAreas.length > 0 && (
            <>Themen: {ai.subjectAreas.join(", ")}</>
          )}
        </div>
      )}

      {/* Mitglieder-Block */}
      <input className="rounded-xl w-full bg-gray-100 mt-3 px-3 py-2 text-gray-400" value="Nur für Mitglieder" disabled />
      <div className="text-xs text-gray-500 mt-1 mb-2">
        Nur als registriertes Mitglied kannst du Alternativen einreichen.
      </div>
      {/* Auswertung/CTA */}
      <div className="bg-violet-50 p-3 mt-2 rounded-xl text-violet-700 text-sm font-semibold">
        <span className="mr-2">📈 Live-Auswertung (Trends, Argumente, Pro/Contra):</span>
        <a href="/mitglied" className="underline font-bold">Jetzt als Mitglied freischalten</a>
      </div>
      {/* Hinweis */}
      <div className="text-xs text-gray-400 mt-2 text-center">
        Beiträge & Alternativen werden durch Community, Redaktion & KI validiert.
      </div>
    </div>
  );
}
