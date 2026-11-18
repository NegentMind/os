"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import { HERO_SPECTRUM_TEXT } from "@/components/nm/v2/hero-preset";

const INTERVAL_MS = 2400;

/**
 * Cycles words in the real Orbital Display face inside the hero title.
 * Each step advances both the word and its ink through the approved
 * spectrum (the two dark bookends are excluded; they are base, not ink).
 * Decorative: the h1 carries the full accessible text, so this block is
 * aria-hidden and keeps a stable first word without JS and under
 * reduced/paused motion.
 */
export function RotatingWord({
  words,
  palette = HERO_SPECTRUM_TEXT,
}: {
  words: readonly string[];
  /** Ink colors cycled in sync with the word index. */
  palette?: readonly string[];
}) {
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

  const step = canAnimate ? index : 0;
  const word = words[step] ?? words[0];
  if (!word) return null;
  const ink = palette.length > 0 ? palette[step % palette.length] : undefined;

  return (
    <span
      className="nm2-rotating-word"
      style={{ "--nm2-rotor-ink": ink } as CSSProperties}
      aria-hidden="true"
      aria-live="off"
    >
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
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
