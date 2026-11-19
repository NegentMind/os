# Orbital Motion And Graphic Corrections

> Implementation recipe. Preserve the approved identity and existing server.

**Goal:** Correct the user's rejected visual behavior, not declare the previous
presence of components equivalent to completing the requested design.

**Architecture:** Motion owns navigation and viewport text reveals. CSS owns the
first-paint hero entrance. GSAP owns section reveals, bounded decorative scroll
and the Paper shader's pointer easing. One engine per animated wrapper.

**Stack:** Existing Next/React, Motion, GSAP 3.15.1, Paper Shaders 0.0.82.
No new dependencies, servers, test commands, typecheck or build.

## Established Evidence

- At 1920x1080 the actual hero has left/right 80px, top/bottom 24px. The 1760px
  maximum width causes the unequal frame. This was not covered by the previous
  1440px geometry check.
- Wordmark computed blend mode is `normal`. The negative treatment is absent.
- Header uses `layout={canAnimate}`, changes max-width 1760px to 64rem at 72px,
  animates y separately, and changes background/border/blur immediately.
- Hero GSAP is dynamically imported and resets already-painted content to y18.
- AnimatedHeading uses visible -> offset keyframes, only 0.4s and <=0.1s stagger.
- ScrollScene rebuilds on the React identity of children. Selecting diagrams
  can tear down and recreate the same drawing timeline.
- Graphics overlay independently projected blueprint geometry, signals and
  planes; capabilities adds another particle field and three rails. Several
  overlapping coordinate systems explain the visual ambiguity.
- Paper boundaries are 24-48px dotted bands inside a silver card, not a real
  material transition. The bottom viewport effect adds black before blurring.
- Strand port 4211 refuses connections. Do not start it. Its saved runtime
  `script_main.8MTO-Tt7.mjs` contains progressive, masked backdrop layers with
  Gaussian blur and channel offsets. Reimplement the optical layering in
  monochrome; do not ship its Framer runtime.

## 1. Hero Frame, First Paint And Navigation

In `orbital.css` set the shared frame gap to 12px and 8px below 768px. Add
`--nm2-frame-bg: var(--nm2-bg)` at the root token declaration, so paper's local
role inversion does not change the outer carbon material.

Remove the 1760px maximum from `.nm2-hero`, `.nm2-header`,
`.nm2-header__bar`, `.nm2-page-hero` and `.nm2-footer`. Keep reading containers
bounded. Main hero height remains `100svh - 2*gap`, growing only when content
needs more room. Check 1920x1080, 1440x900, 390x844 and 1024x600.

Replace `hero-entrance.tsx` with this server component:

```tsx
import type { ReactNode } from "react";

/** First-paint CSS entrance avoids resetting content after a lazy import. */
export function HeroEntrance({ children }: { children: ReactNode }) {
  return <div className="nm2-hero__content">{children}</div>;
}
```

In `motion-provider.tsx` the dataset effect must not write a provisional "off"
while `reduced === null`. GPU/canvas still use conservative `canAnimate`.
Use the following body and dependencies:

```tsx
useEffect(() => {
  if (reduced === null) return;
  document.documentElement.dataset.motion = value.canAnimate ? "on" : "off";
  return () => {
    delete document.documentElement.dataset.motion;
  };
}, [reduced, value.canAnimate]);
```

Keep the stable MotionConfig `reducedMotion="user"` and current pause semantics.
Actual CSS media queries protect the entrance before hydration.

In `orbital-hero.css`, remove `z-index:1` from `.nm2-hero__content`; it must not
isolate the wordmark from the shader. Animate individual intro nodes, never
the entire content parent. Put difference blending on the signature wrapper:

```css
.nm2-hero__signature { mix-blend-mode: difference; }
.nm2-hero__wordmark { color: rgb(255 255 255); }
@media (prefers-reduced-motion: no-preference) {
  .nm2-hero__intro > [data-hero-reveal],
  .nm2-page-hero__content {
    animation: nm2-hero-arrive 1100ms cubic-bezier(.22,1,.36,1) both;
  }
  .nm2-hero__description { animation-delay: 100ms; }
  .nm2-hero__actions { animation-delay: 180ms; }
  .nm2-hero__signature {
    animation: nm2-signature-arrive 1400ms ease-out both;
  }
}
@keyframes nm2-hero-arrive {
  from { opacity: .66; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes nm2-signature-arrive {
  from { opacity: .75; }
  to { opacity: 1; }
}
```

