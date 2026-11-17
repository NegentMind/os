#!/usr/bin/env python3
"""
Orbital Display — MVP font builder.

Consumes the per-glyph centerline SVGs in ./glyphs (stroke 13, bevel joins,
construction lines y=16/56/96), expands strokes into filled outlines with
skia-pathops, and emits orbital-display.ttf + orbital-display.woff2.

Geometry source: ./glyphs/*.svg — same table as
web/components/nm/v2/orbital-glyphs.tsx and font/specimen.html.

Requirements: fontTools, skia-pathops, brotli (for WOFF2).
Run: python build-font.py
"""

from __future__ import annotations

import math
import os
import re
import sys

try:
    import pathops
except ImportError:  # pragma: no cover
    sys.exit("build-font.py requires skia-pathops (pip install skia-pathops)")

try:
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.cu2quPen import Cu2QuPen
    from fontTools.pens.ttGlyphPen import TTGlyphPen
except ImportError:  # pragma: no cover
    sys.exit("build-font.py requires fontTools (pip install fonttools[woff])")

HERE = os.path.dirname(os.path.abspath(__file__))
GLYPH_DIR = os.path.join(HERE, "glyphs")

# --- source-space metrics ---------------------------------------------------
# SVG coordinate system: cap top y=16, mid y=56, baseline y=96, stroke 13.
STROKE = 13.0
UPM = 1024
# 80 SVG units of cap height -> 700 font units.
SCALE = 700.0 / 80.0
BASELINE_SVG_Y = 96.0
LSB = 52.0          # left sidebearing, font units
RSB = 52.0          # right sidebearing, font units
SPACE_ADVANCE = 300
# Optical advance corrections (font units): measured edges are equal, so the
# corrections compensate perceived density, not arithmetic.
OPTICAL = {"T": -14, "I": -18, "L": -10, "Z": -8, "W": 12, "S": 8, "V": -6, "Y": -6}

LETTERS = [chr(c) for c in range(ord("A"), ord("Z") + 1)]

# --- tiny SVG path parser (M/L/H/V/A/Z, absolute only) -----------------------
TOKEN = re.compile(r"([MLHVAZ])([^MLHVAZ]*)")


def _numbers(chunk: str) -> list[float]:
    return [float(n) for n in re.findall(r"-?\d*\.?\d+(?:e-?\d+)?", chunk, re.I)]


