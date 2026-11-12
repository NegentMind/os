import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilmBackdrop } from "@/components/nm/FilmBackdrop";
import { LatticeField } from "@/components/nm/LatticeField";
import { MaskLine } from "@/components/nm/MaskLine";
import { Ticker } from "@/components/nm/Ticker";
import { SectionHeading } from "@/components/nm/SectionHeading";
import { DescentSection } from "@/components/nm/DescentSection";
import { SiteHeader } from "@/components/nm/SiteHeader";
import { SiteFooter } from "@/components/nm/SiteFooter";
import { Reveal } from "@/components/nm/Reveal";
import { FeatureRail, type RailItem } from "@/components/nm/FeatureRail";
import { TerminalDemo } from "@/components/nm/TerminalDemo";
import { InstrumentCounter } from "@/components/nm/InstrumentCounter";
import { Faq, type FaqItem } from "@/components/nm/Faq";

const VANTADB_REPO = "https://github.com/ness-e/Vantadb";
const ORG_REPO = "https://github.com/NegentMind";
const SPECS_REPO = "https://github.com/NegentMind/negentmind";

const PROBLEMS: Array<{ name: string; detail: string }> = [
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
];

const RAIL_ITEMS: RailItem[] = [
  {
    index: "01",
    name: "Embedded",
    detail:
      "Runs inside your process, the way SQLite runs inside an app. No server, no daemon, no container, no port to secure. Memory lives where the agent lives.",
    spec: "IN-PROCESS · ZERO NETWORK CALLS",
  },
  {
    index: "02",
    name: "Hybrid retrieval",
    detail:
      "Lexical BM25 and vector HNSW in one engine, fused with Reciprocal Rank Fusion. Exact terms and semantic neighbors come back in a single query, with structured metadata filters.",
    spec: "BM25 + HNSW → RRF · METADATA FILTERS",
  },
  {
    index: "03",
    name: "MVCC",
    detail:
      "Snapshot isolation with write-write conflict detection and ACID transactions. Ask what the agent knew at a given transaction — not just what is true now.",
    spec: "SNAPSHOT ISOLATION · WRITE CONFLICT DETECTION",
  },
  {
    index: "04",
    name: "Durable",
    detail:
      "Write-ahead log with CRC32C checksums, crash-safe recovery, and atomic checkpoints on a Fjall LSM backend. Memory that survives the process that wrote it. Optional TTL for state that should expire.",
    spec: "WAL + CRC32C · FJALL LSM · TTL",
  },
];

const NOT_ITEMS: Array<{ name: string; detail: string }> = [
  {
    name: "Not an agent framework",
    detail:
      "VantaDB does not orchestrate, plan, or call tools. It remembers — and leaves the reasoning to your stack.",
  },
  {
    name: "Not a hosted service",
    detail:
      "No account, no API key, no meter running on your agent's context. The binary is the product.",
  },
  {
    name: "Not a generic vector DB",
    detail:
      "Vector-only retrieval misses exact terms. Hybrid lexical-plus-semantic fusion is the product, not a flag.",
  },
];

type Cell = boolean | "partial";
const COMPARE: Array<{
  name: string;
  embedded: Cell;
  local: Cell;
  txn: Cell;
  hybrid: Cell;
}> = [
  { name: "Memory files (CLAUDE.md, AGENTS.md)", embedded: true, local: true, txn: false, hybrid: false },
  { name: "Hosted memory APIs (Mem0, Zep)", embedded: false, local: false, txn: false, hybrid: "partial" },
  { name: "Agent servers (Letta)", embedded: false, local: false, txn: "partial", hybrid: "partial" },
  { name: "VantaDB", embedded: true, local: true, txn: true, hybrid: true },
];