White is the technical inversion operand, not a new accent. Keep the SVG paths,
reading scrim, spectrum and actual semantic text. No hidden initial content.

Header: remove `layout={canAnimate}` from the bar. Do not shrink its width on
scroll; it retains the hero's frame. Retain the native Sheet and focus behavior.
Use Motion only for y, with floating target -4, duration .6 and ease
`[.22,1,.36,1]`. CSS smoothly interpolates background, border and backdrop:

```css
.nm2-header__bar {
  backdrop-filter: blur(0px);
  transition: background-color 600ms ease, border-color 600ms ease,
    backdrop-filter 600ms ease, box-shadow 600ms ease;
}
.nm2-header__bar[data-floating="true"] {
  background: color-mix(in srgb, var(--nm2-surface) 94%, transparent);
  border-color: color-mix(in srgb, var(--nm2-structure) 45%, transparent);
  backdrop-filter: blur(16px);
}
```

Do not introduce a layout animation on its text or buttons. Keep the existing
active-link pill separate. Align desktop header padding to the hero's
`clamp(32px,4.5vw,72px)` and mobile to 24px.

## 2. Text And Scroll

Replace keyframe-based AnimatedHeading with scoped Motion `useAnimate`,
`useInView` and `stagger`. Preserve its existing interface/effect names and
natural text wrapping. SSR renders the whole readable title.

Exact lifecycle:

```tsx
const [scope, animate] = useAnimate<HTMLSpanElement>();
const inView = useInView(scope, { once: true, amount: .2 });
const prepared = useRef(false);
const played = useRef(false);
const { canAnimate } = useSiteMotion();
useEffect(() => {
  const element = scope.current;
  if (!element) return;
  if (!canAnimate) {
    animate(".nm2-animated-heading__word", { opacity: 1, y: 0 }, { duration: 0 });
    prepared.current = false;
    return;
  }
  if (played.current) return;
  const rect = element.getBoundingClientRect();
  if (!prepared.current) {
    // Prepare only outside the viewport; never knock already-visible text down.
    if (rect.top < window.innerHeight) {
      played.current = true;
      return;
    }
    animate(".nm2-animated-heading__word",
      { opacity: .2, y: effect === "trace" ? "85%" : "50%" }, { duration: 0 });
    prepared.current = true;
  }
  if (!inView) return;
  played.current = true;
  const count = element.querySelectorAll(".nm2-animated-heading__word").length;
  const controls = animate(".nm2-animated-heading__word", { opacity: 1, y: 0 }, {
    duration: effect === "focus" ? 1 : .85,
    delay: stagger(Math.min(.055, .35 / Math.max(1, count - 1))),
    ease: [.22, 1, .36, 1],
  });
  return () => { controls.stop(); };
}, [animate, canAnimate, effect, inView, scope]);
```

Render split words using plain span wrappers `.nm2-animated-heading__mask`
and `.nm2-animated-heading__word`, keep whitespace strings unchanged.
The trace mask has `overflow:clip`; all words are inline-block. Do not key
content by pause state. No blanket opacity zero. On pause restore readable
defaults. No character scrambling or blur of text during reading.

ScrollScene keeps its interface. Remove `children` from effect dependencies:
create one context per mounted scene / motion preference, not every selection.
Keep closest-scene filtering.

- Decor paths: prepare/trace only if the scene is initially below the viewport.
  One timeline with start `"top 90%"`, end `"center 55%"`, scrub .8.
  Draw only explicitly marked connectors, not every construction line.
- Decor float: animate `.to(wrappers,{y:-12,...})` from the natural y0, with
  start `"top bottom"`, end `"bottom top"`, scrub .8. No initial y18 reset.
- Reading: select `[data-scroll-reveal]` owned by this scene. For initially
  offscreen nodes use y14/opacity .35 to y0/opacity1, duration .9,
  ease `"power2.out"`, ScrollTrigger start `"top 88%"`, once true.
  Already-visible nodes stay as-is. Never scrub body text to readability.
- Revert the context on cleanup, including partial import errors.

`Section` replaces its inner div with
`<ScrollScene className="nm2-container">{children}</ScrollScene>`.
Same DOM class/layout, separate ownership from nested art scenes.
Mark the SectionHeading description `data-scroll-reveal`, and the existing
home workbench-copy, scope-ledger, system-reading and evidence-entry native
elements likewise. Capability articles each get that marker. Do not apply it
to controls that themselves animate with Motion.

## 3. Clean Semantic Graphics

