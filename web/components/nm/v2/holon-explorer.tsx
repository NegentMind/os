"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import type { SiteCopy } from "@/lib/content/en";

export function HolonExplorer({ copy, visionLabel, caption }: {
  copy: SiteCopy["home"]["holons"];
  visionLabel: string;
  caption: string;
}) {
  const [selected, setSelected] = useState(0);
  const { canAnimate } = useSiteMotion();
  const id = useId();
  const current = copy.items[selected];

  return (
    <div className="nm2-holon-explorer">
      <div className="nm2-holon-explorer__intro">
        <p className="nm2-lead">{copy.definition}</p>
        <p>{copy.usage}</p>
      </div>
      <div className="nm2-holon-explorer__composition">
        <ScrollScene className="nm2-holon-explorer__scene">
          <figure>
            <div className="nm2-holon-explorer__map">
              <svg className="nm2-holon-explorer__connections" viewBox="0 0 660 450" preserveAspectRatio="none" fill="none" aria-hidden="true">
                {[
                  "M110 75H330", "M330 75H550", "M550 75V225",
                  "M110 225V75", "M330 225H550", "M550 225V375",
                  "M110 375V225", "M330 375H110", "M550 375H330",
                ].map((path, index) => (
                  <path
                    key={path}
                    data-draw=""
                    data-active={selected === index}
                    d={path}
                  />
                ))}
              </svg>
              <div className="nm2-holon-explorer__modules" role="group" aria-label={copy.controls}>
                {copy.items.map((item, index) => (
                  <div key={item.name} data-float="" className="nm2-holon-explorer__module-seat">
                    <motion.button
                      type="button"
                      className="nm2-holon-explorer__module"
                      aria-pressed={selected === index}
                      aria-controls={`${id}-detail`}
                      onClick={() => setSelected(index)}
                      whileTap={canAnimate ? { scale: 0.97 } : undefined}
                      transition={{ duration: canAnimate ? 0.18 : 0 }}
                    >
                      <span className="nm2-holon-explorer__module-mark" aria-hidden="true" />
                      <span>{item.name}</span>
                      <span className="nm2-holon-explorer__module-state">{visionLabel}</span>
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
            <figcaption>{caption}</figcaption>
          </figure>
        </ScrollScene>
        <div id={`${id}-detail`} className="nm2-holon-explorer__detail" aria-live="polite" aria-atomic="true">
          <StatusBadge status="vision" label={visionLabel} />
          <h3>{current.name}</h3>
          <p className="nm2-holon-explorer__role">{current.role}</p>
          <p>{current.body}</p>
        </div>
      </div>
      <p className="nm2-story-boundary nm2-holon-explorer__boundary">{copy.boundary}</p>
    </div>
  );
}
