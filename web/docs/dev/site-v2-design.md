---
title: "Negent Mind: Orbital, carbon and silver"
kind: design
status: approved
---

# Website V2: Direction And Research

Status: direction and five-page scope approved by the founder.
Recorded in Notion Brand. Implementation is in progress.
This is a design record, not a claim that the redesign is implemented.

## Brief

An organization-first, bilingual site for developers building AI agents.
Negent Mind builds capabilities around models; it is not a model provider.
The new world combines an original geometric Orbital wordmark, rounded
editorial typography, carbon/silver surfaces and a controlled animated
spectrum inspired by the Mondragon2 hero.

The user requests rounded containers, a reusable internal component library,
Motion for interactions, GSAP for coordinated transitions, and removal of the
initial blocking loader. Neither VantaDB nor published GitHub assets are
implementation targets.

## Verified Current State

- Next.js 15.5, React 19.1, Tailwind 4, shadcn/Radix, Motion and GSAP are
  already installed. Do not introduce a second UI foundation.
- Public marketing currently consists of `/en` and `/es`, with a long home
  combining multiple reference-template visual systems.
- `components/ui` contains Button, Card, Input and Label.
- The hero contains bespoke GLSL, a loading overlay, a manager-style tile
  and product metrics. These do not communicate the organization clearly.
- App and login remain disabled by `APP_ENABLED`; preserve their gates.
- Site URLs and publication flags live in `lib/site.ts`.
- `PRODUCT.md`, `DESIGN.md`, `DESIGN_SYSTEM.md`, surface briefs and brand
  tokens still describe the preceding visual direction. Update the relevant
  contracts together after approval, not by adding CSS overrides indefinitely.
- A pre-existing line-ending-only change in `app/globals.css` is unrelated
  to this redesign and must not be reverted or silently committed.

## Product Truth And Sources

The following were read directly in Notion:

