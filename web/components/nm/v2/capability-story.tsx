import { ActionLink } from "@/components/nm/v2/action-link";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import type { SiteCopy } from "@/lib/content/en";

export function CapabilityStory({ copy, caption }: {
  copy: SiteCopy["home"]["capabilities"];
  caption: string;
}) {
  return (
    <ScrollScene className="nm2-capability-story">
      <div className="nm2-capability-story__copy">
        <article className="nm2-capability-story__today" data-scroll-reveal="">
          <p className="nm2-map-state">{copy.currentLabel}</p>
          <h3>{copy.currentTitle}</h3>
          <p>{copy.currentBody}</p>
          <ol className="nm2-capability-story__flow">
            {copy.diagram.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </article>
        <article id="compare" className="nm2-capability-story__vision" data-scroll-reveal="">
          <p className="nm2-map-state">{copy.futureLabel}</p>
          <h3>{copy.futureTitle}</h3>
          <p>{copy.futureBody}</p>
          <span id="not" className="nm2-anchor" aria-hidden="true" />
          <ActionLink href="#holons" variant="text">{copy.mapLink}</ActionLink>
        </article>
      </div>
      <figure className="nm2-capability-story__figure">
        <div className="nm2-capability-story__art" aria-hidden="true">
          <BlueprintScene variant="memory" labels={copy.diagram} />
        </div>
        <figcaption>{caption}</figcaption>
      </figure>
    </ScrollScene>
  );
}
