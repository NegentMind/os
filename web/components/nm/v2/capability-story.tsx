import { ActionLink } from "@/components/nm/v2/action-link";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { FieldCanvas } from "@/components/nm/v2/field-canvas";
import { ScrollScene } from "@/components/nm/v2/scroll-scene";
import type { SiteCopy } from "@/lib/content/en";

export function CapabilityStory({ copy, caption }: {
  copy: SiteCopy["home"]["capabilities"];
  caption: string;
}) {
  return (
    <ScrollScene className="nm2-capability-story">
      <div className="nm2-capability-story__copy">
        <article className="nm2-capability-story__today">
          <p className="nm2-map-state">{copy.currentLabel}</p>
          <h3>{copy.currentTitle}</h3>
          <p>{copy.currentBody}</p>
          <ol className="nm2-capability-story__flow">
            {copy.diagram.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </article>
        <article id="compare" className="nm2-capability-story__vision">
          <p className="nm2-map-state">{copy.futureLabel}</p>
          <h3>{copy.futureTitle}</h3>
          <p>{copy.futureBody}</p>
          <span id="not" className="nm2-anchor" aria-hidden="true" />
          <ActionLink href="#holons" variant="text">{copy.mapLink}</ActionLink>
        </article>
      </div>
      <figure className="nm2-capability-story__figure">
        <div className="nm2-capability-story__art" aria-hidden="true">
          <FieldCanvas variant="orbit" className="nm2-capability-story__field" />
          <div data-float="" className="nm2-capability-story__blueprint">
            <BlueprintScene variant="capabilities" />
          </div>
          <svg className="nm2-capability-story__rails" viewBox="0 0 720 680" fill="none">
            <path data-draw="" d="M40 110h100c120 0 90 220 220 220s130 240 260 240h60" />
            <path data-draw="" d="M40 130h90c100 0 110 220 230 220s150 240 270 240h50" />
            <path data-draw="" d="M40 150h80c100 0 130 220 240 220s170 240 280 240h40" />
          </svg>
        </div>
        <figcaption>{caption}</figcaption>
      </figure>
    </ScrollScene>
  );
}
