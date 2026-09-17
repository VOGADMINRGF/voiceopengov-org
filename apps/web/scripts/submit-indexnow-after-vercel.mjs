const repo = process.env.GITHUB_REPOSITORY;
const sha = process.env.GITHUB_SHA;
const key = "b9e75cf96bbd019de7be3f11b46bd928";
const site = "https://www.voiceopengov.org";
const host = "www.voiceopengov.org";
const keyLocation = `${site}/${key}.txt`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (!repo || !sha) {
  console.log("IndexNow: not running in a GitHub commit context; skipping.");
  process.exit(0);
}

async function readVercelStatus() {
  const response = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}/status`, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "voiceopengov-indexnow",
    },
  });
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
