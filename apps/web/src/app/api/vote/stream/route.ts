import { redisSubscribe, voteChannel } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statementId = searchParams.get("statementId") || "";
  if (!statementId) return new Response("statementId required", { status: 400 });

  const ch = voteChannel(statementId);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (obj: any) => controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
      const sendRaw = (s: string) => controller.enqueue(enc.encode(s));

      // Reconnect-Vorschlag 5s (Client darf anders)
      sendRaw(`retry: 5000\n\n`);

      // subscribe
      const unsubscribe = await redisSubscribe(ch, (msg) => {
        try { send(JSON.parse(msg)); } catch { /* ignore */ }
      });

      // hello + keep-alive
      send({ type: "hello", ch, ts: Date.now() });
      const iv = setInterval(() => controller.enqueue(enc.encode(`: ping\n\n`)), 15000);

      // close on abort
      const abort = (req as any).signal as AbortSignal | undefined;
      abort?.addEventListener("abort", async () => {
        clearInterval(iv);
        try { await unsubscribe(); } catch {}
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
