"use client";

import { useEffect, useRef } from "react";
import { stagger, useAnimate, useInView } from "motion/react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";

export type HeadingEffect = "assemble" | "focus" | "trace";

export function AnimatedHeading({
  text,
  effect = "assemble",
}: {
  text: string;
  effect?: HeadingEffect;
}) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const inView = useInView(scope, { once: true, amount: 0.2 });
  const prepared = useRef(false);
  const played = useRef(false);
  const { canAnimate } = useSiteMotion();

  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    if (!canAnimate) {
      animate(".nm2-animated-heading__word", { opacity: 1, y: 0 }, { duration: 0 });
      prepared.current = false;
      return;
    }
    if (played.current) return;
    const rect = element.getBoundingClientRect();
    if (!prepared.current) {
      // Prepare only outside the viewport; never knock already-visible text down.
      if (rect.top < window.innerHeight) {
        played.current = true;
        return;
      }
      animate(
        ".nm2-animated-heading__word",
        { opacity: 0.2, y: effect === "trace" ? "85%" : "50%" },
        { duration: 0 },
      );
      prepared.current = true;
    }
    if (!inView) return;
    played.current = true;
    const count = element.querySelectorAll(".nm2-animated-heading__word").length;
    const controls = animate(
      ".nm2-animated-heading__word",
      { opacity: 1, y: 0 },
      {
        duration: effect === "focus" ? 1 : 0.85,
        delay: stagger(Math.min(0.055, 0.35 / Math.max(1, count - 1))),
        ease: [0.22, 1, 0.36, 1],
      },
    );
    return () => {
      controls.stop();
    };
  }, [animate, canAnimate, effect, inView, scope]);

  // SSR renders the whole readable title; only the visual text is split.
  return (
    <span
      ref={scope}
      className={`nm2-animated-heading nm2-animated-heading--${effect}`}
    >
      {text.split(/(\s+)/).map((word, index) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span key={`${word}-${index}`} className="nm2-animated-heading__mask">
            <span className="nm2-animated-heading__word">{word}</span>
          </span>
        ),
      )}
    </span>
  );
}
