# Orbital Organization Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the approved five-page bilingual organization website,
Orbital branding, native shader hero and reusable internal component layer.

**Architecture:** Keep Next App Router, server-rendered content and existing
locale prefixes. Build a new marketing CSS entry and namespaced `nm/v2`
components on the existing shadcn/Radix foundation; do not modify the unrelated
legacy CSS worktree diff. Preserve product/auth gates and published assets.

**Tech Stack:** Next 15, React 19, Tailwind 4, shadcn/Radix, Motion, GSAP and
`@paper-design/shaders-react@0.0.82` (Apache-2.0; React 18/19 peer range).

---

## Authority And Execution

The founder approved the five-page option and the update to Notion Brand.
That targeted Notion update has succeeded. It records approval and work in
progress, not deployment. Use [the approved design](../site-v2-design.md).

Work in the existing `main` worktree, as required by this workspace. Each
implementation area has exclusive file ownership. No push. No production
deploy. No edits to VantaDB, `.opencode`, frozen GitHub profile or existing
Remotion rendering tokens. Do not remove legacy files without approval.

The user runs test/build/start commands manually. Browser inspection of the
already running server is allowed. No automated `npm run` commands, direct
`tsc`, build scripts or substitute test gates. Dependency installation and
component generation are allowed; a single owner manages the lockfile.

## Shared Contracts

All new components live at `components/nm/v2/` with kebab-case filenames.
Preserve `lib/i18n` for legacy component types; new public copy lives at
`lib/content`. Import `Locale` as a type from `@/lib/i18n`.

Shared CSS variables: `--nm2-bg`, `--nm2-section`, `--nm2-surface`,
`--nm2-raised`, `--nm2-text`, `--nm2-muted`, `--nm2-line`,
`--nm2-structure`, `--nm2-action`, `--nm2-on-action`. Define corresponding
Tailwind/shadcn aliases rather than hand-coding colors in component markup.
Foundation also defines `--nm2-gutter`, `--nm2-container`,
`--nm2-radius-sm`, `--nm2-radius-card`, `--nm2-radius-hero`.

Shared art hues (not button/status colors):
`--nm2-spectrum-teal: #5BADA0`, `--nm2-spectrum-blue: #465DCF`,
`--nm2-spectrum-violet: #965CCB`, `--nm2-spectrum-rose: #DC5E89`,
`--nm2-spectrum-amber: #D9A45E`, `--nm2-spectrum-ice: #B7CDD7`.
The hero preset and section artwork use this same palette. Dark/silver
shading may be included in the shader; do not introduce arbitrary new hues.

Pages owner adds these external constants to `lib/site.ts` for the other
areas to consume: `DISCUSSIONS_URL`, `CONTRIBUTING_URL`,
`CODE_OF_CONDUCT_URL`, `SECURITY_URL`, `TRADEMARK_URL`, `SUPPORT_URL`,
`VANTADB_DOCS`. Governance documents are
`https://github.com/NegentMind/.github/blob/main/<NAME>.md`;
Discussions is `https://github.com/NegentMind/.github/discussions`;
VantaDB docs link to `${VANTADB_REPO}#readme`, not an invented docs host.

### Foundation-Owned Types: `lib/marketing-types.ts`

```ts
export type ProjectState = "active" | "incubation" | "vision";

export type NavCopy = {
  home: string;
  projects: string;
  about: string;
  contribute: string;
  github: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  skipToContent: string;
};

export type HeroCopy = {
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  note: string;
  pauseMotion: string;
  resumeMotion: string;
  reducedMotion: string;
};

export type FooterCopy = {
  statement: string;
  independence: string;
  resources: string;
  discussions: string;
  handbook: string;
  handbookPending: string;
  conduct: string;
  security: string;
  trademark: string;
  contactPending: string;
};
```

### Foundation Components

- `BrandMark({variant?: "wordmark" | "monogram", className?, decorative?})`:
  copy the exact Orbital vector geometry, with `currentColor` for the mark
  and closing dot; correct accessible naming or decorative hiding.
- `ActionLink({href, children, variant?: "primary" | "secondary" | "text",
  external?: boolean, className?})`: compose the existing shadcn Button.
- `Surface({children, tone?: "surface" | "raised" | "spectrum", className?})`.
- `Section({id?, children, className?})`: section spacing plus `.nm2-container`;
  do not force all sections to look like a card.
- `SectionHeading({title, description?, id?, as?: "h1" | "h2", className?})`.
- `StatusBadge({status: ProjectState, label: string})`.
- `ProjectCard({name, summary, status, statusLabel, href?, actionLabel?,
  featured?: boolean, headingLevel?: 2 | 3, children?, className?})`.
- `Faq({items: {question: string; answer: string}[]})`: accessible disclosure,
  meaningful content remains available; prefer native details for simplicity.
- `SiteHeader({lang: Locale, copy: NavCopy})`.
- `SiteFooter({lang: Locale, nav: NavCopy, copy: FooterCopy})`.
- `MotionProvider({children})` and `useSiteMotion()` returning
  `{paused, reducedMotion, canAnimate, togglePaused}`.
  `canAnimate` is false until the OS preference is known and when paused.

The header owns a focus-safe mobile menu, route-preserving locale switch
and meaningful navigation. Motion is confined to micro-interactions.
No loader, custom cursor, fake operational HUD or decorative clock.

### Pages-Owned Routing And Content

`lib/site-routes.ts` exports:

```ts
export type PageId = "home" | "projects" | "vantadb" | "about" | "contribute";
export const PUBLIC_PAGES: readonly PageId[];
export function hrefFor(lang: Locale, page: PageId): string;
```