const SYSTEMS: Array<{ name: string; fn: string; status: string }> = [
  {
    name: "Cardinal",
    fn: "Episodic memory: every fact with position, time, provenance.",
    status: "IN BUILD",
  },
  {
    name: "Iris",
    fn: "Document perception: dead files into queryable data.",
    status: "DEFINED",
  },
  {
    name: "Meta",
    fn: "Trust calibration: what the system said, with what backing.",
    status: "DEFINED",
  },
  {
    name: "Execute",
    fn: "Tool execution with log, replay, and reversal.",
    status: "DEFINED",
  },
  {
    name: "Sage",
    fn: "Local correction capture; learning never leaves the org.",
    status: "DEFINED",
  },
  {
    name: "Plan",
    fn: "Objectives into steps with acceptance criteria.",
    status: "DEFINED",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Is it ready for production?",
    a: "It is at v0.5 and in build. The core engine — storage, hybrid retrieval, MVCC transactions — is implemented. Treat it like any young embedded database: pin the version, run your own workload, report what breaks.",
  },
  {
    q: "Why embedded instead of a service?",
    a: "Agent memory is data, not infrastructure. Embedded means no ops surface, no network hop, nothing leaving the machine, and it works offline. The same reason SQLite wins where a database server would be overhead.",
  },
  {
    q: "How is it different from Mem0 or Zep?",
    a: "Those are hosted memory services: your agent's context crosses the network and lives on their infrastructure. VantaDB is an engine that runs inside your process — SQLite's shape, retrieval designed for agent workloads.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. Apache-2.0, use it anywhere. No managed cloud exists today; if one ever does, the engine stays open.",
  },
  {
    q: "What are the other named systems?",
    a: "The research roadmap — Cardinal, Iris, Meta, Execute, Sage, Plan. VantaDB is the only product today; the rest carry honest status labels, not promises.",
  },
];

