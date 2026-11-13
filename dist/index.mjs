import { Joystick } from './chunk-6WA2X3R4.mjs';
export { Joystick } from './chunk-6WA2X3R4.mjs';
import { ZoneModal } from './chunk-FRUPUOKV.mjs';
export { ArcadeMiniGame } from './chunk-PKPKEXDZ.mjs';
import './chunk-WBQAMGXK.mjs';
import { WORLD, PATHS, PLAZA, COURIER_PLAZA, POINTS, PROJECT_BOARDS, SKILL_PATCHES } from './chunk-DC3WCUZY.mjs';
export { createGame } from './chunk-DC3WCUZY.mjs';
import { resetSharedState, gameRuntime } from './chunk-YDGJWAXN.mjs';
export { gameRuntime, pixelFont, resetSharedState, sharedInput } from './chunk-YDGJWAXN.mjs';
import { getLocalTimeMode, unlockedIds, onGameEvent, emitGameEvent, portfolio, ACHIEVEMENTS } from './chunk-GCRFGHX2.mjs';
export { portfolio } from './chunk-GCRFGHX2.mjs';
import { audio } from './chunk-ISDBGZ27.mjs';
export { ChiptuneEngine, audio } from './chunk-ISDBGZ27.mjs';
import './chunk-STROURK6.mjs';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { FileText, Gamepad2, Sun, Sunset, Moon, VolumeX, Volume2, Trophy, X, Printer, Download, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import { jsxs, jsx } from 'react/jsx-runtime';

var SIZE = 150;
var K = SIZE / WORLD.width;
function drawStatic(ctx) {
  ctx.fillStyle = "#0d1a0e";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#6b5537";
  for (const p of PATHS) {
    ctx.fillRect(p.x * K, p.y * K, Math.max(1, p.w * K), Math.max(1, p.h * K));
  }
  ctx.fillStyle = "#7d786e";
  ctx.fillRect(
    (PLAZA.cx - PLAZA.half) * K,
    (PLAZA.cy - PLAZA.half) * K,
    PLAZA.half * 2 * K,
    PLAZA.half * 2 * K
  );
  ctx.fillRect(
    (COURIER_PLAZA.cx - COURIER_PLAZA.w / 2) * K,
    (COURIER_PLAZA.cy - COURIER_PLAZA.h / 2) * K,
    COURIER_PLAZA.w * K,
    COURIER_PLAZA.h * K
  );
  const dot = (x, y, r, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * K, y * K, r, 0, Math.PI * 2);
    ctx.fill();
  };
  dot(POINTS.fountain.x, POINTS.fountain.y, 3, "#e8c170");
  for (const b of PROJECT_BOARDS) dot(b.x, b.y, 1.8, "#7fb0ff");
  for (const s of SKILL_PATCHES) dot(s.x, s.y, 1.8, "#8fce6b");
  dot(POINTS.mailbox.x, POINTS.mailbox.y, 2, "#ff8a5c");
  dot(POINTS.chest.x, POINTS.chest.y, 1.8, "#b28dff");
  dot(POINTS.npcOldOcto.x, POINTS.npcOldOcto.y, 1.5, "#c9c9d9");
  dot(POINTS.npcPixel.x, POINTS.npcPixel.y, 1.5, "#d98f8f");
}
function Minimap() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    drawStatic(ctx);
    let frame = null;
    const off = onGameEvent("pg:tick", (d) => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        drawStatic(ctx);
        ctx.fillStyle = "#9fe0ff";
        for (const g of d.ghosts) {
          ctx.beginPath();
          ctx.arc(g.x * K, g.y * K, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        const px = d.x * K;
        const py = d.y * K;
        const pulse = 3.2 + Math.sin(performance.now() / 240) * 1.1;
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, pulse + 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    return () => {
      off();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref: canvasRef,
      width: SIZE,
      height: SIZE,
      "aria-label": "World minimap",
      className: "pointer-events-none absolute right-3 top-16 z-10 w-[96px] border-2 border-[#e8c170]/50 bg-[#0d1a0e] shadow-[0_0_12px_rgba(0,0,0,0.5)] sm:w-[150px]"
    }
  );
}
function GameOverlay({ open, onClose }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const [prompt, setPrompt] = useState(null);
  const [zone, setZone] = useState(null);
  const [ready, setReady] = useState(false);
  const [resumeModeOpen, setResumeModeOpen] = useState(false);
  const [muted, setMuted] = useState(() => audio.isMuted);
  const [timeMode, setTimeMode] = useState(() => getLocalTimeMode());
  const timeModeRef = useRef(timeMode);
  useEffect(() => {
    timeModeRef.current = timeMode;
  }, [timeMode]);
  const [touch, setTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(any-pointer: coarse)").matches || navigator.maxTouchPoints > 1;
  });
  const [achOpen, setAchOpen] = useState(false);
  const [achCount, setAchCount] = useState(() => unlockedIds().size);
  const [presence, setPresence] = useState(1);
  useEffect(() => {
    if (touch) return;
    const onTouchStart = () => {
      setTouch(true);
      detach();
    };
    const onPointerDown = (e) => {
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
    const cleanups = [];
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
    Promise.race([
      typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500))
    ]).then(async () => {
      if (destroyed || !containerRef.current) return;
      const { createGame: createGame2 } = await import('./main-LYCYM5XB.mjs');
      if (destroyed || !containerRef.current) return;
      gameRef.current = createGame2(containerRef.current);
    });
    cleanups.push(
      onGameEvent("pg:ready", () => {
        setReady(true);
        emitGameEvent("pg:time-mode", { mode: timeModeRef.current, instant: true });
      })
    );
    cleanups.push(onGameEvent("pg:prompt", (d) => setPrompt(d.label)));
    cleanups.push(onGameEvent("pg:zone-open", (d) => setZone(d)));
    cleanups.push(onGameEvent("pg:presence", (d) => setPresence(d.count)));
    cleanups.push(
      onGameEvent("pg:achievement", (d) => {
        setAchCount(unlockedIds().size);
        audio.achieve();
        toastAchievement(d.emoji, d.title, d.desc);
      })
    );
    return () => {
      var _a;
      destroyed = true;
      cleanups.forEach((c) => c());
      (_a = gameRef.current) == null ? void 0 : _a.destroy(true);
      gameRef.current = null;
      audio.destroy();
      document.body.style.overflow = prevOverflow;
      resetSharedState();
    };
  }, [open]);
  const closeZone = useCallback(() => {
    setZone(null);
    gameRuntime.modalOpen = false;
    emitGameEvent("pg:zone-close", void 0);
  }, []);
  const handleInteract = useCallback(() => {
    gameRuntime.interactQueued = true;
  }, []);
  const toggleResumeMode = useCallback((active) => {
    setResumeModeOpen((prev) => {
      const next = active !== void 0 ? active : !prev;
      gameRuntime.modalOpen = next || zone !== null;
      if (next) {
        emitGameEvent("pg:zone-open", { kind: "welcome", id: "resume", title: "Resume" });
      } else if (!zone) {
        emitGameEvent("pg:zone-close", void 0);
      }
      return next;
    });
  }, [zone]);
  const toggleMute = useCallback(() => {
    setMuted(audio.toggleMute());
  }, []);
  const cycleTimeMode = useCallback(() => {
    setTimeMode((prev) => {
      const next = prev === "day" ? "sunset" : prev === "sunset" ? "night" : "day";
      emitGameEvent("pg:time-mode", { mode: next, instant: false });
      return next;
    });
  }, []);
  if (!open) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 bg-[#1d3520]", role: "dialog", "aria-label": "Interactive portfolio game", children: [
    /* @__PURE__ */ jsx("div", { ref: containerRef, className: "absolute inset-0", "aria-hidden": true }),
    !ready && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-[#12160f]", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-bounce font-pixel text-lg text-[#e8c170]", children: "\u{1F3AE}" }),
      /* @__PURE__ */ jsx("div", { className: "font-pixel text-[10px] text-[#a89a76]", children: "BUILDING THE WORLD..." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "pixel-chip font-pixel text-[9px] sm:text-[10px]", children: [
          "\u{1F3AE} ",
          portfolio.name.toUpperCase(),
          "'S WORLD"
        ] }),
        ready && presence > 1 && /* @__PURE__ */ jsxs("div", { className: "pixel-chip animate-pulse font-pixel text-[8px] text-[#9fe0ff] sm:text-[9px]", children: [
          "\u{1F47B} ",
          presence - 1,
          " GHOST",
          presence === 2 ? "" : "S",
          " HERE"
        ] })
      ] }),
      ready && /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto flex items-center border-2 border-[#a8862f] bg-[#141008] p-0.5 shadow-md", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggleResumeMode(true),
            className: `flex items-center gap-1.5 px-2.5 py-1 font-pixel text-[8px] sm:text-[9px] transition ${resumeModeOpen ? "bg-[#e8c170] text-[#1c160a]" : "text-[#cdb87e] hover:text-[#f5d78e]"}`,
            children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "\u{1F4C4} RESUME MODE" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggleResumeMode(false),
            className: `flex items-center gap-1.5 px-2.5 py-1 font-pixel text-[8px] sm:text-[9px] transition ${!resumeModeOpen ? "bg-[#e8c170] text-[#1c160a]" : "text-[#cdb87e] hover:text-[#f5d78e]"}`,
            children: [
              /* @__PURE__ */ jsx(Gamepad2, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "\u{1F3AE} GAME" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pointer-events-auto flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: cycleTimeMode,
            "aria-label": `Current time of day: ${timeMode}. Click to switch.`,
            title: `Lighting: ${timeMode.toUpperCase()} (Click to toggle)`,
            className: "hud-btn flex items-center gap-1.5",
            children: [
              timeMode === "day" && /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4 text-[#f5c96b]" }),
              timeMode === "sunset" && /* @__PURE__ */ jsx(Sunset, { className: "h-4 w-4 text-[#f97316]" }),
              timeMode === "night" && /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4 text-[#93c5fd]" }),
              /* @__PURE__ */ jsx("span", { className: "hidden font-pixel text-[8px] uppercase sm:inline", children: timeMode })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: toggleMute,
            "aria-label": muted ? "Unmute sound" : "Mute sound",
            className: "hud-btn",
            children: muted ? /* @__PURE__ */ jsx(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Volume2, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setAchOpen(true),
            "aria-label": "Open achievements",
            className: "hud-btn flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxs("span", { className: "font-pixel text-[9px]", children: [
                achCount,
                "/",
                ACHIEVEMENTS.length
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx("button", { onClick: onClose, "aria-label": "Exit game", className: "hud-btn", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
      ] })
    ] }),
    ready && prompt && !zone && !resumeModeOpen && /* @__PURE__ */ jsx("div", { className: "pixel-chip absolute bottom-32 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap font-pixel text-[9px] sm:text-[10px]", children: touch ? /* @__PURE__ */ jsxs("span", { children: [
      "\u2728 ",
      prompt
    ] }) : /* @__PURE__ */ jsxs("span", { children: [
      /* @__PURE__ */ jsx("span", { className: "text-[#e8c170]", children: "[E]" }),
      " ",
      prompt
    ] }) }),
    ready && !zone && !achOpen && !resumeModeOpen && /* @__PURE__ */ jsx(Minimap, {}),
    touch && ready && !zone && !resumeModeOpen && /* @__PURE__ */ jsx(Joystick, {}),
    touch && ready && !zone && !resumeModeOpen && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleInteract,
        "aria-label": "Interact",
        className: "absolute bottom-7 right-5 z-20 flex h-20 w-20 touch-none select-none items-center justify-center rounded-full border-4 border-[#e8c170] bg-[#e8c170]/30 font-pixel text-[11px] text-[#f5d78e] shadow-[0_0_20px_rgba(232,193,112,0.4)] backdrop-blur-[2px] active:scale-95",
        children: "E"
      }
    ),
    zone && !resumeModeOpen && /* @__PURE__ */ jsx(
      ZoneModal,
      {
        payload: zone,
        onClose: closeZone,
        onOpenResumeSheet: () => {
          closeZone();
          toggleResumeMode(true);
        }
      }
    ),
    resumeModeOpen && /* @__PURE__ */ jsx(ResumeSheet, { onClose: () => toggleResumeMode(false) }),
    achOpen && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-30 flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/60", onClick: () => setAchOpen(false), "aria-hidden": true }),
      /* @__PURE__ */ jsxs("div", { className: "pixel-panel relative z-10 w-full max-w-md p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between border-b-2 border-dashed border-[#6b5b33] pb-3", children: [
          /* @__PURE__ */ jsx("span", { className: "font-pixel text-[11px] text-[#e8c170]", children: "\u{1F3C6} ACHIEVEMENTS" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setAchOpen(false), "aria-label": "Close", className: "text-[#cdb87e] hover:text-[#e8c170]", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "max-h-96 space-y-2 overflow-y-auto pr-1", children: ACHIEVEMENTS.map((a) => {
          const got = unlockedIds().has(a.id);
          return /* @__PURE__ */ jsxs(
            "li",
            {
              className: `flex items-center gap-3 border-2 p-2.5 ${got ? "border-[#e8c170] bg-[#e8c170]/10" : "border-[#3d3625] bg-[#141008] opacity-60"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-xl", children: got ? a.emoji : "\u2754" }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-pixel text-[9px] text-[#f4e8c8]", children: a.title }),
                  /* @__PURE__ */ jsx("div", { className: "truncate text-xs text-[#a89a76]", children: a.desc })
                ] }),
                got && /* @__PURE__ */ jsx("span", { className: "ml-auto text-[#e8c170]", children: "\u2713" })
              ]
            },
            a.id
          );
        }) })
      ] })
    ] })
  ] });
}
function toastAchievement(emoji, title, desc) {
  toast.custom(
    () => /* @__PURE__ */ jsxs("div", { className: "pixel-panel flex items-center gap-3 p-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-2xl", children: emoji }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-pixel text-[10px] text-[#e8c170]", children: "ACHIEVEMENT UNLOCKED" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-[#f4e8c8]", children: title }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-[#a89a76]", children: desc })
      ] })
    ] }),
    { duration: 4200, position: "top-center" }
  );
}
function ResumeSheet({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const handleDownload = () => {
    const resumeText = `================================================================
${portfolio.name.toUpperCase()} \u2014 ${portfolio.role.toUpperCase()}
Location: ${portfolio.location} | Email: ${portfolio.contact.email}
GitHub: https://github.com/YashShingan
LinkedIn: https://www.linkedin.com/in/yashshingan
Portfolio Game: https://yashshingan.github.io/portfolio-game/
================================================================

SUMMARY:
${portfolio.about.bio.join("\n\n")}

TECHNICAL EXPERTISE:
${portfolio.skills.map((s) => `\u2022 ${s.name}: ${s.skills.join(", ")}`).join("\n")}

SELECTED WORKS & PORTFOLIO:
${portfolio.projects.map(
      (p) => `\u2022 ${p.title} (${p.year})
  ${p.description}
  Tech Stack: ${p.tags.join(", ")}
  Links: ${p.links.map((l) => `${l.label}: ${l.url}`).join(" | ")}`
    ).join("\n\n")}

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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm printable-resume-dialog",
      onKeyDown: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 no-print", onClick: onClose, "aria-hidden": true }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "pixel-panel relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden border-2 border-[#e8c170] bg-[#141008] p-0 shadow-2xl printable-resume-dialog",
            role: "dialog",
            "aria-label": "Recruiter Resume Fast Track",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "no-print flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-[#856b28] bg-[#1a140b] px-4 py-3 sm:px-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-pixel text-xs text-[#e8c170]", children: "\u{1F4C4} RECRUITER FAST TRACK" }),
                  /* @__PURE__ */ jsx("span", { className: "rounded border border-[#856b28] bg-[#241c10] px-2 py-0.5 font-pixel text-[8px] text-[#cdb87e]", children: "EXECUTIVE SHEET" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handlePrint,
                      "aria-label": "Print resume",
                      className: "flex items-center gap-1 border border-[#856b28] bg-[#241c10] px-2.5 py-1.5 font-pixel text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717]",
                      children: [
                        /* @__PURE__ */ jsx(Printer, { className: "h-3.5 w-3.5 text-[#e8c170]" }),
                        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "PRINT / PDF" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleDownload,
                      "aria-label": "Download plaintext resume",
                      className: "flex items-center gap-1 border border-[#856b28] bg-[#241c10] px-2.5 py-1.5 font-pixel text-[9px] text-[#f5d78e] transition hover:border-[#e8c170] hover:bg-[#332717]",
                      children: [
                        /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5 text-[#e8c170]" }),
                        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "DOWNLOAD TXT" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: onClose,
                      "aria-label": "Close resume mode",
                      className: "border border-[#856b28] bg-[#241c10] p-1.5 text-[#cdb87e] transition hover:border-[#e8c170] hover:text-[#e8c170]",
                      children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-6 overflow-y-auto p-4 sm:p-6 text-sm text-[#f4e8c8] printable-resume-body", children: [
                /* @__PURE__ */ jsx("div", { className: "border-2 border-[#4a3f24] bg-[#1b150c] p-4 sm:p-5 printable-card", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h1", { className: "font-pixel text-base sm:text-lg text-[#f5d78e]", children: portfolio.name }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 font-pixel text-[10px] text-[#e8c170]", children: [
                      portfolio.role,
                      " \xB7 ",
                      portfolio.location
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs italic text-[#cdb87e]", children: portfolio.tagline })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [
                    /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: `mailto:${portfolio.contact.email}`,
                        className: "flex items-center gap-1.5 border border-[#856b28] bg-[#141008] px-2.5 py-1 text-[#f4e8c8] hover:border-[#e8c170]",
                        children: [
                          /* @__PURE__ */ jsx(Mail, { className: "h-3 w-3 text-[#e8c170]" }),
                          " ",
                          portfolio.contact.email
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: "https://github.com/YashShingan",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "flex items-center gap-1.5 border border-[#856b28] bg-[#141008] px-2.5 py-1 text-[#f4e8c8] hover:border-[#e8c170]",
                        children: [
                          /* @__PURE__ */ jsx(Github, { className: "h-3 w-3 text-[#e8c170]" }),
                          " GitHub"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: "https://www.linkedin.com/",
                        target: "_blank",
                        rel: "noreferrer",
                        className: "flex items-center gap-1.5 border border-[#856b28] bg-[#141008] px-2.5 py-1 text-[#f4e8c8] hover:border-[#e8c170]",
                        children: [
                          /* @__PURE__ */ jsx(Linkedin, { className: "h-3 w-3 text-[#e8c170]" }),
                          " LinkedIn"
                        ]
                      }
                    )
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h2", { className: "mb-2 font-pixel text-[10px] text-[#e8c170] flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { children: "\u2726" }),
                    " SUMMARY & PHILOSOPHY"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-2 border-l-2 border-[#856b28] pl-3 text-xs leading-relaxed text-[#f4e8c8]/90", children: portfolio.about.bio.map((p, i) => /* @__PURE__ */ jsx("p", { children: p }, i)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h2", { className: "mb-2.5 font-pixel text-[10px] text-[#e8c170] flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { children: "\u2726" }),
                    " TECHNICAL COMPETENCIES"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: portfolio.skills.map((grp) => /* @__PURE__ */ jsxs("div", { className: "border border-[#4a3f24] bg-[#19140c] p-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-base", children: grp.emoji }),
                      /* @__PURE__ */ jsx("span", { className: "font-pixel text-[9px] text-[#f5d78e]", children: grp.name })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: grp.skills.map((sk) => /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "border border-[#594b29] bg-[#120e07] px-1.5 py-0.5 text-[10px] text-[#cdb87e]",
                        children: sk
                      },
                      sk
                    )) })
                  ] }, grp.id)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h2", { className: "mb-2.5 font-pixel text-[10px] text-[#e8c170] flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { children: "\u2726" }),
                    " FEATURED PROJECTS"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: portfolio.projects.map((proj) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col border border-[#4a3f24] bg-[#19140c] p-3.5", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-2 mb-1.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-lg", children: proj.emoji }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("h3", { className: "font-pixel text-[10px] text-[#f5d78e]", children: proj.title }),
                        /* @__PURE__ */ jsx("span", { className: "font-pixel text-[8px] text-[#8a7c58]", children: proj.year })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsx("p", { className: "mb-3 text-xs leading-relaxed text-[#dcd4c0] flex-1", children: proj.description }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: proj.tags.map((t) => /* @__PURE__ */ jsx("span", { className: "border border-[#3d341c] bg-[#100c06] px-1.5 py-0.5 text-[9px] text-[#a89a76]", children: t }, t)) }),
                    /* @__PURE__ */ jsx("div", { className: "mt-auto flex flex-wrap gap-2 border-t border-[#3d321d] pt-2", children: proj.links.map((l) => /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: l.url,
                        target: "_blank",
                        rel: "noreferrer",
                        className: "inline-flex items-center gap-1 font-pixel text-[8px] text-[#e8c170] hover:text-[#fde68a]",
                        children: [
                          /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" }),
                          /* @__PURE__ */ jsx("span", { children: l.label })
                        ]
                      },
                      l.url
                    )) })
                  ] }, proj.id)) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "no-print border-t-2 border-dashed border-[#856b28] pt-4 text-center", children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: onClose,
                    className: "inline-flex items-center gap-2 border-b-4 border-[#a8862f] bg-[#e8c170] px-5 py-2.5 font-pixel text-[10px] text-[#221d14] transition hover:bg-[#f5d78e] active:translate-y-[2px] active:border-b-0",
                    children: [
                      /* @__PURE__ */ jsx(Gamepad2, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsx("span", { children: "RETURN TO EXPLORING THE WORLD" })
                    ]
                  }
                ) })
              ] })
            ]
          }
        )
      ]
    }
  );
}

// src/index.ts
function PortfolioGame({
  open = true,
  onClose,
  className
}) {
  const [isOpen, setIsOpen] = useState(open);
  const handleClose = () => {
    setIsOpen(false);
    onClose == null ? void 0 : onClose();
  };
  if (!isOpen) return null;
  return React.createElement(
    "div",
    { className },
    React.createElement(GameOverlay, { open: isOpen, onClose: handleClose })
  );
}
var src_default = PortfolioGame;

export { GameOverlay, PortfolioGame, src_default as default };
