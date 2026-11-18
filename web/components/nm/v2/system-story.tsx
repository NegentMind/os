"use client";

import { useId, useState } from "react";
import { ArtFigure } from "@/components/nm/v2/art-figure";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { CoreOrb } from "@/components/nm/v2/core-orb";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { StoryControl, StoryControls } from "@/components/nm/v2/story-controls";
import { StoryDetail } from "@/components/nm/v2/story-detail";
import { useCompositionLabConfig } from "@/components/nm/v2/section-transition/transition-lab";
import type { SiteCopy } from "@/lib/content/en";

type SystemStoryProps = {
  copy: SiteCopy["home"]["statement"]["system"];
  caption: string;
  /** "orb" is the v2 default; pass "blueprint" to restore the diagram scene. */
  art?: "orb" | "blueprint";
};

export function SystemStory({ copy, caption, art = "orb" }: SystemStoryProps) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const current = copy.items[selected];
  // The TransitionLab composition toggle overrides the canonical orb.
  const labArt = useCompositionLabConfig()?.orgArt;
  const effectiveArt = labArt ?? art;

  return (
    <div className="nm2-system-story" data-selected={selected}>
      <ScrollScene className="nm2-system-story__scene">
        {/* The orb is a real toggle (focusable), so the frame stays in the
            a11y tree; BlueprintScene hides its own decorative SVG. */}
        <ArtFigure
          caption={caption}
          frameClassName="nm2-system-story__art"
          decorative={false}
          frameProps={{ "data-art": effectiveArt }}
        >
          {effectiveArt === "orb" ? (
            <CoreOrb actionLabel={copy.orbAction} />
          ) : (
            <BlueprintScene
              variant="system"
              labels={copy.items.map((item) => item.label)}
              selected={selected}
            />
          )}
        </ArtFigure>
      </ScrollScene>
      <div className="nm2-system-story__reading" data-scroll-reveal="">
        <StoryControls label={copy.controls}>
          {copy.items.map((item, index) => (
            <StoryControl
              key={item.label}
              pressed={selected === index}
              controlsId={`${id}-detail`}
              onSelect={() => setSelected(index)}
            >
              {item.label}
            </StoryControl>
          ))}
        </StoryControls>
        <StoryDetail id={`${id}-detail`}>
          <h3>{current.label}</h3>
          <p>{current.body}</p>
        </StoryDetail>
        <p className="nm2-story-boundary">{copy.boundary}</p>
      </div>
    </div>
  );
}
