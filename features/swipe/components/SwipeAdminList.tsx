"use client";
import { useEffect, useState, useMemo } from "react";
import SwipeCard from "./SwipeCard"; // Deine Einzelkarten-Komponente für Swipes

export default function SwipeAdminList({
  admin,
  moderator,
  ngoView,
  politikView,
  readOnly,
  user,
  onEdit,
}: {
  admin?: boolean;
  moderator?: boolean;
  ngoView?: boolean;
  politikView?: boolean;
  readOnly?: boolean;
  user?: any;
  onEdit?: (swipe: any) => void;
}) {
  const [swipes, setSwipes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Swipes vom Server laden
  useEffect(() => {
    fetch("/api/swipes")
      .then((res) => res.json())
      .then((data) => setSwipes(data))
      .catch(() => setSwipes([]))
      .finally(() => setLoading(false));
  }, []);

  // Filterlogik (Rolle, Suche)
  const filteredSwipes = useMemo(() => {
    let list = swipes;
    // Optional: Rollenbasierte Filter
    if (ngoView && user?.orgId) {
      list = list.filter((s) => s.orgId === user.orgId);
    }
    if (politikView && user?.district) {
      list = list.filter((s) => s.district === user.district);
    }
    // Suche
    if (search.length > 2) {
      list = list.filter(
        (s) =>
          s.title?.toLowerCase().includes(search.toLowerCase()) ||
          s.statement?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [swipes, ngoView, politikView, user, search]);

  return (
    <div>
      <div className="flex gap-2 mb-4 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Swipes suchen (Kernbotschaft, ...)"
          className="w-full p-2 rounded-xl border border-gray-200 shadow-sm text-base outline-none focus:ring-2 focus:ring-coral"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">Lädt Swipes…</div>
      ) : filteredSwipes.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <div style={{ fontSize: 48 }}>🧭</div>
          <p>Keine passenden Swipes gefunden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSwipes.map((swipe) => (
            <SwipeCard
              key={swipe._id || swipe.id}
              swipe={swipe}
              admin={admin}
              moderator={moderator}
              readOnly={readOnly}
              onEdit={onEdit ? () => onEdit(swipe) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
