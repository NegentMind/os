"use client";

import { useState } from "react";
import { AsciiField, type FieldStats } from "@/components/nm/AsciiField";
import { EntropyTrace } from "@/components/nm/EntropyTrace";
import { InstrumentCounter } from "@/components/nm/InstrumentCounter";
import { SectionHeading } from "@/components/nm/SectionHeading";
import type { Dict } from "@/lib/i18n";

const ZERO: FieldStats = { entropy: 0, resolved: 0, fps: 0 };
const HISTORY = 120;

/**
 * 02 Mecanismo + 03 Prueba: el scroll converge ruido fractal en orden ASCII
 * y los instrumentos muestran valores medidos en vivo, nada fabricado.
 * La traza guarda el historial real de entropía (osciloscopio, no decoración).
 */
export function DescentSection({ dict }: { dict: Dict["proof"] }) {
  const [stats, setStats] = useState<FieldStats>(ZERO);
  const [history, setHistory] = useState<number[]>([]);

  const onStats = (s: FieldStats) => {
    setStats(s);
    setHistory((h) => [...h.slice(-HISTORY + 1), s.entropy]);
  };

  const values = [
    stats.entropy.toFixed(2),
    String(stats.resolved),
    String(stats.fps),
    dict.bannerLoopValue,
  ];

  return (
    <>
      <section id="mechanism" aria-labelledby="mechanism-h" className="scroll-mt-24">
        <SectionHeading
          index={dict.mechIndex}
          title={<span id="mechanism-h">{dict.mechTitle}</span>}
          lede={dict.mechLede}
        />
        <div className="mt-8">
          <div className="border-linedark border">
            <div
              aria-hidden="true"
              className="border-linedark flex items-center justify-between border-b px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-fog"
            >
              <span>FRM 001 / 024</span>
              <span>{dict.mechChrome}</span>
            </div>
            <AsciiField
              onStats={onStats}
              className="h-[52vh] max-h-[560px] min-h-[320px] w-full"
            />
          </div>
          <p className="font-mono mt-3 text-[11px] tracking-[0.14em] text-fog uppercase">
            {dict.fig1}
          </p>
        </div>
      </section>

      <section id="proof" aria-labelledby="proof-h" className="mt-24 scroll-mt-24 sm:mt-32">
        <SectionHeading
          index={dict.proofIndex}
          title={<span id="proof-h">{dict.proofTitle}</span>}
          lede={dict.proofLede}
        />
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {dict.counters.map((c, i) => (
            <InstrumentCounter
              key={c.label}
              label={c.label}
              value={values[i]}
              unit={c.unit}
              tone={c.tone}
            />
          ))}
        </div>
        <div className="mt-6">
          <EntropyTrace
            values={history}
            className="border-linedark h-28 w-full border"
            ariaLabel={dict.traceAria}
          />
          <p className="font-mono mt-3 text-[11px] tracking-[0.14em] text-fog uppercase">
            {dict.fig2.replace("{n}", String(HISTORY))}
          </p>
        </div>
      </section>
    </>
  );
}
