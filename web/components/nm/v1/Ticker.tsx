"use client";

import { useEffect, useState } from "react";

/**
 * Único marquee de la página: ticker mono con reloj UTC vivo.
 * Pausado con prefers-reduced-motion (antes en la retirada V1 globals.css).
 */
export function Ticker({ items }: { items: readonly string[] }) {
  const [now, setNow] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setNow(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const row = (
    <>
      {items.map((item) => (
        <span key={item} className="mx-6 inline-flex items-center gap-6">
          <span>{item}</span>
          <span aria-hidden="true" className="text-pulse">
            ●
          </span>
        </span>
      ))}
      <span className="mx-6 inline-flex items-center gap-6">
        <span className="tabular-nums">{now}</span>
        <span aria-hidden="true" className="text-pulse">
          ●
        </span>
      </span>
    </>
  );

  return (
    <div
      aria-hidden="true"
      className="border-linedark overflow-hidden border-y py-2"
    >
      <div className="ticker-track font-mono inline-flex whitespace-nowrap text-[11px] tracking-[0.18em] text-fog">
        <div className="ticker-half">{row}</div>
        <div className="ticker-half">{row}</div>
      </div>
    </div>
  );
}
