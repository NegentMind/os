"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";

export function ScrollScene({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const { canAnimate } = useSiteMotion();

  // One context per mounted scene / motion preference. React children stay
  // out of the dependency list so selecting a diagram never rebuilds the
  // drawing timeline of the scene that owns it.
  useEffect(() => {
    const element = root.current;
    if (!element || !canAnimate) return;

    let disposed = false;
    let context: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);

        // Assign the context before creating tweens: even a partial setup
        // failure can revert all styles and triggers created in this scope.
        const scoped = gsap.context(() => {}, element);
        context = scoped;
        scoped.add(() => {
          const belongsToScene = (node: Element) =>
            node.closest(".nm2-scroll-scene") === element;

          // Reading reveals: only nodes still below the fold; visible text
          // is never knocked down nor scrubbed to readability.
          const reveals = Array.from(
            element.querySelectorAll<HTMLElement>("[data-scroll-reveal]"),
          ).filter(belongsToScene);
          for (const node of reveals) {
            if (node.getBoundingClientRect().top < window.innerHeight) continue;
            gsap.fromTo(
              node,
              { y: 14, opacity: 0.35 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: node,
                  start: "top 88%",
                  once: true,
                },
              },
            );
          }

          // Decor trace: prepare only when the scene starts offscreen, and
          // only explicitly marked connectors are drawn.
          const sceneBelowViewport =
            element.getBoundingClientRect().top >= window.innerHeight;
          const paths = Array.from(
            element.querySelectorAll<SVGGeometryElement>(
              "path[data-draw], line[data-draw], polyline[data-draw]",
            ),
          ).filter(belongsToScene);
          const drawable = paths.flatMap((node) => {
            // Restrict tracing to geometry that really supports path metrics.
            if (typeof node.getTotalLength !== "function") return [];
            const length = node.getTotalLength();
            return Number.isFinite(length) && length > 0 ? [{ node, length }] : [];
          });
          if (sceneBelowViewport && drawable.length > 0) {
            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "center 55%",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            });
            for (const { node, length } of drawable) {
              timeline.fromTo(
                node,
                { strokeDasharray: `${length} ${length}`, strokeDashoffset: length },
                { strokeDashoffset: 0, duration: 1 },
                0,
              );
            }
          }

          // Decor float: from the natural position toward -12 over the whole
          // pass; no initial reset of already-painted art.
          const wrappers = Array.from(
            element.querySelectorAll<HTMLElement | SVGElement>("[data-float]"),
          ).filter(belongsToScene);
          if (wrappers.length > 0) {
            gsap.to(wrappers, {
              y: -12,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            });
          }
        });
      })
      .catch((error: unknown) => {
        context?.revert();
        if (disposed) return;
        console.warn(
          "Orbital ScrollScene: scroll enhancement unavailable; original content retained. Check the gsap/ScrollTrigger dynamic chunks and SVG path metrics before reloading.",
          error,
        );
      });

    return () => {
      disposed = true;
      context?.revert();
    };
  }, [canAnimate]);

  return (
    <div ref={root} className={`nm2-scroll-scene ${className}`}>
      {children}
    </div>
  );
}
