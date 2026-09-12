#!/usr/bin/env node

const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

async function request(path, expectedStatus = 200) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  const body = await response.text();
  if (response.status !== expectedStatus) {
    throw new Error(`${path}: expected ${expectedStatus}, received ${response.status}`);
  }
  return { response, body };
}

const home = await request("/?lang=en");
if (!home.body.includes('id="mitmachen"')) throw new Error("membership entry section is missing");

const arabic = await request("/?lang=ar");
if (!/<html[^>]+lang="ar"[^>]+dir="rtl"/.test(arabic.body)) {
  throw new Error("Arabic HTML direction contract is missing");
}

await request("/login?lang=en");
await request("/unterstuetzen?lang=en");
await request("/api/funding/status?session_id=invalid", 400);

const admin = await request("/admin/growth", 503);
if (admin.response.headers.get("cache-control") !== "no-store") {
  throw new Error("admin denial must not be cached");
}

console.log("VoiceOpenGov membership/funding production smoke: OK");
