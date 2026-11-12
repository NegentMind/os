/* English dictionary — canonical shape (Dict = typeof en). */

import type { HalftoneKind } from "@/components/nm/HalftoneCanvas";

type Cell = boolean | "partial";
type Tone = "bone" | "fog" | "pulse";

export const en = {
  meta: {
    title: "Negent Mind — Order out of chaos",
    description:
      "Open-source capability infrastructure for AI agents. VantaDB: an embedded memory engine — hybrid retrieval (HNSW + BM25 + RRF), MVCC snapshot isolation, local-first. Apache-2.0.",
  },
  nav: {
    homeAria: "Negent Mind, home",
    navAria: "Sections",
    langAria: "Language",
    links: [
      { href: "#system", label: "System" },
      { href: "#modules", label: "Modules" },
      { href: "#engine", label: "Engine" },
      { href: "#proof", label: "Proof" },
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
    subTags: "VANTADB · APACHE-2.0 · RUST · LOCAL-FIRST",
    subLink: "see the engine ↓",
    canvasAria: "Liquid silk shader field",
  },
  ticker: {
    items: [
      "EMBEDDED MEMORY ENGINE",
      "BM25 + HNSW → RRF",
      "MVCC SNAPSHOT ISOLATION",
      "WAL + CRC32C · FJALL LSM",
      "APACHE-2.0 · LOCAL-FIRST",
    ],
  },
  org: {
    label: "[ 01 / THE ORGANIZATION ]",
    title: "Agents are brilliant at inference",
    qual: "and amnesiac by default.",
    sub: "Negent Mind is an independent open-source organization building capability infrastructure for AI agents — memory, perception, verification, execution. One substrate is shipping; the rest are specifications with honest labels.",
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
    title: "One substrate. Six named systems.",
    qual: "specifications, not vaporware.",
    sub: "The architecture is layered: a memory substrate at the core, and capability modules defined as public RFCs before a single repository exists. Only one is code today.",
    items: [
      {
        num: "S/01",
        cat: "MEMORY SUBSTRATE",
        kind: "memory",
        title: "VantaDB",
        body: "Embedded Rust engine — HNSW + BM25 hybrid retrieval with MVCC isolation, WAL durability and snapshotting. The storage layer every other module builds on.",
        status: "IN BUILD",
        hudLeft: "ENGINE · v0.9.0",
        live: true,
      },
      {
        num: "S/02",
        cat: "RFC-01",
        kind: "orchestration",
        title: "Cardinal",
        body: "Context & working memory. Bitemporal episodic state — what an agent knew, and when it became true — with provenance tracking and token budgeting.",
        status: "RFC",
        hudLeft: "CONTEXT LAYER",
        live: false,
      },
      {
        num: "S/03",
        cat: "RFC-02",
        kind: "evaluations",
        title: "Meta",
        body: "Verification & metacognition. Deterministic execution traces and signed attestation logs so an agent's actions can be audited, not just logged.",
        status: "RFC",
        hudLeft: "AUDIT LAYER",
        live: false,
      },
      {
        num: "S/04",
        cat: "RFC-03",
        kind: "observability",
        title: "Iris",
        body: "Perception & ingestion. Local-first pipelines that turn unstructured multimodal documents into vector-indexed, verifiable nodes.",
        status: "RFC",
        hudLeft: "PERCEPTION",
        live: false,
      },
      {
        num: "S/05",
        cat: "RFC-04",
        kind: "runtime",
        title: "Execute",
        body: "Deterministic tool execution. Sandboxed action boundaries with explicit retry policies — no probabilistic retry loops.",
        status: "RFC",
        hudLeft: "EXECUTION",
        live: false,
      },
      {
        num: "S/06",
        cat: "RFC-04",
        kind: "security",
        title: "Sage",
        body: "Correction feedback. Persistent human-in-the-loop signals so agents stop repeating mistakes that were already corrected.",
        status: "RFC",
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
  engine: {
    label: "[ 04 / FLAGSHIP ENGINE ]",
    title: "VantaDB.",
    qual: "memory that stays when the session ends.",
    sub: "The first shipped module — an embedded persistent-memory engine for agents. Hybrid retrieval, transactional state, zero servers. Scroll through the pipeline.",
    h3: "Five lines. Persistent memory.",
    body: "The Python SDK mirrors the Rust core. Put a payload with its embedding, query it by meaning and by term, get it back when the next session opens.",
    counters: [
      { label: "Servers to run", value: "0", unit: "" },
      { label: "Processes it embeds in", value: "1", unit: "" },
      { label: "Engine version", value: "v0.9.0", unit: "", tone: "fog" },
      { label: "License", value: "Apache-2.0", unit: "", tone: "pulse" },
    ] as { label: string; value: string; unit: string; tone?: Tone }[],
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
    mechIndex: "05 / MECHANISM",
    mechTitle: "Noise in. Signal out.",
    mechLede:
      "This field is live fractal noise. Scroll and it converges to order; move the pointer and order follows it. What you see is the product: stochastic output, deterministically resolved.",
    mechChrome: "LIVE FIELD — SCROLL SCRUBS ORDER",
    fig1: "Fig. 01 — Fractal noise field, scroll-scrubbed · live entropy",
    proofIndex: "05 / PROOF",
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
    label: "06 / THE BOUNDARY",
    title: "Positioned by what it is not.",
    items: [
      {
        name: "Not an agent framework",
        detail:
          "Negent Mind does not orchestrate reasoning or prompt loops. It builds the substrate the reasoning reads from and writes to.",
      },
      {
        name: "Not a hosted service",
        detail:
          "No account, no API key, no meter running on your agent's context. The binary is the product.",
      },
      {
        name: "Not vaporware",
        detail:
          "Every module on the map is either shipped code or a written specification with a status label — never a rendered promise.",
      },
    ],
    footnote: "The alternative today is a markdown file or someone else's server.",
  },
  landscape: {
    label: "[ 07 / THE LANDSCAPE ]",
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
    label: "[ 08 / OPEN SOURCE ]",
    title: "Built in public.",
    qual: "join in.",
    sub: "Negent Mind is an independent open-source organization. The engine is Apache-2.0: read it, fork it, embed it in your agent — and help decide what gets built next.",
    ctaRepo: "ness-e/Vantadb",
    ctaOrg: "NegentMind org",
    ctaSpecs: "Read the specs",
    cards: [
      {
        plan: "The substrate",
        amount: "Apache-2.0",
        per: "v0.9.0 — in build",
        desc: "VantaDB. One dependency, embedded in your process, readable end to end.",
        inc: "WHAT'S IN THE BOX",
        rows: [
          ["engine", "HNSW + BM25 hybrid search, fused by RRF"],
          ["isolation", "MVCC snapshots — reads never block writes"],
          ["durability", "WAL with CRC32C + auto-heal on open"],
          ["memory", "TTL expiry, scoped contexts, zero network"],
        ],
        cta: "github.com/ness-e/Vantadb",
        href: "https://github.com/ness-e/Vantadb",
      },
      {
        plan: "The organization",
        amount: "Open",
        per: "specs before code",
        desc: "Negent Mind publishes capability specifications as RFCs before any repository exists. No phantom projects.",
        inc: "HOW TO JOIN",
        rows: [
          ["read", "the specification and the RFC pipeline"],
          ["build", "good first issues on the engine repo"],
          ["shape", "RFC reviews decide what gets built next"],
          ["govern", "public roadmap, public roadmap only"],
        ],
        cta: "github.com/NegentMind",
        href: "https://github.com/NegentMind",
      },
    ],
  },
  faq: {
    label: "[ 09 / THE INQUIRY ]",
    title: "Asked, answered.",
    items: [
      {
        q: "Is VantaDB ready for production?",
        a: "It is at v0.9.0 and in build. The core engine — storage, hybrid retrieval, MVCC transactions — is implemented. Treat it like any young embedded database: pin the version, run your own workload, report what breaks.",
      },
      {
        q: "Why embedded instead of a service?",
        a: "Agent memory is data, not infrastructure. Embedded means no ops surface, no network hop, nothing leaving the machine, and it works offline. The same reason SQLite wins where a database server would be overhead.",
      },
      {
        q: "What are the named systems?",
        a: "The capability modules on the roadmap — Cardinal, Meta, Iris, Execute, Sage. Each exists today only as a specification RFC; VantaDB is the only shipped module. Status labels are honest, not marketing.",
      },
      {
        q: "How does an RFC become code?",
        a: "The specification pipeline: a module is written as a formal RFC first, reviewed in public, and only gets a repository once the RFC is approved. No phantom repos.",
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
    legal: "© {year} Negent Mind · Apache-2.0",
    pending: "Privacy and Terms pending publication.",
  },
};

export type Dict = typeof en;
