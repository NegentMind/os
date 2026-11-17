"use client";

import { motion } from "motion/react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";

export type HeadingEffect = "assemble" | "focus" | "trace";

export function AnimatedHeading({
  text,
  effect = "assemble",
}: {
  text: string;
  effect?: HeadingEffect;
}) {
  const { canAnimate } = useSiteMotion();
  const transition = {
    duration: canAnimate ? 0.4 : 0,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  // No hidden initial state: SSR, no-JS and paused readers get the real title.
  // Only the visual text is split; no duplicate screen-reader-only heading.
  if (effect === "assemble") {
    const words = text.split(/(\s+)/);
    const wordCount = Math.max(1, Math.ceil(words.length / 2) - 1);
    return (
      <span className="nm2-animated-heading nm2-animated-heading--assemble">
        {words.map((word, index) =>
          /^\s+$/.test(word) ? word : (
            <motion.span
              key={`${word}-${index}`}
              className="nm2-animated-heading__word"
              initial={false}
              whileInView={canAnimate ? { y: [8, 0] } : { y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                ...transition,
                delay: canAnimate ? (Math.floor(index / 2) / wordCount) * 0.1 : 0,
              }}
            >
              {word}
            </motion.span>
          ),
        )}
      </span>
    );
  }

  return (
    <span className={`nm2-animated-heading nm2-animated-heading--${effect}`}>
      <motion.span
        className="nm2-animated-heading__line"
        initial={false}
        whileInView={canAnimate
          ? effect === "focus"
            ? { filter: ["blur(3px)", "blur(0px)"] }
            : { y: ["0.12em", "0em"], clipPath: ["inset(0 0 10% 0)", "inset(0 0 0% 0)"] }
          : { y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, amount: 0.5 }}
        transition={transition}
      >
        {text}
      </motion.span>
    </span>
  );
}
