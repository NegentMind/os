/*
 * Orbital lettering — glyph map for display words.
 * Source of truth: os/brand/orbital/font/glyphs/*.svg (stroke 13, bevel
 * joins, construction lines y=16/56/96). D, E, G, I, M, N, T are verbatim
 * logo geometry from brand/orbital/orbital-source.svg; the rest follow the
 * same construction. Keep this table in sync with the font masters.
 *
 * STATUS: fallback/library, not the live path. Site headings and the hero
 * rotating word render in the compiled font (next/font/local,
 * --font-orbital-display → web/public/fonts/orbital-display.woff2). This
 * map stays for glyphs the font does not cover yet (accented capitals,
 * digits) and for canvas/SVG-only contexts that cannot load a webfont.
 *
 * Punctuation mirrors glyphs/punct/*.svg (v0.4.1): baseline dots at cy=92,
 * upper dots at cy=58, ¿/¡ are the exact 180° rotation of ?/!. Filled r6
 * circles reuse the registration-dot geometry and render as `dots`.
 * v0.4.1 visibility pass: comma/semicolon gain an angular hook (dot r6 +
 * two-segment tail to the descender), quotes become slanted elbow bars /
 * raised-comma marks, parens are chevrons, % rings grow r11→r14, & is a
 * closed top ring + crossing + U-bowl (no longer a fragmented 8).
 *
 * Accented capitals (Á É Í Ó Ú Ñ Ü) are composites: base letter + a mark
 * drawn above the cap line in negative y. .nm2-orbital-word already sets
 * overflow:visible, so the mark paints without changing the 120-unit box.
 * The compiled font does not include accents yet — see font/SPECIMEN.md.
 */

export type OrbitalGlyph = {
  /** Centerline path data in the 120-unit glyph box. */
  d: string;
  /** Advance width in glyph units (ink + internal sidebearing). */
  w: number;
  /** Filled circles [cx, cy, r] — registration-dot geometry, not stroked. */
  dots?: readonly (readonly [number, number, number])[];
};

