"use client";
import { useEffect, useRef, useState } from "react";

/** Liefert zuletzt empfangenes SSE-Event (oder null).
 *  Debounce reduziert Re-Fetch-Stürme bei vielen Votes. */
export function useVoteStream(statementId: string) {
  const [lastEvent, setLastEvent] = useState<any>(null);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    if (!statementId) return;
    const es = new EventSource(`/api/vote/stream?statementId=${encodeURIComponent(statementId)}`);

    es.onmessage = (e) => {
      const payload = (() => { try { return JSON.parse(e.data); } catch { return null; } })();
      if (!payload) return;
      if (tRef.current) window.clearTimeout(tRef.current);
      tRef.current = window.setTimeout(() => setLastEvent(payload), 150);
    };
    es.onerror = () => { /* Browser reconnectet automatisch */ };

    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
      es.close();
    };
  }, [statementId]);

  return lastEvent;
}