- [Identity and strategy](https://app.notion.com/p/41ad0445975681dbbd30d5ac6e431e7c):
  persistent memory, perception, action, reasoning and verification are the
  capability thesis; VantaDB is active, Scopegrain is incubation, the other
  holons are vision rather than shipped products.
- [Brand](https://app.notion.com/p/41ad044597568189abfcf919db4e520e):
  the page still declares Void/Bone/Pulse and Chakra Petch/Inter as V1.
  The present user request specifies a replacement direction. Do not claim
  that Notion or the published identity has already been migrated.
- [Public Handbook draft](https://app.notion.com/p/41ad0445975681858d05d822efcb56f5):
  independent lab, evidence before marketing, local-first, open-core,
  written collaboration. The Handbook is not yet a verified public link.
- [Website project](https://app.notion.com/p/41ad044597568042896ac671eeaa72ac):
  the next public deliverable includes a VantaDB page and Handbook link.
- The latest Scopegrain search results identify a public work-in-progress
  repository without a launch announcement; an older Handbook phrase
  saying not yet published must not be interpreted as a private repository.
  The project remains incubation, not a launched product.

Do not expose private revenue targets, internal roadmap dates, accounts,
legal/IP discussions, or the private architecture specifications.
Do not invent clients, testimonials, papers, benchmarks or adoption counts.

## Proposed Information Architecture

Keep English and Spanish route prefixes and localize all public content.
Use stable content slugs below both locale prefixes.

| Route | Purpose |
| --- | --- |
| `/[lang]` | Organization thesis, current work, capabilities and next action |
| `/[lang]/projects` | Honest portfolio with active/incubation/vision states |
| `/[lang]/projects/vantadb` | Flagship overview, use cases and verified repository/docs links |
| `/[lang]/about` | Purpose, working principles, founder and research direction |
| `/[lang]/contribute` | Contribution paths, Discussions, support, conduct and security |

An internal development-only design-system gallery demonstrates components,
variants, interaction states and tokens. It is not a public product page.
Do not add a blog, careers, pricing, newsletter, account flow or standalone
research publication archive without real content and operational support.

The home should be shorter and org-first:

1. A clearly stated thesis in the hero, original Orbital wordmark, and two
   meaningful actions: explore projects and contribute.
2. Current work, with VantaDB as the flagship and Scopegrain in incubation.
3. A capability map explicitly distinguishing built work from vision.
4. Working method and evidence, linked to real artifacts.
5. Principles, participation and a substantive footer.

Move implementation detail to the VantaDB page instead of making the entire
organization site look like a database product.

## Visual Contract

### Brand And Type

- Reuse the original SVG geometry from the approved Orbital specimen.
  The brand is vector lettering, independent from editorial fonts.
- Proposed editorial pairing: Outfit for headings and DM Sans for body.
  Both are available in the installed Next font API. Confirm visually
  before finalizing; do not use the Orbital paths for paragraph text.
- Keep JetBrains Mono only for code and actual technical identifiers.
- Use sentence case and comfortable reading widths rather than a page
  dominated by tracked uppercase and miniature labels.

### Neutrals

These are copied from the existing `plata` dark specimen, not new guesses:

| Role | Value |
| --- | --- |
| Background | `#000000` |
| Section | `#070809` |
| Surface | `#0E1013` |
| Raised | `#1C2026` |
| Text | `#F1F3F5` |
| Secondary text | `#ADB5C0` |
| Border | `#343B46` |
| Structural ink | `#A7B4C7` |
| Attention and primary action | `#E7EDF5` |
| Text on primary action | `#000000` |

The spectrum is expressive material, not a competing set of arbitrary
button colors. Carry selected hues from the hero into illustrations,
section details and project artwork. Keep body text and controls neutral.
Do not rely on color alone to distinguish project states.

### Shape And Rhythm

Define named radii for small controls, cards, large sections and pill
controls. Round surfaces intentionally, not every element with a universal
CSS selector. Use a single spacing scale and container system.

Vary composition: a large featured project, a compact project ledger,
an explanatory diagram and a quiet editorial passage can share tokens
without becoming identical cards.

### Hero And Assets

Replace manager/avatar/time/metrics filler with a clear organization title,
a short explanation and useful actions. Keep the full wordmark visible.
No loading gate, simulated progress or introductory interstitial.

Use an independently maintained shader implementation for the expressive
background, not the captured Framer HTML or its remote runtime. Similar
art direction does not establish identical shader behavior.

Use one frozen texture/preset as the source for a poster, avatar, banner
and social image. Keep a monochrome SVG mark for small sizes and accessible
navigation. Texture should not compromise the legibility of the mark.
Website assets can change locally; publishing GitHub branding remains
a separate authority action.

## Component And Motion Architecture

- Foundation: existing shadcn/Radix primitives and Tailwind tokens.
- Internal layer: BrandMark, Surface, Section, SectionHeading, ActionLink,
  StatusBadge, ProjectCard, ProjectLedger, SiteHeader and SiteFooter.
- Add only primitives actually needed, such as Accordion or a mobile Sheet.
  Preserve library primitives; customize through tokens and composition.
- Keep content/catalog data separate from presentation and type the ES
  dictionary against the EN shape.
- Build an internal gallery rather than adding Storybook or publishing
  a component registry before there is another consumer.
- Motion owns menu, accordion, hover/focus and small entrance interactions.
- GSAP owns bounded scroll choreography and section transitions.
  Never animate the same DOM properties with both engines.
- No forced multi-screen scroll tracks or scroll hijacking on mobile.
- Honor reduced motion, provide a pause control for ongoing decorative
  animation, and stop expensive work when hidden or off-screen.
- Content renders on the server and remains usable without a shader.

## Library Research

1. Keep [shadcn/ui](https://ui.shadcn.com/docs) and existing Radix primitives.
   A second theme/component system would increase inconsistency.
2. Keep [Motion](https://motion.dev/docs/react-accessibility) and
   [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).
   Their documented lifecycle/reduced-motion APIs avoid hand-written
   scroll and preference listeners.
3. Candidate: [Paper Shaders](https://github.com/paper-design/shaders).
   Its documented Warp/mesh components provide configurable color and
   distortion, render-loop management and visibility handling.
   The repository declares Apache-2.0. A trial must establish the visual
   result and fallback behavior before replacing the existing shader.
   No bundle-size or performance improvement has been measured yet.

Organization-content references, not visual templates to clone:

- [EleutherAI](https://eleuther.ai/): mission tied to actual tools and work.
- [Ink & Switch](https://www.inkandswitch.com/): distinction between
  research areas, published work and production software.

These larger organizations do not justify fabricating equivalent content
or sections for Negent Mind.

## Failure Modes And Verification

- WebGL unavailable or delayed: static poster and immediate readable copy.
- Animated background contrast: solid/controlled reading areas; verify
  actual foreground/background combinations, including focus states.
- ES text expansion and narrow viewports: no clipped wordmark, labels,
  navigation or horizontal page overflow.
- Motion disabled or JS absent: complete content and navigation remain.
- New routes: preserve locale switching, canonical/hreflang, sitemap,
  anchors and disabled application routes.
- Product status: active/incubation/vision never implied solely by color.
- Brand drift: update design documentation and reusable tokens together.

After implementation, inspect desktop and mobile in one bounded capture
pass and batch corrections. Typecheck/build/start commands are run by
the user unless separately authorized; do not claim they passed without
their output. Create focused local commits, never push implicitly.
