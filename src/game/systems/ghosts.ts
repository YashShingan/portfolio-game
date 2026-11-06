import * as Phaser from "phaser";
import { Ghost } from "@/game/entities/Ghost";
import { audio } from "@/game/systems/audio";

/**
 * Ghost visitors — see other people exploring the world as translucent
 * octopus apparitions, each with a generated name ("Curious Puffin").
 *
 * Transport is deliberately boring:
 *   • POST /api/presence        — throttled position heartbeats (this tab)
 *   • GET  /api/presence/stream — SSE snapshot of everyone else, ~700ms
 *
 * The in-game Ghost entities lerp toward reported positions, so remote
 * movement reads as smooth at 1-2 Hz reports. All network calls are
 * best-effort: if anything fails, the single-player experience is
 * completely unaffected.
 */

const MAX_GHOSTS = 14;
const REPORT_MIN_MS = 240; // fastest heartbeat while moving
const REPORT_IDLE_MS = 2500; // keep-alive heartbeat while standing still

export interface GhostPos {
  id: string;
  x: number;
  y: number;
}

interface RemoteVisitor {
  id: string;
  name: string;
  x: number;
  y: number;
  moving: boolean;
  facing: string;
}

function visitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem("pg_visitor_id");
    if (!id) {
      id =
        (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`) + "";
      sessionStorage.setItem("pg_visitor_id", id);
    }
    return id;
  } catch {
    return `anon-${Math.random().toString(36).slice(2)}`;
  }
}

class GhostSystem {
  private scene: Phaser.Scene | null = null;
  private es: EventSource | null = null;
  private ghosts = new Map<string, Ghost>();
  private id = visitorId();
  private lastReport = 0;
  private lastReportedPos = { x: -1, y: -1, moving: false };
  private lastChime = 0;
  private pageHide = (): void => {
    // Hard reload / tab close skips React unmounts — the beacon is the
    // one network call browsers guarantee to deliver during unload.
    if (!this.id || typeof navigator === "undefined" || !navigator.sendBeacon) return;
    try {
      navigator.sendBeacon(
        "/api/presence",
        new Blob([JSON.stringify({ id: this.id, leave: true })], {
          type: "application/json",
        }),
      );
    } catch {
      /* best effort */
    }
  };

  connect(scene: Phaser.Scene): void {
    this.disconnect();
    this.scene = scene;
    this.id = visitorId();
    if (!this.id) return;
    // On static sites (like GitHub Pages), skip presence API requests
    if (process.env.NEXT_PUBLIC_ENABLE_PRESENCE !== "true") return;

    window.addEventListener("pagehide", this.pageHide);
    try {
      this.es = new EventSource(
        `/api/presence/stream?id=${encodeURIComponent(this.id)}`,
      );
      this.es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as { visitors?: RemoteVisitor[] };
          this.applySnapshot(data.visitors ?? []);
        } catch {
          /* malformed frame — ignore */
        }
      };
      this.es.onerror = () => {
        /* EventSource retries on its own */
      };
    } catch {
      /* SSE unsupported — game stays single-player */
    }
  }

  private applySnapshot(list: RemoteVisitor[]): void {
    const scene = this.scene;
    if (!scene || !scene.scene.isActive()) return;

    const seen = new Set<string>();
    for (const v of list) {
      if (!v || typeof v.id !== "string") continue;
      seen.add(v.id);
      const existing = this.ghosts.get(v.id);
      if (existing) {
        existing.setTarget(v.x, v.y, !!v.moving, v.facing);
      } else if (this.ghosts.size < MAX_GHOSTS) {
        this.ghosts.set(
          v.id,
          new Ghost(scene, {
            id: v.id,
            name: v.name || "Visitor",
            x: v.x,
            y: v.y,
            facing: v.facing,
            moving: !!v.moving,
          }),
        );
        const now = performance.now();
        if (now - this.lastChime > 1800) {
          this.lastChime = now;
          audio.ghost();
        }
      }
    }
    for (const [id, ghost] of this.ghosts) {
      if (!seen.has(id)) {
        ghost.fadeOutAndDestroy();
        this.ghosts.delete(id);
      }
    }
  }

  /** Throttled heartbeat to the server. Fire-and-forget. */
  report(x: number, y: number, moving: boolean, facing: string): void {
    if (!this.id || process.env.NEXT_PUBLIC_ENABLE_PRESENCE !== "true") return;
    const now = performance.now();
    const moved =
      Math.abs(x - this.lastReportedPos.x) > 2 ||
      Math.abs(y - this.lastReportedPos.y) > 2 ||
      moving !== this.lastReportedPos.moving;
    if (!moved && now - this.lastReport < REPORT_IDLE_MS) return;
    if (moved && now - this.lastReport < REPORT_MIN_MS) return;

    this.lastReport = now;
    this.lastReportedPos = { x, y, moving };
    try {
      void fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: this.id, x, y, moving, facing }),
      }).catch(() => {});
    } catch {
      /* offline — ignore */
    }
  }

  update(dt: number): void {
    for (const ghost of this.ghosts.values()) ghost.update(dt);
  }

  /** Positions for the minimap. */
  positions(): GhostPos[] {
    const out: GhostPos[] = [];
    for (const ghost of this.ghosts.values()) {
      // Ask the ghost for its CURRENT visual position via the sprite
      out.push({ id: ghost.id, ...ghost.visualPosition() });
    }
    return out;
  }

  onlineCount(): number {
    return this.ghosts.size;
  }

  disconnect(): void {
    this.es?.close();
    this.es = null;
    window.removeEventListener("pagehide", this.pageHide);
  }

  /** Full teardown — also tells the server we left, so ghosts vanish fast. */
  leave(): void {
    this.disconnect();
    for (const ghost of this.ghosts.values()) ghost.fadeOutAndDestroy();
    this.ghosts.clear();
    this.scene = null;
    this.lastReport = 0;
    this.lastReportedPos = { x: -1, y: -1, moving: false };
    if (this.id && process.env.NEXT_PUBLIC_ENABLE_PRESENCE === "true") {
      try {
        void fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: this.id, leave: true }),
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* best effort */
      }
    }
  }
}

export const ghosts = new GhostSystem();