Replace the crowded BlueprintScene implementation, preserving `variant` and
`className` and adding:

```tsx
type BlueprintSceneProps = {
  variant: "system" | "memory" | "scope" | "capabilities" | "evidence";
  className?: string;
  labels?: readonly string[];
  selected?: number;
  expanded?: boolean;
};
```

One coordinate system and one geometry per story. No ground-plane hatching,
ambient orbit, pointer tilt or drifting layers on explanatory diagrams.
Use a native HTML label layer over SVG connectors: labels remain >=13px on
mobile instead of becoming tiny scaled SVG text.

Exact composition:

```tsx
<div className={`nm2-blueprint nm2-blueprint--${variant} ${className}`}
     data-expanded={expanded || undefined} data-float="" aria-hidden="true">
  <svg className="nm2-blueprint__svg" viewBox="0 0 640 420"
       preserveAspectRatio="none" fill="none">
    {/* system: four center-to-center spokes, behind solid nodes */}
    {/* other non-scope variants: two short left-to-right connector paths */}
  </svg>
  <div className="nm2-blueprint__nodes">
    {Array.from({ length: variant === "system" ? 5 : 3 }, (_, index) => (
      <div key={index} className={`nm2-blueprint__node-card nm2-blueprint__node-card--${index}`}
           data-selected={selected === index || undefined}>
        <span className="nm2-blueprint__node-index">{String(index + 1).padStart(2, "0")}</span>
        {labels?.[index] ? <span>{labels[index]}</span> : null}
      </div>
    ))}
  </div>
</div>
```

System node centers: 0=(50%,50%), 1=(18%,16%), 2=(82%,16%),
3=(82%,84%), 4=(18%,84%). Width 28%, centered at these positions.
All other non-scope variants: centers 17%,50%,83% across, y50%, width26%.
Node min-height64px, padding8px, radius12px, solid semantic surface fill,
line border and tiny neutral 4px/5px depth shadow. Use explicit CSS classes for
positions, not layout style objects. Text >=13px and wraps naturally.
Selected: action fill/on-action text, not a different-sized node.
Index is small muted technical annotation, no invented values.
Use existing lucide-react icons as the primary node glyph, 20px and hidden
from assistive tech: system `[BrainCircuit, Database, ScanEye, Wrench,
ShieldCheck]`, memory `[ArrowDownToLine, Database, Layers]`, evidence
`[FileCode2, BookOpen, MessagesSquare]`. Import only these named icons.
Do not turn the illustration into a second clickable control set.
System connectors `M320 210L115.2 67.2`, `M320 210L524.8 67.2`,
`M320 210L524.8 352.8`, `M320 210L115.2 352.8`.
Flow connectors `M192 210H230`, `M403.2 210H441`. Mark only these `data-draw`.
No text inside SVG. Node backgrounds cover the connectors below them.

Scope is the exception: one original exploded-sheet study with three clean
parallelograms, no HTML nodes or second geometry. Use
`M170 160L400 110L470 260L240 310Z` three times, stroke semantic line,
solid semantic surface, no background construction. Base offsets y=-18/0/18;
expanded offsets y=-58/0/58, x=-28/0/28. CSS transform transitions .7s, no
continuous drift or tilt. This remains a visual study, not product claims.

Call sites:
- SystemStory: one BlueprintScene with `labels={copy.items.map(i=>i.label)}`
  and `selected={selected}`. Remove the separate signals SVG.
- MemoryDemo: `labels={steps.map(i=>i.title)}` / selected; remove layers SVG.
- EvidenceWorkbench: `labels={entries.map(i=>i.label)}` / selected; remove
  separate signals SVG.
- CapabilityStory: `variant="memory" labels={copy.diagram}`; remove its
  particle field, three rails and double data-float wrapper. Keep localized
  reading copy/statuses and controls.
- ScopeStudy: pass `expanded={exploded}`; remove the separate planes SVG.
- PageHero/development gallery remain compatible without labels: render one
  clean decorative solid instead of empty numbered cards. Memory is one
  cylinder (three ellipses and two verticals, solid semantic surface).
  System/capabilities are one cube with three solid faces:
  top `M320 100L460 180L320 260L180 180Z`,
  left `M180 180V290L320 370V260Z`,
  right `M460 180V290L320 370V260Z`.
  Evidence uses the same clean three-sheet study as scope. No hatching,
  wireframe ground, captions in English, or overlaid construction elements.
- HolonExplorer retains its nine labelled native controls and statuses.