export const ORBITAL_GLYPHS: Readonly<Record<string, OrbitalGlyph>> = {
  A: { d: "M10,96 L34,16 L58,96 M20,68 H48", w: 68 },
  B: { d: "M12,96 V16 H34 A20,20 0 0 1 34,56 H12 H40 A20,20 0 0 1 40,96 H12 Z", w: 72 },
  C: { d: "M74.6,30.3 A40,40 0 1 0 74.6,81.7", w: 82 },
  D: { d: "M12,16 V96 H38 A40,40 0 0 0 38,16 H12 Z", w: 84 },
  E: { d: "M52,16 H12 V96 H52 M12,56 H44", w: 64 },
  F: { d: "M52,16 H12 V96 M12,56 H44", w: 64 },
  G: { d: "M68,34 A30,30 0 1 0 74,56 H46", w: 80 },
  H: { d: "M12,16 V96 M56,16 V96 M12,56 H56", w: 68 },
  I: { d: "M18,16 V96", w: 36 },
  J: { d: "M56,16 V76 A20,20 0 0 1 16,76", w: 68 },
  K: { d: "M12,16 V96 M58,16 L14,56 L60,96", w: 72 },
  L: { d: "M12,16 V96 H56", w: 66 },
  M: { d: "M12,96 V16 L40,62 L68,16 V96", w: 80 },
  N: { d: "M12,96 V16 L56,96 V16", w: 68 },
  O: { d: "M38,16 A30,40 0 1 0 38,96 A30,40 0 1 0 38,16 Z", w: 78 },
  P: { d: "M12,96 V16 H38 A20,20 0 0 1 38,56 H12 Z", w: 70 },
  Q: { d: "M38,16 A30,40 0 1 0 38,96 A30,40 0 1 0 38,16 Z M50,76 L74,102", w: 82 },
  R: { d: "M12,96 V16 H38 A20,20 0 0 1 38,56 H12 Z M36,56 L62,96", w: 74 },
  S: { d: "M56,36 A20,20 0 0 0 16,36 L56,76 A20,20 0 0 1 16,76", w: 72 },
  T: { d: "M6,16 H58 M32,16 V96", w: 64 },
  U: { d: "M12,16 V72 A24,24 0 0 0 60,72 V16", w: 72 },
  V: { d: "M10,16 L34,96 L58,16", w: 68 },
  W: { d: "M12,16 V96 L40,50 L68,96 V16", w: 80 },
  X: { d: "M12,16 L60,96 M60,16 L12,96", w: 72 },
  Y: { d: "M8,16 L34,56 L60,16 M34,56 V96", w: 68 },
  Z: { d: "M12,16 H56 L12,96 H58", w: 70 },
  // Accented capitals — composite: base letter + mark above cap (y<0).
  "Á": { d: "M10,96 L34,16 L58,96 M20,68 H48 M30,6 L42,-4", w: 68 },
  "É": { d: "M52,16 H12 V96 H52 M12,56 H44 M26,6 L38,-4", w: 64 },
  "Í": { d: "M18,16 V96 M12,6 L24,-4", w: 36 },
  "Ó": { d: "M38,16 A30,40 0 1 0 38,96 A30,40 0 1 0 38,16 Z M32,6 L44,-4", w: 78 },
  "Ú": { d: "M12,16 V72 A24,24 0 0 0 60,72 V16 M30,6 L42,-4", w: 72 },
  "Ñ": { d: "M12,96 V16 L56,96 V16 M22,2 L31,-5 L40,1 L49,-4", w: 68 },
  "Ü": { d: "M12,16 V72 A24,24 0 0 0 60,72 V16", w: 72, dots: [[28, -2, 5], [44, -2, 5]] },
  // Punctuation — mirrors glyphs/punct/*.svg.
  ".": { d: "", w: 36, dots: [[18, 92, 6]] },
  ",": { d: "M26,90 L14,108 L8,116", w: 40, dots: [[24, 84, 6]] },
  ":": { d: "", w: 36, dots: [[18, 58, 6], [18, 92, 6]] },
  ";": { d: "M26,90 L14,108 L8,116", w: 40, dots: [[24, 58, 6], [24, 84, 6]] },
  "?": { d: "M20,36 A20,20 0 1 1 40,56 L40,72", w: 68, dots: [[40, 92, 6]] },
  "!": { d: "M20,16 V70", w: 40, dots: [[20, 92, 6]] },
  "'": { d: "M22,16 L16,34 L12,44", w: 36 },
  "’": { d: "M26,28 L16,42 L12,48", w: 36, dots: [[24, 22, 6]] },
  "\"": { d: "M18,16 L12,34 L10,44 M38,16 L32,34 L30,44", w: 48 },
  "-": { d: "M12,56 H40", w: 52 },
  "–": { d: "M6,56 H60", w: 66 },
  "—": { d: "M4,56 H92", w: 96 },
  "(": { d: "M46,16 L16,66 L46,116", w: 56 },
  ")": { d: "M10,16 L40,66 L10,116", w: 56 },
  "/": { d: "M54,16 L14,96", w: 68 },
  "·": { d: "", w: 36, dots: [[18, 58, 6]] },
  "+": { d: "M30,36 V76 M10,56 H50", w: 60 },
  "¿": { d: "M48,96 A20,20 0 1 0 28,76 L28,60", w: 68, dots: [[28, 40, 6]] },
  "¡": { d: "M20,62 V116", w: 40, dots: [[20, 40, 6]] },
  "&": { d: "M46,16 A13,13 0 1 0 46,42 A13,13 0 1 0 46,16 Z M54,38 L26,64 A19,19 0 0 0 62,70 L74,96", w: 84 },
  "%": { d: "M69,16 L19,96 M23,16 A14,14 0 1 0 23,44 A14,14 0 1 0 23,16 Z M65,68 A14,14 0 1 0 65,96 A14,14 0 1 0 65,68 Z", w: 88 },
};

const SPACE_ADVANCE = 34;

/**
 * One word in Orbital capitals. Letters without a designed glyph fall back to
 * advance space so a typo degrades to a gap, never to a wrong letter.
 */
export function OrbitalWord({
  word,
  className = "",
  gap = 16,
}: {
  word: string;
  className?: string;
  gap?: number;
}) {
  const letters = word.toUpperCase().split("");
  const paths: { d: string; x: number; key: string }[] = [];
  const dots: { x: number; y: number; r: number; key: string }[] = [];
  let x = 0;
  letters.forEach((letter, index) => {
    if (letter === " ") {
      x += SPACE_ADVANCE;
      return;
    }
    const glyph = ORBITAL_GLYPHS[letter];
    if (!glyph) {
      x += SPACE_ADVANCE;
      return;
    }
    if (glyph.d) {
      paths.push({ d: glyph.d, x, key: `${index}-${letter}` });
    }
    glyph.dots?.forEach(([cx, cy, r], dotIndex) => {
      dots.push({ x: x + cx, y: cy, r, key: `${index}-${letter}.${dotIndex}` });
    });
    x += glyph.w + gap;
  });
  const width = Math.max(1, x - (paths.length || dots.length ? gap : 0));

  return (
    <svg
      viewBox={`0 0 ${width} 120`}
      className={["nm2-orbital-word", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMinYMid meet"
    >
      <g fill="none" stroke="currentColor" strokeWidth={13} strokeLinejoin="bevel">
        {paths.map((p) => (
          <path key={p.key} d={p.d} transform={`translate(${p.x},0)`} />
        ))}
      </g>
      {dots.map((dot) => (
        <circle
          key={dot.key}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
