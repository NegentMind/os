"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import type { SiteCopy } from "@/lib/content/en";

export function ScopeStudy({ copy, caption }: {
  copy: SiteCopy["home"]["work"]["scopeStudy"];
  caption: string;
}) {
  const [exploded, setExploded] = useState(false);
  const { canAnimate } = useSiteMotion();
  const id = useId();

  return (
    <div className="nm2-scope-study" data-exploded={exploded}>
      <ScrollScene>
        <figure>
          <div className="nm2-scope-study__art" aria-hidden="true">
            <BlueprintScene variant="scope" />
            <svg className="nm2-scope-study__planes" viewBox="0 0 640 420" fill="none">
              {[0, 1, 2].map((plane) => (
                <g key={plane} className={`nm2-scope-study__plane nm2-scope-study__plane--${plane}`}>
                  <path data-draw="" d="M180 130l240 -35 40 195 -240 35Z" />
                  <path d="M202 147l201 -29 34 159 -201 29Z" />
                </g>
              ))}
            </svg>
          </div>
          <figcaption>{caption}</figcaption>
        </figure>
      </ScrollScene>
      <motion.button
        type="button"
        className="nm2-story-control"
        aria-pressed={exploded}
        aria-controls={`${id}-detail`}
        onClick={() => setExploded((value) => !value)}
        whileTap={canAnimate ? { scale: 0.97 } : undefined}
        transition={{ duration: canAnimate ? 0.18 : 0 }}
      >
        {copy.action}
      </motion.button>
      <p id={`${id}-detail`} className="nm2-scope-study__note" aria-live="polite">
        {exploded ? copy.exploded : copy.bounded}
      </p>
    </div>
  );
}
