import * as Phaser from 'phaser';

/**
 * Shared types between the Phaser game and the React shell.
 * Kept free of any Phaser imports so both sides can use them.
 */
type ZoneKind = "welcome" | "about" | "project" | "skills" | "contact" | "dialogue" | "secret";
interface ZonePayload {
    kind: ZoneKind;
    /** Zone identifier — also used for visit tracking & achievements */
    id: string;
    title: string;
    subtitle?: string;
    /** For dialogue NPCs */
    npcId?: string;
    /** For project zones: the project id in the config */
    projectId?: string;
    /** For skill zones: the skill group id */
    skillId?: string;
}
interface AchievementDef {
    id: string;
    title: string;
    desc: string;
    emoji: string;
}

/**
 * Creates the Phaser game bound to a parent DOM element.
 * Only ever imported dynamically from the client — Phaser must never
 * be evaluated during SSR.
 *
 * Scale mode RESIZE + a FIXED 3000×3000 world bounds is the correct
 * pairing: the canvas stretches with the window while the world (and
 * everything built in it) stays untouched.
 */
declare function createGame(parent: HTMLElement): Phaser.Game;

type TimeMode = "day" | "sunset" | "night";
declare function getLocalTimeMode(): TimeMode;
/**
 * Tiny typed event bus over window CustomEvents — the ONLY channel
 * between the Phaser game and React. No DOM queries inside the
 * game loop (that was v1's #1 perf bug).
 */
interface GameEventMap {
    "pg:ready": undefined;
    "pg:prompt": {
        label: string | null;
    };
    "pg:zone-open": ZonePayload;
    "pg:zone-close": undefined;
    "pg:achievement": AchievementDef;
    "pg:presence": {
        count: number;
    };
    "pg:tick": {
        x: number;
        y: number;
        ghosts: Array<{
            id: string;
            x: number;
            y: number;
        }>;
    };
    "pg:time-mode": {
        mode: TimeMode;
        instant?: boolean;
    };
    "pg:fountain-toss": undefined;
}
declare function emitGameEvent<K extends keyof GameEventMap>(type: K, detail: GameEventMap[K]): void;
declare function onGameEvent<K extends keyof GameEventMap>(type: K, handler: (detail: GameEventMap[K]) => void): () => void;

type events_GameEventMap = GameEventMap;
type events_TimeMode = TimeMode;
declare const events_emitGameEvent: typeof emitGameEvent;
declare const events_getLocalTimeMode: typeof getLocalTimeMode;
declare const events_onGameEvent: typeof onGameEvent;
declare namespace events {
  export { events_emitGameEvent as emitGameEvent, events_getLocalTimeMode as getLocalTimeMode, events_onGameEvent as onGameEvent };
  export type { events_GameEventMap as GameEventMap, events_TimeMode as TimeMode };
}

interface Project {
    id: string;
    emoji: string;
    title: string;
    year: string;
    description: string;
    tags: string[];
    links: {
        label: string;
        url: string;
    }[];
}
interface SkillGroup {
    id: string;
    name: string;
    emoji: string;
    description: string;
    skills: string[];
}
interface NpcDialogue {
    id: string;
    name: string;
    emoji: string;
    /** CSS tint applied to the octopus sprite */
    tint: number;
    intro: string;
    lines: string[];
}
declare const portfolio: {
    name: string;
    role: string;
    tagline: string;
    location: string;
    about: {
        emoji: string;
        bio: string[];
        funFacts: string[];
    };
    projects: Project[];
    skills: SkillGroup[];
    contact: {
        emoji: string;
        email: string;
        discord: string;
        blurb: string;
        links: {
            label: string;
            value: string;
            url: string;
        }[];
    };
    npcs: NpcDialogue[];
    secret: {
        emoji: string;
        lines: string[];
    };
};

interface GhostSpawn {
    id: string;
    name: string;
    x: number;
    y: number;
    facing: string;
    moving: boolean;
}
/**
 * A translucent echo of another real visitor walking through the world.
 * No physics body — it's a friendly apparition, not a collision. The
 * sprite lerps toward the last reported position so movement looks
 * smooth even at 1-2 position reports per second.
 */
declare class Ghost {
    readonly id: string;
    private readonly scene;
    private readonly sprite;
    private readonly glow;
    private readonly label;
    private readonly fadeTween?;
    private tx;
    private ty;
    private moving;
    private facing;
    constructor(scene: Phaser.Scene, spawn: GhostSpawn);
    setTarget(x: number, y: number, moving: boolean, facing: string): void;
    /** Current visual position (for the minimap). */
    visualPosition(): {
        x: number;
        y: number;
    };
    update(dt: number): void;
    fadeOutAndDestroy(): void;
}

interface GhostPos {
    id: string;
    x: number;
    y: number;
}
declare class GhostSystem {
    private scene;
    private es;
    private ghosts;
    private id;
    private lastReport;
    private lastReportedPos;
    private lastChime;
    private pageHide;
    connect(scene: Phaser.Scene): void;
    private applySnapshot;
    /** Throttled heartbeat to the server. Fire-and-forget. */
    report(x: number, y: number, moving: boolean, facing: string): void;
    update(dt: number): void;
    /** Positions for the minimap. */
    positions(): GhostPos[];
    onlineCount(): number;
    disconnect(): void;
    /** Full teardown — also tells the server we left, so ghosts vanish fast. */
    leave(): void;
}
declare const ghosts: GhostSystem;

