"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import { OrbitalWord } from "@/components/nm/v2/orbital-glyphs";

const INTERVAL_MS = 2400;

/**
 * Cycles Orbital-lettered words inside the hero title. Decorative: the h1
 * carries the full accessible text, so this block is aria-hidden and keeps a
 * stable first word without JS and under reduced/paused motion.
 */
export function RotatingWord({ words }: { words: readonly string[] }) {
  const { canAnimate } = useSiteMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!canAnimate || words.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [canAnimate, words.length]);

  const word = words[canAnimate ? index : 0] ?? words[0];
  if (!word) return null;

  return (
    <span className="nm2-rotating-word" aria-hidden="true" aria-live="off">
      {/* Sync mode: entering and exiting words overlap (items are absolutely
          stacked in CSS), so the headline never shows an empty slot. */}
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          className="nm2-rotating-word__item"
          initial={canAnimate ? { y: "-0.28em", opacity: 0, filter: "blur(6px)" } : false}
          animate={{ y: "0em", opacity: 1, filter: "blur(0px)" }}
          exit={canAnimate ? { y: "0.28em", opacity: 0, filter: "blur(6px)" } : undefined}
          transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
        >
          <OrbitalWord word={word} />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
