"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import type { SiteCopy } from "@/lib/content/en";

type SystemStoryProps = {
  copy: SiteCopy["home"]["statement"]["system"];
  caption: string;
};

export function SystemStory({ copy, caption }: SystemStoryProps) {
  const [selected, setSelected] = useState(0);
  const { canAnimate } = useSiteMotion();
  const id = useId();
  const current = copy.items[selected];

  return (
    <div className="nm2-system-story" data-selected={selected}>
      <ScrollScene className="nm2-system-story__scene">
        <figure>
          <div className="nm2-system-story__art" aria-hidden="true">
            <BlueprintScene variant="system" />
            <svg className="nm2-system-story__signals" viewBox="0 0 640 420" fill="none">
              {[
                "M320 182l-58 29-54-67", "M320 182l58 29 64 68",
                "M320 182l54-27 54-3", "M320 182l-54 27-54 68",
              ].map((path, index) => (
                <path key={path} d={path} data-draw="" data-active={selected === index + 1} />
              ))}
              {[[320, 182], [208, 144], [442, 279], [428, 152], [212, 277]].map(([cx, cy], index) => (
                <circle key={index} cx={cx} cy={cy} r={selected === index ? 17 : 7} data-active={selected === index} />
              ))}
            </svg>
          </div>
          <figcaption>{caption}</figcaption>
        </figure>
      </ScrollScene>
      <div className="nm2-system-story__reading">
        <div className="nm2-story-controls" role="group" aria-label={copy.controls}>
          {copy.items.map((item, index) => (
            <motion.button
              key={item.label}
              type="button"
              className="nm2-story-control"
              aria-pressed={selected === index}
              aria-controls={`${id}-detail`}
              onClick={() => setSelected(index)}
              whileTap={canAnimate ? { scale: 0.97 } : undefined}
              transition={{ duration: canAnimate ? 0.18 : 0 }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
        <div id={`${id}-detail`} className="nm2-story-detail" aria-live="polite" aria-atomic="true">
          <h3>{current.label}</h3>
          <p>{current.body}</p>
        </div>
        <p className="nm2-story-boundary">{copy.boundary}</p>
      </div>
    </div>
  );
}
