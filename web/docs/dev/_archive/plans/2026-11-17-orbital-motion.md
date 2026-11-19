# Orbital Spatial Storytelling Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore expressive, explanatory motion and spatial variety without losing the organization-first content, bilingual routes or progressive rendering.

**Architecture:** Keep Next.js Server Components, the existing Orbital/shadcn layer and the current motion provider. Add reusable Canvas 2D particle fields and geometric SVG scenes; use GSAP for bounded scroll relationships and Motion for navigation, headings and interaction feedback. Do not import Framer template runtimes, add a second component system or make canvas essential to comprehension.

**Tech Stack:** Existing Next.js 15, React 19, TypeScript, Tailwind 4, Radix/shadcn, Motion, GSAP/ScrollTrigger and Paper Shaders.

## Settled Direction

- User explicitly chose carbon/silver with occasional spectrum, not grayscale-only.
- Keep the spectrum hero; increase its configured speed from 0.18 to 0.26.
- One composed theme: dark backgrounds alternate with two silver reading surfaces; no theme switch.
- Keep Outfit, DM Sans and original Orbital SVG lettering. A complete font is a separate investigated artifact, not an existing asset.
- Build original geometric/particle treatments, informed by references; do not copy unlicensed template implementation into the organization website.
- VantaDB remains the only active flagship; Scopegrain remains incubation. All nine holons are vision; Cardinal is not VantaDB.
- Native scroll, no forced scroll tracks, no scroll hijacking, no blocking loader.

## Existing Implementation Checked

The current home, four inner pages, header/footer, motion provider, hero CSS,
shader preset and preserved V1 components were read before this plan.
V1 `HolonGrid`, `sculpture.ts`, `HalftoneCanvas` and other components still exist;
they were removed from the composition, not deleted.

The hero currently combines a minimum viewport height with an unbounded content
stack and large signature padding. The urgent first edit removes that large
padding, composes the desktop introduction across two columns, bounds the
signature height, and removes the hero-local pause UI. These are code changes,
not a claim that visual gates have passed.

## Shared Interfaces

New art components under `components/nm/v2/`:

```tsx
export type FieldVariant = "wave" | "orbit" | "network" | "memory";
export type BlueprintVariant =
  | "system" | "memory" | "scope" | "capabilities" | "evidence";

export function FieldCanvas(props: {
  variant: FieldVariant;
  className?: string;
  interactive?: boolean;
}): React.ReactNode;

export function BlueprintScene(props: {
  variant: BlueprintVariant;
  className?: string;
}): React.ReactNode;

export function ScrollScene(props: {
  children: React.ReactNode;
  className?: string;
}): React.ReactNode;
```

`FieldCanvas` is decorative, transparent, silver/currentColor, with an immediate
SVG fallback. At most 1,400 points desktop / 600 mobile and DPR capped at 1.5;
30fps is a scheduling target, not a measured performance claim. Wave geometry
uses a layered sine surface; memory uses projected stacked planes; network uses
point rows with a bounded pointer highlight; orbit uses elliptical particle
paths. No Three.js dependency is needed for these treatments.

`BlueprintScene` uses exact geometric linework, not a stock icon in a card:
central model with surrounding modules, exploded memory layers, framing planes,
capability orbits, and connected evidence artifacts. It carries no claims,
fake telemetry or product UI. Pointer tilt is bounded and disabled for reduced
motion/coarse pointers. Native controls in the composing story expose state.

`ScrollScene` creates a scoped GSAP context and ScrollTriggers only while
animation is allowed. `[data-draw]` marks decorative SVG geometry for path
tracing; `[data-float]` marks a wrapper for bounded scroll displacement. Never
target the title or a descendant whose transform CSS/Motion already owns.
Clean up with `ctx.revert()`, including async-disposal guards and import failure.

Shared shell:

```tsx
export function PageHero(props: {
  title: string;
  description: string;
  variant: FieldVariant;
  children?: React.ReactNode;
}): React.ReactNode;

// SectionHeading gains only an optional presentation parameter.
type HeadingEffect = "assemble" | "focus" | "trace";
// Existing props remain compatible; effect?: HeadingEffect.
```

New art CSS belongs in `app/orbital-scenes.css`; home story CSS in
`app/orbital-home.css`. Only the shell owner wires both imports in `orbital.css`.

## Shell And Hero

- One header DOM, transparent and visually inside the hero, same frame width.
- After 72px scroll, contract into a floating bar and move upward with Motion
  layout/transform; no duplicated navigation or focus order.
- Preserve controlled Radix Sheet, route/breakpoint close, locale links and
  current-page semantics.
