// Finale Version 04.August 2025 
"use client";
"use client";
import React, { useState, useMemo } from "react";
import clsx from "clsx";
import VoteBar from "@features/vote/components/VoteBar";
import { VoteButton } from "@features/vote/components/VoteButton";
import { UserVoteBar } from "@features/vote/components/UserVoteBar";
import VotingRuleBadge from "@features/vote/components/VotingRuleBadge";
import { getNationalFlag } from "@features/stream/utils/nationalFlag";
import { FiFlag } from "react-icons/fi";
import MiniLineChart from "@features/report/components/MiniLineChart";
import { badgeColors } from "@ui/design/badgeColor";

function ImpactList({ impacts, showAll, onExpand }) {
  const maxShow = 4;
  return (
    <div className="flex flex-wrap gap-2 mb-1" aria-label="Impact-Logik">
      {(showAll ? impacts : impacts.slice(0, maxShow)).map((impact, i) => (
        <span
          key={i}
          className="text-xs bg-neutral-100 px-2 py-1 rounded-lg"
          title={impact.description.einfach || impact.description.eloquent}
        >
          <b>{impact.type}:</b> {impact.description.einfach || impact.description.eloquent}
        </span>
      ))}
      {impacts.length > maxShow && !showAll && (
        <button
          onClick={onExpand}
          className="text-xs underline text-indigo-700 ml-2"
          aria-expanded="false"
        >
          Mehr anzeigen
        </button>
      )}
    </div>
  );
}

