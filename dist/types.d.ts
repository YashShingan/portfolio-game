import { p as portfolio } from './world-CRY4NAa7.js';
export { A as AchievementDef, f as GameEventMap, a as GhostPos, b as GhostSpawn, N as NpcDialogue, P as PathRect, h as Project, S as SkillGroup, T as TimeMode, Z as ZoneKind, i as ZonePayload, j as emitGameEvent, k as getLocalTimeMode, o as onGameEvent } from './world-CRY4NAa7.js';
export { GameRuntime, JoystickProps, SharedInput } from './controls.js';
export { DialogueProps, TypewriterResult } from './dialogue.js';
export { GameState as ArcadeGameState, ArcadeMiniGameProps, Bubble, Particle, Pipe } from './arcade.js';
import * as react from 'react';
import react__default from 'react';
import './audio-QzSBQ_dp.js';
import 'phaser';

/**
 * Full-screen game shell: mounts the Phaser game (client-only,
 * dynamically imported), hosts the HUD, mobile controls, zone modal
 * and achievement toasts. The ONLY channel between game and UI is
 * the typed event bus — zero DOM writes happen inside the game loop.
 */
declare function GameOverlay({ open, onClose }: {
    open: boolean;
    onClose: () => void;
}): react.JSX.Element | null;

interface PortfolioGameProps {
    /** Initial visibility state of the game. Defaults to true. */
    open?: boolean;
    /** Callback triggered when the player exits the game overlay */
    onClose?: () => void;
    /** Optional class name for the wrapper */
    className?: string;
    /** Optional portfolio configuration override */
    config?: typeof portfolio;
}
declare function PortfolioGame({ open, onClose, className, }: PortfolioGameProps): react__default.JSX.Element | null;

export { GameOverlay as G, PortfolioGame as P, portfolio };
export type { PortfolioGameProps };
