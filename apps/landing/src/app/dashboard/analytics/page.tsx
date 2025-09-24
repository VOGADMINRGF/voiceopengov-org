
export const dynamic = "force-dynamic";
async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/analytics`, { cache: "no-store" });
  return res.json();
}
export default async function Page() {
  const data = await getData();
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-bold mb-4">Mini-Analytics</h1>
      <pre className="rounded-xl border border-slate-200 bg-white p-4">{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}