Keep the current FieldCanvas implementation for actual section backgrounds.
Only remove it where it competes with a diagram's explanation. Remove now-dead
overlay/tilt/construction CSS, do not pile new rules after old conflicting ones.

## 4. Actual Boundaries And Viewport Edge

Replace the dotted paper-section pseudo-elements. Make them real material
gradients into the surrounding carbon, inside the existing rounded frame:

```css
.nm2-home .nm2-section--paper::before,
.nm2-home .nm2-section--paper::after {
  content:""; position:absolute; inset-inline:0; z-index:0;
  block-size:clamp(64px,6vw,112px); pointer-events:none;
  background:linear-gradient(180deg,var(--nm2-frame-bg),
    color-mix(in srgb,var(--nm2-frame-bg) 62%,transparent) 28%,transparent);
}
.nm2-home .nm2-section--paper::before { inset-block-start:0; }
.nm2-home .nm2-section--paper::after { inset-block-end:0; transform:rotate(180deg); }
```

Delete old radial dots, background-size and mask-image declarations. Section
content must be above these, with >=96px top/bottom reading clearance on
desktop and >=72px on mobile. Do not let the gradient muddy text.
This pass intentionally favors an actual clean gradient over another
decorative "Matrix" dotted border.

ViewportFade is a fixed optical layer, not a section boundary:
five spans, 24px high at the bottom, pointer-events none, z-index40.
No black background/tint. Each absolute layer covers the strip with blur
1,2,4,8,16px respectively; masks fade top->bottom using
`linear-gradient(to bottom,transparent START,black END)`:
0%/30%, 15%/50%, 35%/70%, 55%/85%, 72%/100%.
Thus text ~24px above the bottom is fully sharp and strongest blur is at the
edge. Include -webkit-backdrop-filter and -webkit-mask-image.
Fallback without backdrop support is transparent, not a black stripe.
Remove the blanket `body:has(:focus-visible)` hide rule for ViewportFade;
retain that rule for pointer feedback only. Give focused elements bottom
scroll clearance of >=40px, and keep the footer's last control above the strip.
Keep pointer-events none and remove the effect in forced-colors mode.

## 5. Shader Interaction

Lead owns the canonical live speed update 0.26 -> 0.32 and the corresponding
manifest/capture HTML metadata. Do not regenerate any frozen raster/exports.

Add a GSAP-driven pointer effect to HeroWarp, after its initializer effect,
only when `status==="ready" && animate && !capture` and fine hover matches.
Attach to `.nm2-hero`, never overlay a hit target.

```tsx
const point = { x: HERO_ART.params.offsetX, y: HERO_ART.params.offsetY };
const apply = () => {
  if (!document.hidden) mount.current?.setUniforms({
    u_offsetX: point.x, u_offsetY: point.y,
  });
};
const tween = gsap.to(point, {
  x: point.x, y: point.y, duration: .9, ease: "power2.out",
  paused: true, onUpdate: apply,
});
const steer = (x: number, y: number) => {
  tween.vars.x = x; tween.vars.y = y;
  tween.invalidate().restart();
};
```

Create that tween inside gsap.context. Pointer move normalizes x/y to [-1,1],
clamps them and adds at most .03 to each canonical offset. Ignore touch.
Pointer leave/cancel steers back to base. One reusable tween, no tween per
event, React state updates, manual RAF loop or cursor replacement.
On cleanup detach listeners and kill the tween/context without resetting the
live shader's frozen frame. Do not initialize another WebGL context. Pause,
hidden/offscreen behavior and context-loss fallback stay intact.

## Verification And Commit

Use only the existing localhost:3000 server. Browser captures are permitted;
no npm scripts, tsc, tests, build, dev startup or server restart.
Use absolute screenshot/video filenames, do not overwrite prior evidence.

Capture an actual short scrolling browser recording, not only static shots.
Check header threshold both directions, text reveals and graphics selections.
Check desktop1920/1440 and mobile390, preserve Escape/focus and locale paths.
Check reduced session with its real Chromium preference, not a fake matchMedia.
Check top frame geometry, actual difference blend and shader mouse response,
and blur of the same text at the bottom versus after scrolling 24px.

No claim of FPS, WCAG conformance or completed user acceptance.
Lead reviews all diffs and captures, then makes a local Conventional Commit.
Leave unrelated globals.css/template-previews.md unchanged and unstaged.
Update only necessary operational docs to the new engine ownership after
implementation; mark subjective visual acceptance as awaiting the user.
