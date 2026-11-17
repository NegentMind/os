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
          const paths = Array.from(
            element.querySelectorAll<SVGGeometryElement>(
              "path[data-draw], line[data-draw], polyline[data-draw]",
            ),
          ).filter(belongsToScene);
          const wrappers = Array.from(
            element.querySelectorAll<HTMLElement | SVGElement>("[data-float]"),
          ).filter(belongsToScene);

          const drawable = paths.flatMap((node) => {
            // Restrict tracing to geometry that really supports path metrics.
            if (typeof node.getTotalLength !== "function") return [];
            const length = node.getTotalLength();
            return Number.isFinite(length) && length > 0 ? [{ node, length }] : [];
          });
          if (drawable.length === 0 && wrappers.length === 0) return;

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 25%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          for (const { node, length } of drawable) {
            timeline.fromTo(
              node,
              { strokeDasharray: `${length} ${length}`, strokeDashoffset: length * 0.55 },
              { strokeDashoffset: 0, duration: 1 },
              0,
            );
          }
          if (wrappers.length > 0) {
            timeline.fromTo(wrappers, { y: 18 }, { y: -12, duration: 1 }, 0);
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
  }, [canAnimate, children]);

  return (
    <div ref={root} className={`nm2-scroll-scene ${className}`}>
      {children}
    </div>
  );
}
