"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import {
  HERO_WARP_IDS,
  HERO_WARP_PRESETS,
  type HeroWarpId,
} from "@/components/nm/v2/hero-preset";
import { useHeroLabConfig } from "@/components/nm/v2/section-transition/transition-lab";

const HeroWarp = dynamic(
  () => import("@/components/nm/v2/hero-warp").then((module) => module.HeroWarp),
  { ssr: false, loading: () => null },
);

// Protect the dynamic module import only; HeroWarp owns async GPU failures.
class ArtBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.warn(
      "Orbital art module unavailable; using the local poster. Check the failed dynamic import before reloading.",
      error,
    );
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroBackground({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const { canAnimate, reducedMotion } = useSiteMotion();
  const lab = useHeroLabConfig();
  // Picked after mount so SSR and the first client render agree; every page
  // load re-rolls among the three approved warp patterns (no persistence).
  const [warp, setWarp] = useState<HeroWarpId | null>(null);

  useEffect(() => {
    setWarp(HERO_WARP_IDS[Math.floor(Math.random() * HERO_WARP_IDS.length)]);
  }, []);

  // The fullbleed toggle and the active art variant live on the section
  // itself so layout/legibility CSS never has to know about the lab.
  // Fullbleed is the shipped default; the lab can pin the framed variant.
  useEffect(() => {
    const hero = host.current?.closest<HTMLElement>(".nm2-hero");
    if (!hero) return;
    if (warp) hero.dataset.artVariant = warp;
    if (lab) hero.dataset.fullbleed = lab.fullbleed ? "true" : "false";
    return () => {
      delete hero.dataset.fullbleed;
      delete hero.dataset.artVariant;
    };
  }, [lab, warp]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    // Do not request a GPU context until animation is actually permitted.
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canAnimate || !inView || started) return;
    // HeroWarp catches initialization failures on its actual canvas.
    setStarted(true);
  }, [canAnimate, inView, started]);

  const warpPreset = warp ? HERO_WARP_PRESETS[warp] : null;

  return (
    <div
      ref={host}
      className={`nm2-hero-art ${className}`}
      data-art-variant={warp ?? undefined}
      aria-hidden="true"
    >
      {/* This local poster is also the immediate SSR/no-JS/error surface. */}
      <div className="nm2-hero-art__poster" />
      {started && !reducedMotion && warpPreset && (
        <ArtBoundary>
          <HeroWarp
            key={warpPreset.id}
            animate={canAnimate && inView}
            preset={warpPreset}
          />
        </ArtBoundary>
      )}
      <div className="nm2-hero-art__grain" />
      <div className="nm2-hero-art__shade" />
    </div>
  );
}
