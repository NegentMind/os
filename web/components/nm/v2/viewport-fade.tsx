"use client";

import { useEffect, useRef } from "react";

/**
 * Shallow optical edge only; never an interactive or semantic overlay.
 * The strip stays hidden while the home hero still covers its zone, and
 * again once the document's own end — the footer card — reaches it: the
 * blur must never sit on top of either surface. Interior pages (no
 * .nm2-hero) keep it visible until the footer arrives. This is a visual
 * concern, not a motion one, so reduced/paused motion changes only the
 * transition speed, not the rule.
 */
export function ViewportFade() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const hero = document.querySelector<HTMLElement>(".nm2-hero");
    const footer = document.querySelector<HTMLElement>(".nm2-footer");
    if (!hero && !footer) return;
    // Keep only the fade's own bottom strip as the observer root: shrink the
    // root's top edge down to the strip, so "intersecting" means the watched
    // surface actually overlaps the fade zone — not merely still on screen.
    // Hero coverage and document end are independent reasons to hide; both
    // feed the same data-hidden flag.
    const height = Math.ceil(element.getBoundingClientRect().height || 96);
    const topMargin = Math.max(0, window.innerHeight - height);
    const covered = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          covered.set(entry.target, entry.isIntersecting);
        }
        const hidden =
          (hero !== null && covered.get(hero) === true) ||
          (footer !== null && covered.get(footer) === true);
        element.dataset.hidden = hidden ? "true" : "false";
      },
      { rootMargin: `-${topMargin}px 0px 0px 0px`, threshold: 0 },
    );
    if (hero) observer.observe(hero);
    if (footer) observer.observe(footer);
    return () => {
      observer.disconnect();
      delete element.dataset.hidden;
    };
  }, []);

  return (
    <div ref={root} className="nm2-viewport-fade" aria-hidden="true">
      <span className="nm2-viewport-fade__layer" />
      <span className="nm2-viewport-fade__layer" />
      <span className="nm2-viewport-fade__layer" />
      <span className="nm2-viewport-fade__layer" />
      <span className="nm2-viewport-fade__layer" />
    </div>
  );
}
