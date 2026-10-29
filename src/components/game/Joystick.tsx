"use client";

import { useEffect, useRef } from "react";
import { sharedInput } from "@/game/systems/shared";

/**
 * Virtual joystick for touch devices. Writes a normalized vector into
 * `sharedInput`, which the Phaser WorldScene reads every frame. All
 * pointer capture is local — no state churn in React at 60fps.
 */
export function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeId = useRef<number | null>(null);

  useEffect(() => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;

    const MAX = 42;

    const setKnob = (dx: number, dy: number) => {
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const handleDown = (e: PointerEvent) => {
      if (activeId.current !== null) return;
      activeId.current = e.pointerId;
      base.setPointerCapture(e.pointerId);
      handleMove(e);
    };

    const handleMove = (e: PointerEvent) => {
      if (activeId.current !== e.pointerId) return;
      const rect = base.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > MAX) {
        dx = (dx / dist) * MAX;
        dy = (dy / dist) * MAX;
      }
      setKnob(dx, dy);
      sharedInput.x = dx / MAX;
      sharedInput.y = dy / MAX;
    };

    const handleUp = (e: PointerEvent) => {
      if (activeId.current !== e.pointerId) return;
      activeId.current = null;
      sharedInput.x = 0;
      sharedInput.y = 0;
      setKnob(0, 0);
    };

    base.addEventListener("pointerdown", handleDown);
    base.addEventListener("pointermove", handleMove);
    base.addEventListener("pointerup", handleUp);
    base.addEventListener("pointercancel", handleUp);

    return () => {
      base.removeEventListener("pointerdown", handleDown);
      base.removeEventListener("pointermove", handleMove);
      base.removeEventListener("pointerup", handleUp);
      base.removeEventListener("pointercancel", handleUp);
      sharedInput.x = 0;
      sharedInput.y = 0;
    };
  }, []);

  return (
    <div
      ref={baseRef}
      className="pointer-events-auto absolute bottom-6 left-5 z-20 flex h-32 w-32 touch-none select-none items-center justify-center rounded-full border-4 border-[#e8c170]/70 bg-black/30 backdrop-blur-[2px]"
      role="application"
      aria-label="Movement joystick"
    >
      <div
        ref={knobRef}
        className="h-14 w-14 rounded-full border-4 border-[#e8c170] bg-[#e8c170]/40 shadow-[0_0_12px_rgba(232,193,112,0.5)] transition-transform duration-75"
        aria-hidden
      />
    </div>
  );
}
