"use client";

import { useId, useState } from "react";
import { ArtFigure } from "@/components/nm/v2/art-figure";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { StoryControl } from "@/components/nm/v2/story-controls";

/** Self-contained copy contract: the study lives in the library, not in a page dict. */
export type ScopeStudyCopy = {
  action: string;
  bounded: string;
  exploded: string;
};

export function ScopeStudy({ copy, caption }: {
  copy: ScopeStudyCopy;
  caption: string;
}) {
  const [exploded, setExploded] = useState(false);
  const id = useId();

  return (
    <div className="nm2-scope-study" data-exploded={exploded}>
      <ScrollScene>
        <ArtFigure caption={caption} frameClassName="nm2-scope-study__art">
          <BlueprintScene variant="scope" expanded={exploded} />
        </ArtFigure>
      </ScrollScene>
      <StoryControl
        pressed={exploded}
        controlsId={`${id}-detail`}
        onSelect={() => setExploded((value) => !value)}
      >
        {copy.action}
      </StoryControl>
      <p id={`${id}-detail`} className="nm2-scope-study__note" aria-live="polite">
        {exploded ? copy.exploded : copy.bounded}
      </p>
    </div>
  );
}
