// Minimaler KV-Adapter über REST (z. B. Vercel KV). Optional, nur wenn KV_ENABLED=true.


const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;


export async function kvPush(key: string, value: unknown) {
if (!KV_URL || !KV_TOKEN) throw new Error("KV missing configuration");
const url = new URL(`/set/${encodeURIComponent(key)}`, KV_URL);
const res = await fetch(url.toString(), {
method: "POST",
headers: {
Authorization: `Bearer ${KV_TOKEN}`,
"Content-Type": "application/json"
},
body: JSON.stringify({ value })
});
if (!res.ok) throw new Error(`KV push failed: ${res.status}`);
}