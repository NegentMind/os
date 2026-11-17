"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { CoreOrb } from "@/components/nm/v2/core-orb";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import { useCompositionLabConfig } from "@/components/nm/v2/section-transition/transition-lab";
import type { SiteCopy } from "@/lib/content/en";

type SystemStoryProps = {
  copy: SiteCopy["home"]["statement"]["system"];
  caption: string;
  /** "orb" is the v2 default; pass "blueprint" to restore the diagram scene. */
  art?: "orb" | "blueprint";
};

export function SystemStory({ copy, caption, art = "orb" }: SystemStoryProps) {
  const [selected, setSelected] = useState(0);
  const { canAnimate } = useSiteMotion();
  const id = useId();
  const current = copy.items[selected];
  // The TransitionLab composition toggle overrides the canonical orb.
  const labArt = useCompositionLabConfig()?.orgArt;
  const effectiveArt = labArt ?? art;

  return (
    <div className="nm2-system-story" data-selected={selected}>
      <ScrollScene className="nm2-system-story__scene">
        <figure>
          {/* The orb is a real toggle (focusable), so the wrapper stays in
              the a11y tree; BlueprintScene hides its own decorative SVG. */}
          <div
            className="nm2-system-story__art"
            data-art={effectiveArt}
          >
            {effectiveArt === "orb" ? (
              <CoreOrb actionLabel={copy.orbAction} />
            ) : (
              <BlueprintScene
                variant="system"
                labels={copy.items.map((item) => item.label)}
                selected={selected}
              />
            )}
          </div>
          <figcaption>{caption}</figcaption>
        </figure>
      </ScrollScene>
      <div className="nm2-system-story__reading" data-scroll-reveal="">
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
