"use client";

import { useEffect, useRef } from "react";
import { stagger, useAnimate, useInView } from "motion/react";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import { OrbitalWord } from "@/components/nm/v2/orbital-glyphs";
import { useCompositionLabConfig } from "@/components/nm/v2/section-transition/transition-lab";

export type HeadingEffect = "assemble" | "focus" | "trace" | "decode";

const WORD = ".nm2-animated-heading__word";
const GLYPHS = "▮▯░▒01/<>";
const DECODE_MS = 700;
const GLYPH_STEP_MS = 55;
const EASE = [0.22, 1, 0.36, 1] as const;

function randomGlyphs(original: string, resolved: number): string {
  let out = "";
  for (let i = 0; i < original.length; i++) {
    out +=
      i < resolved
        ? original[i]
        : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

function setWordText(word: HTMLElement, value: string) {
  const node = word.firstChild;
  if (node) node.nodeValue = value;
}

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
  // The TransitionLab composition toggles override the call-site rendering:
  // `orbital` swaps the word-split type for Orbital lettering outright,
  // `heading` only swaps which entrance effect plays on the type.
  const lab = useCompositionLabConfig();
  const labEffect = lab?.heading;
  const effective = labEffect ?? effect;
  const lastEffect = useRef(effective);

  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    // A live lab change re-arms preparation for the next pass; already
    // visible headings keep their readable state instead of replaying.
    if (lastEffect.current !== effective) {
      lastEffect.current = effective;
      prepared.current = false;
      played.current = false;
    }
    const words = Array.from(element.querySelectorAll<HTMLElement>(WORD));
    const line = element.querySelector<HTMLElement>(".nm2-animated-heading__line");
    let raf = 0;
    let stopped = false;
    let controls: { stop: () => void } | undefined;

    const readable = () => {
      for (const word of words) {
        setWordText(word, word.dataset.text ?? word.textContent ?? "");
        word.removeAttribute("style");
      }
      line?.removeAttribute("style");
    };

    if (!canAnimate) {
      readable();
      prepared.current = false;
      return;
    }
    if (played.current) return;

    if (!prepared.current) {
      // Prepare only outside the viewport; never knock already-visible text down.
      if (element.getBoundingClientRect().top < window.innerHeight) {
        played.current = true;
        return;
      }
      if (effective === "trace" && line) {
        animate(line, { clipPath: "inset(0 100% 0 0)" }, { duration: 0 });
      } else if (effective === "focus") {
        animate(words, { opacity: 0.2, filter: "blur(10px)" }, { duration: 0 });
      } else if (effective === "decode") {
        for (const word of words) {
          word.style.minWidth = `${word.getBoundingClientRect().width}px`;
          setWordText(word, randomGlyphs(word.dataset.text ?? "", 0));
        }
      } else {
        animate(words, { opacity: 0, y: "60%" }, { duration: 0 });
      }
      prepared.current = true;
    }
    if (!inView) return;
    played.current = true;

    const delay = stagger(Math.min(0.055, 0.35 / Math.max(1, words.length - 1)));
    if (effective === "trace" && line) {
      controls = animate(
        line,
        { clipPath: "inset(0 0% 0 0)" },
        { duration: 1.1, ease: EASE },
      );
    } else if (effective === "focus") {
      controls = animate(
        words,
        { opacity: 1, filter: "blur(0px)" },
        { duration: 1, delay, ease: EASE },
      );
    } else if (effective === "decode") {
      const originals = words.map((word) => word.dataset.text ?? "");
      const total = originals.reduce((sum, word) => sum + word.length, 0);
      const start = performance.now();
      let lastGlyph = -GLYPH_STEP_MS;
      const tick = (now: number) => {
        if (stopped) return;
        const progress = Math.min(1, (now - start) / DECODE_MS);
        if (progress >= 1) {
          readable();
          return;
        }
        if (now - lastGlyph >= GLYPH_STEP_MS) {
          lastGlyph = now;
          let remaining = Math.floor(progress * total);
          words.forEach((word, index) => {
            const length = originals[index].length;
            const resolved = Math.min(length, remaining);
            remaining -= resolved;
            setWordText(word, randomGlyphs(originals[index], resolved));
          });
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else {
      controls = animate(
        words,
        { opacity: 1, y: 0 },
        { duration: 0.85, delay, ease: EASE },
      );
    }

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      controls?.stop();
    };
  }, [animate, canAnimate, effective, inView, scope]);

  // The visual split is hidden from assistive tech; sr-only carries the title.
  // Lab-only eval variant: Orbital lettering replaces the animated type —
  // the letters are artwork, so the entrance choreography does not apply.
  if (lab?.orbitalHeadings) {
    return (
      <>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" className="nm2-orbital-heading">
          {text.split(/\s+/).filter(Boolean).map((word, index) => (
            <OrbitalWord key={`${word}-${index}`} word={word} />
          ))}
        </span>
      </>
    );
  }
  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        ref={scope}
        aria-hidden="true"
        className={`nm2-animated-heading nm2-animated-heading--${effective}`}
      >
        <span className="nm2-animated-heading__line">
          {text.split(/(\s+)/).map((word, index) =>
            /^\s+$/.test(word) ? (
              word
            ) : (
              <span key={`${word}-${index}`} className="nm2-animated-heading__mask">
                <span className="nm2-animated-heading__word" data-text={word}>
                  {word}
                </span>
              </span>
            ),
          )}
        </span>
      </span>
    </>
  );
}
