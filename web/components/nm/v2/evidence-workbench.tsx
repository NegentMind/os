"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { ActionLink } from "@/components/nm/v2/action-link";
import { ArtFigure } from "@/components/nm/v2/art-figure";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import { useSiteMotion } from "@/components/nm/v2/motion-provider";
import { StoryDetail } from "@/components/nm/v2/story-detail";
import type { SiteCopy } from "@/lib/content/en";

type EvidenceWorkbenchProps = {
  copy: SiteCopy["home"]["method"];
  links: { repository: string; documentation: string; discussions: string };
  labels: { documentation: string; discussions: string };
  caption: string;
};

export function EvidenceWorkbench({ copy, links, labels, caption }: EvidenceWorkbenchProps) {
  const [selected, setSelected] = useState(0);
  const { canAnimate } = useSiteMotion();
  const id = useId();
  const entries = [
    { label: copy.evidence.code, title: copy.items[0].title, body: copy.items[0].body, href: links.repository, action: copy.sourceAction },
    { label: copy.evidence.context, title: copy.items[1].title, body: copy.items[1].body, href: links.documentation, action: labels.documentation },
    { label: copy.evidence.conversation, title: copy.evidence.conversation, body: copy.evidence.conversationBody, href: links.discussions, action: labels.discussions },
  ];
  const current = entries[selected];

  return (
    <div className="nm2-evidence-workbench" data-selected={selected}>
      <div className="nm2-evidence-workbench__ledger" role="group" aria-label={copy.evidence.controls}>
        {entries.map((entry, index) => (
          <div key={entry.label} className="nm2-evidence-workbench__entry" data-active={selected === index} data-scroll-reveal="">
            <motion.button
              type="button"
              className="nm2-evidence-workbench__select"
              aria-pressed={selected === index}
              aria-controls={`${id}-detail`}
              onClick={() => setSelected(index)}
              whileTap={canAnimate ? { x: 3 } : undefined}
              transition={{ duration: canAnimate ? 0.18 : 0 }}
            >
              {entry.label}
            </motion.button>
            <ActionLink href={entry.href} external variant="text">{entry.action}</ActionLink>
          </div>
        ))}
      </div>
      <div className="nm2-evidence-workbench__study">
        <ScrollScene>
          <ArtFigure caption={caption} frameClassName="nm2-evidence-workbench__art">
            <BlueprintScene
              variant="evidence"
              labels={entries.map((entry) => entry.label)}
              selected={selected}
            />
          </ArtFigure>
        </ScrollScene>
        <StoryDetail id={`${id}-detail`}>
          <h3>{current.title}</h3>
          <p>{current.body}</p>
        </StoryDetail>
      </div>
    </div>
  );
}
