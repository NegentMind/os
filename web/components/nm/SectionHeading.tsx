"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  title: ReactNode;
  lede?: string;
  className?: string;
};

/**
 * Section heading: the heading carries its own weight (no kicker).
 * `index` is a scale/depth readout, not decoration — the descent order.
 */
export function SectionHeading({ index, title, lede, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("max-w-3xl", className)}
    >
      <p
        aria-hidden="true"
        className="font-mono text-xs tracking-[0.2em] text-fog tabular-nums"
      >
        {index}
      </p>
      <h2 className="font-display mt-4 text-4xl font-bold uppercase leading-[1.05] tracking-[0.04em] text-bone sm:text-5xl">
        {title}
      </h2>
      {lede ? (
        <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-fog">
          {lede}
        </p>
      ) : null}
    </motion.div>
  );
}
