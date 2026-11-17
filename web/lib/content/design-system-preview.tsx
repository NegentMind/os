"use client";

import { Pause, Play } from "lucide-react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import type { SiteCopy } from "@/lib/content";

/** Interactive leaf for the development gallery; public pages stay server-rendered. */
export function MotionPreview({
  copy,
  hero,
}: {
  copy: SiteCopy["gallery"];
  hero: SiteCopy["hero"];
}) {
  const { paused, reducedMotion, canAnimate, togglePaused } = useSiteMotion();
  const message = reducedMotion
    ? copy.motionReduced
    : paused
      ? copy.motionPaused
      : canAnimate
        ? copy.motionActive
        : copy.motionUnknown;

  return (
    <div className="nm2-motion-preview">
      <p role="status">{message}</p>
      <button
        type="button"
        className="nm2-gallery-motion-control"
        onClick={togglePaused}
        disabled={reducedMotion}
        aria-pressed={paused}
      >
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        {reducedMotion ? hero.reducedMotion : paused ? hero.resumeMotion : hero.pauseMotion}
      </button>
    </div>
  );
}
