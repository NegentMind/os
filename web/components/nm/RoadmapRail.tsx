"use client";

import { useEffect, useRef } from "react";
import type { Dict } from "@/lib/i18n";

/*
 * Roadmap rail, ported from strand's "Scroll Progress Section"
 * (templates/strand index page: Rail -> Rail Cart + pinned Progress
 * indicator). Strand's carts were 100vh sticky swaps driven by baked-in
 * Framer scroll effects; here the spine fill (--p) and per-milestone
 * activation are rebuilt with the house pattern from Immersive.tsx:
 * a passive scroll listener sets --p on the root, an IntersectionObserver
 * toggles .is-on as each milestone crosses the activation line (~60% vh,
 * the same line the fill tip rides on). Desktop alternates cards around a
 * centered spine; below 900px it collapses to a left-spine column.
 * prefers-reduced-motion renders the fully-revealed static state.
 */
export function RoadmapRail({ dict }: { dict: Dict["roadmap"] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>(".rail__item"),
    );

    if (reduced) {
      root.style.setProperty("--p", "1");
      for (const el of items) el.classList.add("is-on");
      return;
    }

    // Fill tip rides a line 60% down the viewport; the fill completes when
    // the rail's bottom edge reaches that line.
    const onScroll = () => {
      const r = root.getBoundingClientRect();
      const head = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (head - r.top) / Math.max(1, r.height)));
      root.style.setProperty("--p", p.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Activation zone = everything above the fill line, shrunk by the node's
    // offset (~48px) so the node lights as the fill tip reaches it.
    const bottom = Math.round(-(window.innerHeight * 0.6 - 48));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          e.target.classList.toggle("is-on", e.isIntersecting);
      },
      { rootMargin: `0px 0px ${bottom}px 0px` },
    );
    for (const el of items) io.observe(el);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, [dict]);

  return (
    <div className="rail" ref={rootRef}>
      <div className="rail__head">
        <span className="rail__lbl font-mono">{dict.railLabel}</span>
        <span className="rail__prog font-mono" aria-hidden="true">
          <span>{dict.progressLabel}</span>
          <span className="rail__track">
            <i />
          </span>
        </span>
      </div>
      <div className="rail__body">
        <span className="rail__spine" aria-hidden="true">
          <i className="rail__fill" />
        </span>
        <ol className="rail__list">
          {dict.items.map((it) => (
            <li
              key={it.num}
              className="rail__item"
              data-tone={it.phaseTone}
            >
              <span className="rail__node" aria-hidden="true" />
              <div className="rail__meta">
                <span className="rail__num font-mono">{it.num}</span>
                <span
                  className={`rail__chip font-mono rail__chip--${it.phaseTone}`}
                >
                  {it.phase}
                </span>
              </div>
              <h3 className="rail__name font-display">{it.name}</h3>
              <p className="rail__role font-mono">{it.role}</p>
              <p className="rail__desc">{it.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
