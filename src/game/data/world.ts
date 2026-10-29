import { portfolio } from "@/config/portfolio";

/**
 * WORLD SPEC — every coordinate is in a FIXED 3000×3000 world space.
 * Nothing here depends on the viewport. The camera scrolls over this
 * world; resizing the window only changes zoom. This is the single
 * biggest architectural difference from v1, where the world was
 * rebuilt from screen-ratios on every resize event.
 */

export const WORLD = { width: 3000, height: 3000 };

/** Path width in px (tiles are 32px, scaled ×4) */
export const PATH_W = 128;
export const HALF_PATH = PATH_W / 2;

/** Central plaza */
export const PLAZA = {
  cx: 1500,
  cy: 1500,
  /** Half-size of the plaza floor */
  half: 480,
};

/** Player spawn (west, like arriving at the edge of town) */
export const SPAWN = { x: 430, y: 1500 };

/** Straight path segments: rects the player walks on */
export interface PathRect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** kept for tooling compat — the painted ground ignores orientation */
  horizontal: boolean;
}

export const PATHS: PathRect[] = [
  // 4 spokes from the plaza edges outward
  { x: 1436, y: 420, w: PATH_W, h: 600, horizontal: false }, // north
  { x: 1436, y: 1980, w: PATH_W, h: 600, horizontal: false }, // south
  { x: 420, y: 1436, w: 600, h: PATH_W, horizontal: true }, // west
  { x: 1980, y: 1436, w: 600, h: PATH_W, horizontal: true }, // east
  // Projects walkway (north district)
  { x: 900, y: 380, w: 1200, h: PATH_W, horizontal: true },
  // Skills walkway (east district)
  { x: 2340, y: 1250, w: PATH_W, h: 500, horizontal: false },
  // Contact walkway (south district)
  { x: 1200, y: 2350, w: 600, h: PATH_W, horizontal: true },
  // Secret trail — narrower, branches off the projects walkway
  // and dead-ends at a hidden chest clearing in the woods
  { x: 2100, y: 380, w: 600, h: 64, horizontal: true },
  { x: 2636, y: 380, w: 64, h: 320, horizontal: false },
];

/** Zones that must stay clear of random decoration */
export const CLEAR_ZONES = PATHS.map((p) => ({
  x: p.x - 60,
  y: p.y - 60,
  w: p.w + 120,
  h: p.h + 120,
})).concat([
  // plaza + margin
  { x: PLAZA.cx - PLAZA.half - 50, y: PLAZA.cy - PLAZA.half - 50, w: PLAZA.half * 2 + 100, h: PLAZA.half * 2 + 100 },
  // projects boards area
  { x: 860, y: 240, w: 1340, h: 400 },
  // skills garden area
  { x: 2280, y: 1180, w: 320, h: 680 },
  // contact area
  { x: 1140, y: 2290, w: 720, h: 340 },
  // secret chest clearing (around the trail's dead end)
  { x: 2520, y: 480, w: 400, h: 360 },
  // NPC spots
  { x: 560, y: 1330, w: 280, h: 240 },
  { x: 1490, y: 2000, w: 280, h: 240 },
  // spawn area
  { x: 320, y: 1360, w: 240, h: 280 },
]);

/** Project noticeboards — one per project, along the north walkway */
export const PROJECT_BOARDS = portfolio.projects.map((p, i) => ({
  id: p.id,
  x: 1080 + i * 300,
  y: 444,
}));

/** Skill patches — one per group, along the east walkway */
export const SKILL_PATCHES = portfolio.skills.map((s, i) => ({
  id: s.id,
  x: 2404,
  y: 1320 + i * 220,
}));

/** Fixed interactable points (all in world coords) */
export const POINTS = {
  welcomeSign: { x: 560, y: 1330 },
  fountain: { x: PLAZA.cx, y: PLAZA.cy },
  mailbox: { x: 1500, y: 2414 },
  // tucked at the end of the secret trail — actually hidden now
  chest: { x: 2668, y: 640 },
  npcOldOcto: { x: 700, y: 1450 },
  npcPixel: { x: 1630, y: 2110 },
};

/** Ground pixel scale: 1 ground texel = GROUND_CELL world px */
export const GROUND_CELL = 8;

/** Soft dirt pads painted under props that sit off-path (world coords) */
export const GROUND_PADS = [
  { x: POINTS.welcomeSign.x, y: POINTS.welcomeSign.y + 44, r: 66 },
  { x: POINTS.npcOldOcto.x, y: POINTS.npcOldOcto.y + 26, r: 74 },
  { x: POINTS.npcPixel.x, y: POINTS.npcPixel.y + 26, r: 74 },
];

/** Trees framing the secret chest clearing (placed deliberately) */
export const CHEST_TREES = [
  { x: 2452, y: 548 },
  { x: 2452, y: 742 },
  { x: 2884, y: 520 },
  { x: 2884, y: 728 },
  { x: 2568, y: 856 },
  { x: 2772, y: 856 },
];

/** Floating district labels */
export const LABELS = [
  { text: "PROJECTS", x: 1500, y: 300 },
  { text: "ABOUT", x: 1500, y: 1230 },
  { text: "SKILLS", x: 2470, y: 1210 },
  { text: "CONTACT", x: 1500, y: 2300 },
];

/** Secret trail branch hint — pale chevrons painted into the ground */
export const SECRET_MARK = { x: 2668, y: 452 };

/** Deterministic RNG so the world looks identical every visit */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Camera zoom: fits the device WITHOUT ever touching the world layout */
export function zoomFor(width: number, height: number): number {
  return Math.min(1.2, Math.max(0.65, Math.min(width / 1000, height / 700)));
}
