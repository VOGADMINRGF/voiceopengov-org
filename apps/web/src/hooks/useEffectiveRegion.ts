// apps/web/src/hooks/useEffectiveRegion.ts
"use client";

import { useEffect, useState, useCallback } from "react";

export type RegionLevel = "country" | "state" | "county" | "city" | "nuts" | "custom";

export interface RegionDTO {
  id: string;
  code: string;
  name: string;
  level: RegionLevel | string;
}

export type RegionSource = "profile" | "cookie" | "none";

export interface EffectiveRegionResult {
  region: RegionDTO | null;
  source: RegionSource;
  userId?: string | null;
}

export function useEffectiveRegion() {
  const [data, setData] = useState<EffectiveRegionResult | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/region/effective", { cache: "no-store" });
      const j = (await r.json()) as EffectiveRegionResult;
      setData(j);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setRegion = useCallback(
    async (code: string, opts?: { persist?: boolean }) => {
      const r = await fetch("/api/region/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ code, persist: !!opts?.persist }),
      });
      if (!r.ok) throw new Error(await r.text());
      await refresh();
    },
    [refresh]
  );

  return { data, loading, refresh, setRegion };
}