def _arc_to_cubics(
    x1: float, y1: float, rx: float, ry: float,
    rotation: float, large: int, sweep: int, x2: float, y2: float,
) -> list[tuple[float, float, float, float, float, float]]:
    """SVG elliptical arc (endpoint parametrization) -> cubic segments."""
    if rx == 0 or ry == 0 or (x1 == x2 and y1 == y2):
        return [(x1, y1, x1, y1, x2, y2)]
    phi = math.radians(rotation % 360.0)
    cos_phi, sin_phi = math.cos(phi), math.sin(phi)
    dx, dy = (x1 - x2) / 2.0, (y1 - y2) / 2.0
    x1p = cos_phi * dx + sin_phi * dy
    y1p = -sin_phi * dx + cos_phi * dy
    rx, ry = abs(rx), abs(ry)
    lam = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry)
    if lam > 1.0:
        s = math.sqrt(lam)
        rx, ry = rx * s, ry * s
    sign = -1.0 if large == sweep else 1.0
    num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    coef = sign * math.sqrt(max(0.0, num / den))
    cxp = coef * (rx * y1p / ry)
    cyp = coef * (-ry * x1p / rx)
    cx = cos_phi * cxp - sin_phi * cyp + (x1 + x2) / 2.0
    cy = sin_phi * cxp + cos_phi * cyp + (y1 + y2) / 2.0

    def angle(ux: float, uy: float, vx: float, vy: float) -> float:
        d = math.hypot(ux, uy) * math.hypot(vx, vy)
        c = max(-1.0, min(1.0, (ux * vx + uy * vy) / d))
        a = math.acos(c)
        return -a if ux * vy - uy * vx < 0 else a

    start = (x1p - cxp) / rx, (y1p - cyp) / ry
    end = (-x1p - cxp) / rx, (-y1p - cyp) / ry
    theta1 = angle(1.0, 0.0, *start)
    delta = angle(*start, *end)
    if not sweep and delta > 0:
        delta -= 2 * math.pi
    elif sweep and delta < 0:
        delta += 2 * math.pi

    cubics = []
    segments = max(1, int(math.ceil(abs(delta) / (math.pi / 2))))
    for i in range(segments):
        t1 = theta1 + delta * i / segments
        t2 = theta1 + delta * (i + 1) / segments
        alpha = (
            math.sin(t2 - t1)
            * (math.sqrt(4 + 3 * math.tan((t2 - t1) / 2) ** 2) - 1)
            / 3
        )
        e1x, e1y = rx * math.cos(t1), ry * math.sin(t1)
        e2x, e2y = rx * math.cos(t2), ry * math.sin(t2)
        d1x, d1y = -rx * math.sin(t1), ry * math.cos(t1)
        d2x, d2y = -rx * math.sin(t2), ry * math.cos(t2)
        c1 = (e1x + alpha * d1x, e1y + alpha * d1y)
        c2 = (e2x - alpha * d2x, e2y - alpha * d2y)

        def unprime(px: float, py: float) -> tuple[float, float]:
            return (
                cos_phi * px - sin_phi * py + cx,
                sin_phi * px + cos_phi * py + cy,
            )

        c1 = unprime(*c1)
        c2 = unprime(*c2)
        e = unprime(e2x, e2y)
        cubics.append((c1[0], c1[1], c2[0], c2[1], e[0], e[1]))
    return cubics


def svg_path_to_skia(d: str) -> pathops.Path:
    path = pathops.Path()
    x = y = 0.0
    start_x = start_y = 0.0
    for cmd, chunk in TOKEN.findall(d):
        vals = _numbers(chunk)
        if cmd == "M":
            x, y = vals[0], vals[1]
            path.moveTo(x, y)
            start_x, start_y = x, y
            # Implicit lineto pairs after moveto.
            for i in range(2, len(vals), 2):
                x, y = vals[i], vals[i + 1]
                path.lineTo(x, y)
        elif cmd == "L":
            for i in range(0, len(vals), 2):
                x, y = vals[i], vals[i + 1]
                path.lineTo(x, y)
        elif cmd == "H":
            for v in vals:
                x = v
                path.lineTo(x, y)
        elif cmd == "V":
            for v in vals:
                y = v
                path.lineTo(x, y)
        elif cmd == "A":
            for i in range(0, len(vals), 7):
                rx, ry, rot, large, sweep, x2, y2 = vals[i : i + 7]
                for c1x, c1y, c2x, c2y, ex, ey in _arc_to_cubics(
                    x, y, rx, ry, rot, int(large), int(sweep), x2, y2
                ):
                    path.cubicTo(c1x, c1y, c2x, c2y, ex, ey)
                x, y = x2, y2
        elif cmd == "Z":
            path.close()
            x, y = start_x, start_y
    return path


def outline_to_tt(source: pathops.Path, lsb: float) -> "object":
    """Stroke -> union -> scale + flip into font units -> TTGlyphPen glyph."""
    # pathops stroke() expands in place and returns None; union() draws the
    # normalized result through an out-pen.
    source.stroke(
        STROKE, pathops.LineCap.BUTT_CAP, pathops.LineJoin.BEVEL_JOIN, 4.0
    )
    merged = pathops.Path()
    pathops.union([source], merged.getPen(), fix_winding=True)
    # transform() returns a new Path; stroke()/simplify() mutate in place.
    merged = merged.transform(SCALE, 0, 0, -SCALE, lsb, BASELINE_SVG_Y * SCALE)
    merged.simplify(fix_winding=True, keep_starting_points=False)
    pen = TTGlyphPen(None)
    merged.draw(Cu2QuPen(pen, max_err=1.0))
    return pen.glyph()


