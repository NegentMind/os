# Orbital Display: Typeface Feasibility

Status: technical and design study, not a released font. No font binary has
been generated, installed or substituted into the website.

## Conclusion

The original Orbital lettering can become the starting point of a reusable
display typeface. Converting the existing logo to a font file would not, by
itself, produce a complete typeface: most characters do not exist yet.

Use it for brand headlines, banners and short display phrases. Keep Outfit for
website headings and DM Sans for reading/UI until a new alphabet has been
designed, proofed and explicitly approved. A distinctive logo alphabet is not
automatically a legible body font.

## What Actually Exists

Source of truth: `orbital-source.svg`, preserved without reconstruction.
`web/components/nm/v2/brand-mark.tsx` renders the same approved geometry.

- Seven distinct uppercase letter designs: D, E, G, I, M, N and T.
- A registration dot, plus fixed logo/monogram compositions.
- Stroke width 13 in the original SVG coordinate system.
- Bevel joins and geometric vertical, horizontal, diagonal and arc construction.
- Nominal construction lines at y=16, y=56 and y=96.
- Distinct curve families, including radius 30 for G and 40 for D.

These are SVG construction facts, not final OpenType metrics. In particular,
an SVG transform placing the next logo letter is not a font's advance width or
kerning value. Stroke expansion also changes the actual outline bounds.

## Design Contract

Preserve:

- The recognizable N diagonal, M construction, open G and narrow I.
- Shared stem weight, controlled diagonal joins and a consistent curve grammar.
- The registration dot as a deliberate brand punctuation element.
- Optical spacing rather than mathematically equal gaps.

Design, do not synthesize:

- Missing letters: an M should not be mechanically flipped into an arbitrary W.
- Round-to-flat transitions and curved overshoots.
- Counters and ambiguous pairs such as I/1, O/0 and G/C.
- Accent placement, punctuation and spacing at real display sizes.

The logo stays an authoritative fixed SVG even after a font exists. Ordinary
typesetting must not silently change its approved spacing or composition.

## Character Coverage

Recommended first review sheet:

- A-Z, 0-9, space and basic punctuation.
- Spanish uppercase accents, N-tilde, U-diaeresis, inverted question/exclamation.
- Brand registration dot, hyphen, dash, colon, slash and parentheses.

This first sheet is an uppercase display proposal, not full Latin support.
Lowercase must either be designed as lowercase or the face must explicitly be
described as unicase. Do not silently replace unsupported characters with
unrelated glyphs. A stable general-purpose Latin/Spanish family requires more
coverage and proofing than the first display sheet.

Start with one upright weight. Alternate glyphs or a second weight can follow a
stable core; variable-font axes are not necessary for the initial use case.

## Engineering Pipeline

1. Preserve the original lettering and create editable per-glyph masters.
2. Design the missing alphabet against the original construction grammar.
3. Expand SVG strokes into closed, filled contours; resolve overlaps and
   contour direction. Open SVG centerlines alone are not usable font outlines.
4. Establish units-per-em, cap height, baseline, ascenders/descenders, overshoots,
   line metrics and sidebearings after inspecting the expanded outlines.
5. Build a Unicode character map, family/style/PostScript names and versioning.
6. Add optical kerning, preferably OpenType GPOS `kern`, and test real words.
7. Export a desktop TrueType font and a WOFF2 web build from one source master.
8. Check contour validity, missing characters, accent clipping, shaping, browser
   loading, text selection, PDF export and desktop application behavior.

FontForge provides stroke expansion and font editing; FontTools provides
TrueType construction/inspection and WOFF2 serialization. They are candidates
for a reproducible build, not dependencies installed by this study.

Do not prescribe final numeric metrics from the logo's viewBox alone. Confirm
them against all glyphs and accented proofs before treating them as a contract.

## Consistency And Creative Range

- One source master and versioned exports; never edit the binary font by hand.
- A specimen sheet with alphabet, numerals, accents and punctuation.
- Proof phrases containing every letter and difficult pairs, in ES and EN.
- Display proofs at small, medium and banner sizes, on dark and silver surfaces.
- Optical variants must be named stylistic alternates, not random mutations.
- Keep foreground lettering independent of shader or image backgrounds:
  color/material is applied by composition, not baked into the glyph outlines.
- Keep animations outside the font; standard text must remain selectable.

## Rights And Naming

The study uses the original Orbital geometry, not Arcspoke, Fuigant, Unflow or
another commercial font's outlines. A distribution license and final family
name still need an explicit decision. Do not label an unlicensed/unreviewed
export as an OFL release. No commercial-font file is included here.

## Official References

- FontForge stroke expansion:
  https://fontforge.org/docs/techref/stroke.html
- FontForge Python interfaces:
  https://fontforge.org/docs/scripting/python.html
- FontTools TrueType glyph pen:
  https://fonttools.readthedocs.io/en/latest/pens/ttGlyphPen.html
- FontTools WOFF2 support:
  https://fonttools.readthedocs.io/en/latest/ttLib/woff2.html
- OpenType kerning feature:
  https://learn.microsoft.com/en-us/typography/opentype/spec/features_ko
- OpenType metrics:
  https://learn.microsoft.com/en-us/typography/opentype/spec/os2
