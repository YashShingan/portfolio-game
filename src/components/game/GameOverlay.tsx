"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as Phaser from "phaser";
import { toast } from "sonner";
import {
  Download,
  ExternalLink,
  FileText,
  Gamepad2,
  Github,
  Linkedin,
  Mail,
  Printer,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
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
  const [resumeModeOpen, setResumeModeOpen] = useState(false);
  const [muted, setMuted] = useState(() => audio.isMuted);
  const [touch, setTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(any-pointer: coarse)").matches ||
      navigator.maxTouchPoints > 1
    );
  });
  const [achOpen, setAchOpen] = useState(false);
  const [achCount, setAchCount] = useState(() => unlockedIds().size);
  const [presence, setPresence] = useState(1);

  // Device capability — controls which input UI we show.
  // Fallback touch detection: catches the first REAL touch seen anywhere on the page
  // if media queries misreported coarse pointer capability.
  useEffect(() => {
    if (touch) return;
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
  }, [touch]);

  useEffect(() => {
    if (!open) return;
    let destroyed = false;
    const cleanups: Array<() => void> = [];

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    resetSharedState();
    audio.init();
    queueMicrotask(() => {
      if (!destroyed) {
        setMuted(audio.isMuted);
        setAchCount(unlockedIds().size);
      }
    });

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

  const toggleResumeMode = useCallback((active?: boolean) => {
    setResumeModeOpen((prev) => {
      const next = active !== undefined ? active : !prev;
      gameRuntime.modalOpen = next || zone !== null;
      if (next) {
        emitGameEvent("pg:zone-open", { kind: "welcome", id: "resume", title: "Resume" });
      } else if (!zone) {
        emitGameEvent("pg:zone-close", undefined);
      }
      return next;
    });
  }, [zone]);

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
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
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

        {/* Recruiter / Fast Track mode switcher */}
        {ready && (
          <div className="pointer-events-auto flex items-center border-2 border-[#a8862f] bg-[#141008] p-0.5 shadow-md">
            <button
              onClick={() => toggleResumeMode(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 font-pixel text-[8px] sm:text-[9px] transition ${
                resumeModeOpen
                  ? "bg-[#e8c170] text-[#1c160a]"
                  : "text-[#cdb87e] hover:text-[#f5d78e]"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>📄 RESUME MODE</span>
            </button>
            <button
              onClick={() => toggleResumeMode(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 font-pixel text-[8px] sm:text-[9px] transition ${
                !resumeModeOpen
                  ? "bg-[#e8c170] text-[#1c160a]"
                  : "text-[#cdb87e] hover:text-[#f5d78e]"
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              <span>🎮 GAME</span>
            </button>
          </div>
        )}

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
      {ready && prompt && !zone && !resumeModeOpen && (
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
      {ready && !zone && !achOpen && !resumeModeOpen && <Minimap />}

      {/* Mobile controls */}
      {touch && ready && !zone && !resumeModeOpen && <Joystick />}
      {touch && ready && !zone && !resumeModeOpen && (
        <button
          onClick={handleInteract}
          aria-label="Interact"
          className="absolute bottom-7 right-5 z-20 flex h-20 w-20 touch-none select-none items-center justify-center rounded-full border-4 border-[#e8c170] bg-[#e8c170]/30 font-pixel text-[11px] text-[#f5d78e] shadow-[0_0_20px_rgba(232,193,112,0.4)] backdrop-blur-[2px] active:scale-95"
        >
          E
        </button>
      )}

      {/* Zone / dialogue modal */}
      {zone && !resumeModeOpen && (
        <ZoneModal
          payload={zone}
          onClose={closeZone}
          onOpenResumeSheet={() => {
            closeZone();
            toggleResumeMode(true);
          }}
        />
      )}

      {/* Recruiter Fast Track Resume Sheet */}
      {resumeModeOpen && <ResumeSheet onClose={() => toggleResumeMode(false)} />}

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

/* --------------------------- recruiter resume sheet --------------------------- */

function ResumeSheet({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleDownload = () => {
    const resumeText = `================================================================
${portfolio.name.toUpperCase()} — ${portfolio.role.toUpperCase()}
Location: ${portfolio.location} | Email: ${portfolio.contact.email}
GitHub: https://github.com/YashShingan
LinkedIn: https://www.linkedin.com/in/yashshingan
Portfolio Game: https://yashshingan.github.io/portfolio-game/
================================================================

SUMMARY:
${portfolio.about.bio.join("\n\n")}

TECHNICAL EXPERTISE:
${portfolio.skills.map((s) => `• ${s.name}: ${s.skills.join(", ")}`).join("\n")}

SELECTED WORKS & PORTFOLIO:
${portfolio.projects
  .map(
    (p) => `• ${p.title} (${p.year})
  ${p.description}
  Tech Stack: ${p.tags.join(", ")}
  Links: ${p.links.map((l) => `${l.label}: ${l.url}`).join(" | ")}`,
  )
  .join("\n\n")}

CONTACT:
Email: ${portfolio.contact.email}
Discord: @${portfolio.contact.discord}
================================================================`;

    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Yash_Shingan_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Resume text downloaded!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm printable-resume-dialog"
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 no-print" onClick={onClose} aria-hidden />
      <div
        className="pixel-panel relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden border-2 border-[#e8c170] bg-[#141008] p-0 shadow-2xl printable-resume-dialog"
        role="dialog"
        aria-label="Recruiter Resume Fast Track"
      >
        {/* Top bar with quick actions */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-[#856b28] bg-[#1a140b] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-[#e8c170]">📄 RECRUITER FAST TRACK</span>
            <span className="rounded border border-[#856b28] bg-[#241c10] px-2 py-0.5 font-pixel text-[8px] text-[#cdb87e]">
              EXECUTIVE SHEET
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              aria-label="Print resume"
              className="flex items-center gap-1 border border-[#856b28] bg-[#241c10] px-2.5 py-1.5 font-pixel text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717]"
            >
              <Printer className="h-3.5 w-3.5 text-[#e8c170]" />
              <span className="hidden sm:inline">PRINT / PDF</span>
            </button>
            <button
              onClick={handleDownload}
              aria-label="Download plaintext resume"
              className="flex items-center gap-1 border border-[#856b28] bg-[#241c10] px-2.5 py-1.5 font-pixel text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717]"
            >
              <Download className="h-3.5 w-3.5 text-[#e8c170]" />
              <span className="hidden sm:inline">DOWNLOAD TXT</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close resume mode"
              className="border border-[#856b28] bg-[#241c10] p-1.5 text-[#cdb87e] transition hover:border-[#e8c170] hover:text-[#e8c170]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable sheet body */}
        <div className="space-y-6 overflow-y-auto p-4 sm:p-6 text-sm text-[#f4e8c8] printable-resume-body">
          {/* Header Bio Card */}
          <div className="border-2 border-[#4a3f24] bg-[#1b150c] p-4 sm:p-5 printable-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="font-pixel text-base sm:text-lg text-[#f5d78e]">{portfolio.name}</h1>
                <p className="mt-1 font-pixel text-[10px] text-[#e8c170]">
                  {portfolio.role} · {portfolio.location}
                </p>
                <p className="mt-1 text-xs italic text-[#cdb87e]">{portfolio.tagline}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href={`mailto:${portfolio.contact.email}`}
                  className="flex items-center gap-1.5 border border-[#856b28] bg-[#141008] px-2.5 py-1 text-[#f4e8c8] hover:border-[#e8c170]"
                >
                  <Mail className="h-3 w-3 text-[#e8c170]" /> {portfolio.contact.email}
                </a>
                <a
                  href="https://github.com/YashShingan"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 border border-[#856b28] bg-[#141008] px-2.5 py-1 text-[#f4e8c8] hover:border-[#e8c170]"
                >
                  <Github className="h-3 w-3 text-[#e8c170]" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 border border-[#856b28] bg-[#141008] px-2.5 py-1 text-[#f4e8c8] hover:border-[#e8c170]"
                >
                  <Linkedin className="h-3 w-3 text-[#e8c170]" /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="mb-2 font-pixel text-[10px] text-[#e8c170] flex items-center gap-2">
              <span>✦</span> SUMMARY & PHILOSOPHY
            </h2>
            <div className="space-y-2 border-l-2 border-[#856b28] pl-3 text-xs leading-relaxed text-[#f4e8c8]/90">
              {portfolio.about.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Technical Skills Breakdown */}
          <div>
            <h2 className="mb-2.5 font-pixel text-[10px] text-[#e8c170] flex items-center gap-2">
              <span>✦</span> TECHNICAL COMPETENCIES
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {portfolio.skills.map((grp) => (
                <div key={grp.id} className="border border-[#4a3f24] bg-[#19140c] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{grp.emoji}</span>
                    <span className="font-pixel text-[9px] text-[#f5d78e]">{grp.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {grp.skills.map((sk) => (
                      <span
                        key={sk}
                        className="border border-[#594b29] bg-[#120e07] px-1.5 py-0.5 text-[10px] text-[#cdb87e]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div>
            <h2 className="mb-2.5 font-pixel text-[10px] text-[#e8c170] flex items-center gap-2">
              <span>✦</span> FEATURED PROJECTS
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {portfolio.projects.map((proj) => (
                <div key={proj.id} className="flex flex-col border border-[#4a3f24] bg-[#19140c] p-3.5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{proj.emoji}</span>
                      <div>
                        <h3 className="font-pixel text-[10px] text-[#f5d78e]">{proj.title}</h3>
                        <span className="font-pixel text-[8px] text-[#8a7c58]">{proj.year}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-[#dcd4c0] flex-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {proj.tags.map((t) => (
                      <span key={t} className="border border-[#3d341c] bg-[#100c06] px-1.5 py-0.5 text-[9px] text-[#a89a76]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 border-t border-[#3d321d] pt-2">
                    {proj.links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-pixel text-[8px] text-[#e8c170] hover:text-[#fde68a]"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                        <span>{l.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Back to Game */}
          <div className="no-print border-t-2 border-dashed border-[#856b28] pt-4 text-center">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] px-5 py-2.5 font-pixel text-[10px] text-[#221d14] transition hover:bg-[#f5d78e] active:translate-y-[2px] active:border-b-0"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>RETURN TO EXPLORING THE WORLD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
