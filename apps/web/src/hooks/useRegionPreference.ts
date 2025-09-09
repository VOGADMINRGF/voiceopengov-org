"use client";

import { useEffect, useState } from "react";

export type RegionSource = "profile" | "cookie" | "geo" | "manual" | "none";
export type RegionPref = { id: string; code: string; name: string; level: number; source: RegionSource } | null;

export function useRegionPreference() {
  const [region, setRegion] = useState<RegionPref>(null);
  const [checking, setChecking] = useState(true);

  // 1) Boot: hole serverseitig gesetzte Präferenzen (Cookie/Profil)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/region/effective", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setRegion(json.region ?? null);
        }
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // 2) Einmalige Geolokalisierung mit expliziter Einwilligung
  async function askGeolocationOnce() {
    if (!("geolocation" in navigator)) throw new Error("Geolocation API not available");
    return new Promise<RegionPref>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const qs = new URLSearchParams({
            lat: String(pos.coords.latitude),
            lng: String(pos.coords.longitude),
          });
        const res = await fetch(`/api/geo/reverse?${qs.toString()}`, { cache: "no-store" });
          const json = await res.json();
          const reg = json?.region ? { ...json.region, source: "geo" as const } : null;
          if (reg) setRegion(reg);
          resolve(reg);
        } catch (e) {
          reject(e);
        }
      }, (err) => reject(err), { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
    });
  }

  // 3) Manuelles Setzen (Auswahlliste / Profil)
  async function setManualRegion(regionId: string) {
    const res = await fetch("/api/region/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regionId }),
    });
    const json = await res.json();
    const reg: RegionPref = json?.region ? { ...json.region, source: json.source } : null;
    setRegion(reg);
    return reg;
  }

  return { region, setRegion, checking, askGeolocationOnce, setManualRegion };
}
