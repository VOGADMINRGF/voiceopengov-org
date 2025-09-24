
"use client";
import { useEffect } from "react";

export default function TrackPageview() {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ t: "pageview", path: window.location.pathname, ts: Date.now() })
    }).catch(()=>{});
  }, []);
  return null;
}
