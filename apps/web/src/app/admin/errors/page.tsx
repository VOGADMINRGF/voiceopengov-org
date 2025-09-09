import { absUrl } from "@/utils/serverBaseUrl";
import ErrorLogModel from "@/models/ErrorLog";
import { connectDB } from "@/lib/connectDB";
import Link from "next/link";

export default async function AdminErrorsPage() {
  await connectDB();
  const errors = await ErrorLogModel.find().sort({ timestamp: -1 }).limit(50).lean();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Fehlerprotokoll</h1>
      <table className="table-auto w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="py-2 px-4">Trace-ID</th>
            <th>Code</th>
            <th>Pfad</th>
            <th>Status</th>
            <th>Zuletzt</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((err: any) => (
            <tr key={err.traceId} className="border-b hover:bg-gray-50">
              <td className="px-4">{err.traceId}</td>
              <td>{err.code}</td>
              <td>{err.path}</td>
              <td>
                <span className={`px-2 py-1 rounded ${err.resolved ? "bg-green-200" : "bg-red-200"}`}>
                  {err.resolved ? "Gelöst" : "Offen"}
                </span>
              </td>
              <td>{new Date(err.timestamp).toLocaleString()}</td>
              <td>
                <button className="text-blue-600 underline" onClick={() => {
                  fetch(absUrl('/api/errors/resolve', {
                    method: 'POST',
                    body: JSON.stringify({ traceId: err.traceId, resolved: !err.resolved }),
                    headers: { 'Content-Type': 'application/json' }
                  });
                }}>
                  {err.resolved ? "Wieder öffnen" : "Als gelöst markieren"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
