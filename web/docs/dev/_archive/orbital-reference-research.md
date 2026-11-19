# Orbital Motion Reference Research

Research date: 2026-11-17. This record distinguishes observed sources from
planned adaptations. It is not a license grant, deployment or validation report.

## Strand

Local source remains under the ignored workspace
`webTemplates/strand/`, outside the organization repository.

Observed implementations:

- `public/assets/js/HeroThreeJSV2.BLMtRZnd.mjs`: a Three.js-based strand
  implementation, including simulation, pointer repulsion, highlights,
  visibility/intersection handling and cleanup.
- `public/assets/js/DotGridGL.CMWvKS01.mjs`: a WebGL point grid with pointer
  highlighting, an exponential decay simulation and resource cleanup.
- `public/ssr/index.html`: stacked, masked backdrop filters with RGB channel
  offsets. This is more than an ordinary opaque bottom gradient.
- `BackgroundPatternSVG.BSIu6-Se.mjs` is a small SVG pattern helper, not the
  complete animated field.

The local template still wraps Framer SSR and its runtime. Copying that wrapper
into the production website would reintroduce a second page/runtime system.
Instead, implement original bounded particle fields, progressive viewport blur
and geometric scenes inside the existing Next/Orbital component library.

The new visual direction references the material behavior, not a promise of
pixel-identical reproduction or permission to redistribute the template code.

## Content Architecture

Source: https://www.contentarchitecture.dev/

Observed:

- Homepage loaded successfully in the research browser.
- Split light/dark composition, a typographic orbital field, asymmetric
  editorial sections and a textured/disintegrating lower edge.
- The site presents a commercial kit. A copy of its public marketing frontend
  is not the underlying private repository or purchased product.

Raw HTML, browser snapshots, viewport captures and observed resource/link lists
are saved outside git under:

`C:\Users\Eros\Negent Mind\templates\research-2026-11-17\`

The files have the prefix `nm3-9f8d6c21-contentarchitecture-`.
The capture inventory is `nm3-9f8d6c21-inventario.md`.

Limitations:

- A full-page screenshot failed; top, middle and lower viewport captures exist.
- The resource list describes one observed browser traversal, not a complete
  dependency closure or every responsive variant.
- No recursive mirror, running local template, backend, checkout or private
  kit source was created by that acquisition.
- A redistribution/reuse license for the site's implementation has not been
  verified.

Feasibility: a local reference of the public frontend is possible in principle,
but "download everything and work locally without problems" is not established.
It requires downloading and rewriting dependencies, handling Next routing and
server requests, excluding real submissions/payment flows, and testing the
result. Do not present raw captured HTML as a functioning offline clone.

For Negent Mind, borrow the compositional principle: silver and carbon surfaces
can coexist in one theme. Make original dithered transitions; do not introduce
an unrelated matrix/code aesthetic or copy the site's typography and identity.

## Making Software

Source: https://www.makingsoftware.com/

The initial request returned HTTP 429 with a Vercel Security Checkpoint. The
research stopped at that protection; no site illustration was extracted or
visually inspected. The exact response is preserved in the same research
folder with the prefix `nm3-9f8d6c21-makingsoftware-`.

The user's description of three-dimensional blueprint elements is a design
input, not evidence that the site was successfully inspected. Build original
isometric geometric diagrams for now. A user-provided capture would support a
more specific comparison without claiming to have bypassed the checkpoint.

## Runtime And Library Choice

Keep Paper Shaders for the spectrum hero, GSAP/ScrollTrigger for bounded scroll
relationships and Motion for navigation/headings/interaction feedback.
Canvas 2D and SVG are sufficient for the requested new particle fields and
geometric 2.5D scenes; adding Three.js to every section is not required.
No FPS, bundle-size or performance improvement has been measured.

Context7 lookups for GSAP and Motion failed with `TypeError: fetch failed`.
Official documentation remains the fallback reference:

- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://motion.dev/docs/react-scroll-animations
- https://motion.dev/docs/react-use-scroll

The proposed original typeface is documented separately in
`brand/orbital/TYPEFACE-STUDY.md`. The current SVG is still the authoritative
logo; a complete font is not yet an implemented asset.
