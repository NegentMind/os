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
      aria-hidden="true"
    >
      {/* This local poster is also the immediate SSR/no-JS/error surface. */}
      <div className="nm2-hero-art__poster" />
      {started && !reducedMotion && (
        <ArtBoundary>
          <HeroWarp animate={canAnimate && inView} />
        </ArtBoundary>
      )}
      <div className="nm2-hero-art__grain" />
      <div className="nm2-hero-art__shade" />
    </div>
  );
}
