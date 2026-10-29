/**
 * In-memory presence store for "ghost visitors".
 *
 * Every open game tab POSTs its player position a few times per second;
 * an SSE stream broadcasts the snapshot of everyone else. Visitors who
 * stop reporting are pruned by TTL — no cleanup job needed.
 *
 * The Map is cached on globalThis so Next.js dev HMR reloads don't
 * orphan the state between requests.
 */

export interface Visitor {
  id: string;
  name: string;
  x: number;
  y: number;
  moving: boolean;
  facing: string;
  lastSeen: number;
}

const TTL_MS = 12_000;

declare global {
  var __pgPresence: Map<string, Visitor> | undefined;
}

function store(): Map<string, Visitor> {
  globalThis.__pgPresence ??= new Map<string, Visitor>();
  return globalThis.__pgPresence;
}

const ADJECTIVES = [
  "Wandering", "Curious", "Silent", "Merry", "Lost", "Pixel",
  "Turbo", "Shy", "Bold", "Lucky", "Drifting", "Humming",
  "Sleepy", "Brave", "Sneaky", "Glowing",
];

const NOUNS = [
  "Octo", "Jelly", "Crab", "Sprite", "Frog", "Newt",
  "Moth", "Bee", "Tadpole", "Puffin", "Axolotl", "Ghost",
  "Squid", "Turtle", "Firefly", "Barnacle",
];

/** Deterministic per-id name — the same visitor keeps the same ghost name. */
export function nameFor(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const a = ADJECTIVES[h % ADJECTIVES.length];
  const n = NOUNS[(h >>> 8) % NOUNS.length];
  return `${a} ${n}`;
}

export function prune(now = Date.now()): void {
  const s = store();
  for (const [id, v] of s) {
    if (now - v.lastSeen > TTL_MS) s.delete(id);
  }
}

export function upsert(input: {
  id: string;
  x: number;
  y: number;
  moving: boolean;
  facing: string;
}): Visitor {
  const s = store();
  const existing = s.get(input.id);
  const visitor: Visitor = {
    id: input.id,
    name: existing?.name ?? nameFor(input.id),
    x: input.x,
    y: input.y,
    moving: input.moving,
    facing: input.facing,
    lastSeen: Date.now(),
  };
  s.set(input.id, visitor);
  return visitor;
}

export function remove(id: string): void {
  store().delete(id);
}

/** Everyone except the requesting visitor. */
export function list(exceptId?: string): Visitor[] {
  prune();
  const out: Visitor[] = [];
  for (const v of store().values()) {
    if (v.id !== exceptId) out.push(v);
  }
  return out;
}

export function count(): number {
  prune();
  return store().size;
}
