import * as react from 'react';

/**
 * Virtual joystick for touch devices. Writes a normalized vector into
 * `sharedInput`, which the Phaser WorldScene reads every frame. All
 * pointer capture is local — no state churn in React at 60fps.
 */
declare function Joystick(): react.JSX.Element;

/**
 * Mutable state shared between the React shell and the Phaser game.
 * Both run in the same client bundle, so a plain module singleton is
 * the cheapest, most reliable bridge. The virtual joystick writes
 * move vectors here; the WorldScene reads them each frame.
 *
 * Deliberately NOT reactive — React uses its own state for UI, and the
 * game polls this at 60fps.
 */
declare const sharedInput: {
    /** -1..1 normalized joystick vector */
    x: number;
    y: number;
};
declare const gameRuntime: {
    /** True while a modal/dialog is open — freezes player input */
    modalOpen: boolean;
    /** Set by the mobile action button / E key, consumed by WorldScene */
    interactQueued: boolean;
};
declare function resetSharedState(): void;
/**
 * next/font renames font families to hashed names, so canvas text must
 * read the actual family from the --font-pixel CSS variable rather
 * than hardcoding "Press Start 2P".
 */
declare function pixelFont(): string;

interface SharedInput {
    x: number;
    y: number;
}
interface GameRuntime {
    modalOpen: boolean;
    interactQueued: boolean;
}
interface JoystickProps {
    className?: string;
}

export { Joystick, Joystick as default, gameRuntime, pixelFont, resetSharedState, sharedInput };
export type { GameRuntime, JoystickProps, SharedInput };
