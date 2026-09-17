import { readdir, readFile } from "node:fs/promises";

const repo = process.env.GITHUB_REPOSITORY;
const sha = process.env.GITHUB_SHA;
const site = "https://www.voiceopengov.org";
const host = "www.voiceopengov.org";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const publicDir = new URL("../public/", import.meta.url);
const candidateFiles = (await readdir(publicDir)).filter((name) => /^[a-f0-9]{32}\.txt$/i.test(name));
if (candidateFiles.length !== 1) {
  throw new Error(`IndexNow: expected exactly one public 32-hex verification file, found ${candidateFiles.length}.`);
}
const verificationFile = candidateFiles[0];
const key = (await readFile(new URL(`../public/${verificationFile}`, import.meta.url), "utf8")).trim();
if (`${key}.txt` !== verificationFile) {
  throw new Error("IndexNow: public verification filename/content mismatch.");
}
const keyLocation = `${site}/${verificationFile}`;

if (!repo || !sha) {
  console.log("IndexNow: not running in a GitHub commit context; skipping.");
  process.exit(0);
}

async function readVercelStatus() {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "voiceopengov-indexnow",
  };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}/status`, { headers });
  if (!response.ok) throw new Error(`GitHub commit status HTTP ${response.status}`);
  const payload = await response.json();
  return payload.statuses?.find((status) => status.context === "Vercel")?.state ?? null;
}

let vercelState = null;
for (let attempt = 1; attempt <= 12; attempt += 1) {
  vercelState = await readVercelStatus();
  if (vercelState === "success" || vercelState === "failure" || vercelState === "error") break;
  console.log(`IndexNow: Vercel status ${vercelState ?? "pending"}; retry ${attempt}/12.`);
  await sleep(10_000);
}

if (vercelState !== "success") {
  console.log(`IndexNow: production deployment is not successful (${vercelState ?? "unknown"}); no URLs submitted.`);
  process.exit(0);
}

let keyVerified = false;
for (let attempt = 1; attempt <= 6; attempt += 1) {
  const response = await fetch(`${keyLocation}?deployment=${encodeURIComponent(sha)}`, {
    headers: { "cache-control": "no-cache", "user-agent": "voiceopengov-indexnow" },
  }).catch(() => null);
  if (response?.ok && (await response.text()).trim() === key) {
    keyVerified = true;
    break;
  }
  if (attempt < 6) await sleep(5_000);
}

if (!keyVerified) {
  console.log("IndexNow: production domain does not yet expose the verification key; no URLs submitted.");
  process.exit(0);
}

let sitemapText = "";
for (let attempt = 1; attempt <= 4; attempt += 1) {
  const response = await fetch(`${site}/sitemap.xml?indexnow=${encodeURIComponent(sha)}`, {
    headers: { "cache-control": "no-cache", "user-agent": "voiceopengov-indexnow" },
  });
  if (response.ok) {
    sitemapText = await response.text();
    break;
  }
  if (attempt < 4) await sleep(3_000);
}

if (!sitemapText) throw new Error("IndexNow: production sitemap unavailable after successful Vercel deployment.");

const urls = [...new Set(
  [...sitemapText.matchAll(/<loc>(https:\/\/www\.voiceopengov\.org\/[^<]*)<\/loc>/g)].map((match) => match[1]),
)];

if (!urls.length) throw new Error("IndexNow: production sitemap contains no canonical VoiceOpenGov URLs.");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
});

if (!response.ok) {
  const body = await response.text().catch(() => "");
  throw new Error(`IndexNow submission failed: HTTP ${response.status}${body ? ` ${body}` : ""}`);
}

console.log(`IndexNow accepted ${urls.length} production sitemap URL(s) for ${sha} with HTTP ${response.status}.`);