- Shared frame gap `clamp(12px, 1.66vw, 24px)`; hero and header use the same value.
- Desktop hero targets `calc(100svh - 2 * var(--nm2-frame-gap))`, with content
  allowed to grow on small screens/zoom rather than clipping. Reserve header
  space inside the hero, not as a separate band.
- Keep the urgent two-column introduction and height-bounded wordmark.
- Footer gets a restrained interactive network field, compact monogram, useful
  links and statement. Remove the giant duplicate wordmark.
- Global motion preference moves to the footer, using existing HeroCopy labels;
  preserve OS reduced motion, pausing when hidden/offscreen, and provider state.
- Buttons get silver material borders/highlights, not rainbow fills everywhere.
- A shallow, non-interactive bottom-viewport blur has CSS fallbacks, safe-area
  spacing and disappears while keyboard focus is visible.
- Pointer feedback retains the native cursor and is disabled on touch/reduced motion.

## Home Composition And Copy

1. Spectrum hero with coordinated entrance, not a new loading sequence.
2. Silver system statement: original heading retained; a model core connects to
   surrounding capabilities underneath it. Diagram labels are conceptual.
3. Dark project workbench: VantaDB memory stages and a separate framing study for
   Scopegrain. Each has real state/interaction, not decorative identical cards.
4. Dark capability field: memory today versus broader vision; scroll connects
   geometry without suggesting that the future system is installed.
5. Holon explorer: definition, the role in our design language, nine selectable
   named pieces and persistent vision labels. Show that autonomous function and
   membership in a larger system are the concept, not a claim of consciousness.
6. Silver evidence workbench: code, written context and conversation, linking to
   actual repository/README/Discussions. No fabricated terminal or benchmark.
7. FAQ and a compact contribution invitation; footer stays distinct.

Copy changes approved by the user's request to improve these sections:

| Key | ES | EN |
|---|---|---|
| home.work.title | Memoria que persiste. Ideas que toman forma. | Memory that persists. Ideas taking shape. |
| home.capabilities.title | Una capacidad real. Un sistema por construir. | One working capability. A wider system to build. |
| home.method.title | Del código a una conversación concreta. | From source code to a concrete conversation. |
| home.method.description | Abre el repositorio, contrasta lo que hace y trae un caso que podamos reproducir. | Open the repository, examine what it does, and bring a case we can reproduce. |
| home.holons.title | Una pieza por sí misma. Parte de algo mayor. | A piece in its own right. Part of something larger. |

New text stays in EN/ES dictionaries; Spanish keeps the English shape.
Detailed holon roles must stay within established sources. Verified local roles:
Cardinal = context/working memory; Iris = perception/ingestion; Meta =
verification/metacognition; Execute = tool execution; Sage = correction feedback.
Other names can appear as vision without inventing implementation details.

## Inner Pages

Replace only each opening composition with PageHero; preserve real content,
actions, metadata and bilingual behavior:

- Projects: network field, distinct project grouping.
- VantaDB: memory planes, embedded/local-first story.
- Laboratory: orbital field, method and larger context.
- Contribute: wave field, individual inputs joining shared work.

## Reference And Typeface Boundaries

Content Architecture's public page and resource list were captured outside the
repo under `templates/research-2026-11-17/`. The commercial kit is not publicly
downloadable source. A local public-front-end reference must clearly exclude
checkout, account/backend functions and protected materials, and document any
remaining network dependency. Do not promise a complete offline application.

Making Software returned a 429 Vercel checkpoint. No claim of full inspection
or extracted artwork; use original blueprint geometry unless evidence arrives.

Orbital currently contains seven distinct uppercase letter designs and a dot.
A typeface needs a designed character set, expanded outlines, optical spacing,
kerning, accents, metrics, font naming, licensing, source masters and exports.
Investigate a display family first; do not replace readable body/UI text with
the logo geometry or call a partial wordmark a complete font.

## Verification And Failure Modes

- Rendering/content must survive missing JS, failed WebGL and rejected dynamic imports.
- No duplicate header focus stops, stale Sheet state or nonfunctional project links.
- Reduced motion/manual pause must stop all decorative loops, not only the shader.
- Observers, RAFs, GSAP contexts, canvas and pointer listeners must clean up.
- Avoid multiple active expensive scenes; stop hidden/offscreen work.
- Native controls work with keyboard and touch; state is not color-only.
- Inverse surfaces override semantic roles together; check body/focus contrast.
- Inspect desktop and mobile in one bounded review, fix issues in one batch,
  then confirm once. Browser access to the existing server is permitted.
- User alone runs `npm run typecheck` and, after stopping dev, `npm run build`.
  No agent-run test/build/server commands or equivalent.
- Local conventional commits follow satisfactory validation; no push.