export default function StatementCard({ statement, userHash, onClick, language = "de" }) {
  const [showAllImpacts, setShowAllImpacts] = useState(false);
  const [showAllAlts, setShowAllAlts] = useState(false);

  // Internationalisierung
  const translated = useMemo(
    () => statement.translations?.[language] ?? {},
    [statement, language]
  );
  const plainStatement = statement.plainStatement || statement.statement;
  const media = statement.media || (statement.imageUrl ? [statement.imageUrl] : []);
  const regionScope = statement.regionScope || [];
  const hasImpact = Array.isArray(statement.impactLogic) && statement.impactLogic.length > 0;
  const hasAlternatives = Array.isArray(statement.alternatives) && statement.alternatives.length > 0;
  const hasTrust = typeof statement.trustScore === "number" && statement.trustScore > 0;
  const trustLabel =
    statement.trustScore >= 0.75
      ? "Sehr hoch"
      : statement.trustScore >= 0.5
      ? "Solide"
      : statement.trustScore > 0.01
      ? "Diskussionswürdig"
      : "Nicht geprüft";
  const ai = statement.aiAnnotations || {};
  const barrierescore = statement.barrierescore;
  const accessibilityStatus = statement.accessibilityStatus;
  const hasAI = ai &&
    (ai.toxicity != null ||
     ai.sentiment != null ||
     (Array.isArray(ai.subjectAreas) && ai.subjectAreas.length > 0));
  const trend = statement.trendData || statement.trend || null;
  const history = statement.historyLog;

  // Card-ID für ARIA/Label
  const cardId = `statement-card-${statement.id}`;

  return (
    <article
      id={cardId}
      tabIndex={0}
      aria-labelledby={`${cardId}-title`}
      className={clsx(
        "bg-white border border-neutral-200 rounded-2xl shadow p-4 sm:p-6 w-full mb-4 relative flex flex-col gap-2 outline-none",
        "transition-shadow focus:ring-2 focus:ring-indigo-400 hover:shadow-lg"
      )}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onClick?.(e);
      }}
      role="group"
    >
      {/* Status/Moderation */}
      <div className="absolute top-3 right-4 flex gap-2 z-10">
        {statement.status === "archived" && (
          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">Archiviert</span>
        )}
        {statement.status === "draft" && (
          <span className="bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">Entwurf</span>
        )}
        {statement.badge && statement.badge !== "none" && (
          <span className="bg-turquoise text-white px-3 py-1 rounded-full text-xs font-bold">{statement.badge}</span>
        )}
      </div>

      {/* Titel mit Farbverlauf */}
      <header className="flex items-center gap-2 mb-1">
        <span aria-hidden="true" className="text-xl">💡</span>
        <h2
          id={`${cardId}-title`}
          className="font-bold text-base sm:text-lg leading-tight truncate"
          style={{
            background: "linear-gradient(90deg, #2396F3 10%, #00B3A6 60%, #FF6F61 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {translated.title || statement.title}
        </h2>
        {statement.votingRule && <VotingRuleBadge votingRule={statement.votingRule} />}
      </header>

      {plainStatement !== statement.statement && (
        <div className="italic text-xs text-gray-500 mb-2">{plainStatement}</div>
      )}

      {/* Kategorie, Länder/Regionen, Tags */}
      <div className="flex flex-wrap gap-2 items-center mb-1">
        <span className="uppercase text-[10px] font-semibold text-neutral-400">
          {statement.category}
        </span>
        {regionScope.map((r, i) => (
          <span key={i} className="text-lg" title={r.name}>
            {getNationalFlag(r.iso || r.nuts1)}
          </span>
        ))}
        {Array.isArray(regionScope) && regionScope.length > 0 && (
          <span className="text-xs text-turquoise-700 truncate">
            • {regionScope.map(r => r.name).join(", ")}
          </span>
        )}
        {Array.isArray(statement.tags) && statement.tags.map((tag, i) => (
          <span
            key={tag}
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-bold border",
              { 0: "border-coral text-coral",
                1: "border-indigo-500 text-indigo-600",
                2: "border-emerald-500 text-emerald-600",
                3: "border-amber-500 text-amber-600" }[i % 4] || "border-neutral-300 text-neutral-600"
            )}
            aria-label={`Tag: ${tag}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Haupttext & Kontext */}
      <div className="mb-2 text-base leading-relaxed" aria-label="Kernaussage">
        {translated.shortText || statement.shortText || statement.statement}
      </div>

      {/* Fakten/Quellen */}
      {Array.isArray(statement.facts) && statement.facts.length > 0 && (
        <div className="mb-2">
          <b>Fakten:</b>
          <ul className="ml-4 list-disc text-xs">
            {statement.facts.map((fact, idx) =>
              <li key={idx}>
                {typeof fact === "string" ? fact : (
                  <>
                    {fact.text}
                    {fact.source?.name && (
                      <> – <a
                        href={fact.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-700"
                      >
                        {fact.source.name}
                      </a> ({fact.source.trustScore} %)
                      </>
                    )}
                  </>
                )}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Impact/Top-Argumente */}
      {hasImpact && (
        <ImpactList
          impacts={statement.impactLogic}
          showAll={showAllImpacts}
          onExpand={() => setShowAllImpacts(true)}
        />
      )}

      {/* Trends/MiniChart */}
      {trend && (
        <div className="my-2 w-full" aria-label="Abstimmungstrend">
          <MiniLineChart data={trend} />
          <span className="text-xs text-neutral-400">Trend: {trend.slice(-1)[0]}</span>
        </div>
      )}

      {/* Media */}
      {Array.isArray(media) && media.length > 0 && (
        <div className="flex gap-2 mb-2">
          {media.map((src, i) => (
            <img
              key={i}
              src={typeof src === "string" ? src : src.src}
              alt={typeof src === "string" ? translated.title || statement.title : (src.alt || translated.title || statement.title)}
              className="w-20 h-14 object-cover rounded shadow"
            />
          ))}
        </div>
      )}

      {/* Abstimmung */}
      <section aria-label="Abstimmungsbereich" className="flex flex-col gap-1">
        <VoteBar statementId={statement.id} />
        <UserVoteBar statementId={statement.id} userHash={userHash} />
        <VoteButton statementId={statement.id} userHash={userHash} />
      </section>
      
      {/* Alternativen */}
      {hasAlternatives && (
        <div className="mt-2">
          <b>Alternativen:</b>
          <ul className="list-disc ml-5 text-xs max-h-24 overflow-hidden">
            {(showAllAlts ? statement.alternatives : statement.alternatives.slice(0, 3)).map((alt, idx) => (
              <li key={idx}>
                {alt.text}
                {alt.impact && (
                  <span className="text-neutral-500 ml-1">({alt.impact})</span>
                )}
              </li>
            ))}
          </ul>
          {statement.alternatives.length > 3 && !showAllAlts && (
            <button
              onClick={() => setShowAllAlts(true)}
              className="text-xs underline text-indigo-700 mt-1"
              aria-expanded="false"
            >
              Mehr Alternativen anzeigen
            </button>
          )}
        </div>
      )}

      {/* KI/Annotations */}
      {hasAI && (
        <div className="text-xs text-gray-500 mt-1" aria-label="KI-Analyse">
          {ai.toxicity != null && <>Toxizität: {(ai.toxicity * 100).toFixed(2)} % </>}
          {ai.sentiment != null && <>Stimmung: {ai.sentiment} </>}
          {Array.isArray(ai.subjectAreas) && ai.subjectAreas.length > 0 && (
            <>Themen: {ai.subjectAreas.join(", ")}</>
          )}
        </div>
      )}

      {/* Details-Link */}
      <a
        href={`/beitrag/${statement.id}`}
        className="mt-3 block text-center underline text-indigo-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
        aria-label="Alle Details & Diskussion anzeigen"
        tabIndex={0}
      >
        Alle Details & Diskussion anzeigen
      </a>

      {/* TrustScore / Redaktion */}
      {hasTrust && statement.trustScore != null && (
        <div className="mt-1 text-xs text-turquoise-700" aria-label="Vertrauensscore">
          TrustScore: {(statement.trustScore * 100).toFixed(1)}%
          <span className="ml-2 text-neutral-500">{trustLabel}</span>
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

      {/* Melden / Review */}
      <div className="flex gap-2 mt-2">
        <button
          className="bg-white border border-neutral-300 text-red-600 rounded-full px-4 py-2 font-bold flex items-center gap-2 shadow focus:outline-none focus:ring-2 focus:ring-red-300"
          title="Beitrag melden"
          aria-label="Beitrag melden"
        >
          <FiFlag aria-hidden="true" /> Beitrag melden
        </button>
      </div>

      {/* History / Audit Log */}
      {history && history.length > 0 && (
        <details className="mt-2">
          <summary className="text-xs underline text-gray-500 cursor-pointer">Änderungsverlauf anzeigen</summary>
          <ul className="text-xs pl-4">
            {history.map((h, i) =>
              <li key={i}>{h.action} – {h.by} – {h.at}</li>
            )}
          </ul>
        </details>
      )}
    </article>
  );
}
