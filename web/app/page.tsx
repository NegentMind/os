import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SilkHero } from "@/components/nm/SilkHero";
import { Ticker } from "@/components/nm/Ticker";
import { Immersive } from "@/components/nm/Immersive";
import { HolonGrid } from "@/components/nm/HolonGrid";
import { FlowBoard } from "@/components/nm/FlowBoard";
import { Marquee } from "@/components/nm/Marquee";
import { OssCards } from "@/components/nm/OssCards";
import { DescentSection } from "@/components/nm/DescentSection";
import { SiteHeader } from "@/components/nm/SiteHeader";
import { SiteFooter } from "@/components/nm/SiteFooter";
import { Reveal } from "@/components/nm/Reveal";
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

const NOT_ITEMS: Array<{ name: string; detail: string }> = [
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

const FAQ_ITEMS: FaqItem[] = [
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
];

function Cell({ v }: { v: Cell }) {
  if (v === true) return <span className="text-pulse">●</span>;
  if (v === "partial") return <span className="text-fog">◐</span>;
  return <span className="text-linedark">—</span>;
}

function Crosshairs() {
  return (
    <>
      <span className="crosshair ch-tl" aria-hidden="true">
        +
      </span>
      <span className="crosshair ch-tr" aria-hidden="true">
        +
      </span>
    </>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* 00 — HERO: seda líquida (mondragon2) */}
        <div id="top">
          <SilkHero />
        </div>

        <Ticker />

        {/* 01 — THE ORGANIZATION */}
        <section id="org" aria-labelledby="org-h" className="nmsec scroll-mt-24">
          <Crosshairs />
          <div className="nmsec-inner nmsec-pad">
            <div className="sechead split">
              <div>
                <p className="lbl">[ 01 / THE ORGANIZATION ]</p>
                <h2 className="h2" id="org-h">
                  Agents are brilliant at inference
                  <span className="qual">and amnesiac by default.</span>
                </h2>
              </div>
              <p className="secsub">
                Negent Mind is an independent open-source organization building
                capability infrastructure for AI agents — memory, perception,
                verification, execution. One substrate is shipping; the rest are
                specifications with honest labels.
              </p>
            </div>
            <Reveal>
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
          </div>
        </section>

        {/* 02 — THE PRINCIPLE: escultura scroll-driven (nice-squash Immersive) */}
        <Immersive />

        {/* 03 — THE MODULES: capability grid (nice-squash Platform) */}
        <section
          id="modules"
          aria-labelledby="modules-h"
          className="nmsec scroll-mt-24"
        >
          <Crosshairs />
          <div className="nmsec-inner nmsec-pad">
            <div className="sechead split">
              <div>
                <p className="lbl">[ 03 / THE MODULES ]</p>
                <h2 className="h2" id="modules-h">
                  One substrate. Six named systems.
                  <span className="qual">specifications, not vaporware.</span>
                </h2>
              </div>
              <p className="secsub">
                The architecture is layered: a memory substrate at the core, and
                capability modules defined as public RFCs before a single
                repository exists. Only one is code today.
              </p>
            </div>
            <HolonGrid />
          </div>
        </section>

        {/* 04 — FLAGSHIP ENGINE: flow board pinned (nice-squash Flow) */}
        <section
          id="engine"
          aria-labelledby="engine-h"
          className="nmsec scroll-mt-24"
        >
          <Crosshairs />
          <div className="nmsec-inner nmsec-pad">
            <div className="sechead split">
              <div>
                <p className="lbl">[ 04 / FLAGSHIP ENGINE ]</p>
                <h2 className="h2" id="engine-h">
                  VantaDB.
                  <span className="qual">memory that stays when the session ends.</span>
                </h2>
              </div>
              <p className="secsub">
                The first shipped module — an embedded persistent-memory engine
                for agents. Hybrid retrieval, transactional state, zero servers.
                Scroll through the pipeline.
              </p>
            </div>
          </div>
          <FlowBoard />
          <div className="nmsec-inner nmsec-pad">
            <Reveal>
              <div className="grid items-start gap-10 pt-20 lg:grid-cols-[1fr_1.1fr]">
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
                    <InstrumentCounter label="Processes it embeds in" value="1" />
                    <InstrumentCounter
                      label="Engine version"
                      value="v0.9.0"
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
          </div>
        </section>

        {/* 05 — MECHANISM + PROOF: medición en vivo */}
        <section className="nmsec" aria-label="Mechanism and proof">
          <Crosshairs />
          <div className="nmsec-inner nmsec-pad">
            <DescentSection />
          </div>
        </section>

        {/* 06 — BOUNDARY (panel Pulse) */}
        <section
          id="not"
          aria-labelledby="not-h"
          className="mt-24 scroll-mt-24 bg-pulse text-void sm:mt-32"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase">
              06 / THE BOUNDARY
            </p>
            <h2
              id="not-h"
              className="font-display mt-4 text-3xl font-bold tracking-[0.02em] uppercase sm:text-5xl"
            >
              Positioned by what it is not.
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {NOT_ITEMS.map((n) => (
                <div key={n.name} className="border-t-2 border-[#14161c]/70 pt-5">
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

        {/* 07 — THE LANDSCAPE */}
        <section
          id="compare"
          aria-labelledby="compare-h"
          className="nmsec scroll-mt-24"
        >
          <Crosshairs />
          <div className="nmsec-inner nmsec-pad">
            <div className="sechead split">
              <div>
                <p className="lbl">[ 07 / THE LANDSCAPE ]</p>
                <h2 className="h2" id="compare-h">
                  Same job, different architectures.
                  <span className="qual">architecture, not quality.</span>
                </h2>
              </div>
              <p className="secsub">
                These are not competitors so much as different shapes for the
                same need — where VantaDB&apos;s engine sits among them.
              </p>
            </div>
            <Reveal className="overflow-x-auto">
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
          </div>
        </section>

        {/* 08 — OPEN SOURCE: price-cards (mondragon2) */}
        <section
          id="oss"
          aria-labelledby="oss-h"
          className="nmsec scroll-mt-24"
        >
          <Crosshairs />
          <div className="nmsec-inner nmsec-pad">
            <div className="sechead split">
              <div>
                <p className="lbl">[ 08 / OPEN SOURCE ]</p>
                <h2 className="h2" id="oss-h">
                  Built in public.
                  <span className="qual">join in.</span>
                </h2>
              </div>
              <p className="secsub">
                Negent Mind is an independent open-source organization. The
                engine is Apache-2.0: read it, fork it, embed it in your agent —
                and help decide what gets built next.
              </p>
            </div>
            <OssCards />
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="font-mono tracking-[0.08em]">
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
          </div>
        </section>

        {/* Marquee tipográfico (mondragon2) */}
        <Marquee />

        {/* 09 — FAQ */}
        <section id="faq" aria-labelledby="faq-h" className="nmsec scroll-mt-24">
          <Crosshairs />
          <div className="nmsec-inner nmsec-pad">
            <div className="sechead">
              <p className="lbl">[ 09 / THE INQUIRY ]</p>
              <h2 className="h2" id="faq-h">
                Asked, answered.
              </h2>
            </div>
            <Reveal>
              <Faq items={FAQ_ITEMS} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
