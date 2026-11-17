# Orbital Request Coverage And Corrective Acceptance

This is a technical worklist, not a production readiness certificate.
The original numbering is preserved, including the missing item 5.

## Baseline

Baseline: commit `c10d545`, followed by the user's explicit rejection of the
motion quality, graphic clarity, material transitions and hero frame.
The earlier existence of components was incorrectly treated as sufficient
evidence of completion. Static screenshots did not establish scroll smoothness.

The table describes the state **when the corrective feedback arrived**.
It does not claim that a subsequent code change has passed visual review.

| Item | Baseline State | Required Closure Evidence |
| --- | --- | --- |
| 1 | Partial. Hero fits the reviewed 1440/390 viewports and has no local pause. The larger desktop frame is unequal, the negative wordmark is missing, and the user requests more speed. | Small equal frame on all four sides at 1920/1440/390/1024; complete wordmark; native motion and poster fallback; no local pause. |
| 2 | Implemented, user acceptance not established. Footer has an original monochrome field and no giant repeated wordmark. | Inspect its actual appearance and motion after the corrective integration; retain readable controls and content. |
| 3 | Rejected. Header is initially transparent and becomes floating, but FLIP resizing and immediate paint changes do not meet the requested smoothness. | Observe crossing the threshold in both directions; stable text/button dimensions, smoothly separated surface, no snapping. |
| 4 | Rejected in quality. Text animation exists but is too slight and can reset already-visible text to an offset. | Clearly perceptible, readable word reveals at section entry, without a visible initial jump or unreadable paused state. |
| 6 | Partial. Interactive model/capability controls exist, but overlapping diagrams do not explain the text clearly. | A single labelled model/capability diagram whose selection visibly maps to the explanatory paragraph. |
| 7 | Partial. Active/incubation project presentation, memory stages and an exploratory Scopegrain study exist. The motion and graphics were not accepted. | Clear graphics for each project, stable native controls, bounded scroll choreography and honest statuses. |
| 8 | Partial. The capability section has a field, blueprint and rails, but their combination is visually ambiguous. | One legible diagram of context -> persistent memory -> another session; clear separation between existing work and vision. |
| 9 | Partial. Evidence selector and real repository/README/Discussions links exist, but the graphic treatment is unclear. | Three understandable evidence channels, clean selection response and readable section entry. |
| 10 | Implemented, visual acceptance pending. Definition, usage, nine native holon controls and vision labels exist. | Preserve the definition and long-term-status boundaries; verify selection, scroll and mobile readability during integration. |
| 11 | Implemented, appearance under revision. Interior heroes use wave/network/memory/orbit fields. | Inspect representative interior heroes after simplifying decorative geometry; retain distinct patterns and readable text. |
| 12 | Research completed; no font released. Orbital remains original SVG lettering with a typeface feasibility study. | Do not call it a full font or imply an OTF/TTF/WOFF2 exists. Alphabet completion, metrics, spacing, rights and proofing remain future font work. |
| 13 | Implemented, visual acceptance pending. Primary/secondary buttons have neutral material edges. | Verify visible normal/hover/focus states on both carbon and paper; preserve native links and buttons. |
| 14 | Partial. Decorative pointer feedback and scene tilt existed; the hero shader was not pointer-reactive. | Bounded shader offsets, no moving labels or blocked controls, no interaction on coarse/reduced/paused inputs. |
| 15 | Rejected in quality. A shallow fixed blur exists, but its black tint and weak layering do not reproduce the intended optical behavior. | Fixed transparent backdrop treatment: bottom text visibly blurred and fully sharp after moving about 24px upward; no dark stripe or intercepted clicks. |
| 16 | Implemented, user acceptance pending. Home has asymmetric editorial, project, diagram and evidence compositions. | Preserve these varied compositions and bounded reading measures; do not replace everything with centered equal cards. |
| 17 | Implemented as original Canvas 2D fields, not an identical Strand effect. Visual equivalence was not established. | Review subdued moving fields where appropriate; do not superimpose them on explanatory diagrams merely to add activity. |
| 18 | Reimplemented, not literally extracted. Footer uses the original network field; Strand's footer code/runtime was not transplanted. | Clearly describe this as an adaptation. Do not claim an exact extraction or match that has not been demonstrated. |
| 19 | Rejected in quality. Hero entrance exists but can reset already-painted content when GSAP loads. | First-paint entrance without a delayed position reset, negative wordmark treatment, reduced-motion fallback and no blocking loader. |
| 20 | Rejected in quality. Fixed paper/carbon sections exist; the joins are dotted strips, not coherent material transitions. | Actual monochrome carbon-to-paper and paper-to-carbon transitions, no dirty dotted border and no gradient across reading text. |
| 21 | Not delivered as a complete local clone. The public Content Architecture reference was inspected; its private kit was not downloaded. | Do not imply a complete offline copy exists. Any later copying work needs separate technical and rights verification. |
| 22 | Original isometric SVG studies were built; Making Software itself remained access-protected. | Keep original geometry and make it understandable. Do not claim access to, extraction of, or exact reproduction of protected illustrations. |

