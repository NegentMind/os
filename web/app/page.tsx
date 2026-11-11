import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EntropyHero } from "@/components/nm/EntropyHero";
import { GlitchWord } from "@/components/nm/GlitchWord";
import { SectionHeading } from "@/components/nm/SectionHeading";
import { DescentSection } from "@/components/nm/DescentSection";
import { SiteHeader } from "@/components/nm/SiteHeader";
import { SiteFooter } from "@/components/nm/SiteFooter";
import { Reveal } from "@/components/nm/Reveal";

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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* SCALE 10⁰ — first viewport: the mechanism, dramatized */}
        <section aria-labelledby="hero-h" className="relative min-h-svh">
          <EntropyHero className="absolute inset-0 h-full w-full" />
          <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 sm:px-6">
            <GlitchWord
              as="h1"
              text="Order out of chaos."
              className="font-display max-w-4xl min-w-0 text-5xl font-bold uppercase leading-[1.02] tracking-[0.04em] text-bone break-words sm:text-7xl"
            />
            <p
              id="hero-h"
              className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fog"
            >
              Deterministic, verifiable infrastructure for the age of AI
              agents.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">Enter</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#mechanism">Read the mechanism</Link>
              </Button>
            </div>
            <p
              aria-hidden="true"
              className="font-mono mt-12 text-[11px] tracking-[0.2em] text-fog"
            >
              SCROLL TO DESCEND · SCALE 10⁰
            </p>
          </div>
        </section>

        {/* SCALE 10⁻¹ — manifesto */}
        <section
          aria-labelledby="manifesto-h"
          className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32"
        >
          <SectionHeading
            index="SCALE 10⁻¹ — MANIFESTO"
            title={<span id="manifesto-h">The mind orders. The model guesses.</span>}
            lede="LLMs are probabilistic: temperature above zero means hallucination is always on the menu. NegentMind builds the deterministic layer around them — memory, context, verification, execution — so output can be trusted, not just admired."
          />
          <Reveal className="mt-10">
            <p className="font-mono text-sm leading-relaxed text-fog sm:text-base">
              J(X) = H(Gauss) − H(X)
            </p>
            <p className="font-mono mt-2 text-[11px] tracking-[0.14em] text-fog uppercase">
              Informational negentropy vs Shannon entropy
            </p>
          </Reveal>
        </section>

        {/* SCALE 10⁻² → 10⁻³ — mechanism + proof (client, scrubbed) */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <DescentSection />
        </div>

        {/* SCALE 10⁻⁴ — systems ledger */}
        <section
          id="systems"
          aria-labelledby="systems-h"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-32"
        >
          <SectionHeading
            index="SCALE 10⁻⁴ — SYSTEMS"
            title={<span id="systems-h">Six holons. One ledger.</span>}
            lede="Each holon owns one scope of the chaos. Defined means specified; in build means being built now — starting with memory."
          />
          <dl className="mt-8">
            {SYSTEMS.map((s) => (
              <Reveal key={s.name}>
                <div className="border-linedark group grid gap-1 border-t py-5 transition-colors last:border-b hover:bg-panel sm:grid-cols-[180px_1fr_auto] sm:items-baseline sm:gap-6">
                  <dt className="font-mono text-sm tracking-[0.12em] text-bone">
                    {s.name.toUpperCase()}
                  </dt>
                  <dd className="max-w-[60ch] text-[15px] leading-relaxed text-fog">
                    {s.fn}
                  </dd>
                  <dd className="font-mono text-[11px] tracking-[0.18em] text-pulse">
                    {s.status}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>

        {/* SURFACE — access */}
        <section
          id="access"
          aria-labelledby="access-h"
          className="border-linedark border-t scroll-mt-24"
        >
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
            <SectionHeading
              index="SURFACE — ACCESS"
              title={<span id="access-h">Enter the system.</span>}
              lede="Sign in to reach the app. New here from any level? The community is open — start with a login, bring questions."
            />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/app">Open the app</Link>
              </Button>
              <a
                href="mailto:negent@negentmind.com"
                className="font-mono text-xs tracking-[0.14em] text-fog uppercase transition-colors hover:text-bone"
              >
                negent@negentmind.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
