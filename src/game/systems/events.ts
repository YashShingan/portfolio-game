import type { AchievementDef, ZonePayload } from "@/game/types";

/**
 * Tiny typed event bus over window CustomEvents — the ONLY channel
 * between the Phaser game and React. No DOM queries inside the
 * game loop (that was v1's #1 perf bug).
 */

export interface GameEventMap {
  "pg:ready": undefined;
  "pg:prompt": { label: string | null };
  "pg:zone-open": ZonePayload;
  "pg:zone-close": undefined;
  "pg:achievement": AchievementDef;
  "pg:presence": { count: number };
  "pg:tick": {
    x: number;
    y: number;
    ghosts: Array<{ id: string; x: number; y: number }>;
  };
}

export function emitGameEvent<K extends keyof GameEventMap>(
  type: K,
  detail: GameEventMap[K],
): void {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

export function onGameEvent<K extends keyof GameEventMap>(
  type: K,
  handler: (detail: GameEventMap[K]) => void,
): () => void {
  const listener = (e: Event) => {
    handler((e as CustomEvent<GameEventMap[K]>).detail);
  };
  window.addEventListener(type, listener);
  return () => window.removeEventListener(type, listener);
}
