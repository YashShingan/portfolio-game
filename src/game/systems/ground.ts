import * as Phaser from "phaser";
import {
  GROUND_CELL,
  GROUND_PADS,
  PATHS,
  PLAZA,
  POINTS,
  SECRET_MARK,
  WORLD,
  mulberry32,
} from "@/game/data/world";

/**
 * GROUND PAINTER — the fix for v2's "messed up roads".
 *
 * The old renderer stacked a dozen tileSprites (each tiling from its own
 * top-left, some rotated) plus opaque "corner" stamps that were really
 * just noise squares. Result: grid seams at every junction, wallpaper
 * repetition and hard rectangular edges everywhere.
 *
 * Instead we paint the ENTIRE ground — grass, dirt paths, stone plaza —
 * into one small canvas (1 texel = 8 world px), where every pixel is
 * placed on purpose:
 *   • layered masks: paths cut THROUGH the plaza as dirt "gates"
 *   • rounded end caps, dithered + eroded edges (grass bites the dirt)
 *   • smooth low-frequency tones (no per-pixel static)
 *   • flagstone plaza with grout lines and a soft curb
 *   • a stone ring grounds the fountain
 *   • pads under off-path props, chevrons at the secret junction
 *   • palettes sampled from the ORIGINAL v1 grass/footpath tiles
 *
 * The canvas is added as ONE nearest-filtered texture → one draw call,
 * zero seams, and the pixel-art chunkiness is preserved (8px texels).
 */

const GW = WORLD.width / GROUND_CELL; // 375
const GH = WORLD.height / GROUND_CELL; // 375

type RGB = [number, number, number];

const STONE_PALETTE: RGB[] = [
  [154, 149, 138], // light flagstone
  [139, 134, 124], // mid
  [125, 120, 110], // dark
  [165, 160, 149], // pale fleck
];

