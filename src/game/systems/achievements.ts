import { emitGameEvent } from "@/game/systems/events";
import type { AchievementDef } from "@/game/types";

/**
 * Achievements — persisted in localStorage, announced over the event bus
 * so React can toast them. The game tracks progress sets (zones visited,
 * boards read, NPCs talked to) and calls `unlock()`.
 */

const STORAGE_KEY = "pg_achievements_v2";

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first-steps", title: "First Steps", desc: "Moved your tiny octopus legs", emoji: "👣" },
  { id: "explorer", title: "World Explorer", desc: "Visited all four districts", emoji: "🗺️" },
  { id: "bookworm", title: "Bookworm", desc: "Read every project noticeboard", emoji: "📚" },
  { id: "social", title: "Social Butterfly", desc: "Talked to every NPC in the world", emoji: "💬" },
  { id: "curious", title: "Curious Mind", desc: "Found what hides in the north-east", emoji: "💎" },
  { id: "konami", title: "Cheater Detected", desc: "↑↑↓↓←→←→BA", emoji: "🎮" },
];

export function unlockedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set<string>();
  }
}

export function unlock(id: string): boolean {
  const all = unlockedIds();
  if (all.has(id)) return false;
  all.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...all]));
  const def = ACHIEVEMENTS.find((a) => a.id === id);
  if (def) emitGameEvent("pg:achievement", def);
  return true;
}

export function resetAchievements(): void {
  localStorage.removeItem(STORAGE_KEY);
}
