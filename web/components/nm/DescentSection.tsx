"use client";

import { useState } from "react";
import { AsciiField, type FieldStats } from "@/components/nm/AsciiField";
import { InstrumentCounter } from "@/components/nm/InstrumentCounter";
import { SectionHeading } from "@/components/nm/SectionHeading";

const ZERO: FieldStats = { entropy: 0, resolved: 0, fps: 0 };

/**
 * Mecanismo + prueba: el scroll converge ruido fractal en orden ASCII
 * y los instrumentos muestran valores medidos en vivo, nada fabricado.
 */
export function DescentSection() {
  const [stats, setStats] = useState<FieldStats>(ZERO);

  return (
    <>
      <section id="mechanism" aria-labelledby="mechanism-h" className="scroll-mt-24">
        <SectionHeading
          index="SCALE 10⁻² — MECHANISM"
          title={<span id="mechanism-h">Noise in. Signal out.</span>}
          lede="This field is live fractal noise. Scroll and it converges to order; move the pointer and order follows it. What you see is the product: stochastic output, deterministically resolved."
        />
        <div className="mt-8">
          <AsciiField
            onStats={setStats}
            className="border-linedark h-[52vh] min-h-[320px] w-full border"
          />
          <p className="font-mono mt-3 text-[11px] tracking-[0.14em] text-fog uppercase">
            Fig. 01 — Fractal noise field, scroll-scrubbed · live entropy
          </p>
        </div>
      </section>

      <section id="proof" aria-labelledby="proof-h" className="mt-24 scroll-mt-24 sm:mt-32">
        <SectionHeading
          index="SCALE 10⁻³ — PROOF"
          title={<span id="proof-h">Measured, not claimed.</span>}
          lede="No testimonials, no customers invented, no benchmarks borrowed. These numbers are computed here, now, from the field above."
        />
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          <InstrumentCounter
            label="Field entropy (Shannon, live)"
            value={stats.entropy.toFixed(2)}
            unit="bits"
            tone="pulse"
          />
          <InstrumentCounter
            label="Glyphs resolved to order"
            value={String(stats.resolved)}
            unit="%"
          />
          <InstrumentCounter
            label="Render loop"
            value={String(stats.fps)}
            unit="fps"
            tone="fog"
          />
          <InstrumentCounter
            label="Deterministic banner loop"
            value="120f"
            unit="30fps"
            tone="fog"
          />
        </div>
      </section>
    </>
  );
}
