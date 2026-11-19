"""Recolour the derived logo PNGs to the current palette. The artwork itself never changes.

Blue (hue ~208deg) -> Sky Industrial Blue, gold/ochre (hue ~39deg) -> Orange; bevel shading is kept
by shifting hue and scaling saturation/value per pixel. Sources are the original-colour files in
scripts/logo-src/ (copies of the brand-supplied derivatives), so the script can be re-run safely.

    python3 scripts/recolor-logo.py
"""
import colorsys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'scripts' / 'logo-src'

# (hue range in degrees) -> (target hue, saturation scale, value scale)
RULES = [
    ((180, 250), (206, 0.68, 0.80)),  # brand blue -> sky industrial blue #2C6A99
    ((20, 60), (24, 1.0, 1.04)),  # brand gold -> orange #D2691E
]


def recolor(name: str) -> None:
    img = Image.open(SRC / name).convert('RGBA')
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if s < 0.2:
                continue  # whites, greys and shadows stay as they are
            deg = h * 360
            for (lo, hi), (th, ss, vs) in RULES:
                if lo <= deg <= hi:
                    nr, ng, nb = colorsys.hsv_to_rgb(th / 360, min(1, s * ss), min(1, v * vs))
                    px[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
                    break
    img.save(ROOT / 'public' / name, optimize=True)
    print('wrote public/' + name)


for f in ('logo-transparent.png', 'logo-icon.png'):
    recolor(f)
