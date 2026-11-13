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

export { gameRuntime, pixelFont, resetSharedState, sharedInput };