/**
 * WORLD SPEC — every coordinate is in a FIXED 3000×3000 world space.
 * Nothing here depends on the viewport. The camera scrolls over this
 * world; resizing the window only changes zoom. This is the single
 * biggest architectural difference from v1, where the world was
 * rebuilt from screen-ratios on every resize event.
 */
declare const WORLD: {
    width: number;
    height: number;
};
/** Path width in px (tiles are 32px, scaled ×4) */
declare const PATH_W = 128;
declare const HALF_PATH: number;
/** Central plaza */
declare const PLAZA: {
    cx: number;
    cy: number;
    /** Half-size of the plaza floor */
    half: number;
};
/** Player spawn (west, like arriving at the edge of town) */
declare const SPAWN: {
    x: number;
    y: number;
};
/** Straight path segments: rects the player walks on */
interface PathRect {
    x: number;
    y: number;
    w: number;
    h: number;
    /** kept for tooling compat — the painted ground ignores orientation */
    horizontal: boolean;
}
declare const PATHS: PathRect[];
/** Courier Plaza / Telegraph Courtyard (south district) */
declare const COURIER_PLAZA: {
    cx: number;
    cy: number;
    w: number;
    h: number;
    r: number;
};
/** Zones that must stay clear of random decoration */
declare const CLEAR_ZONES: {
    x: number;
    y: number;
    w: number;
    h: number;
}[];
/** Project noticeboards — one per project, along north walkway at y=335 facing south onto the walkway */
declare const PROJECT_BOARDS: {
    id: string;
    x: number;
    y: number;
}[];
/** Skill sanctuaries — 3 themed arboretum sanctuaries (North, East, South) */
declare const SKILL_PATCHES: {
    id: string;
    x: number;
    y: number;
}[];
/** Fixed interactable points (all in world coords) */
declare const POINTS: {
    welcomeSign: {
        x: number;
        y: number;
    };
    fountain: {
        x: number;
        y: number;
    };
    mailbox: {
        x: number;
        y: number;
    };
    chest: {
        x: number;
        y: number;
    };
    npcOldOcto: {
        x: number;
        y: number;
    };
    npcPixel: {
        x: number;
        y: number;
    };
};
/** Ground pixel scale: 1 ground texel = GROUND_CELL world px */
declare const GROUND_CELL = 8;
/** Soft dirt pads painted under props that sit off-path (world coords) */
declare const GROUND_PADS: {
    x: number;
    y: number;
    r: number;
}[];
/** Trees framing the secret chest clearing (placed deliberately) */
declare const CHEST_TREES: {
    x: number;
    y: number;
}[];
/** Floating district labels */
declare const LABELS: {
    text: string;
    x: number;
    y: number;
}[];
/** Secret trail branch hint — pale chevrons painted into the ground */
declare const SECRET_MARK: {
    x: number;
    y: number;
};
/** Deterministic RNG so the world looks identical every visit */
declare function mulberry32(seed: number): () => number;
/** Camera zoom: fits the device WITHOUT ever touching the world layout */
declare function zoomFor(width: number, height: number): number;

declare const world_CHEST_TREES: typeof CHEST_TREES;
declare const world_CLEAR_ZONES: typeof CLEAR_ZONES;
declare const world_COURIER_PLAZA: typeof COURIER_PLAZA;
declare const world_GROUND_CELL: typeof GROUND_CELL;
declare const world_GROUND_PADS: typeof GROUND_PADS;
declare const world_HALF_PATH: typeof HALF_PATH;
declare const world_LABELS: typeof LABELS;
declare const world_PATHS: typeof PATHS;
declare const world_PATH_W: typeof PATH_W;
declare const world_PLAZA: typeof PLAZA;
declare const world_POINTS: typeof POINTS;
declare const world_PROJECT_BOARDS: typeof PROJECT_BOARDS;
type world_PathRect = PathRect;
declare const world_SECRET_MARK: typeof SECRET_MARK;
declare const world_SKILL_PATCHES: typeof SKILL_PATCHES;
declare const world_SPAWN: typeof SPAWN;
declare const world_WORLD: typeof WORLD;
declare const world_mulberry32: typeof mulberry32;
declare const world_zoomFor: typeof zoomFor;
declare namespace world {
  export { world_CHEST_TREES as CHEST_TREES, world_CLEAR_ZONES as CLEAR_ZONES, world_COURIER_PLAZA as COURIER_PLAZA, world_GROUND_CELL as GROUND_CELL, world_GROUND_PADS as GROUND_PADS, world_HALF_PATH as HALF_PATH, world_LABELS as LABELS, world_PATHS as PATHS, world_PATH_W as PATH_W, world_PLAZA as PLAZA, world_POINTS as POINTS, world_PROJECT_BOARDS as PROJECT_BOARDS, world_SECRET_MARK as SECRET_MARK, world_SKILL_PATCHES as SKILL_PATCHES, world_SPAWN as SPAWN, world_WORLD as WORLD, world_mulberry32 as mulberry32, world_zoomFor as zoomFor };
  export type { world_PathRect as PathRect };
}

export { Ghost as G, createGame as c, GhostSystem as d, events as e, ghosts as g, emitGameEvent as j, getLocalTimeMode as k, onGameEvent as o, portfolio as p, world as w };
export type { AchievementDef as A, NpcDialogue as N, PathRect as P, SkillGroup as S, TimeMode as T, ZoneKind as Z, GhostPos as a, GhostSpawn as b, GameEventMap as f, Project as h, ZonePayload as i };
