"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";

type HeroEntranceProps = { children: ReactNode };

export function HeroEntrance({ children }: HeroEntranceProps) {
  const root = useRef<HTMLDivElement>(null);
  const entered = useRef(false);
  const { canAnimate } = useSiteMotion();

  useEffect(() => {
    if (!canAnimate || entered.current || !root.current) return;
    let disposed = false;
    let revert: (() => void) | undefined;

    void import("gsap").then(({ gsap }) => {
      if (disposed || !root.current) return;
      entered.current = true;
      const ctx = gsap.context(() => {
        // Already-visible SSR content, one bounded coordinated moment.
        gsap.fromTo(
          "[data-hero-reveal]",
          { y: 18, opacity: 0.82 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.085,
            ease: "expo.out",
            clearProps: "transform,opacity",
          },
        );
      }, root);
      revert = () => ctx.revert();
    }).catch((error: unknown) => {
      if (disposed) return;
      console.warn(
        "Hero entrance unavailable; content remains visible. Check the failed GSAP import before reloading.",
        error,
      );
    });

    // Preference changes and manual pause also restore the visible defaults.
    return () => {
      disposed = true;
      revert?.();
    };
  }, [canAnimate]);

  return (
    <div ref={root} className="nm2-hero__content">
      {children}
    </div>
  );
}