/** Deterministic 2D hash → 0..1 (for per-cell flagstone tones) */
function hash2(x: number, y: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function samplePalette(scene: Phaser.Scene, key: string, limit = 512): RGB[] {
  const src = scene.textures.get(key).getSourceImage() as CanvasImageSource;
  const cnv = document.createElement("canvas");
  const w = (src as HTMLImageElement).naturalWidth || (src as HTMLCanvasElement).width;
  const h = (src as HTMLImageElement).naturalHeight || (src as HTMLCanvasElement).height;
  cnv.width = w;
  cnv.height = h;
  const ctx = cnv.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(src, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;
  const palette: RGB[] = [];
  for (let i = 0; i < data.length && palette.length < limit; i += 4) {
    if (data[i + 3] < 200) continue;
    palette.push([data[i], data[i + 1], data[i + 2]]);
  }
  return palette.length ? palette : [[120, 100, 70]];
}

/** Average + sort a palette into a smooth 5-step ramp (kills static). */
function smoothRamp(palette: RGB[]): RGB[] {
  const avg = (c: RGB) => (c[0] + c[1] + c[2]) / 3;
  const sorted = [...palette].sort((a, b) => avg(a) - avg(b));
  const ramp: RGB[] = [];
  for (let i = 0; i < 5; i++) {
    const lo = sorted[Math.floor((i / 5) * sorted.length)];
    const hi = sorted[Math.floor(((i + 1) / 5) * (sorted.length - 1))];
    ramp.push([
      Math.round((lo[0] + hi[0]) / 2),
      Math.round((lo[1] + hi[1]) / 2),
      Math.round((lo[2] + hi[2]) / 2),
    ]);
  }
  return ramp;
}

export function buildGroundTexture(scene: Phaser.Scene): void {
  const dirtPal = smoothRamp(samplePalette(scene, "footpath"));
  const grassPal = smoothRamp(samplePalette(scene, "grass"));
  const rng = mulberry32(20261025);

  // ---------------- 1. Layered masks (1 texel = 8 world px) ----------------
  const pathMask = new Uint8Array(GW * GH); // paths (+caps) — cut through plaza
  const plazaMask = new Uint8Array(GW * GH);
  const ringMask = new Uint8Array(GW * GH);
  const padMask = new Uint8Array(GW * GH);
  const dirtMask = new Uint8Array(GW * GH); // everything that ends up dirt

  const fillRect = (m: Uint8Array, x0: number, y0: number, w: number, h: number) => {
    const xa = Math.max(0, Math.floor(x0));
    const ya = Math.max(0, Math.floor(y0));
    const xb = Math.min(GW - 1, Math.ceil(x0 + w) - 1);
    const yb = Math.min(GH - 1, Math.ceil(y0 + h) - 1);
    for (let y = ya; y <= yb; y++)
      for (let x = xa; x <= xb; x++) m[y * GW + x] = 1;
  };

  const fillCircle = (m: Uint8Array, cx: number, cy: number, r: number) => {
    const x0 = Math.max(0, Math.floor(cx - r));
    const x1 = Math.min(GW - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r));
    const y1 = Math.min(GH - 1, Math.ceil(cy + r));
    const r2 = r * r;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= r2) m[y * GW + x] = 1;
      }
  };

  const fillRoundRect = (
    m: Uint8Array, x0: number, y0: number, w: number, h: number, r: number,
  ) => {
    fillRect(m, x0 + r, y0, w - 2 * r, h);
    fillRect(m, x0, y0 + r, w, h - 2 * r);
    fillCircle(m, x0 + r, y0 + r, r);
    fillCircle(m, x0 + w - r, y0 + r, r);
    fillCircle(m, x0 + r, y0 + h - r, r);
    fillCircle(m, x0 + w - r, y0 + h - r, r);
  };

  const S = (v: number) => v / GROUND_CELL; // world → texel coords

  // Paths with rounded end caps (fixes the ugly flat dead-ends).
  // Also remember each path's centerline for the worn-trail effect.
  interface Centerline {
    horiz: boolean;
    x0: number; x1: number; y0: number; y1: number;
    cx: number; cy: number; half: number;
  }
  const centerlines: Centerline[] = PATHS.map((p) => {
    fillRect(pathMask, S(p.x), S(p.y), S(p.w), S(p.h));
    if (p.w >= p.h) {
      const r = S(p.h) / 2;
      fillCircle(pathMask, S(p.x), S(p.y + p.h / 2), r);
      fillCircle(pathMask, S(p.x + p.w), S(p.y + p.h / 2), r);
    } else {
      const r = S(p.w) / 2;
      fillCircle(pathMask, S(p.x + p.w / 2), S(p.y), r);
      fillCircle(pathMask, S(p.x + p.w / 2), S(p.y + p.h), r);
    }
    return {
      horiz: p.w >= p.h,
      x0: S(p.x), x1: S(p.x + p.w), y0: S(p.y), y1: S(p.y + p.h),
      cx: S(p.x + p.w / 2), cy: S(p.y + p.h / 2),
      half: S(Math.min(p.w, p.h)) / 2,
    };
  });

  // Plaza — rounded-corner flagstone square
  const pzX = S(PLAZA.cx - PLAZA.half);
  const pzY = S(PLAZA.cy - PLAZA.half);
  const pzS = S(PLAZA.half * 2);
  fillRoundRect(plazaMask, pzX, pzY, pzS, pzS, 8);

  // Stone ring grounding the fountain
  const fC = { x: S(POINTS.fountain.x), y: S(POINTS.fountain.y + 56) };
  const fR = S(210);
  fillCircle(ringMask, fC.x, fC.y, fR);

  // Soft dirt pads under off-path props
  for (const p of GROUND_PADS) fillCircle(padMask, S(p.x), S(p.y), S(p.r));

  // Composite dirt = paths ∪ pads, erode/dither its grass border
  for (let i = 0; i < dirtMask.length; i++) dirtMask[i] = pathMask[i] | padMask[i];

  const neighbor0 = (m: Uint8Array, x: number, y: number) =>
    x === 0 || y === 0 || x === GW - 1 || y === GH - 1 ||
    m[y * GW + x - 1] === 0 || m[y * GW + x + 1] === 0 ||
    m[(y - 1) * GW + x] === 0 || m[(y + 1) * GW + x] === 0;

  // Erode: dirt edge texels randomly fall away → ragged grass bite
  for (let y = 0; y < GH; y++)
    for (let x = 0; x < GW; x++) {
      const i = y * GW + x;
      if (dirtMask[i] === 1 && neighbor0(dirtMask, x, y) && rng() < 0.3) dirtMask[i] = 0;
    }
  // Spill: grass texels hugged by dirt on 3+ sides get tracked → soft fringe
  for (let y = 1; y < GH - 1; y++)
    for (let x = 1; x < GW - 1; x++) {
      const i = y * GW + x;
      if (dirtMask[i]) continue;
      const n =
        (dirtMask[i - 1] ? 1 : 0) + (dirtMask[i + 1] ? 1 : 0) +
        (dirtMask[i - GW] ? 1 : 0) + (dirtMask[i + GW] ? 1 : 0);
      if (n >= 3 && rng() < 0.5) dirtMask[i] = 1;
    }

  // ---------------- 2. Paint pixels ----------------
  const cnv = document.createElement("canvas");
  cnv.width = GW;
  cnv.height = GH;
  const ctx = cnv.getContext("2d")!;
  const img = ctx.createImageData(GW, GH);
  const px = img.data;

  const put = (i: number, c: RGB, mul = 1) => {
    px[i] = Math.min(255, c[0] * mul) | 0;
    px[i + 1] = Math.min(255, c[1] * mul) | 0;
    px[i + 2] = Math.min(255, c[2] * mul) | 0;
    px[i + 3] = 255;
  };

  /** Smooth two-scale tone: big coherent patches + small-scale detail. */
  const toneAt = (x: number, y: number, ramp: RGB[]): RGB => {
    const big = ramp[(hash2(x >> 4, y >> 4) * ramp.length) | 0];
    const small = ramp[(hash2(x >> 2, y >> 2) * ramp.length) | 0];
    return [
      (big[0] * 3 + small[0]) >> 2,
      (big[1] * 3 + small[1]) >> 2,
      (big[2] * 3 + small[2]) >> 2,
    ];
  };

  const onDirtEdge = (x: number, y: number) =>
    neighbor0(dirtMask, x, y) ||
    (!plazaMask[y * GW + x] && (
      x === 0 || plazaMask[y * GW + x - 1] || plazaMask[y * GW + x + 1] ||
      plazaMask[(y - 1 < 0 ? 0 : y - 1) * GW + x] ||
      plazaMask[(y + 1 >= GH ? GH - 1 : y + 1) * GW + x]));

  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const idx = y * GW + x; // mask index
      const i = idx * 4; // RGBA index — put() writes 4 channels

      // 1) Dirt wins over everything — spokes cut through the plaza
      if (dirtMask[idx]) {
        if (rng() < 0.015) {
          put(i, [172, 158, 130], 0.94 + rng() * 0.12); // pale pebble
          continue;
        }
        const c = toneAt(x, y, dirtPal);
        let mul = 0.95 + hash2(x, y) * 0.1;

        // Worn centerline — the trail feet actually use
        for (const cl of centerlines) {
          if (cl.horiz && y + 0.5 > cl.cy - cl.half && y + 0.5 < cl.cy + cl.half) {
            const d = Math.abs(y + 0.5 - cl.cy) / cl.half;
            if (d < 0.5 && x + 0.5 > cl.x0 + 1 && x + 0.5 < cl.x1 - 1) mul *= 1.05;
          } else if (!cl.horiz && x + 0.5 > cl.cx - cl.half && x + 0.5 < cl.cx + cl.half) {
            const d = Math.abs(x + 0.5 - cl.cx) / cl.half;
            if (d < 0.5 && y + 0.5 > cl.y0 + 1 && y + 0.5 < cl.y1 - 1) mul *= 1.05;
          }
        }
        // Trodden edge shade where dirt meets grass or stone
        if (onDirtEdge(x, y)) mul *= 0.78;
        put(i, c, mul);
        continue;
      }

      // 2) Fountain stone ring
      const dx = x + 0.5 - fC.x;
      const dy = y + 0.5 - fC.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= fR) {
        const ring =
          Math.abs(dist - fR * 0.55) < 0.6 || Math.abs(dist - fR * 0.82) < 0.5;
        const c = STONE_PALETTE[(hash2(x, y) * STONE_PALETTE.length) | 0];
        put(i, c, ring ? 0.62 : 0.95 + hash2(x, y) * 0.1);
        continue;
      }

      // 3) Plaza flagstones — 5-texel cells, grout, soft curb
      if (plazaMask[idx]) {
        const curb =
          x < pzX + 3 || y < pzY + 3 || x > pzX + pzS - 4 || y > pzY + pzS - 4;
        const grout = x % 5 === 0 || y % 5 === 0;
        const tone = STONE_PALETTE[
          (hash2(Math.floor(x / 5) + 1000, Math.floor(y / 5) + 1000) * STONE_PALETTE.length) | 0
        ];
        put(i, tone, curb ? 0.72 : grout ? 0.6 : 0.92 + hash2(x, y) * 0.16);
        continue;
      }

      // 4) Grass — smooth meadow patches, occasional blade fleck
      const c = toneAt(x, y, grassPal);
      put(i, c, hash2(x + 7, y + 7) < 0.04 ? 0.84 : 0.98 + hash2(x, y) * 0.06);
    }
  }

  // ---------------- 3. Chevrons at the secret trail branch ----------------
  const ax = Math.round(SECRET_MARK.x / GROUND_CELL);
  const ay = Math.round(SECRET_MARK.y / GROUND_CELL);
  for (let k = 0; k < 3; k++) {
    const cy = ay + k * 4;
    for (let d = -3; d <= 3; d++) {
      const yy = cy + (3 - Math.abs(d));
      if (yy >= 0 && yy < GH) put((yy * GW + ax + d) * 4, [186, 176, 156], 1);
    }
  }

  ctx.putImageData(img, 0, 0);

  if (scene.textures.exists("world-ground")) scene.textures.remove("world-ground");
  scene.textures.addCanvas("world-ground", cnv);
  scene.textures.get("world-ground").setFilter(Phaser.Textures.FilterMode.NEAREST);
}

/** Convenience — build the texture and return the single ground image. */
export function addGroundImage(scene: Phaser.Scene): Phaser.GameObjects.Image {
  buildGroundTexture(scene);
  return scene.add
    .image(WORLD.width / 2, WORLD.height / 2, "world-ground")
    .setOrigin(0.5)
    .setScale(GROUND_CELL)
    .setDepth(-1000);
}