def filled_circle(cx: float, cy: float, r: float, lsb: float) -> "object":
    """Registration dot: filled, not stroked."""
    p = pathops.Path()
    k = 0.5523 * r
    p.moveTo(cx + r, cy)
    p.cubicTo(cx + r, cy + k, cx + k, cy + r, cx, cy + r)
    p.cubicTo(cx - k, cy + r, cx - r, cy + k, cx - r, cy)
    p.cubicTo(cx - r, cy - k, cx - k, cy - r, cx, cy - r)
    p.cubicTo(cx + k, cy - r, cx + r, cy - k, cx + r, cy)
    p.close()
    p = p.transform(SCALE, 0, 0, -SCALE, lsb, BASELINE_SVG_Y * SCALE)
    pen = TTGlyphPen(None)
    p.draw(Cu2QuPen(pen, max_err=1.0))
    return pen.glyph()


def read_glyph(letter: str) -> tuple[str, float]:
    with open(os.path.join(GLYPH_DIR, f"{letter}.svg"), encoding="utf-8") as f:
        svg = f.read()
    d = re.search(r'\bd="([^"]+)"', svg)
    w = re.search(r'viewBox="0 0 (\d+) 120"', svg)
    if not d or not w:
        sys.exit(f"glyphs/{letter}.svg: missing d or viewBox")
    return d.group(1), float(w.group(1))


def main() -> None:
    glyph_order = [".notdef", "space", "period"] + LETTERS
    cmap: dict[int, str] = {0x20: "space", 0x2E: "period"}
    cmap.update({ord(ch): ch for ch in LETTERS})

    glyphs: dict[str, object] = {}
    metrics: dict[str, tuple[int, int]] = {}

    pen = TTGlyphPen(None)
    glyphs[".notdef"] = pen.glyph()
    metrics[".notdef"] = (500, 0)
    glyphs["space"] = TTGlyphPen(None).glyph()
    metrics["space"] = (SPACE_ADVANCE, 0)

    for letter in LETTERS:
        d, w = read_glyph(letter)
        glyphs[letter] = outline_to_tt(svg_path_to_skia(d), LSB)
        advance = round(w * SCALE + LSB + RSB + OPTICAL.get(letter, 0))
        metrics[letter] = (advance, LSB)

    # Registration dot mapped to U+002E: faithful to the logo punctuation.
    glyphs["period"] = filled_circle(18, 92, 6, 24)
    metrics["period"] = (round(36 * SCALE + 48), 24)

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=820, descent=-160)
    fb.setupNameTable({
        "familyName": "Orbital Display",
        "styleName": "Regular",
        "uniqueFontIdentifier": "Negent Mind; Orbital Display; 0.1.0",
        "fullName": "Orbital Display Regular",
        "psName": "OrbitalDisplay-Regular",
        "version": "Version 0.1.0",
        "description": "MVP uppercase display face built from the Orbital logo "
                       "construction. Development build; see SPECIMEN.md.",
        "licenseDescription": "Unreleased development build. License pending.",
    })
    fb.setupOS2(
        sTypoAscender=780,
        sTypoDescender=-160,
        sTypoLineGap=60,
        usWinAscent=820,
        usWinDescent=180,
        sCapHeight=700,
        sxHeight=700,
        usWeightClass=400,
        usWidthClass=5,
        achVendID="NMND",
        ulUnicodeRange1=0x00000001,
        ulCodePageRange1=0x00000001,
        fsSelection=0x40,
        fsType=0,
    )
    fb.setupPost(keepGlyphNames=False)

    out_ttf = os.path.join(HERE, "orbital-display.ttf")
    fb.save(out_ttf)
    print(f"wrote {out_ttf}")

    try:
        fb.font.flavor = "woff2"
        out_woff2 = os.path.join(HERE, "orbital-display.woff2")
        fb.save(out_woff2)
        print(f"wrote {out_woff2}")
    except Exception as exc:  # pragma: no cover
        print(f"WOFF2 skipped: {exc}", file=sys.stderr)


if __name__ == "__main__":
    main()
