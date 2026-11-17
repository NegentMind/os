"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "motion/react";

type SiteMotion = {
  /** User paused decorative animation via the global footer control. */
  paused: boolean;
  /** OS prefers reduced motion. False until the preference is known. */
  reducedMotion: boolean;
  /** Only true once the OS preference is known, not reduced, and not paused. */
  canAnimate: boolean;
  togglePaused: () => void;
};

const SiteMotionContext = createContext<SiteMotion | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  // null until the media query resolves on the client — canAnimate must not
  // flash true before the real preference is known.
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const value = useMemo<SiteMotion>(
    () => ({
      paused,
      reducedMotion: reduced === true,
      canAnimate: reduced === false && !paused,
      togglePaused: () => setPaused((v) => !v),
    }),
    [paused, reduced],
  );

  // Mirror the effective state on <html> so CSS-only decorative loops in
  // the .nm2-site subtree stop too, without a JS render loop.
  useEffect(() => {
    document.documentElement.dataset.motion = value.canAnimate ? "on" : "off";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [value.canAnimate]);

  return (
    // Motion caches this policy at mount; pause is handled by live transitions
    // and canAnimate, without remounting content or resetting interaction state.
    <MotionConfig
      reducedMotion="user"
      transition={value.canAnimate ? undefined : { duration: 0 }}
    >
      <SiteMotionContext.Provider value={value}>
        {children}
      </SiteMotionContext.Provider>
    </MotionConfig>
  );
}

export function useSiteMotion(): SiteMotion {
  const ctx = useContext(SiteMotionContext);
  if (!ctx) {
    throw new Error("useSiteMotion must be used inside MotionProvider");
  }
  return ctx;
}
