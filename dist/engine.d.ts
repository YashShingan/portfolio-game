import { c as createGame } from './world-CRY4NAa7.js';
import { TimeMode, NpcDialogue } from './index.js';
export { G as Ghost, a as GhostPos, b as GhostSpawn, d as GhostSystem, e as events, g as ghosts, w as world } from './world-CRY4NAa7.js';
import * as Phaser from 'phaser';

/**
 * BootScene — loads the 7 real assets from the v1 repo, generates all
 * remaining textures procedurally (trees, bushes, flowers, chest, drop,
 * sparkle...), creates the walk animation, then hands over to WorldScene.
 */
declare class BootScene extends Phaser.Scene {
    constructor();
    preload(): void;
    create(): void;
    /** All extra sprites are drawn once into textures at boot — cheap at runtime. */
    private generateTextures;
    private createAnimations;
}

/**
 * WorldScene — builds the whole world ONCE in create(), then never
 * rebuilds anything. Resizing the window only adjusts camera zoom.
 * Interactions are diff-based: the event bus fires only when the
 * nearest interactable CHANGES, never per-frame.
 */
declare class WorldScene extends Phaser.Scene {
    private player;
    private statics;
    private leafEmitter?;
    private npcs;
    private interactables;
    private activeId;
    private keys;
    private interactKey;
    private moveUnlocked;
    private visitedDistricts;
    private readProjects;
    private talkedNpcs;
    private konamiIndex;
    private konamiListener;
    private offBusCleanups;
    private tickAcc;
    private lastPresence;
    private lastFacing;
    private currentTimeMode;
    private ambientOverlay;
    private ambientTween?;
    private lampHalos;
    private fountainGlow?;
    private fireflyEmitters;
    constructor();
    create(): void;
    private addTree;
    private scatterDecor;
    private buildProps;
    private buildNpcs;
    private buildInteractables;
    private buildAtmosphere;
    private buildAmbientLighting;
    private updateAmbientOverlaySize;
    getTimeMode(): TimeMode;
    private setTimeMode;
    update(_time: number, delta: number): void;
    private findNearest;
    private tryInteract;
    private trackKonami;
    private konamiReward;
    private confetti;
    private ensureCoinTexture;
    private handleFountainToss;
    private splashFountainPool;
}

/**
 * The player — GitHub's octopus, walking on tiny legs.
 * Movement reads a normalized vector from keyboard OR the virtual
 * joystick; diagonal is normalized so you don't move faster at 45°.
 */
declare class Player {
    readonly sprite: Phaser.Physics.Arcade.Sprite;
    private readonly scene;
    private readonly dustEmitter;
    private readonly speed;
    private readonly walkKey;
    private stepTimer;
    constructor(scene: Phaser.Scene, x: number, y: number);
    /**
     * @param mvx,mvy normalized -1..1 input vector
     * @returns true if the player actually moved this frame
     */
    update(mvx: number, mvy: number): boolean;
    stop(): void;
    destroy(): void;
}

/**
 * An NPC octopus — tinted so it reads as a character, not a clone of
 * the player. Bobs idly and shuffles between two points. Uses a
 * dynamic IMMUTABLE body so the player can't push them around.
 */
declare class NPC {
    readonly sprite: Phaser.Physics.Arcade.Sprite;
    readonly def: NpcDialogue;
    private readonly scene;
    private readonly label;
    private readonly wanderTween?;
    constructor(scene: Phaser.Scene, def: NpcDialogue, x: number, y: number, wanderDist: number);
    private setFlip;
    /** Little hop + label bump when a conversation starts. */
    celebrate(): void;
    update(): void;
    destroy(): void;
}

declare function buildGroundTexture(scene: Phaser.Scene): void;
/** Convenience — build the texture and return the single ground image. */
declare function addGroundImage(scene: Phaser.Scene): Phaser.GameObjects.Image;

declare const ground_addGroundImage: typeof addGroundImage;
declare const ground_buildGroundTexture: typeof buildGroundTexture;
declare namespace ground {
  export {
    ground_addGroundImage as addGroundImage,
    ground_buildGroundTexture as buildGroundTexture,
  };
}

export { BootScene, NPC, Player, WorldScene, createGame, createGame as default, ground };
