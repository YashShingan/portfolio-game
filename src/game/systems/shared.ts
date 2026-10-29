/**
 * Mutable state shared between the React shell and the Phaser game.
 * Both run in the same client bundle, so a plain module singleton is
 * the cheapest, most reliable bridge. The virtual joystick writes
 * move vectors here; the WorldScene reads them each frame.
 *
 * Deliberately NOT reactive — React uses its own state for UI, and the
 * game polls this at 60fps.
 */

export const sharedInput = {
  /** -1..1 normalized joystick vector */
  x: 0,
  y: 0,
};

export const gameRuntime = {
  /** True while a modal/dialog is open — freezes player input */
  modalOpen: false,
  /** Set by the mobile action button / E key, consumed by WorldScene */
  interactQueued: false,
};

export function resetSharedState(): void {
  sharedInput.x = 0;
  sharedInput.y = 0;
  gameRuntime.modalOpen = false;
  gameRuntime.interactQueued = false;
}

let cachedPixelFont = "";

/**
 * next/font renames font families to hashed names, so canvas text must
 * read the actual family from the --font-pixel CSS variable rather
 * than hardcoding "Press Start 2P".
 */
export function pixelFont(): string {
  if (cachedPixelFont) return cachedPixelFont;
  if (typeof window === "undefined") return "monospace";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-pixel");
  cachedPixelFont = v ? v.trim() : '"Press Start 2P", monospace';
  return cachedPixelFont;
}
