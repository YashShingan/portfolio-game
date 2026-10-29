"use client";

import { useEffect, useRef } from "react";
import { onGameEvent } from "@/game/systems/events";
import {
  PATHS,
  PLAZA,
  POINTS,
  PROJECT_BOARDS,
  SKILL_PATCHES,
  WORLD,
} from "@/game/data/world";

/**
 * Pixel minimap — the whole 3000×3000 world on a 150×150 canvas.
 * Roads and POIs are static; the player dot and cyan ghost dots update
 * from the throttled pg:tick event (~4 Hz). Zero canvas -> React state,
 * the whole thing redraws imperatively in one pass.
 */

const SIZE = 150;
const K = SIZE / WORLD.width; // world → minimap px

function drawStatic(ctx: CanvasRenderingContext2D): void {
  // Deep-woods background
  ctx.fillStyle = "#0d1a0e";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Roads
  ctx.fillStyle = "#6b5537";
  for (const p of PATHS) {
    ctx.fillRect(p.x * K, p.y * K, Math.max(1, p.w * K), Math.max(1, p.h * K));
  }

  // Plaza — flagstone square
  ctx.fillStyle = "#7d786e";
  ctx.fillRect(
    (PLAZA.cx - PLAZA.half) * K,
    (PLAZA.cy - PLAZA.half) * K,
    PLAZA.half * 2 * K,
    PLAZA.half * 2 * K,
  );

  const dot = (x: number, y: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x * K, y * K, r, 0, Math.PI * 2);
    ctx.fill();
  };

  // POIs
  dot(POINTS.fountain.x, POINTS.fountain.y, 3, "#e8c170"); // fountain = gold hub
  for (const b of PROJECT_BOARDS) dot(b.x, b.y, 1.8, "#7fb0ff");
  for (const s of SKILL_PATCHES) dot(s.x, s.y, 1.8, "#8fce6b");
  dot(POINTS.mailbox.x, POINTS.mailbox.y, 2, "#ff8a5c");
  dot(POINTS.chest.x, POINTS.chest.y, 1.8, "#b28dff");
  dot(POINTS.npcOldOcto.x, POINTS.npcOldOcto.y, 1.5, "#c9c9d9");
  dot(POINTS.npcPixel.x, POINTS.npcPixel.y, 1.5, "#d98f8f");
}

export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    drawStatic(ctx);

    let frame: number | null = null;
    const off = onGameEvent("pg:tick", (d) => {
      // Coalesce to one draw per animation frame if ticks stack up
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        drawStatic(ctx);

        // Ghost dots (cyan)
        ctx.fillStyle = "#9fe0ff";
        for (const g of d.ghosts) {
          ctx.beginPath();
          ctx.arc(g.x * K, g.y * K, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Player — white dot with pulse ring
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

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      aria-label="World minimap"
      className="pointer-events-none absolute right-3 top-16 z-10 w-[96px] border-2 border-[#e8c170]/50 bg-[#0d1a0e] shadow-[0_0_12px_rgba(0,0,0,0.5)] sm:w-[150px]"
    />
  );
}
