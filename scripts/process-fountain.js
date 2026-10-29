/**
 * Build-time asset processing for the portfolio game.
 * Replaces the old runtime `processFountainImage()` pixel surgery:
 *   - Reads the original fountain.png (500x500, brown background)
 *   - Flood-fills from the BORDER only, removing background pixels within
 *     color tolerance of the sampled border color (so interior browns survive)
 *   - Writes fountain-clean.png with transparency
 * Run: node scripts/process-fountain.js
 */
const sharp = require("sharp");

const SRC = "public/game-assets/images/fountain.png";
const DST = "public/game-assets/images/fountain-clean.png";

async function main() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info; // channels = 4
  const idx = (x, y) => (y * w + x) * channels;

  // 1. Sample average border color (the background to remove)
  let sr = 0, sg = 0, sb = 0, n = 0;
  for (let x = 0; x < w; x++) {
    for (const y of [0, h - 1]) {
      sr += data[idx(x, y)]; sg += data[idx(x, y) + 1]; sb += data[idx(x, y) + 2]; n++;
    }
  }
  for (let y = 0; y < h; y++) {
    for (const x of [0, w - 1]) {
      sr += data[idx(x, y)]; sg += data[idx(x, y) + 1]; sb += data[idx(x, y) + 2]; n++;
    }
  }
  sr /= n; sg /= n; sb /= n;
  console.log(`Sampled border color: rgb(${sr.toFixed(0)}, ${sg.toFixed(0)}, ${sb.toFixed(0)})`);

  const TOL = 68; // euclidean distance tolerance per channel
  const close = (x, y) => {
    const i = idx(x, y);
    const dr = data[i] - sr, dg = data[i + 1] - sg, db = data[i + 2] - sb;
    return Math.sqrt(dr * dr + dg * dg + db * db) < TOL;
  };

  // 2. BFS flood fill from all border pixels
  const visited = new Uint8Array(w * h);
  const queue = [];
  for (let x = 0; x < w; x++) { queue.push(x, 0, x, h - 1); }
  for (let y = 0; y < h; y++) { queue.push(0, y, w - 1, y); }
  let removed = 0;
  let qi = 0;
  while (qi < queue.length) {
    const x = queue[qi++], y = queue[qi++];
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (visited[p]) continue;
    visited[p] = 1;
    if (!close(x, y)) continue;
    data[idx(x, y) + 3] = 0; // make transparent
    removed++;
    queue.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }

  console.log(`Removed ${removed} px of ${w * h} (${((removed / (w * h)) * 100).toFixed(1)}%)`);

  // 3. Soften the cut edge: pixels adjacent to transparency get partial alpha
  const alphaAt = (x, y) => data[idx(x, y) + 3];
  const snapshot = Buffer.from(data);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = idx(x, y);
      if (snapshot[i + 3] === 0) continue;
      const neighbors = [
        snapshot[idx(x + 1, y) + 3], snapshot[idx(x - 1, y) + 3],
        snapshot[idx(x, y + 1) + 3], snapshot[idx(x, y - 1) + 3],
      ];
      if (neighbors.some((a) => a === 0)) data[i + 3] = Math.min(data[i + 3], 160);
    }
  }

  await sharp(data, { raw: { width: w, height: h, channels } })
    .png()
    .toFile(DST);
  console.log(`Wrote ${DST}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
