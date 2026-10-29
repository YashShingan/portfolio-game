/** Coarse ASCII visualization of fountain-clean.png to verify the chroma-key result. */
const sharp = require("sharp");

async function main() {
  const img = sharp("public/game-assets/images/fountain-clean.png").resize(48, 48, { fit: "fill" });
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, ch = 4;
  const ramp = " .:-=+*#%@";
  for (let y = 0; y < info.height; y++) {
    let row = "";
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * ch;
      const a = data[i + 3]; // 0..255 opacity
      const lum = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11) / 255;
      const c = Math.round((a / 255) * (lum * 6 + 1)); // denser glyph if opaque & bright
      row += ramp[Math.min(c, ramp.length - 1)];
    }
    console.log(row);
  }
}
main();
