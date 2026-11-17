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
            <BlueprintScene variant="scope" expanded={exploded} />
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
