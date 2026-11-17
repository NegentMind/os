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
import type { HeroArtPreset } from "@/components/nm/v2/hero-preset";

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
      "Orbital art module unavailable; using the static backdrop. Check the failed dynamic import before reloading.",
      error,
    );
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Section-scoped warp backdrop: same lifecycle contract as the hero art
 * (no GPU context until visible and animated motion is allowed; CSS gradient
 * remains the no-JS/reduced/error surface). Absolute fill of the nearest
 * positioned ancestor.
 */
export function ArtMount({
  preset,
  className = "",
}: {
  preset: HeroArtPreset;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const { canAnimate, reducedMotion } = useSiteMotion();

  useEffect(() => {
    const element = host.current;
    if (!element) return;
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
    setStarted(true);
  }, [canAnimate, inView, started]);

  return (
    <div
      ref={host}
      className={`nm2-art-mount ${className}`}
      data-art-preset={preset.id}
      aria-hidden="true"
    >
      <div className="nm2-art-mount__poster" />
      {started && !reducedMotion && (
        <ArtBoundary>
          <HeroWarp animate={canAnimate && inView} preset={preset} />
        </ArtBoundary>
      )}
    </div>
  );
}
