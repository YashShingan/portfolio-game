import { list } from "@/lib/presence-store";

/**
 * GET /api/presence/stream?id=<selfId> — Server-Sent Events feed of
 * everyone else currently in the world. One connection per open game,
 * snapshot every ~700ms. Cheaper than WebSockets for a presence room
 * and works with plain Next.js route handlers (no custom server).
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SNAPSHOT_MS = 700;

export async function GET(req: Request) {
  const selfId = new URL(req.url).searchParams.get("id") ?? "";
  const encoder = new TextEncoder();

  let interval: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const close = () => {
        if (closed) return;
        closed = true;
        if (interval) clearInterval(interval);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      const send = () => {
        if (closed) return;
        try {
          const payload = JSON.stringify({
            t: Date.now(),
            visitors: list(selfId || undefined),
          });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          close();
        }
      };

      // Initial comment beats some proxies' buffering of the first event
      try {
        controller.enqueue(encoder.encode(": connected\n\n"));
      } catch {
        close();
        return;
      }
      send();
      interval = setInterval(send, SNAPSHOT_MS);
      req.signal.addEventListener("abort", close);
    },
    cancel() {
      if (interval) clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
