import * as Phaser from "phaser";
import { BootScene } from "@/game/scenes/BootScene";
import { WorldScene } from "@/game/scenes/WorldScene";

/**
 * Creates the Phaser game bound to a parent DOM element.
 * Only ever imported dynamically from the client — Phaser must never
 * be evaluated during SSR.
 *
 * Scale mode RESIZE + a FIXED 3000×3000 world bounds is the correct
 * pairing: the canvas stretches with the window while the world (and
 * everything built in it) stays untouched.
 */
export function createGame(parent: HTMLElement): Phaser.Game {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: "#1d3520",
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: parent.clientWidth || window.innerWidth,
      height: parent.clientHeight || window.innerHeight,
    },
    physics: {
      default: "arcade",
      arcade: { debug: false },
    },
    scene: [BootScene, WorldScene],
  });
  // Dev-only handle for browser-side debugging & automated verification
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as { __pg?: Phaser.Game }).__pg = game;
  }
  return game;
}
