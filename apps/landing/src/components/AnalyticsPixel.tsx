"use client";
import { useEffect } from "react";


export default function AnalyticsPixel({ path, locale }: { path: string; locale: string }) {
useEffect(() => {
fetch("/api/track", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ type: "pageview", name: "view", path, locale })
}).catch(() => {});
}, [path, locale]);
return null;
}