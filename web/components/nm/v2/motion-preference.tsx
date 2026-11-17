"use client";

import { Pause, Play } from "lucide-react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import type { HeroCopy } from "@/lib/marketing-types";

export type MotionPreferenceCopy = Pick<
  HeroCopy,
  "pauseMotion" | "resumeMotion" | "reducedMotion"
>;

export function MotionPreference({ copy }: { copy: MotionPreferenceCopy }) {
  const { paused, reducedMotion, togglePaused } = useSiteMotion();
  const Icon = paused && !reducedMotion ? Play : Pause;
  return (
    <button
      type="button"
      className="nm2-motion-preference"
      aria-pressed={paused || reducedMotion}
      disabled={reducedMotion}
      onClick={togglePaused}
    >
      <Icon size={14} aria-hidden="true" />
      {reducedMotion ? copy.reducedMotion : paused ? copy.resumeMotion : copy.pauseMotion}
    </button>
  );
}
