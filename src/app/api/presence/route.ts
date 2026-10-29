import { NextResponse } from "next/server";
import { count, remove, upsert } from "@/lib/presence-store";

/**
 * POST /api/presence — the client heartbeat.
 * Body: { id, x, y, moving, facing }      → upsert position
 *     or { id, leave: true }              → clean exit (tab close / game exit)
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (id.length < 8 || id.length > 64) {
    return NextResponse.json({ ok: false, error: "bad id" }, { status: 400 });
  }

  if (body.leave) {
    remove(id);
    return NextResponse.json({ ok: true, count: count() });
  }

  const x = Number(body.x);
  const y = Number(body.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return NextResponse.json({ ok: false, error: "bad position" }, { status: 400 });
  }

  const visitor = upsert({
    id,
    x: Math.max(0, Math.min(3000, Math.round(x))),
    y: Math.max(0, Math.min(3000, Math.round(y))),
    moving: body.moving === true,
    facing: typeof body.facing === "string" ? body.facing.slice(0, 8) : "right",
  });

  return NextResponse.json({ ok: true, name: visitor.name, count: count() });
}
