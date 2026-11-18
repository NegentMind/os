"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";

/*
 * Story controls — the segmented selectors that drive the home stories
 * (SystemStory, MemoryDemo) and the single toggle in ScopeStudy.
 *
 * `StoryControls` is the `role="group"` frame; `StoryControl` is the
 * motion button with the shared contract: `aria-pressed` + `aria-controls`
 * wiring to a StoryDetail region, a 0.97 tap scale that exists only while
 * animated motion is allowed, and a 0.18s transition (0s otherwise).
 * Centralizing it keeps the three call sites from drifting.
 */
export function StoryControls({
  label,
  className,
  children,
}: {
  /** Accessible group label (e.g. copy.controls). */
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={["nm2-story-controls", className].filter(Boolean).join(" ")}
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  );
}

export function StoryControl({
  pressed,
  controlsId,
  onSelect,
  className,
  children,
}: {
  /** Selection state rendered as `aria-pressed`. */
  pressed: boolean;
  /** `id` of the StoryDetail region this control drives. */
  controlsId: string;
  onSelect: () => void;
  className?: string;
  children: ReactNode;
}) {
  const { canAnimate } = useSiteMotion();
  return (
    <motion.button
      type="button"
      className={["nm2-story-control", className].filter(Boolean).join(" ")}
      aria-pressed={pressed}
      aria-controls={controlsId}
      onClick={onSelect}
      whileTap={canAnimate ? { scale: 0.97 } : undefined}
      transition={{ duration: canAnimate ? 0.18 : 0 }}
    >
      {children}
    </motion.button>
  );
}
