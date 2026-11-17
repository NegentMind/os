"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import type { SiteCopy } from "@/lib/content/en";

type MemoryDemoProps = {
  steps: SiteCopy["vantadb"]["diagram"]["steps"];
  controlsLabel: string;
  caption: string;
};

const PLATE_X = 230;
const PLATE_Y = [130, 176, 222] as const;
const PLATE_HALF_W = 120;
const PLATE_HALF_H = 60;
const PLATE_EDGE = 10;
const LABEL_X = 400;

function MemoryStack({
  labels,
  selected,
}: {
  labels: readonly string[];
  selected: number;
}) {
  const order = [2, 1, 0];
  return (
    <div className="nm2-memory-stack" data-float="">
      <svg
        className="nm2-memory-stack__svg"
        viewBox="0 0 640 420"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {PLATE_Y.map((cy, index) => (
          <path
            key={`guide-${index}`}
            className="nm2-memory-stack__guide"
            data-draw=""
            d={`M${PLATE_X} ${cy}H${LABEL_X - 8}`}
          />
        ))}
        {order.map((index) => {
          const cy = PLATE_Y[index];
          const x0 = PLATE_X - PLATE_HALF_W;
          const x1 = PLATE_X + PLATE_HALF_W;
          return (
            <g
              key={`plate-${index}`}
              className="nm2-memory-stack__plate"
              data-selected={selected === index || undefined}
            >
              <path
                className="nm2-memory-stack__side"
                d={`M${x0} ${cy}V${cy + PLATE_EDGE}L${PLATE_X} ${cy + PLATE_HALF_H + PLATE_EDGE}V${cy + PLATE_HALF_H}Z`}
              />
              <path
                className="nm2-memory-stack__side"
                d={`M${x1} ${cy}V${cy + PLATE_EDGE}L${PLATE_X} ${cy + PLATE_HALF_H + PLATE_EDGE}V${cy + PLATE_HALF_H}Z`}
              />
              <path
                className="nm2-memory-stack__top"
                d={`M${x0} ${cy}L${PLATE_X} ${cy - PLATE_HALF_H}L${x1} ${cy}L${PLATE_X} ${cy + PLATE_HALF_H}Z`}
              />
            </g>
          );
        })}
      </svg>
      <ol className="nm2-memory-stack__labels">
        {PLATE_Y.map((_, index) => (
          <li
            key={index}
            className="nm2-memory-stack__label"
            data-selected={selected === index || undefined}
          >
            <span className="nm2-memory-stack__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            {labels[index]}
          </li>
        ))}
      </ol>
    </div>
  );
}

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
            <MemoryStack labels={steps.map((step) => step.title)} selected={selected} />
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