Paths are home, `/projects`, `/projects/vantadb`, `/about`, `/contribute`,
all prefixed with the locale. `getSiteCopy(lang)` comes from
`lib/content/index.ts`; EN determines the ES shape. Copy includes `nav`,
`footer`, `hero: HeroCopy` and localized page metadata.

Root marketing layout imports only the new `app/orbital.css`, applies
`className="nm2-site"` to body and composes the provider, shared header,
`<main id="main-content">` around children, and shared footer. Every page
defines its own canonical and locale alternates through a shared helper.

Preserve root middleware and gated product routes. New `sitemap.ts` lists
the five public paths in both languages. Internal gallery and art routes
are excluded, noindex, and return 404 outside development.

### Hero-Owned Interface

`Hero({lang: Locale, copy: HeroCopy})` from `nm/v2/hero.tsx` is server-rendered.
It contains isolated client background/entrance leaves, not a client-only
page. `hero-background.tsx` also exports `HeroBackground({className?})`
for the internal gallery/art renderer.

The new hero must not import the old SilkHero. Primary action links to
Projects, secondary to Contribute. Use shared BrandMark/ActionLink and
`useSiteMotion`. Own CSS: `app/orbital-hero.css`.

Fixed opening copy:

EN title: "What a model doesn't come with."

ES title: "Lo que un modelo no trae de fábrica."

EN description: "Open-source infrastructure for AI agents. Persistent memory
today; perception, reasoning and verifiable action as our long-term direction."

ES description: "Infraestructura open source para agentes de IA. Memoria
persistente hoy; percepción, razonamiento y acción verificable como visión
de largo plazo."

## Task 1: Foundation And Internal Library

**Files:** `app/orbital.css`, `lib/fonts.ts`, `lib/marketing-types.ts`,
`components/nm/v2/` foundation files above, generated `components/ui/sheet.tsx`,
`package.json`, `package-lock.json`. This owner alone installs dependencies.

1. Preserve the existing `globals.css` diff; do not edit that file.
2. Install the pinned Paper React package and generate only the needed
   Sheet via shadcn CLI, without reinitializing or overwriting existing UI.
3. Use Outfit, DM Sans and JetBrains Mono through next/font.
4. Define named neutral/spectrum/spacing/radius/type tokens in the new CSS.
5. Import `orbital-hero.css` and `orbital-pages.css` from that entry.
6. Implement shared components and reduced-motion/pause coordination.
7. Keep styles for owned components in this entry; page and hero owners
   write their respective CSS files, never this one.

## Task 2: Hero And Coordinated Brand Assets

**Files:** `components/nm/v2/hero*.tsx`, `app/orbital-hero.css`,
`brand/orbital/`, `public/brand/`, `public/og.png`, `app/icon.svg`,
the development-only nested gallery `/design-system/art` route.

1. Use the maintained Warp shader, not the Framer snapshot/runtime.
   Select a coherent flowing/grainy composition; no stock mesh preset.
2. Use the neutral palette as the UI base and controlled art colors.
3. Implement a static fallback and a visible pause/resume control.
4. Keep the whole wordmark visible on small screens. No fixed clipping
   height tied to viewport width and no blend mode on functional text.
5. Add one bounded GSAP entrance/transition with complete cleanup,
   no initial content gate and no scroll hijack.
6. Freeze a hero texture for fallback, avatar and banner; export Orbital
   vector marks plus usable avatar, banner and 1200x630 social image.
   No publishing or edits to old Remotion/GitHub exports.

## Task 3: Five Pages, Content, SEO And Internal Gallery

**Files:** `app/(marketing)/[lang]/layout.tsx`, home and four page routes,
`app/(marketing)/[lang]/design-system/page.tsx`, `app/orbital-pages.css`,
`lib/content/`, `lib/site-routes.ts`, `lib/marketing-metadata.ts`,
`lib/site.ts`, `app/sitemap.ts`.

1. Implement the canonical route map and bilingual content.
2. Compose the five pages from the foundation and new Hero.
3. Keep VantaDB active, Scopegrain in incubation, and conceptual holons
   clearly labeled vision. Cardinal itself is not shipped.
4. Build useful diagrams/ledgers with actual explanatory content, not
   mock telemetry, made-up API calls or benchmark-like illustrations.
5. Use about principles/founder, project details and contribution paths
   to add substance rather than repeatedly restating the home.
6. Preserve meaningful old home anchors where practical.
7. Implement the development-only component gallery and localized metadata.
8. Centralize external URLs in `lib/site.ts`; the VantaDB repository stays
   `https://github.com/ness-e/Vantadb`, docs can link to its README.
9. Handbook/contact remain governed by existing publication flags; do not
   expose private Notion URLs or promise a working inbox.

## Task 4: Review, Documentation And User-Run Gates

Lead reviews every full implementation diff before landing/committing.
Inspect all requested viewports/routes in a bounded shared browser pass,
then batch corrections rather than repetitive one-off handoffs.

Synchronize README, ARCHITECTURE, DESIGN_SYSTEM, PRODUCT, DESIGN and its
machine-readable sidecar/surface brief with what was actually built.
Record the V1 compatibility boundary in root AGENTS without altering the
frozen media pipeline.

Commands for the user, from `os/web`:

```powershell
npm run typecheck
npm run build
```

Expected: both exit 0. Until results are provided, report these gates as
pending. Do not fabricate a pass. Commit approved scoped changes locally
with Conventional Commits, exclude the unrelated globals.css diff, no push.