function Cell({ v }: { v: Cell }) {
  if (v === true) return <span className="text-pulse">●</span>;
  if (v === "partial") return <span className="text-fog">◐</span>;
  return <span className="text-linedark">—</span>;
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* 00 — HERO: ruido que resuelve en retícula. */}
        <section
          id="top"
          aria-labelledby="hero-h"
          className="relative flex min-h-svh flex-col overflow-hidden"
        >
          <FilmBackdrop className="absolute inset-0 h-full w-full" />
          <LatticeField className="absolute inset-0 h-full w-full" />

          <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-4 pt-28 pb-16 sm:px-6 sm:pb-20">
            <div className="pointer-events-none absolute top-24 right-4 hidden text-right sm:right-6 md:block">
              <p className="font-mono text-[10px] leading-relaxed tracking-[0.18em] text-fog uppercase">
                Embedded memory engine
                <br />
                In-process · no server
                <br />
                Apache-2.0
              </p>
            </div>

            <p className="font-mono mb-8 inline-flex w-fit items-center gap-3 border border-linedark px-3 py-1.5 text-[10px] tracking-[0.18em] text-fog uppercase">
              <span className="bg-pulse inline-block h-1.5 w-1.5" aria-hidden="true" />
              VantaDB · Apache-2.0 · Rust · Local-first
            </p>

            <h1
              id="hero-h"
              className="font-display text-[clamp(2.6rem,8.5vw,6rem)] leading-[0.98] font-bold tracking-[0.02em] text-bone uppercase"
            >
              <MaskLine>Order</MaskLine>
              <MaskLine delay={0.08}>Out of</MaskLine>
              <MaskLine delay={0.16}>
                <span className="text-outline">Chaos.</span>
              </MaskLine>
            </h1>

            <p className="mt-8 max-w-[62ch] text-base leading-relaxed text-fog text-pretty sm:text-lg">
              VantaDB is an embedded memory engine for AI agents. Hybrid
              retrieval — HNSW vectors fused with BM25 by RRF — MVCC snapshot
              isolation, and WAL durability, in a single process on your
              machine.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="font-mono tracking-[0.08em]">
                <a href={VANTADB_REPO} target="_blank" rel="noopener noreferrer">
                  Star VantaDB
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-mono tracking-[0.08em]"
              >
                <Link href="#product">
                  See the engine
                  <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Ticker />

        {/* 01 — EL PROBLEMA */}
        <section
          id="problem"
          aria-labelledby="problem-h"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-24 sm:px-6 sm:pt-32"
        >
          <SectionHeading
            index="01 / THE PROBLEM"
            title={<span id="problem-h">Every session starts from zero.</span>}
            lede="Agents are brilliant at inference and amnesiac by default. The current fixes all leak:"
          />
          <Reveal className="mt-10">
            <div className="border-linedark border-t">
              {PROBLEMS.map((p, i) => (
                <div
                  key={p.name}
                  className="border-linedark grid gap-2 border-b py-6 sm:grid-cols-[180px_1fr] sm:gap-8"
                >
                  <p className="font-mono text-[11px] tracking-[0.14em] text-fog uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[0.04em] text-bone uppercase sm:text-xl">
                      {p.name}
                    </h3>
                    <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-fog text-pretty sm:text-base">
                      {p.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 02 + 03 — mecanismo y prueba medida en vivo */}
        <div className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 sm:pt-32">
          <DescentSection />
        </div>

        {/* 04 — VANTADB */}
        <section
          id="product"
          aria-labelledby="product-h"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-24 sm:px-6 sm:pt-32"
        >
          <SectionHeading
            index="04 / THE ENGINE"
            title={<span id="product-h">VantaDB.</span>}
            lede="A persistent memory engine that embeds in the agent's own process. Memory that stays when the session ends."
          />
          <div className="mt-12">
            <FeatureRail items={RAIL_ITEMS} />
          </div>
          <Reveal className="mt-16">
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <h3 className="font-display text-xl font-bold tracking-[0.04em] text-bone uppercase sm:text-2xl">
                  Five lines. Persistent memory.
                </h3>
                <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-fog text-pretty sm:text-base">
                  The Python SDK mirrors the Rust core. Put a payload with its
                  embedding, query it by meaning and by term, get it back when
                  the next session opens.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <InstrumentCounter label="Servers to run" value="0" />
                  <InstrumentCounter label="Process it embeds in" value="1" />
                  <InstrumentCounter
                    label="Rust crate"
                    value="v0.5"
                    tone="fog"
                  />
                  <InstrumentCounter
                    label="License"
                    value="Apache-2.0"
                    tone="pulse"
                  />
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="font-mono mt-8 tracking-[0.08em]"
                >
                  <a
                    href={VANTADB_REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the source
                    <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              </div>
              <TerminalDemo />
            </div>
          </Reveal>
        </section>

        {/* 05 — QUÉ NO SOMOS (panel Pulse) */}
        <section
          id="not"
          aria-labelledby="not-h"
          className="mt-24 scroll-mt-24 bg-pulse text-void sm:mt-32"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase">
              05 / THE BOUNDARY
            </p>
            <h2
              id="not-h"
              className="font-display mt-4 text-3xl font-bold tracking-[0.02em] uppercase sm:text-5xl"
            >
              Positioned by what it is not.
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {NOT_ITEMS.map((n) => (
                <div
                  key={n.name}
                  className="border-t-2 border-[#14161c]/70 pt-5"
                >
                  <h3 className="font-display text-lg font-bold tracking-[0.04em] uppercase">
                    {n.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pretty">
                    {n.detail}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-mono mt-14 text-[11px] tracking-[0.14em] uppercase">
              The alternative today is a markdown file or someone else&apos;s
              server.
            </p>
          </div>
        </section>

        {/* 06 — COMPARATIVA */}
        <section
          id="compare"
          aria-labelledby="compare-h"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-24 sm:px-6 sm:pt-32"
        >
          <SectionHeading
            index="06 / THE LANDSCAPE"
            title={
              <span id="compare-h">Same job, different architectures.</span>
            }
            lede="These are not competitors so much as different shapes for the same need. The axis here is architecture, not quality."
          />
          <Reveal className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="font-mono border-linedark border-b text-[10px] tracking-[0.14em] text-fog uppercase">
                  <th scope="col" className="py-3 pr-4 font-normal">
                    Approach
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    Embedded
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    Local-first
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    Transactional
                  </th>
                  <th scope="col" className="px-4 py-3 font-normal">
                    Hybrid
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs tracking-[0.04em]">
                {COMPARE.map((row) => (
                  <tr
                    key={row.name}
                    className={
                      row.name === "VantaDB"
                        ? "border-linedark border-b text-bone"
                        : "border-linedark border-b text-fog"
                    }
                  >
                    <th
                      scope="row"
                      className="py-4 pr-4 font-normal whitespace-nowrap"
                    >
                      {row.name === "VantaDB" ? (
                        <span className="text-pulse">VantaDB</span>
                      ) : (
                        row.name
                      )}
                    </th>
                    <td className="px-4 py-4">
                      <Cell v={row.embedded} />
                    </td>
                    <td className="px-4 py-4">
                      <Cell v={row.local} />
                    </td>
                    <td className="px-4 py-4">
                      <Cell v={row.txn} />
                    </td>
                    <td className="px-4 py-4">
                      <Cell v={row.hybrid} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <p className="font-mono mt-4 text-[10px] tracking-[0.14em] text-fog uppercase">
            ● yes · ◐ partial · — no · architecture comparison, not a benchmark
          </p>
        </section>

        {/* 07 — ROADMAP */}
        <section
          id="roadmap"
          aria-labelledby="roadmap-h"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-24 sm:px-6 sm:pt-32"
        >
          <SectionHeading
            index="07 / THE ROADMAP"
            title={<span id="roadmap-h">Named systems, honest status.</span>}
            lede="VantaDB is the only product today. The rest of the map is research with labels, not launches."
          />
          <Reveal className="mt-10">
            <div className="border-linedark border-t">
              {SYSTEMS.map((s) => (
                <div
                  key={s.name}
                  className="border-linedark grid items-baseline gap-1 border-b py-5 sm:grid-cols-[180px_1fr_auto] sm:gap-8"
                >
                  <h3 className="font-display text-base font-bold tracking-[0.06em] text-bone uppercase">
                    {s.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-fog text-pretty">
                    {s.fn}
                  </p>
                  <p
                    className={`font-mono text-[10px] tracking-[0.14em] uppercase ${
                      s.status === "IN BUILD" ? "text-pulse" : "text-fog"
                    }`}
                  >
                    {s.status}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 08 — OPEN SOURCE */}
        <section
          id="open-source"
          aria-labelledby="oss-h"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-24 sm:px-6 sm:pt-32"
        >
          <SectionHeading
            index="08 / OPEN SOURCE"
            title={<span id="oss-h">Built in public. Join in.</span>}
            lede="Negent Mind is an independent open-source organization. The engine is Apache-2.0: read it, fork it, embed it in your agent."
          />
          <Reveal className="mt-10">
            <div className="border-linedark grid gap-8 border-t pt-10 md:grid-cols-3">
              <div>
                <h3 className="font-display text-base font-bold tracking-[0.04em] text-bone uppercase">
                  Contribute
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fog text-pretty">
                  Issues, ideas, and pull requests are the contribution path.
                  Rust core, Python bindings, docs — pick the surface you know.
                </p>
              </div>
              <div>
                <h3 className="font-display text-base font-bold tracking-[0.04em] text-bone uppercase">
                  Report
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fog text-pretty">
                  A young engine earns trust by breaking in public. Reproduce
                  it, file it, and it becomes a test.
                </p>
              </div>
              <div>
                <h3 className="font-display text-base font-bold tracking-[0.04em] text-bone uppercase">
                  Watch
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fog text-pretty">
                  Specs live in the open alongside the code. Follow the org to
                  see the roadmap turn into releases.
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="font-mono tracking-[0.08em]"
              >
                <a href={VANTADB_REPO} target="_blank" rel="noopener noreferrer">
                  ness-e/Vantadb
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-mono tracking-[0.08em]"
              >
                <a href={ORG_REPO} target="_blank" rel="noopener noreferrer">
                  NegentMind org
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-mono tracking-[0.08em]"
              >
                <a href={SPECS_REPO} target="_blank" rel="noopener noreferrer">
                  Read the specs
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </Reveal>
        </section>

        {/* 09 — FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-h"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-24 pb-24 sm:px-6 sm:pt-32 sm:pb-32"
        >
          <SectionHeading
            index="09 / THE INQUIRY"
            title={<span id="faq-h">Asked, answered.</span>}
          />
          <Reveal className="mt-10">
            <Faq items={FAQ_ITEMS} />
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