## Grounded Findings

Observed in the live browser at 1920x1080 before correction:

- Hero frame: left/right 80px, top/bottom 24px, height 1032px.
- Hero maximum width: 1760px.
- Wordmark blend mode: `normal`.
- Bottom effect: 32px strip, three blur layers, and a separate black gradient.
- Motion state: `on`, not an OS-reduced-motion session.

Code findings:

- The header's max-width switches at 72px while Motion FLIP scales its box.
  Background, border and blur have no corresponding paint transition.
- The hero's lazy GSAP initializer applies y18 to already-visible content.
- Heading entry begins with an offset keyframe even though the title was
  rendered at its natural position.
- ScrollScene depends on `children` identity and can recreate drawing effects
  on unrelated selection renders.
- Several stories superimpose independently projected signals, sheets,
  blueprint constructions and particle fields.

These are established implementation conditions. Their contribution to
perceived motion quality is a diagnosis to verify with actual moving captures,
not a measured performance result.

## Corrective Design

Implementation recipe:
[Orbital Motion And Graphic Corrections](plans/2026-11-17-orbital-corrections.md).

- Small fluid frame rather than a fixed maximum-width background.
- Stable-width floating header; no scaling of navigation text.
- First-paint CSS entrance; Motion for readable viewport-triggered titles.
- GSAP for bounded scroll and pointer easing, with stable scene lifecycles.
- One semantic diagram per story, with native-size labels and existing Lucide
  icons; simplified original solids for decorative hero art.
- Genuine material gradients and a separate transparent optical viewport edge.
- No new dependencies or change to the approved carbon/silver/spectrum identity.

## Verification Boundary

No test suite, typecheck, build or server startup is authorized for the agent.
The user's existing localhost:3000 server is the only application server used.
The Strand preview at localhost:4211 refused connections during this round;
its saved source can be read, but it must not be silently started.

Required browser evidence includes actual scrolling, not just stills; menu
Escape/focus behavior; persistent selections during pause/resume; and the real
Chromium reduced-motion setting. Keep absolute, non-overwriting artifact paths.

Technical checks can establish layout, event behavior and policy compliance.
They do **not** substitute for the user's visual acceptance, a complete WCAG
audit, measured FPS/performance or a production build.

## Corrective Review

The corrective source diff and new browser captures have been reviewed.
Technical observations are not a substitute for the user's visual acceptance.

- Current browser readout at 1440x900: four frame gaps are 12px; wordmark color
  is `rgb(255,255,255)`, signature blend is `difference`, and the content parent
  has z-index `auto`. The 1920x1080 layout capture also has a 12px frame.
- Hero entry no longer depends on a delayed GSAP import. Header width no
  longer changes at the floating threshold. Title preparation happens only
  offscreen, not after text has already become visible.
- Semantic diagrams have one coordinate system, native HTML labels and Lucide
  icons. A complete base connector remains visible while its accent traces.
  Mobile corner cards slightly extend beyond their art box, but the reviewed
  capture shows no clipping or caption overlap.
- A pointer-listener leak was found during review: the paused shader still
  received uniform updates. After explicit listener removal and non-reverting
  tween disposal, the same lead-authored probe reports
  `uniformsMutatedWhilePaused:false` in two pause/resume cycles.
- The optical effect was checked using the same paragraph line, not just the
  presence of CSS. At 1440x900 its line center moves from 889.875 to 865.875
  after scrolling 24px; the strip starts at y876. The paired captures show the
  line blurred inside the strip and sharp above it. The strip has five layers,
  a transparent background and no pointer hit target.
- The new continuous-scroll recording covers the floating threshold in both
  directions and entry into the system section. It is not an FPS measurement.
- The targeted browser round also exercised menu Escape/focus restoration,
  locale navigation, diagram selection, pause and real Chromium reduced motion.
  No typecheck, test suite, build or server startup was run.
- A temporary ffmpeg executable copy used for browser recording was removed
  from the user bin directory; the original Hermes tool remains unchanged.

Evidence is local and ignored by git:
`brand/specimens/out/orbital-correction-2026-11-17/`, relative to `os/`.
Key files: `lead-final-state.json`, `scroll-continuous.webm`,
`m-org-v2.png`, `sec-org-v2.png`, `lead-text-in-optical-strip.png`,
`lead-text-24px-clear.png` and `lead-optical-comparison.png`.
The earlier `geometry-1920.json` predates the final wordmark-color specificity
fix; use `lead-final-state.json` for the current computed blend/color.

## Pending

- User review of motion quality, graphic clarity and section transitions.
- User's manual `npm run typecheck` and `npm run build` outputs.
- The baseline limitations for the font and third-party references remain:
  no complete font, no literal Strand extraction, no complete local Content
  Architecture clone, and no claim of accessing protected Making Software art.
