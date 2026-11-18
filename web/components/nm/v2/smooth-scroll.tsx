"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";

/**
 * Lenis smooth scrolling for the marketing shell. Lives only while motion is
 * allowed: reduced motion or the footer pause switch destroys the instance and
 * restores native scroll. Anchor links are handled here (not Lenis' `anchors`
 * option, which never calls preventDefault) so the smooth pass and the hash
 * update behave like one navigation; `scrollTo` honors `scroll-margin-top`,
 * which is what gives the fixed header its clearance.
 */
export function SmoothScroll() {
  const { canAnimate } = useSiteMotion();

  useEffect(() => {
    if (!canAnimate) return;

    let lenis: Lenis | null = null;
    let raf = 0;
    let disposed = false;
    let removeGsapHook: (() => void) | undefined;

    const frame = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(frame);
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return;
      }
      const origin = event.target;
      const anchor =
        origin instanceof Element
          ? origin.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      let id = href.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // Malformed escape sequences keep the raw id.
      }
      const target = document.getElementById(id);
      if (!target || !lenis) return;
      event.preventDefault();
      lenis.scrollTo(target);
      window.history.pushState(null, "", href);
      // The skip link relies on focus moving to the anchor target; sections
      // without tabindex are not focus destinations.
      if (target.hasAttribute("tabindex")) {
        target.focus({ preventScroll: true });
      }
    };

    void import("lenis")
      .then(({ default: Lenis }) => {
        if (disposed) return;
        lenis = new Lenis({ stopInertiaOnNavigate: true });
        document.addEventListener("click", onClick);

        // GSAP drives the raf loop when it is available so ScrollTrigger
        // stays in sync with the smoothed position; plain rAF otherwise.
        void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
          .then(([{ gsap }, { ScrollTrigger }]) => {
            if (disposed || !lenis) return;
            gsap.registerPlugin(ScrollTrigger);
            const instance = lenis;
            const update = () => ScrollTrigger.update();
            const tick = (time: number) => instance.raf(time * 1000);
            instance.on("scroll", update);
            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);
            removeGsapHook = () => {
              instance.off("scroll", update);
              gsap.ticker.remove(tick);
              gsap.ticker.lagSmoothing(500, 33);
            };
          })
          .catch(() => {
            if (!disposed && !raf) raf = requestAnimationFrame(frame);
          });
      })
      .catch((error: unknown) => {
        if (disposed) return;
        console.warn(
          "Orbital smooth scroll unavailable; native scrolling retained. Check the lenis dynamic chunk before reloading.",
          error,
        );
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      removeGsapHook?.();
      lenis?.destroy();
    };
  }, [canAnimate]);

  return null;
}
