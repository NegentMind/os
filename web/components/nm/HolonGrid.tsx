"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { HalftoneCanvas } from "@/components/nm/HalftoneCanvas";
import type { Dict } from "@/lib/i18n";

/*
 * Capability grid ported from webTemplates/nice-squash-242352 (Sections.tsx
 * `Platform`): bordered grid of technical cards, each pairing a numbered
 * header + HUD-framed halftone instrument with a system name and spec.
 * Content maps 1:1 to specs/SPECIFICATION.md — VantaDB is the only shipped
 * module; every RFC card is labelled DEFINED, not built. `live` is a
 * non-localized flag so the pulse dot survives translation.
 */
function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`hg-reveal${on ? " is-in" : ""}`}>
      {children}
    </div>
  );
}

export function HolonGrid({ items }: { items: Dict["modules"]["items"] }) {
  return (
    <div className="feat-grid">
      {items.map((h) => (
        <Reveal key={h.num}>
          <article className="feat">
            <header className="fhead">
              <span className="fnum">{h.num}</span>
              <span className="fcat">{h.cat}</span>
            </header>
            <div className="graphic">
              <HalftoneCanvas kind={h.kind} />
              <div className="g-hud" aria-hidden="true">
                <span>{h.hudLeft}</span>
                <b className={h.live ? "live" : ""}>{h.status}</b>
              </div>
            </div>
            <h3>{h.title}</h3>
            <p>{h.body}</p>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
