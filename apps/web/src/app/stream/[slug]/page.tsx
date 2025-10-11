import { notFound } from "next/navigation";
import streamData from "@features/stream/data/streamData";
import VideoPlayer from "@ui";
import StatementList from "@ui";

export async function generateStaticParams() {
  return streamData.map((stream: any) => ({ slug: stream.slug }));
}

export default function StreamDetail({ params }: { params: { slug: string } }) {
  const stream = streamData.find((s: any) => s.slug === params.slug);

  if (!stream) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-24 space-y-8">
      <h1 className="text-3xl font-bold text-coral">{stream.title}</h1>
      <div className="text-gray-700 text-sm">
        <p>
          {stream.region} · {stream.topic}
        </p>
        <p>
          {stream.viewers} Zuschauer:innen · Status:{" "}
          <strong>{stream.status}</strong>
        </p>
      </div>

      {stream.trailerUrl && <VideoPlayer url={stream.trailerUrl} />}

      {stream.description && (
        <p className="text-lg text-gray-800">{stream.description}</p>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2 text-indigo-800">
          Statements im Stream
        </h2>
        <StatementList streamId={stream.slug} />
      </div>
    </main>
  );
}
