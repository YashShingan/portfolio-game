"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as Phaser from "phaser";
import { toast } from "sonner";
import { Trophy, Volume2, VolumeX, X } from "lucide-react";
import { Joystick } from "@/components/game/Joystick";
import { Minimap } from "@/components/game/Minimap";
import { ZoneModal } from "@/components/game/ZoneModal";
import { portfolio } from "@/config/portfolio";
import { ACHIEVEMENTS, unlockedIds } from "@/game/systems/achievements";
import { audio } from "@/game/systems/audio";
import { emitGameEvent, onGameEvent } from "@/game/systems/events";
import { gameRuntime, resetSharedState } from "@/game/systems/shared";
import type { ZonePayload } from "@/game/types";

/**
 * Full-screen game shell: mounts the Phaser game (client-only,
 * dynamically imported), hosts the HUD, mobile controls, zone modal
 * and achievement toasts. The ONLY channel between game and UI is
 * the typed event bus — zero DOM writes happen inside the game loop.
 */
export function GameOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [zone, setZone] = useState<ZonePayload | null>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [touch, setTouch] = useState(false);
  const [achOpen, setAchOpen] = useState(false);
  const [achCount, setAchCount] = useState(0);
  const [presence, setPresence] = useState(1);

  // Device capability — controls which input UI we show.
  // Coarse pointer (phones/tablets), ANY coarse pointer, or a multi-touch
  // digitizer → show the joystick. Some in-app browsers (webviews) manage
  // to misreport ALL of those, so as a bulletproof fallback we also flip
  // touch UI on the first REAL touch seen anywhere on the page — a touch
  // is proof no media query can argue with. This listener lives for the
  // whole page session, so it catches the first tap on the landing page
  // ("ENTER THE GAME") even before the overlay opens.
  useEffect(() => {
    const looksTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(any-pointer: coarse)").matches ||
      navigator.maxTouchPoints > 1;
    if (looksTouch) {
      setTouch(true);
      return;
    }
    const onTouchStart = () => {
      setTouch(true);
      detach();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") onTouchStart();
    };
    const detach = () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("pointerdown", onPointerDown);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return detach;
  }, []);

  useEffect(() => {
    if (!open) return;
    setPresence(1);
    let destroyed = false;
    const cleanups: Array<() => void> = [];

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    resetSharedState();
    audio.init();
    setMuted(audio.isMuted);
    setAchCount(unlockedIds().size);

    // Let the pixel font settle so canvas text renders crisp on first draw
    Promise.race([
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(async () => {
      if (destroyed || !containerRef.current) return;
      const { createGame } = await import("@/game/main");
      if (destroyed || !containerRef.current) return;
      gameRef.current = createGame(containerRef.current);
    });

    cleanups.push(onGameEvent("pg:ready", () => setReady(true)));
    cleanups.push(onGameEvent("pg:prompt", (d) => setPrompt(d.label)));
    cleanups.push(onGameEvent("pg:zone-open", (d) => setZone(d)));
    cleanups.push(onGameEvent("pg:presence", (d) => setPresence(d.count)));
    cleanups.push(
      onGameEvent("pg:achievement", (d) => {
        setAchCount(unlockedIds().size);
        audio.achieve();
        toastAchievement(d.emoji, d.title, d.desc);
      }),
    );

    return () => {
      destroyed = true;
      cleanups.forEach((c) => c());
      gameRef.current?.destroy(true);
      gameRef.current = null;
      // THE fix: exiting the game must also stop the music — the chiptune
      // scheduler is a singleton that otherwise keeps playing forever.
      audio.destroy();
      document.body.style.overflow = prevOverflow;
      resetSharedState();
    };
  }, [open]);

  const closeZone = useCallback(() => {
    setZone(null);
    gameRuntime.modalOpen = false;
    emitGameEvent("pg:zone-close", undefined);
  }, []);

  const handleInteract = useCallback(() => {
    gameRuntime.interactQueued = true;
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(audio.toggleMute());
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1d3520]" role="dialog" aria-label="Interactive portfolio game">
      <div ref={containerRef} className="absolute inset-0" aria-hidden />

      {/* Loading veil */}
      {!ready && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-[#12160f]">
          <div className="animate-bounce font-pixel text-lg text-[#e8c170]">🎮</div>
          <div className="font-pixel text-[10px] text-[#a89a76]">BUILDING THE WORLD...</div>
        </div>
      )}

      {/* HUD — top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 sm:p-4">
        <div className="flex flex-col items-start gap-2">
          <div className="pixel-chip font-pixel text-[9px] sm:text-[10px]">
            🎮 {portfolio.name.toUpperCase()}&apos;S WORLD
          </div>
          {ready && presence > 1 && (
            <div className="pixel-chip animate-pulse font-pixel text-[8px] text-[#9fe0ff] sm:text-[9px]">
              👻 {presence - 1} GHOST{presence === 2 ? "" : "S"} HERE
            </div>
          )}
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            className="hud-btn"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setAchOpen(true)}
            aria-label="Open achievements"
            className="hud-btn flex items-center gap-1.5"
          >
            <Trophy className="h-4 w-4" />
            <span className="font-pixel text-[9px]">
              {achCount}/{ACHIEVEMENTS.length}
            </span>
          </button>
          <button onClick={onClose} aria-label="Exit game" className="hud-btn">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Interaction prompt — only visible when the nearest interactable CHANGES */}
      {ready && prompt && !zone && (
        <div className="pixel-chip absolute bottom-32 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-pixel text-[9px] sm:text-[10px]">
          {touch ? (
            <span>✨ {prompt}</span>
          ) : (
            <span>
              <span className="text-[#e8c170]">[E]</span> {prompt}
            </span>
          )}
        </div>
      )}

      {/* Minimap — top-right, under the HUD buttons */}
      {ready && !zone && !achOpen && <Minimap />}

      {/* Mobile controls */}
      {touch && ready && !zone && <Joystick />}
      {touch && ready && !zone && (
        <button
          onClick={handleInteract}
          aria-label="Interact"
          className="absolute bottom-7 right-5 z-20 flex h-20 w-20 touch-none select-none items-center justify-center rounded-full border-4 border-[#e8c170] bg-[#e8c170]/30 font-pixel text-[11px] text-[#f5d78e] shadow-[0_0_20px_rgba(232,193,112,0.4)] backdrop-blur-[2px] active:scale-95"
        >
          E
        </button>
      )}

      {/* Zone / dialogue modal */}
      {zone && <ZoneModal payload={zone} onClose={closeZone} />}

      {/* Achievements list */}
      {achOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setAchOpen(false)} aria-hidden />
          <div className="pixel-panel relative z-10 w-full max-w-md p-5">
            <div className="mb-4 flex items-center justify-between border-b-2 border-dashed border-[#6b5b33] pb-3">
              <span className="font-pixel text-[11px] text-[#e8c170]">🏆 ACHIEVEMENTS</span>
              <button onClick={() => setAchOpen(false)} aria-label="Close" className="text-[#cdb87e] hover:text-[#e8c170]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {ACHIEVEMENTS.map((a) => {
                const got = unlockedIds().has(a.id);
                return (
                  <li
                    key={a.id}
                    className={`flex items-center gap-3 border-2 p-2.5 ${
                      got ? "border-[#e8c170] bg-[#e8c170]/10" : "border-[#3d3625] bg-[#141008] opacity-60"
                    }`}
                  >
                    <span className="text-xl">{got ? a.emoji : "❔"}</span>
                    <div className="min-w-0">
                      <div className="font-pixel text-[9px] text-[#f4e8c8]">{a.title}</div>
                      <div className="truncate text-xs text-[#a89a76]">{a.desc}</div>
                    </div>
                    {got && <span className="ml-auto text-[#e8c170]">✓</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------- achievement toast ---------------------------- */

function toastAchievement(emoji: string, title: string, desc: string) {
  toast.custom(
    () => (
      <div className="pixel-panel flex items-center gap-3 p-4">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="font-pixel text-[10px] text-[#e8c170]">ACHIEVEMENT UNLOCKED</div>
          <div className="mt-1 text-sm text-[#f4e8c8]">{title}</div>
          <div className="text-xs text-[#a89a76]">{desc}</div>
        </div>
      </div>
    ),
    { duration: 4200, position: "top-center" },
  );
}
