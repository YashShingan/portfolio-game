"""Probe fountain-clean.png: dimensions, alpha mask block-art, color regions.

Goal: find where the top basin / pillar / pool are so the water-pour
animation can be anchored to real sprite geometry instead of guessing.
"""
from PIL import Image

img = Image.open("/home/z/my-project/public/game-assets/images/fountain-clean.png").convert("RGBA")
w, h = img.size
print(f"size: {w}x{h}")

# Downsample to ~48 columns of block art. Mark:
#  . = transparent, # = opaque "solid" (stone/brown), ~ = bluish (water), o = other
COLS = 48
rows = max(8, round(COLS * h / w / 2))
step_x, step_y = w / COLS, h / rows
px = img.load()

def sample_cell(cx0, cy0, cx1, cy1):
    """Average color + alpha over a cell, subsampled 2x2 per cell."""
    n = solid = blue = 0
    rs = gs = bs = alphas = 0
    for yy in range(int(cy0), int(cy1), max(1, int(step_y // 3) or 1)):
        for xx in range(int(cx0), int(cx1), max(1, int(step_x // 3) or 1)):
            r, g, b, a = px[xx, yy]
            n += 1
            alphas += a
            if a > 40:
                solid += 1
                rs += r; gs += g; bs += b
                # water-ish: blue channel clearly dominant or cyan-ish
                if b > 150 and b > r + 30:
                    blue += 1
    if n == 0:
        return " "
    alpha = alphas / n
    if alpha < 30 or solid < n * 0.25:
        return "."
    avg = (rs / solid, gs / solid, bs / solid)
    if blue > solid * 0.5:
        return "~"  # water
    return "#"

print("\nblock art (# stone/solid, ~ water/blue, . transparent):")
for ry in range(rows):
    line = ""
    for rx in range(COLS):
        line += sample_cell(rx * step_x, ry * step_y, (rx + 1) * step_x, (ry + 1) * step_y)
    print(f"{line}  row {ry} y={ry * h // rows}-{((ry + 1) * h // rows)}")

# Scan for distinct horizontal bands of bluish pixels (water surfaces)
print("\nblue-pixel count per 4px horizontal band (y: count):")
band_counts = []
for y0 in range(0, h, 4):
    cnt = 0
    for x in range(0, w, 2):
        r, g, b, a = px[x, y0]
        if a > 60 and b > 150 and b > r + 30:
            cnt += 1
    if cnt > 2:
        band_counts.append((y0, cnt))
for y0, cnt in band_counts:
    print(f"  y={y0:4d} blue_px={cnt}")
