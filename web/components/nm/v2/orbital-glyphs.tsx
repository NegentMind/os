/*
 * Orbital lettering — glyph map for display words.
 * Source of truth: os/brand/orbital/font/glyphs/*.svg (stroke 13, bevel
 * joins, construction lines y=16/56/96). D, E, G, I, M, N, T are verbatim
 * logo geometry from brand/orbital/orbital-source.svg; the rest follow the
 * same construction. Keep this table in sync with the font masters.
 */

export type OrbitalGlyph = {
  /** Centerline path data in the 120-unit glyph box. */
  d: string;
  /** Advance width in glyph units (ink + internal sidebearing). */
  w: number;
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
};

const SPACE_ADVANCE = 34;
const DOT = { d: "", w: 36 };

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
  const dots: { x: number; key: string }[] = [];
  let x = 0;
  letters.forEach((letter, index) => {
    if (letter === " ") {
      x += SPACE_ADVANCE;
      return;
    }
    if (letter === ".") {
      dots.push({ x: x + DOT.w / 2, key: `${index}-.` });
      x += DOT.w;
      return;
    }
    const glyph = ORBITAL_GLYPHS[letter];
    if (!glyph) {
      x += SPACE_ADVANCE;
      return;
    }
    paths.push({ d: glyph.d, x, key: `${index}-${letter}` });
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
        <circle key={dot.key} cx={dot.x} cy={92} r={6} fill="currentColor" />
      ))}
    </svg>
  );
}
