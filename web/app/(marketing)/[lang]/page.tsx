import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
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
import { Faq } from "@/components/nm/Faq";
import { getDictionary, isLocale } from "@/lib/i18n";

const VANTADB_REPO = "https://github.com/ness-e/Vantadb";
const ORG_REPO = "https://github.com/NegentMind";
const SPECS_REPO = "https://github.com/NegentMind/negentmind";

type Cell = boolean | "partial";

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

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);

  return (
    <>
      <SiteHeader lang={lang} dict={d.nav} />
      <main>
        {/* 00 — HERO: seda líquida (mondragon2) */}
        <div id="top">
          <SilkHero dict={d.hero} />
        </div>

        <Ticker items={d.ticker.items} />

        {/* 01 — THE ORGANIZATION */}
        <section id="org" aria-labelledby="org-h" className="nmsec scroll-mt-24">
          <Crosshairs />
          <div className="nmsec-inner nmsec-pad">
            <div className="sechead split">
              <div>
                <p className="lbl">{d.org.label}</p>
                <h2 className="h2" id="org-h">
                  {d.org.title}
                  <span className="qual">{d.org.qual}</span>
                </h2>
              </div>
              <p className="secsub">{d.org.sub}</p>
            </div>
            <Reveal>
              <div className="border-linedark border-t">
                {d.org.problems.map((p, i) => (
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
        <Immersive dict={d.immersive} />

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
                <p className="lbl">{d.modules.label}</p>
                <h2 className="h2" id="modules-h">
                  {d.modules.title}
                  <span className="qual">{d.modules.qual}</span>
                </h2>
              </div>
              <p className="secsub">{d.modules.sub}</p>
            </div>
            <HolonGrid items={d.modules.items} />
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
                <p className="lbl">{d.engine.label}</p>
                <h2 className="h2" id="engine-h">
                  {d.engine.title}
                  <span className="qual">{d.engine.qual}</span>
                </h2>
              </div>
              <p className="secsub">{d.engine.sub}</p>
            </div>
          </div>
          <FlowBoard dict={d.engine.board} />
          <div className="nmsec-inner nmsec-pad">
            <Reveal>
              <div className="grid items-start gap-10 pt-20 lg:grid-cols-[1fr_1.1fr]">
                <div>
                  <h3 className="font-display text-xl font-bold tracking-[0.04em] text-bone uppercase sm:text-2xl">
                    {d.engine.h3}
                  </h3>
                  <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-fog text-pretty sm:text-base">
                    {d.engine.body}
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-6">
                    {d.engine.counters.map((c) => (
                      <InstrumentCounter
                        key={c.label}
                        label={c.label}
                        value={c.value}
                        tone={c.tone}
                      />
                    ))}
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
                      {d.engine.cta}
                      <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
                <TerminalDemo replayLabel={d.engine.replayAria} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 05 — MECHANISM + PROOF: medición en vivo */}
        <section className="nmsec" aria-label="Mechanism and proof">
          <Crosshairs />
          <div className="nmsec-inner nmsec-pad">
            <DescentSection dict={d.proof} />
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
              {d.boundary.label}
            </p>
            <h2
              id="not-h"
              className="font-display mt-4 text-3xl font-bold tracking-[0.02em] uppercase sm:text-5xl"
            >
              {d.boundary.title}
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {d.boundary.items.map((n) => (
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
              {d.boundary.footnote}
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
                <p className="lbl">{d.landscape.label}</p>
                <h2 className="h2" id="compare-h">
                  {d.landscape.title}
                  <span className="qual">{d.landscape.qual}</span>
                </h2>
              </div>
              <p className="secsub">{d.landscape.sub}</p>
            </div>
            <Reveal className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="font-mono border-linedark border-b text-[10px] tracking-[0.14em] text-fog uppercase">
                    {d.landscape.heads.map((h, i) => (
                      <th
                        key={h}
                        scope="col"
                        className={
                          i === 0
                            ? "py-3 pr-4 font-normal"
                            : "px-4 py-3 font-normal"
                        }
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-mono text-xs tracking-[0.04em]">
                  {d.landscape.rows.map((row) => (
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
              {d.landscape.legend}
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
                <p className="lbl">{d.oss.label}</p>
                <h2 className="h2" id="oss-h">
                  {d.oss.title}
                  <span className="qual">{d.oss.qual}</span>
                </h2>
              </div>
              <p className="secsub">{d.oss.sub}</p>
            </div>
            <OssCards cards={d.oss.cards} />
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="font-mono tracking-[0.08em]">
                <a href={VANTADB_REPO} target="_blank" rel="noopener noreferrer">
                  {d.oss.ctaRepo}
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
                  {d.oss.ctaOrg}
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
                  {d.oss.ctaSpecs}
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
              <p className="lbl">{d.faq.label}</p>
              <h2 className="h2" id="faq-h">
                {d.faq.title}
              </h2>
            </div>
            <Reveal>
              <Faq items={d.faq.items} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter dict={d.footer} />
    </>
  );
}
