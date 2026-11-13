'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

// src/game/systems/shared.ts
var sharedInput = {
  /** -1..1 normalized joystick vector */
  x: 0,
  y: 0
};
var gameRuntime = {
  /** True while a modal/dialog is open — freezes player input */
  modalOpen: false,
  /** Set by the mobile action button / E key, consumed by WorldScene */
  interactQueued: false
};
function resetSharedState() {
  sharedInput.x = 0;
  sharedInput.y = 0;
  gameRuntime.modalOpen = false;
  gameRuntime.interactQueued = false;
}
var cachedPixelFont = "";
function pixelFont() {
  if (cachedPixelFont) return cachedPixelFont;
  if (typeof window === "undefined") return "monospace";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-pixel");
  cachedPixelFont = v ? v.trim() : '"Press Start 2P", monospace';
  return cachedPixelFont;
}
function Joystick() {
  const baseRef = react.useRef(null);
  const knobRef = react.useRef(null);
  const activeId = react.useRef(null);
  react.useEffect(() => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;
    const MAX = 42;
    const setKnob = (dx, dy) => {
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const handleDown = (e) => {
      if (activeId.current !== null) return;
      activeId.current = e.pointerId;
      base.setPointerCapture(e.pointerId);
      handleMove(e);
    };
    const handleMove = (e) => {
      if (activeId.current !== e.pointerId) return;
      const rect = base.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > MAX) {
        dx = dx / dist * MAX;
        dy = dy / dist * MAX;
      }
      setKnob(dx, dy);
      sharedInput.x = dx / MAX;
      sharedInput.y = dy / MAX;
    };
    const handleUp = (e) => {
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref: baseRef,
      className: "pointer-events-auto absolute bottom-6 left-5 z-20 flex h-32 w-32 touch-none select-none items-center justify-center rounded-full border-4 border-[#e8c170]/70 bg-black/30 backdrop-blur-[2px]",
      role: "application",
      "aria-label": "Movement joystick",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref: knobRef,
          className: "h-14 w-14 rounded-full border-4 border-[#e8c170] bg-[#e8c170]/40 shadow-[0_0_12px_rgba(232,193,112,0.5)] transition-transform duration-75",
          "aria-hidden": true
        }
      )
    }
  );
}

// src/controls.ts
var controls_default = Joystick;

exports.Joystick = Joystick;
exports.default = controls_default;
exports.gameRuntime = gameRuntime;
exports.pixelFont = pixelFont;
exports.resetSharedState = resetSharedState;
exports.sharedInput = sharedInput;
