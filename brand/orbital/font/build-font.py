#!/usr/bin/env python3
"""
Orbital Display — MVP font builder.

Consumes the per-glyph centerline SVGs in ./glyphs (uppercase, stroke 13,
bevel joins, construction lines y=16/56/96), ./glyphs/lowercase
(x-height y=56, ascender y=16, descender y=116) and ./glyphs/punct
(punctuation, same contract; baseline dots reuse the r6 registration
dot, ¿/¡ are the 180°-rotated ?/! reaching the descender line), expands
strokes into filled outlines with skia-pathops, and emits
orbital-display.ttf + orbital-display.woff2. Filled <circle> elements in
a glyph SVG (the i/j tittle, colon/period dots, same r6 geometry as the
registration dot) are merged as filled outlines, not stroked.

Accented glyphs (v0.4) are composed here, not stored as SVGs: the
diacritic marks are parametric geometry appended to the base letter's
path data. Capitals reuse verbatim the mark geometry already shipped in
web/components/nm/v2/orbital-glyphs.tsx (acute rising 12×10 into
y<0, angular zigzag tilde, r5 dieresis dots); lowercase marks hang in
the tittle zone with their lowest point at y=40; the cedilla is an
angular hook under the baseline (y≈96..114), echoing the comma tail.
í drops the i tittle. Advance/sidebearings are copied from the base
letter, including its OPTICAL/OPTICAL_LOWER correction.

Geometry source: ./glyphs/*.svg + ./glyphs/lowercase/*.svg +
./glyphs/punct/*.svg — same table as
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
# SVG coordinate system: cap top y=16, x-height y=56, baseline y=96,
# descender y=116, stroke 13.
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
# Lowercase corrections: narrow stems and open letters run tighter; wide
# letters (m, w) and the tense s get air.
OPTICAL_LOWER = {
    "i": -40, "j": -24, "l": -40, "f": -16, "t": -16, "r": -14,
    "k": -10, "v": -8, "x": -8, "y": -10, "z": -6,
    "s": 6, "m": 12, "w": 12,
}

LETTERS = [chr(c) for c in range(ord("A"), ord("Z") + 1)]
LOWER = [chr(c) for c in range(ord("a"), ord("z") + 1)]

# Punctuation (./glyphs/punct/<name>.svg) — glyph name -> codepoint.
# Priority order first (the marks real copy uses), then the wider set.
PUNCT = {
    "comma": 0x002C,
    "colon": 0x003A,
    "semicolon": 0x003B,
    "question": 0x003F,
    "exclam": 0x0021,
    "quotesingle": 0x0027,
    "quoteright": 0x2019,
    "quotedbl": 0x0022,
    "hyphen": 0x002D,
    "endash": 0x2013,
    "emdash": 0x2014,
    "parenleft": 0x0028,
    "parenright": 0x0029,
    "slash": 0x002F,
    "periodcentered": 0x00B7,
    "plus": 0x002B,
    "questiondown": 0x00BF,
    "exclamdown": 0x00A1,
    "ampersand": 0x0026,
    "percent": 0x0025,
}
# Hyphen-minus U+002D doubles as U+2010 HYPHEN; quoteright doubles as the
# ASCII-less apostrophe in copy that already uses U+2019.
PUNCT_ALIASES = {0x2010: "hyphen"}
OPTICAL_PUNCT: dict[str, int] = {}

# --- diacritic marks (SVG units, appended to the base letter's path) ---------
# Capital marks reproduce verbatim the composites already shipped in
# web/components/nm/v2/orbital-glyphs.tsx (they paint above cap y=16 in
# negative y; the stem-less top bars reach y≈9.5 of ink, so the acute sits
# deliberately tight). Lowercase marks hang in the tittle zone with their
# lowest endpoint at y=40 (≈45 ink, ~4.5 over x-height ink at 49.5).
# `ax` is the accent anchor: the optical center of the base letterform.


def _acute(ax: float, yb: float) -> str:
    """Acute bar rising to the right: 12 wide, 10 tall, butt ends."""
    return f"M{ax - 6:g},{yb:g} L{ax + 6:g},{yb - 10:g}"


def _tilde(ax: float, yb: float) -> str:
    """Angular zigzag tilde (no curves — the face is bevel-joined)."""
    return (
        f"M{ax - 13.5:g},{yb:g} L{ax - 4.5:g},{yb - 7:g} "
        f"L{ax + 4.5:g},{yb - 1:g} L{ax + 13.5:g},{yb - 6:g}"
    )


def _dieresis(ax: float, cy: float) -> list[tuple[float, float, float]]:
    """Two filled dots r5 (as shipped in the web composite; the r6
    registration dot reads too heavy above cap height)."""
    return [(ax - 8, cy, 5), (ax + 8, cy, 5)]


def _cedilla(ax: float) -> str:
    """Angular hook under the baseline — echoes the comma tail."""
    return f"M{ax + 6:g},96 L{ax - 8:g},106 L{ax - 2:g},114"


# name -> (codepoint, base letter, svg subdir, extra path d, extra circles,
#          drop base filled dots). Anchors chosen per letterform (apex/stem/
# bowl center), matching the deployed composite where it exists.
ACCENTED: dict[str, tuple[int, str, str, str, list, bool]] = {
    "Aacute":    (0x00C1, "A", "", _acute(36, 6), [], False),
    "Ccedilla":  (0x00C7, "C", "", _cedilla(34.6), [], False),
    "Eacute":    (0x00C9, "E", "", _acute(32, 6), [], False),
    "Iacute":    (0x00CD, "I", "", _acute(18, 6), [], False),
    "Ntilde":    (0x00D1, "N", "", _tilde(35.5, 2), [], False),
    "Oacute":    (0x00D3, "O", "", _acute(38, 6), [], False),
    "Uacute":    (0x00DA, "U", "", _acute(36, 6), [], False),
    "Udieresis": (0x00DC, "U", "", "", _dieresis(36, -2), False),
    "Yacute":    (0x00DD, "Y", "", _acute(34, 6), [], False),
    "aacute":    (0x00E1, "a", "lowercase", _acute(32, 40), [], False),
    "ccedilla":  (0x00E7, "c", "lowercase", _cedilla(27.3), [], False),
    "eacute":    (0x00E9, "e", "lowercase", _acute(28, 40), [], False),
    "iacute":    (0x00ED, "i", "lowercase", _acute(12, 40), [], True),
    "ntilde":    (0x00F1, "n", "lowercase", _tilde(32, 40), [], False),
    "oacute":    (0x00F3, "o", "lowercase", _acute(32, 40), [], False),
    "uacute":    (0x00FA, "u", "lowercase", _acute(32, 40), [], False),
    "udieresis": (0x00FC, "u", "lowercase", "", _dieresis(32, 40), False),
    "yacute":    (0x00FD, "y", "lowercase", _acute(32, 40), [], False),
}

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


def circle_path(cx: float, cy: float, r: float) -> pathops.Path:
    """Filled circle in SVG space (registration-dot geometry, r=6)."""
    p = pathops.Path()
    k = 0.5523 * r
    p.moveTo(cx + r, cy)
    p.cubicTo(cx + r, cy + k, cx + k, cy + r, cx, cy + r)
    p.cubicTo(cx - k, cy + r, cx - r, cy + k, cx - r, cy)
    p.cubicTo(cx - r, cy - k, cx - k, cy - r, cx, cy - r)
    p.cubicTo(cx + k, cy - r, cx + r, cy - k, cx + r, cy)
    p.close()
    return p


def outline_to_tt(
    source: pathops.Path | None,
    lsb: float,
    circles: list[tuple[float, float, float]] = (),
) -> "object":
    """Stroke -> union (+ filled circles) -> scale + flip -> TTGlyphPen glyph."""
    # pathops stroke() expands in place and returns None; union() draws the
    # normalized result through an out-pen. A None source means the glyph is
    # dots only (colon, periodcentered).
    if source is not None:
        source.stroke(
            STROKE, pathops.LineCap.BUTT_CAP, pathops.LineJoin.BEVEL_JOIN, 4.0
        )
    else:
        source = pathops.Path()
    parts = [source] + [circle_path(cx, cy, r) for cx, cy, r in circles]
    merged = pathops.Path()
    pathops.union(parts, merged.getPen(), fix_winding=True)
    # transform() returns a new Path; stroke()/simplify() mutate in place.
    merged = merged.transform(SCALE, 0, 0, -SCALE, lsb, BASELINE_SVG_Y * SCALE)
    merged.simplify(fix_winding=True, keep_starting_points=False)
    pen = TTGlyphPen(None)
    merged.draw(Cu2QuPen(pen, max_err=1.0))
    return pen.glyph()


def filled_circle(cx: float, cy: float, r: float, lsb: float) -> "object":
    """Registration dot: filled, not stroked."""
    p = circle_path(cx, cy, r).transform(
        SCALE, 0, 0, -SCALE, lsb, BASELINE_SVG_Y * SCALE
    )
    pen = TTGlyphPen(None)
    p.draw(Cu2QuPen(pen, max_err=1.0))
    return pen.glyph()


def read_glyph(
    name: str, sub: str = ""
) -> tuple[str | None, float, list[tuple[float, float, float]]]:
    path = os.path.join(GLYPH_DIR, sub, f"{name}.svg")
    with open(path, encoding="utf-8") as f:
        svg = f.read()
    # d may be absent for dot-only marks (colon, periodcentered).
    d = re.search(r'\bd="([^"]+)"', svg)
    w = re.search(r'viewBox="0 0 (\d+) 120"', svg)
    if not w:
        sys.exit(f"glyphs/{sub + '/' if sub else ''}{name}.svg: missing viewBox")
    # Filled dot elements (tittle, colon dots): <circle cx cy r>,
    # attribute order fixed.
    circles = [
        (float(m[0]), float(m[1]), float(m[2]))
        for m in re.findall(
            r'<circle[^>]*cx="([\d.]+)"\s+cy="([\d.]+)"\s+r="([\d.]+)"', svg
        )
    ]
    if not d and not circles:
        sys.exit(f"glyphs/{sub + '/' if sub else ''}{name}.svg: no path or circle")
    return (d.group(1) if d else None), float(w.group(1)), circles


def main() -> None:
    glyph_order = (
        [".notdef", "space", "period"]
        + LETTERS + LOWER + list(PUNCT) + list(ACCENTED)
    )
    cmap: dict[int, str] = {0x20: "space", 0x2E: "period"}
    cmap.update({ord(ch): ch for ch in LETTERS + LOWER})
    cmap.update({code: name for name, code in PUNCT.items()})
    cmap.update(PUNCT_ALIASES)
    cmap.update({code: name for name, (code, *_rest) in ACCENTED.items()})

    glyphs: dict[str, object] = {}
    metrics: dict[str, tuple[int, int]] = {}

    pen = TTGlyphPen(None)
    glyphs[".notdef"] = pen.glyph()
    metrics[".notdef"] = (500, 0)
    glyphs["space"] = TTGlyphPen(None).glyph()
    metrics["space"] = (SPACE_ADVANCE, 0)

    for letter in LETTERS:
        d, w, circles = read_glyph(letter)
        glyphs[letter] = outline_to_tt(
            svg_path_to_skia(d) if d else None, LSB, circles
        )
        advance = round(w * SCALE + LSB + RSB + OPTICAL.get(letter, 0))
        metrics[letter] = (advance, LSB)

    for letter in LOWER:
        d, w, circles = read_glyph(letter, "lowercase")
        glyphs[letter] = outline_to_tt(
            svg_path_to_skia(d) if d else None, LSB, circles
        )
        advance = round(w * SCALE + LSB + RSB + OPTICAL_LOWER.get(letter, 0))
        metrics[letter] = (advance, LSB)

    # Registration dot mapped to U+002E: faithful to the logo punctuation.
    glyphs["period"] = filled_circle(18, 92, 6, 24)
    metrics["period"] = (round(36 * SCALE + 48), 24)

    for name in PUNCT:
        d, w, circles = read_glyph(name, "punct")
        glyphs[name] = outline_to_tt(
            svg_path_to_skia(d) if d else None, LSB, circles
        )
        advance = round(
            w * SCALE + LSB + RSB + OPTICAL_PUNCT.get(name, 0)
        )
        metrics[name] = (advance, LSB)

    # Accented glyphs: base letter outline + composed mark. Metrics are
    # copied verbatim from the base letter so accents change zero spacing.
    for name, (_code, base, sub, mark_d, mark_circles, drop_dots) in (
        ACCENTED.items()
    ):
        d, w, circles = read_glyph(base, sub)
        if drop_dots:
            circles = []
        combined_d = " ".join(chunk for chunk in (d, mark_d) if chunk)
        glyphs[name] = outline_to_tt(
            svg_path_to_skia(combined_d) if combined_d else None,
            LSB,
            circles + mark_circles,
        )
        optical = (
            OPTICAL.get(base, 0) if not sub else OPTICAL_LOWER.get(base, 0)
        )
        advance = round(w * SCALE + LSB + RSB + optical)
        metrics[name] = (advance, LSB)

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics)
    # v0.4: ascent raised 820 -> 940. The capital tilde's ink tops out at
    # ~y_svg=-10 (~929 font units); hhea/usWin must cover it or accents clip.
    fb.setupHorizontalHeader(ascent=940, descent=-240)
    fb.setupNameTable({
        "familyName": "Orbital Display",
        "styleName": "Regular",
        "uniqueFontIdentifier": "Negent Mind; Orbital Display; 0.4.0",
        "fullName": "Orbital Display Regular",
        "psName": "OrbitalDisplay-Regular",
        "version": "Version 0.4.0",
        "description": "MVP display face built from the Orbital logo "
                       "construction. A-Z + a-z + punctuation + Spanish "
                       "diacritics + space + registration dot. "
                       "Development build; see SPECIMEN.md.",
        "licenseDescription": "Unreleased development build. License pending.",
    })
    fb.setupOS2(
        sTypoAscender=780,
        sTypoDescender=-200,
        sTypoLineGap=60,
        usWinAscent=940,
        usWinDescent=240,
        sCapHeight=700,
        sxHeight=350,
        usWeightClass=400,
        usWidthClass=5,
        achVendID="NMND",
        ulCodePageRange1=0x00000001,
        fsSelection=0x40,
        fsType=0,
    )
    fb.setupPost(keepGlyphNames=False)
    # Let fontTools recompute ulUnicodeRange* from the final cmap (Basic
    # Latin + Latin-1 Supplement + General Punctuation).
    fb.font["OS/2"].recalcUnicodeRanges(fb.font)

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
