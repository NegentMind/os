/* English dictionary — canonical shape (Dict = typeof en). */

import type { HalftoneKind } from "@/components/nm/HalftoneCanvas";
import { ORG_URL, VANTADB_REPO, displayUrl } from "@/lib/site";

type Cell = boolean | "partial";
type Tone = "bone" | "fog" | "pulse";
type PhaseTone = "shipped" | "build" | "rfc";

export const en = {
  meta: {
    title: "NEGENT MIND — Order out of chaos",
    description:
      "Applied AI Research & Product Engineering: infrastructure for persistent, controllable, efficient and trustworthy agentic AI.",
  },
  nav: {
    homeAria: "NEGENT MIND, home",
    navAria: "Sections",
    langAria: "Language",
    links: [
      { href: "#org", label: "Lab" },
      { href: "#modules", label: "Modules" },
      { href: "#status", label: "Status" },
      { href: "#engine", label: "Engine" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: "GitHub",
  },
  hero: {
    loader: "Loading…",
    addr: "Open Source, Everywhere",
    managerLine1: "Read the code —",
    managerLine2: "VantaDB on GitHub",
    managerCta: "View Repo",
    slogan: "Order out of chaos for the age of AI agents.",
    metrics: [
      { num: "Rust", lbl: "Core Language" },
      { num: "2", lbl: "Retrieval Engines — HNSW + BM25" },
      { num: "2.0", lbl: "Apache License" },
    ],
    subTags: "OPEN-SOURCE CAPABILITY INFRA · VANTADB · APACHE-2.0 · LOCAL-FIRST",
    subLink: "see the engine ↓",
    canvasAria: "Liquid silk shader field",
  },
  ticker: {
    items: [
      "CAPABILITY INFRASTRUCTURE",
      "CAPABILITY MAP · 1 ACTIVE",
      "EMBEDDED MEMORY ENGINE",
      "SPECS BEFORE CODE",
      "APACHE-2.0 · LOCAL-FIRST",
    ],
  },
  org: {
    label: "[ 01 / THE ORGANIZATION ]",
    title: "Agents are brilliant at inference",
    qual: "and amnesiac by default.",
    sub: "NEGENT MIND is an independent applied AI research and product engineering lab building infrastructure for AI agents — memory, perception, verification, execution. One engine is shipping; the rest of the map is written specification, labelled as vision.",
    problems: [
      {
        name: "Markdown memory rots",
        detail:
          "A memory file is something you edit by hand. It drifts, duplicates, and nobody prunes it. The agent reads the rot as fact.",
      },
      {
        name: "Hosted memory exfiltrates",
        detail:
          "A memory SaaS means your agent's context lives on someone else's meter. Latency, lock-in, and your data leaving the machine.",
      },
      {
        name: "Process state dies",
        detail:
          "In-process stores vanish on exit. Every new session starts from zero and re-learns the same lessons.",
      },
    ],
  },
  immersive: {
    label: "[ 02 / THE PRINCIPLE ]",
    phases: [
      "PHASE 01 — ASSEMBLE",
      "PHASE 02 — EXPAND",
      "PHASE 03 — MORPH",
      "PHASE 04 — REORGANISE",
    ],
    tags: [
      { k: "CAPABILITY", v: "MEMORY" },
      { k: "PRINCIPLE", v: "NEGENTROPY" },
      { k: "METHOD", v: "HYBRID" },
      { k: "LICENSE", v: "APACHE-2.0" },
    ],
    title: "Order out of chaos.",
    sub1: "Capabilities agents don't have.",
    sub2: "Built in the open.",
    canvasAria:
      "A large sculpture of halftone particles. Scrolling assembles it, expands it, morphs it into a knot and finally reorganises the particles into a clean cubic lattice. Drag to rotate.",
  },
  modules: {
    label: "[ 03 / THE MODULES ]",
    title: "One engine shipping. A capability map beyond it.",
    qual: "vision, labelled as vision.",
    sub: "The architecture is layered: a memory engine at the core, and a long-term map of capabilities around it — written as internal RFCs, not sold as products. Only VantaDB is released code today.",
    items: [
      {
        num: "S/01",
        cat: "MEMORY SUBSTRATE",
        kind: "memory",
        title: "VantaDB",
        body: "Embedded Rust engine — HNSW + BM25 hybrid retrieval with MVCC isolation, WAL durability and snapshotting. The storage layer every other module builds on.",
        status: "ACTIVE",
        hudLeft: "ENGINE · v0.9.0",
        live: true,
      },
      {
        num: "S/02",
        cat: "RFC-01",
        kind: "orchestration",
        title: "Cardinal",
        body: "Context & working memory. Bitemporal episodic state — what an agent knew, and when it became true — with provenance tracking and token budgeting.",
        status: "VISION",
        hudLeft: "CONTEXT LAYER",
        live: false,
      },
      {
        num: "S/03",
        cat: "RFC-02",
        kind: "evaluations",
        title: "Meta",
        body: "Verification & metacognition. Deterministic execution traces and signed attestation logs so an agent's actions can be audited, not just logged.",
        status: "VISION",
        hudLeft: "AUDIT LAYER",
        live: false,
      },
      {
        num: "S/04",
        cat: "RFC-03",
        kind: "observability",
        title: "Iris",
        body: "Perception & ingestion. Local-first pipelines that turn unstructured multimodal documents into vector-indexed, verifiable nodes.",
        status: "VISION",
        hudLeft: "PERCEPTION",
        live: false,
      },
      {
        num: "S/05",
        cat: "RFC-04",
        kind: "runtime",
        title: "Execute",
        body: "Deterministic tool execution. Sandboxed action boundaries with explicit retry policies — no probabilistic retry loops.",
        status: "VISION",
        hudLeft: "EXECUTION",
        live: false,
      },
      {
        num: "S/06",
        cat: "RFC-04",
        kind: "security",
        title: "Sage",
        body: "Correction feedback. Persistent human-in-the-loop signals so agents stop repeating mistakes that were already corrected.",
        status: "VISION",
        hudLeft: "ADAPTATION",
        live: false,
      },
    ] as {
      num: string;
      cat: string;
      kind: HalftoneKind;
      title: string;
      body: string;
      status: string;
      hudLeft: string;
      live: boolean;
    }[],
  },
  roadmap: {
    label: "[ 04 / PROJECT STATUS ]",
    title: "One engine active. One in incubation.",
    qual: "the rest is vision, not promise.",
    sub: "Status, not a schedule. Active means released code; Incubation means in development and not yet released; Vision means a written specification on the long-term map. No dates are promised here.",
    railLabel: "PIPELINE",
    progressLabel: "SCROLL",
    items: [
      {
        num: "R/00",
        phase: "ACTIVE",
        phaseTone: "shipped",
        name: "VantaDB",
        role: "STORAGE LAYER",
        body: "The only released code in the lab today: an embedded Rust engine — hybrid HNSW + BM25 retrieval fused by RRF, MVCC isolation, WAL durability. v0.9.0, Apache-2.0.",
      },
      {
        num: "R/01",
        phase: "INCUBATION",
        phaseTone: "build",
        name: "Scopegrain",
        role: "NOT YET RELEASED",
        body: "In incubation — not yet released. Details will be published with its first release.",
      },
      {
        num: "R/02",
        phase: "VISION",
        phaseTone: "rfc",
        name: "Cardinal",
        role: "CONTEXT LAYER",
        body: "Context & working memory. Bitemporal episodic state — what an agent knew, and when it became true — with provenance tracking and token budgeting. Written as RFC-01.",
      },
      {
        num: "R/03",
        phase: "VISION",
        phaseTone: "rfc",
        name: "Meta",
        role: "AUDIT LAYER",
        body: "Verification & metacognition. Deterministic execution traces and signed attestation logs, so an agent's actions can be audited — not just logged. Written as RFC-02.",
      },
      {
        num: "R/04",
        phase: "VISION",
        phaseTone: "rfc",
        name: "Iris",
        role: "PERCEPTION LAYER",
        body: "Perception & ingestion. Local-first pipelines that turn unstructured multimodal documents into vector-indexed, verifiable nodes. Written as RFC-03.",
      },
      {
        num: "R/05",
        phase: "VISION",
        phaseTone: "rfc",
        name: "Execute",
        role: "EXECUTION LAYER",
        body: "Deterministic tool execution. Sandboxed action boundaries with explicit retry policies — no probabilistic retry loops. Written as RFC-04.",
      },
      {
        num: "R/06",
        phase: "VISION",
        phaseTone: "rfc",
        name: "Sage",
        role: "ADAPTATION LAYER",
        body: "Correction feedback. Persistent human-in-the-loop signals so agents stop repeating mistakes that were already corrected. Specified under RFC-04.",
      },
    ] as {
      num: string;
      phase: string;
      phaseTone: PhaseTone;
      name: string;
      role: string;
      body: string;
    }[],
  },
  work: {
    label: "[ 05 / THE WORK ]",
    title: "How things get built here.",
    qual: "spec first, code second.",
    sub: "The method is the message: written specifications, evidence before claims, honest status labels. Every project carries one of three: Active, Incubation or Vision.",
    method: {
      title: "The specification pipeline",
      steps: [
        {
          name: "Write the spec",
          detail:
            "Every capability starts as a formal RFC — problem, specification, dependencies — written before a line of code exists.",
        },
        {
          name: "Public review",
          detail:
            "Released code is reviewed in the open: issues, objections and benchmarks shape what gets built next.",
        },
        {
          name: "Then the release",
          detail:
            "Nothing is presented as a product until it ships as verifiable code. Work in incubation stays labelled as such until it is released.",
        },
      ],
    },
    founder: {
      title: "One founder, working in the open.",
      body: "NEGENT MIND is an independent, founder-led lab — not yet an incorporated company. No venture backing, no team page to inflate — the shipped engine and this capability map are the full extent of the public work, stated at honest scale.",
    },
    contact: {
      title: "A direct line.",
      body: "Questions about the architecture, VantaDB or contributing — one inbox, read by the person who wrote the code.",
      pending: "(available once negentmind.com is live)",
      fallback: "Until then, reach us on GitHub",
    },
    metrics: [
      { label: "Active engine", value: "1", unit: "", tone: "pulse" },
      { label: "In incubation", value: "1", unit: "", tone: "bone" },
      { label: "Written specifications", value: "4", unit: "RFC-01–04 · internal", tone: "fog" },
      { label: "License", value: "Apache-2.0", unit: "", tone: "fog" },
    ] as { label: string; value: string; unit: string; tone: Tone }[],
  },
  engine: {
    label: "[ 06 / FLAGSHIP ENGINE ]",
    title: "VantaDB.",
    qual: "memory that stays when the session ends.",
    sub: "The first shipped module — an embedded persistent-memory engine for agents. Hybrid retrieval, transactional state, zero servers. Scroll through the pipeline.",
    h3: "Five lines. Persistent memory.",
    body: "The Python SDK mirrors the Rust core. Put a payload with its embedding, query it by meaning and by term, get it back when the next session opens.",
    cta: "Read the source",
    replayAria: "Replay terminal session",
    board: {
      hint: "SCROLL OR SELECT A STAGE",
      stagesAria: "Stages",
      stageLabel: "STAGE",
      statusLabel: "STATUS",
      graphHead: "QUERY GRAPH",
      formHead: "FORM",
      regions: ["READ", "WRITE", "COMMIT"],
      stages: [
        {
          name: "Connect",
          status: "CONNECTING",
          metricTitle: "ENGINE",
          metricUnit: "PROCESS",
          rowLabels: ["embedded core", "fjall backend", "wal enabled", "local-first"],
        },
        {
          name: "Index",
          status: "INDEXING",
          metricTitle: "INDEX",
          metricUnit: "ENGINES",
          rowLabels: ["hnsw", "bm25", "filters", "wal"],
        },
        {
          name: "Query",
          status: "FUSING",
          metricTitle: "SCORE",
          metricUnit: "K=60",
          rowLabels: [],
        },
        {
          name: "Commit",
          status: "COMMITTED",
          metricTitle: "ISOLATION",
          metricUnit: "SNAPSHOTS",
          rowLabels: [],
        },
      ],
    },
  },
  proof: {
    mechIndex: "07 / MECHANISM",
    mechTitle: "Noise in. Signal out.",
    mechLede:
      "This field is live fractal noise. Scroll and it converges to order; move the pointer and order follows it. What you see is the product: stochastic output, deterministically resolved.",
    mechChrome: "LIVE FIELD — SCROLL SCRUBS ORDER",
    fig1: "Fig. 01 — Fractal noise field, scroll-scrubbed · live entropy",
    proofIndex: "07 / PROOF",
    proofTitle: "Measured, not claimed.",
    proofLede:
      "No testimonials, no customers invented, no benchmarks borrowed. These numbers are computed here, now, from the field above.",
    counters: [
      { label: "Field entropy (Shannon, live)", unit: "bits", tone: "pulse" },
      { label: "Glyphs resolved to order", unit: "%", tone: "bone" },
      { label: "Render loop", unit: "fps", tone: "fog" },
      { label: "Deterministic banner loop", unit: "30fps", tone: "fog" },
    ] as { label: string; unit: string; tone: Tone }[],
    bannerLoopValue: "120f",
    fig2: "Fig. 02 — Entropy trace, last {n} samples · scale 0–8 bits",
    traceAria: "Live trace of the field's measured Shannon entropy",
  },
  boundary: {
    label: "08 / THE BOUNDARY",
    title: "Positioned by what it is not.",
    items: [
      {
        name: "Not an agent framework",
        detail:
          "NEGENT MIND does not orchestrate reasoning or prompt loops. It builds the substrate the reasoning reads from and writes to.",
      },
      {
        name: "Not a hosted service",
        detail:
          "No account, no API key, no meter running on your agent's context. The binary is the product.",
      },
      {
        name: "Not vaporware",
        detail:
          "Every entry on the map is released code, work in incubation or a written specification — each with a status label, never a rendered promise.",
      },
    ],
    footnote: "The alternative today is a markdown file or someone else's server.",
  },
  landscape: {
    label: "[ 09 / THE LANDSCAPE ]",
    title: "Same job, different architectures.",
    qual: "architecture, not quality.",
    sub: "These are not competitors so much as different shapes for the same need — where VantaDB's engine sits among them.",
    heads: ["Approach", "Embedded", "Local-first", "Transactional", "Hybrid"],
    rows: [
      { name: "Memory files (CLAUDE.md, AGENTS.md)", embedded: true, local: true, txn: false, hybrid: false },
      { name: "Hosted memory APIs (Mem0, Zep)", embedded: false, local: false, txn: false, hybrid: "partial" },
      { name: "Agent servers (Letta)", embedded: false, local: false, txn: "partial", hybrid: "partial" },
      { name: "VantaDB", embedded: true, local: true, txn: true, hybrid: true },
    ] as { name: string; embedded: Cell; local: Cell; txn: Cell; hybrid: Cell }[],
    legend: "● yes · ◐ partial · — no · architecture comparison, not a benchmark",
  },
  oss: {
    label: "[ 10 / OPEN SOURCE ]",
    title: "Built in public.",
    qual: "join in.",
    sub: "NEGENT MIND is an independent applied AI research lab. The engine is Apache-2.0: read it, fork it, embed it in your agent — and help decide what gets built next.",
    ctaRepo: displayUrl(VANTADB_REPO).replace("github.com/", ""),
    ctaOrg: "NegentMind org",
    cards: [
      {
        plan: "The substrate",
        amount: "Apache-2.0",
        per: "v0.9.0 — active",
        desc: "VantaDB. One dependency, embedded in your process, readable end to end.",
        inc: "WHAT'S IN THE BOX",
        rows: [
          ["engine", "HNSW + BM25 hybrid search, fused by RRF"],
          ["isolation", "MVCC snapshots — reads never block writes"],
          ["durability", "WAL with CRC32C + auto-heal on open"],
          ["memory", "TTL expiry, scoped contexts, zero network"],
        ],
        cta: displayUrl(VANTADB_REPO),
        href: VANTADB_REPO,
      },
      {
        plan: "The organization",
        amount: "Open",
        per: "specs before code",
        desc: "NEGENT MIND writes its capability specifications as internal RFCs; a public summary will live in the Handbook. Released code, work in incubation and vision are labelled as such.",
        inc: "HOW TO JOIN",
        rows: [
          ["read", "the capability map and its status labels"],
          ["build", "good first issues on the engine repo"],
          ["shape", "issues and benchmarks shape what gets built next"],
          ["follow", "direction and status in the Public Handbook"],
        ],
        cta: displayUrl(ORG_URL),
        href: ORG_URL,
      },
    ],
  },
  faq: {
    label: "[ 11 / THE INQUIRY ]",
    title: "Asked, answered.",
    items: [
      {
        q: "What is NEGENT MIND exactly?",
        a: "An independent applied AI research and product engineering lab building infrastructure for persistent, controllable, efficient and trustworthy agentic AI. VantaDB, the embedded memory engine, is its first released project. Scopegrain is in incubation and not yet released. Everything else on this page is a long-term capability map — written specifications, not products.",
      },
      {
        q: "How do decisions get made?",
        a: "Capabilities are written as internal specifications; released code is reviewed in public, with tests and evidence. The detailed roadmap is private. Direction, principles and project status live in the Public Handbook (publishing December 2026).",
      },
      {
        q: "Is VantaDB ready for production?",
        a: "It is at v0.9.0 and in active development. The core engine — storage, hybrid retrieval, MVCC transactions — is implemented. Treat it like any young embedded database: pin the version, run your own workload, report what breaks.",
      },
      {
        q: "Why embedded instead of a service?",
        a: "Agent memory is data, not infrastructure. Embedded means no ops surface, no network hop, nothing leaving the machine, and it works offline. The same reason SQLite wins where a database server would be overhead.",
      },
      {
        q: "What does it cost?",
        a: "Nothing. Apache-2.0, use it anywhere. No managed cloud exists today; if one ever does, the engine stays open.",
      },
    ],
  },
  footer: {
    navAria: "Site map",
    links: [
      { href: "#engine", label: "Engine" },
      { href: "#modules", label: "Modules" },
      { href: "#proof", label: "Proof" },
      { href: "#faq", label: "FAQ" },
    ],
    handbook: "Handbook",
    handbookPending: "Handbook — publishing December 2026",
    legal: "© {year} NEGENT MIND · Apache-2.0",
    pending: "Privacy and Terms pending publication.",
  },
};

export type Dict = typeof en;
