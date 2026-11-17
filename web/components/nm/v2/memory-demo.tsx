"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import type { SiteCopy } from "@/lib/content/en";

type MemoryDemoProps = {
  steps: SiteCopy["vantadb"]["diagram"]["steps"];
  controlsLabel: string;
  caption: string;
};

export function MemoryDemo({ steps, controlsLabel, caption }: MemoryDemoProps) {
  const [selected, setSelected] = useState(0);
  const { canAnimate } = useSiteMotion();
  const id = useId();
  const current = steps[selected];

  return (
    <div className="nm2-memory-demo" data-stage={selected}>
      <ScrollScene className="nm2-memory-demo__scene">
        <figure>
          <div className="nm2-memory-demo__art" aria-hidden="true">
            <BlueprintScene variant="memory" />
            <svg className="nm2-memory-demo__layers" viewBox="0 0 640 420" fill="none">
              {[0, 1, 2].map((layer) => (
                <g key={layer} className="nm2-memory-demo__layer" data-active={selected === layer}>
                  <path
                    d={`M295 ${154 - layer * 62}l152 88-102 59-152-88Z`}
                    data-draw=""
                  />
                </g>
              ))}
            </svg>
          </div>
          <figcaption>{caption}</figcaption>
        </figure>
      </ScrollScene>
      <div className="nm2-story-controls nm2-memory-demo__controls" role="group" aria-label={controlsLabel}>
        {steps.map((step, index) => (
          <motion.button
            key={step.title}
            type="button"
            className="nm2-story-control"
            aria-pressed={selected === index}
            aria-controls={`${id}-detail`}
            onClick={() => setSelected(index)}
            whileTap={canAnimate ? { scale: 0.97 } : undefined}
            transition={{ duration: canAnimate ? 0.18 : 0 }}
          >
            {step.title}
          </motion.button>
        ))}
      </div>
      <div id={`${id}-detail`} className="nm2-story-detail nm2-memory-demo__detail" aria-live="polite" aria-atomic="true">
        <h4>{current.title}</h4>
        <p>{current.body}</p>
        <p className="nm2-memory-demo__context">{current.detail}</p>
      </div>
    </div>
  );
}
