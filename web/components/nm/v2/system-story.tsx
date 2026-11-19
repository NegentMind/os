"use client";

import { useEffect, useRef, useState } from "react";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { CoreOrb } from "@/components/nm/v2/core-orb";
import { DriftCanvas } from "@/components/nm/v2/drift-canvas";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import { useCompositionLabConfig } from "@/components/nm/v2/section-transition/transition-lab";
import type { SiteCopy } from "@/lib/content/en";

type SystemStoryProps = {
  copy: SiteCopy["home"]["statement"]["system"];
  caption: string;
  /** "orb" is the v2 default; pass "blueprint" to restore the diagram scene. */
  art?: "orb" | "blueprint";
};

/**
 * The conceptual system told as scroll-driven assembly: a sticky dark stage
 * (drift currents + orb at the center) while the five steps flow beside it.
 * Each step lights its capability node and draws its spoke until the whole
 * ring is assembled. GSAP owns the scroll choreography; the DOM always
 * renders the assembled state first, so reduced motion or a failed import
 * keeps every element visible.
 */
export function SystemStory({ copy, caption, art = "orb" }: SystemStoryProps) {
  const root = useRef<HTMLDivElement>(null);
  const { canAnimate } = useSiteMotion();
  // -1 = not scroll-driven (SSR, reduced motion): the stage renders its
  // static fully-assembled state. 0..items.length-1 = the active step.
  const [stage, setStage] = useState(-1);
  const labArt = useCompositionLabConfig()?.orgArt;
  const effectiveArt = labArt ?? art;
  const nodes = copy.items.slice(1);
  const current = stage >= 0 ? copy.items[stage] : undefined;

  useEffect(() => {
    const element = root.current;
    if (!element || !canAnimate) return;

    let disposed = false;
    let context: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);

        const scoped = gsap.context(() => {}, element);
        context = scoped;
        scoped.add(() => {
          const steps = element.querySelector<HTMLElement>(
            ".nm2-system-story__steps",
          );
          const articles = Array.from(
            element.querySelectorAll<HTMLElement>("[data-step]"),
          );
          element.style.setProperty("--nm2-system-progress", "0");
          // The stage starts disassembled (orb alone) as soon as the
          // choreography owns it; the first step re-assembles on scroll.
          setStage(0);

          // Discrete thresholds, not zones: each article claims the stage
          // crossing its own line down and hands it back scrolling up, so
          // overlapping viewports can never oscillate between two steps.
          articles.forEach((article, index) => {
            ScrollTrigger.create({
              trigger: article,
              start: "top 58%",
              onEnter: () => setStage(index),
              onLeaveBack: () => setStage(Math.max(0, index - 1)),
            });
          });

          if (steps) {
            const sync = (progress: number) => {
              element.style.setProperty(
                "--nm2-system-progress",
                progress.toFixed(4),
              );
            };
            ScrollTrigger.create({
              trigger: steps,
              start: "top 55%",
              end: "bottom 45%",
              onUpdate: (self) => sync(self.progress),
              onRefresh: (self) => sync(self.progress),
            });
          }
        });
      })
      .catch((error: unknown) => {
        context?.revert();
        if (disposed) return;
        console.warn(
          "Orbital SystemStory: scroll choreography unavailable; the assembled diagram and full text remain. Check the gsap/ScrollTrigger dynamic chunks before reloading.",
          error,
        );
      });

    return () => {
      disposed = true;
      context?.revert();
      element.style.removeProperty("--nm2-system-progress");
      setStage(-1);
    };
  }, [canAnimate]);

  return (
    <div
      ref={root}
      className="nm2-system-story"
      data-stage={stage >= 0 ? stage : undefined}
    >
      <figure className="nm2-system-story__stage nm2-tone-dark">
        <DriftCanvas className="nm2-system-story__drift" />
        <div className="nm2-system-story__meta" aria-hidden="true">
          <span className="nm2-system-story__readout">
            {current ? (
              <>
                <span className="nm2-system-story__index">
                  {String(stage + 1).padStart(2, "0")}
                </span>
                {current.label}
              </>
            ) : null}
          </span>
          <span className="nm2-system-story__rail">
            <span className="nm2-system-story__rail-fill" />
          </span>
        </div>
        <div className="nm2-system-story__art" data-art={effectiveArt}>
          {effectiveArt === "orb" ? (
            <>
              <svg
                className="nm2-assembly"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <ellipse
                  className="nm2-assembly__orbit"
                  cx="50"
                  cy="50"
                  rx="33"
                  ry="29"
                  pathLength={400}
                />
                <line
                  className="nm2-assembly__spoke nm2-assembly__spoke--0"
                  x1="50" y1="50" x2="20" y2="17"
                  pathLength={100}
                />
                <line
                  className="nm2-assembly__spoke nm2-assembly__spoke--1"
                  x1="50" y1="50" x2="80" y2="17"
                  pathLength={100}
                />
                <line
                  className="nm2-assembly__spoke nm2-assembly__spoke--2"
                  x1="50" y1="50" x2="80" y2="83"
                  pathLength={100}
                />
                <line
                  className="nm2-assembly__spoke nm2-assembly__spoke--3"
                  x1="50" y1="50" x2="20" y2="83"
                  pathLength={100}
                />
              </svg>
              <CoreOrb
                actionLabel={copy.orbAction}
                className="nm2-system-story__orb"
              />
              <div className="nm2-assembly__nodes" aria-hidden="true">
                {nodes.map((item, index) => (
                  <span
                    key={item.label}
                    className={`nm2-assembly__node nm2-assembly__node--${index}`}
                  >
                    <span className="nm2-assembly__index">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                    {item.label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <BlueprintScene
              variant="system"
              labels={copy.items.map((item) => item.label)}
              selected={stage >= 0 ? stage : undefined}
            />
          )}
        </div>
        <figcaption className="nm2-system-story__caption">{caption}</figcaption>
      </figure>
      <div
        className="nm2-system-story__steps"
        role="group"
        aria-label={copy.controls}
      >
        {copy.items.map((item, index) => (
          <article
            key={item.label}
            className="nm2-system-story__step"
            data-step=""
            data-active={stage === index || undefined}
          >
            <span className="nm2-system-story__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{item.label}</h3>
            <p>{item.body}</p>
          </article>
        ))}
        <p className="nm2-story-boundary" data-scroll-reveal="">
          {copy.boundary}
        </p>
      </div>
    </div>
  );
}
