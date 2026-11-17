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
import { FieldCanvas, type FieldVariant } from "@/components/nm/v2/field-canvas";
import { HERO_WARP_PRESETS } from "@/components/nm/v2/hero-preset";
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

const FIELD_VARIANTS = {
  "wave-field": "wave",
  "orbit-field": "orbit",
  "network-field": "network",
  "memory-field": "memory",
} as const satisfies Record<string, FieldVariant>;

export function HeroBackground({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const { canAnimate, reducedMotion } = useSiteMotion();
  const lab = useHeroLabConfig();
  const background = lab?.background ?? "warp-stripes";
  const warpPreset =
    background in HERO_WARP_PRESETS
      ? HERO_WARP_PRESETS[background as keyof typeof HERO_WARP_PRESETS]
      : null;
  const fieldVariant =
    background in FIELD_VARIANTS
      ? FIELD_VARIANTS[background as keyof typeof FIELD_VARIANTS]
      : null;

  // The fullbleed toggle and the active art variant live on the section
  // itself so layout/legibility CSS never has to know about the lab.
  useEffect(() => {
    const hero = host.current?.closest<HTMLElement>(".nm2-hero");
    if (!hero) return;
    hero.dataset.artVariant = background;
    if (lab?.fullbleed) hero.dataset.fullbleed = "true";
    else delete hero.dataset.fullbleed;
    return () => {
      delete hero.dataset.fullbleed;
      delete hero.dataset.artVariant;
    };
  }, [lab?.fullbleed, background]);

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

  return (
    <div
      ref={host}
      className={`nm2-hero-art ${className}`}
      data-art-variant={background}
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
      {started && !reducedMotion && fieldVariant && (
        <div className="nm2-hero-art__field">
          <FieldCanvas
            variant={fieldVariant}
            interactive
            pointerHost=".nm2-hero"
          />
        </div>
      )}
      <div className="nm2-hero-art__grain" />
      <div className="nm2-hero-art__shade" />
    </div>
  );
}
