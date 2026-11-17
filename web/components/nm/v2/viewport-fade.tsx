"use client";

import { useEffect, useRef } from "react";

/**
 * Shallow optical edge only; never an interactive or semantic overlay.
 * While the home hero still covers the strip zone the fade stays hidden —
 * the blur must never sit on top of the hero. Interior pages (no .nm2-hero)
 * keep it always visible. This is a visual concern, not a motion one, so
 * reduced/paused motion changes only the transition speed, not the rule.
 */
export function ViewportFade() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    const hero = document.querySelector<HTMLElement>(".nm2-hero");
    if (!element || !hero || !("IntersectionObserver" in window)) return;
    // Keep only the fade's own bottom strip as the observer root: shrink the
    // root's top edge down to the strip, so "intersecting" means the hero
    // actually overlaps the fade zone — not merely still on screen.
    const height = Math.ceil(element.getBoundingClientRect().height || 96);
    const topMargin = Math.max(0, window.innerHeight - height);
    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.hidden = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: `-${topMargin}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(hero);
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
