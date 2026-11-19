# Home Redesign Implementation Plan

**Goal:** Rebuild `/` so VantaDB (the only real product) is the protagonist, inside the approved "strand-structure + grafts" composition fused with the dossier world already fixed in DESIGN.md.

**Architecture:** Server Component page composing client islands (canvas fields, terminal, accordion). No new deps. Canvas 2D only (three.js not in deps). Reuse working components from the aborted impeccable rewrite.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind v4 `@theme` tokens, motion/react (micro), gsap+ScrollTrigger (scroll), JetBrains Mono marginalia.

**World law (from DESIGN.md):** dark-first Void/Bone, Pulse is the only accent, hairlines not shadows, chaos colors only inside fields, no cards (rows/hairlines), no serif, no blur/glass, mono marginalia, one motion moment per section, `prefers-reduced-motion` = static end state.

**Copy facts (verified against vantadb skill + repo):** Rust core, Python SDK, embedded/in-process, BM25+HNSW fused by RRF, MVCC, WAL+CRC32C, Fjall LSM, Apache-2.0, v0.5.0 Rust crate line. No benchmarks, no clients, no testimonials.

---

### Task 1: New components

**Files (create, all under `components/nm/`):**
- `LatticeField.tsx` — canvas 2D dot-grid: seeded noise displaces dots; pointer proximity + time resolve them into the lattice (provenance motif + EntropyHero concept). Chaos colors only on displaced dots. Static converged state under reduced motion.
- `TerminalDemo.tsx` — typed terminal loop (nice-squash/aion pattern): real vantadb Python session (`Client`, `put`, `search`, `get`), blinking cursor, reduced-motion = full text.
- `FeatureRail.tsx` — strand-style rail: sticky left mono index (01–04) + right rows; IntersectionObserver highlights active row. Items: EMBEDDED / HYBRID RETRIEVAL / MVCC / DURABLE.
- `Faq.tsx` — client accordion, state-based, motion height, chevron rotate. 5 honest items.

### Task 2: Rewrite `app/page.tsx`

Sections (numbered mono marginalia, hairline rows):
- **00 HERO:** FilmBackdrop + LatticeField; pill `APACHE-2.0 · RUST · LOCAL-FIRST`; stacked Chakra `ORDER / OUT OF / CHAOS.`; sub naming VantaDB as embedded memory engine; CTAs `Star on GitHub` (ness-e/Vantadb) + `See how it works` anchor; mono marginalia.
- **01 THE PROBLEM:** "Every session starts from zero." 3 hairline rows: markdown memory rots / hosted memory exfiltrates / process-local state dies.
- **02 MECHANISM:** DescentSection (AsciiField + instruments) reframed — "Noise in. Signal out."
- **03 VANTADB:** FeatureRail + TerminalDemo + repo CTA + spec counters (InstrumentCounter: `0` servers, `1` process, `Apache-2.0` license).
- **04 WHAT WE'RE NOT:** Pulse panel — not agent framework / not hosted SaaS / not generic vector DB.
- **05 COMPARISON:** hairline table vs CLAUDE.md / Mem0 / Zep / Letta (axes: embedded, local-first, transactional, hybrid).
- **06 ROADMAP:** six named systems (fix `afen` typo) as IN BUILD/DEFINED + disclaimer "roadmap, not products".
- **07 OPEN SOURCE:** built in public; contributing/issues CTA.
- **08 FAQ:** accordion.
- Ticker once; SiteHeader/SiteFooter.

### Task 3: Chrome updates

- `SiteHeader.tsx`: nav anchors Product/Mechanism/Roadmap/FAQ; CTA = GitHub (remove Login "Enter").
- `SiteFooter.tsx`: sitemap → GitHub org, VantaDB repo, specs repo, email; keep giant `NM.`; remove /login//app links.
- `Ticker.tsx`: items → factual (`EMBEDDED MEMORY ENGINE`, `HNSW + BM25 + RRF`, `MVCC`, `APACHE-2.0`, `LOCAL-FIRST`).
- `layout.tsx`: remove CONTRACT innerHTML hack + FINISH comment; metadata → "Negent Mind — Order out of chaos" / VantaDB description; add openGraph basics.

### Task 4: Restyle `/login` + `/app` with tokens

Replace inline styles with Tailwind tokens, add SiteHeader-less minimal chrome, `var(--color-*)` via classes.

### Task 5: Verify + docs + commit

- `npm run typecheck` → exit 0; `npm run build` → exit 0.
- `impeccable detect --json` over changed targets (one pass).
- Screenshots desktop+mobile via agent-browser.
- Update DESIGN.md + surface brief to the new world.
- Commit `feat(web): …` English, direct to main, no push.
