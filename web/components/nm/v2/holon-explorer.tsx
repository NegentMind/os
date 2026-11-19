"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ActionLink } from "@/components/nm/v2/action-link";
import { ArtFigure } from "@/components/nm/v2/art-figure";
import { HolonField } from "@/components/nm/v2/holon-field";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { StoryDetail } from "@/components/nm/v2/story-detail";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import type { SiteCopy } from "@/lib/content/en";

export function HolonExplorer({ copy, visionLabel, activeLabel, vantaLink, caption }: {
  copy: SiteCopy["home"]["holons"];
  visionLabel: string;
  activeLabel: string;
  vantaLink: { href: string; label: string };
  caption: string;
}) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const { canAnimate } = useSiteMotion();
  const id = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  // VantaDB seats after the nine vision holons; its cell is the solid
  // membrane, last in HOLON_LAYOUT (holon-field.tsx) — keep them in sync.
  const vantaIndex = copy.items.length;
  const isVanta = selected === vantaIndex;
  const current = isVanta
    ? { name: copy.vanta.name, role: copy.vanta.tagline, body: copy.vanta.body }
    : copy.items[selected];

  // Arrow keys rove the membrane seats like a radio group: the field has no
  // meaningful spatial reading order for cursor keys, so they cycle the map.
  const onModuleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const count = copy.items.length + 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % count;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + count) % count;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = count - 1;
    }
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    groupRef.current
      ?.querySelectorAll<HTMLButtonElement>("button")
      [next]?.focus();
  };

  return (
    <div className="nm2-holon-explorer">
      <div className="nm2-holon-explorer__intro">
        <p className="nm2-lead">{copy.definition}</p>
        <p>{copy.usage}</p>
      </div>
      <div className="nm2-holon-explorer__composition">
        <ScrollScene className="nm2-holon-explorer__scene">
          {/* The membrane seats are real buttons, so the map frame stays in
              the a11y tree; the HolonField art is decorative. */}
          <ArtFigure
            caption={caption}
            frameClassName="nm2-holon-explorer__map"
            decorative={false}
            frameProps={{ "data-float": "" }}
          >
            <HolonField selected={selected} hovered={hovered} />
            <span className="nm2-holon-explorer__whole" aria-hidden="true">
              {copy.whole}
            </span>
            <div
              ref={groupRef}
              className="nm2-holon-explorer__modules"
              role="group"
              aria-label={copy.controls}
            >
              {copy.items.map((item, index) => (
                <div
                  key={item.name}
                  className={`nm2-holon-explorer__module-seat nm2-holon-explorer__module-seat--${index}`}
                >
                  <motion.button
                    type="button"
                    className="nm2-holon-explorer__module"
                    aria-pressed={selected === index}
                    aria-controls={`${id}-detail`}
                    onClick={() => setSelected(index)}
                    onKeyDown={(event) => onModuleKeyDown(event, index)}
                    onPointerEnter={() => setHovered(index)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    whileTap={canAnimate ? { scale: 0.97 } : undefined}
                    transition={{ duration: canAnimate ? 0.18 : 0 }}
                  >
                    <span className="nm2-holon-explorer__module-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.name}</span>
                  </motion.button>
                </div>
              ))}
              {/* The built piece joins the same seat grammar; data-built
                  marks the solid membrane's control for styling. */}
              <div
                className={`nm2-holon-explorer__module-seat nm2-holon-explorer__module-seat--${vantaIndex}`}
                data-built=""
              >
                <motion.button
                  type="button"
                  className="nm2-holon-explorer__module"
                  aria-pressed={isVanta}
                  aria-controls={`${id}-detail`}
                  onClick={() => setSelected(vantaIndex)}
                  onKeyDown={(event) => onModuleKeyDown(event, vantaIndex)}
                  onPointerEnter={() => setHovered(vantaIndex)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(vantaIndex)}
                  onBlur={() => setHovered(null)}
                  whileTap={canAnimate ? { scale: 0.97 } : undefined}
                  transition={{ duration: canAnimate ? 0.18 : 0 }}
                >
                  <span className="nm2-holon-explorer__module-index" aria-hidden="true">
                    {String(vantaIndex + 1).padStart(2, "0")}
                  </span>
                  <span>{copy.vanta.name}</span>
                </motion.button>
              </div>
            </div>
          </ArtFigure>
        </ScrollScene>
        <StoryDetail id={`${id}-detail`} className="nm2-holon-explorer__detail">
          <StatusBadge
            status={isVanta ? "active" : "vision"}
            label={isVanta ? activeLabel : visionLabel}
          />
          <h3>{current.name}</h3>
          <p className="nm2-holon-explorer__role">{current.role}</p>
          <p>{current.body}</p>
          {isVanta ? (
            <ActionLink
              href={vantaLink.href}
              variant="text"
              className="nm2-holon-explorer__action"
            >
              {vantaLink.label}
            </ActionLink>
          ) : null}
        </StoryDetail>
      </div>
      <p className="nm2-story-boundary nm2-holon-explorer__boundary">{copy.boundary}</p>
    </div>
  );
}
