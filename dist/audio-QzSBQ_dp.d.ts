/**
 * Procedural chiptune engine — BGM and SFX are synthesized with WebAudio,
 * so there are zero audio files to download (v1 shipped none at all).
 *
 * Cozy pentatonic adventure loop: square lead + triangle bass + soft hats,
 * gently low-passed, scheduled with a lookahead timer.
 */
declare class ChiptuneEngine {
    private ctx;
    private master;
    private musicBus;
    private sfxBus;
    private timer;
    private nextStepTime;
    private step;
    private muted;
    private started;
    constructor();
    /** Must be called from a user gesture (browser autoplay policy). */
    init(): void;
    private startBgm;
    private schedule;
    private scheduleStep;
    private tone;
    private hat;
    private blip;
    open(): void;
    close(): void;
    achieve(): void;
    konami(): void;
    secret(): void;
    /** Soft airy two-note chime — another visitor just faded in. */
    ghost(): void;
    /** Dual frequency sine ping with bright metallic chime decay — fountain coin toss. */
    coin(): void;
    get isMuted(): boolean;
    toggleMute(): boolean;
    /** Dev/test introspection: what state is the engine in right now? */
    get debugState(): {
        ctx: string;
        scheduler: boolean;
    };
    /**
     * Full shutdown — called when the player EXITS the game. Fades the
     * master bus out over ~250ms instead of a jarring hard cut, then
     * closes the AudioContext. The singleton is reset so a later re-entry
     * (audio.init) builds a fresh context from scratch.
     */
    destroy(): void;
}
/** Client-side singleton (imported by both the game and React shell). */
declare const audio: ChiptuneEngine;
declare global {
    var __pgAudio: (() => {
        ctx: string;
        scheduler: boolean;
    }) | undefined;
}

export { ChiptuneEngine as C, audio as a };
