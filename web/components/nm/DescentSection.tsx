"use client";

import { useState } from "react";
import { AsciiField, type FieldStats } from "@/components/nm/AsciiField";
import { EntropyTrace } from "@/components/nm/EntropyTrace";
import { InstrumentCounter } from "@/components/nm/InstrumentCounter";
import { SectionHeading } from "@/components/nm/SectionHeading";

const ZERO: FieldStats = { entropy: 0, resolved: 0, fps: 0 };
const HISTORY = 120;

/**
 * 02 Mecanismo + 03 Prueba: el scroll converge ruido fractal en orden ASCII
 * y los instrumentos muestran valores medidos en vivo, nada fabricado.
 * La traza guarda el historial real de entropía (osciloscopio, no decoración).
 */
export function DescentSection() {
  const [stats, setStats] = useState<FieldStats>(ZERO);
  const [history, setHistory] = useState<number[]>([]);

  const onStats = (s: FieldStats) => {
    setStats(s);
    setHistory((h) => [...h.slice(-HISTORY + 1), s.entropy]);
  };

  return (
    <>
      <section id="mechanism" aria-labelledby="mechanism-h" className="scroll-mt-24">
        <SectionHeading
          index="05 / MECHANISM"
          title={<span id="mechanism-h">Noise in. Signal out.</span>}
          lede="This field is live fractal noise. Scroll and it converges to order; move the pointer and order follows it. What you see is the product: stochastic output, deterministically resolved."
        />
        <div className="mt-8">
          <div className="border-linedark border">
            <div
              aria-hidden="true"
              className="border-linedark flex items-center justify-between border-b px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-fog"
            >
              <span>FRM 001 / 024</span>
              <span>LIVE FIELD — SCROLL SCRUBS ORDER</span>
            </div>
            <AsciiField
              onStats={onStats}
              className="h-[52vh] max-h-[560px] min-h-[320px] w-full"
            />
          </div>
          <p className="font-mono mt-3 text-[11px] tracking-[0.14em] text-fog uppercase">
            Fig. 01 — Fractal noise field, scroll-scrubbed · live entropy
          </p>
        </div>
      </section>

      <section id="proof" aria-labelledby="proof-h" className="mt-24 scroll-mt-24 sm:mt-32">
        <SectionHeading
          index="05 / PROOF"
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
        <div className="mt-6">
          <EntropyTrace values={history} className="border-linedark h-28 w-full border" />
          <p className="font-mono mt-3 text-[11px] tracking-[0.14em] text-fog uppercase">
            Fig. 02 — Entropy trace, last {HISTORY} samples · scale 0–8 bits
          </p>
        </div>
      </section>
    </>
  );
}
