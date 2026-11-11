"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const CHAOS = "@#%?*+~!;:·";

function scrambleTo(target: string, progress: number): string {
  return target
    .split("")
    .map((ch, i) => {
      if (ch === " " || ch === "\n") return ch;
      const revealAt = i / target.length;
      if (progress >= revealAt) return ch;
      return CHAOS[(i * 7 + Math.floor(progress * 40)) % CHAOS.length];
    })
    .join("");
}

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

/** Headline that resolves from chaos glyphs to final copy on first view. */
export function GlitchWord({ text, className, as = "h2" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = usePrefersReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 900, 1);
      setFrame(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Fallback por si rAF se detiene (pestaña oculta, headless): resuelve igual.
    const fallback = window.setTimeout(() => setFrame(1), 1500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
    };
  }, [inView, reduced]);

  const shown = reduced || !inView ? text : scrambleTo(text, frame);
  const Tag = as as "div";

  return (
    <motion.div ref={ref} className={className}>
      <Tag aria-label={text} className="min-w-0 break-words">
        {shown}
      </Tag>
    </motion.div>
  );
}
