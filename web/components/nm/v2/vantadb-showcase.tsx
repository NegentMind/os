import { ActionLink } from "@/components/nm/v2/action-link";
import { ArtFigure } from "@/components/nm/v2/art-figure";
import { SpecList } from "@/components/nm/v2/spec-list";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { VantaStrata } from "@/components/nm/v2/vanta-strata";
import type { SiteCopy } from "@/lib/content/en";

/*
 * VantaShowcase — the flagship block of the home work section.
 *
 * Composition: identity + problem/body copy and actions on the left, the
 * VantaStrata plate on the right, and a full-width ledger underneath that
 * pairs the hybrid-retrieval pipeline (node-card grammar) with the concrete
 * spec sheet. Content only; reveals are owned by the section's ScrollScene.
 */
export function VantaShowcase({
  copy,
  status,
  caption,
  links,
  labels,
}: {
  copy: SiteCopy["home"]["work"]["vanta"];
  /** Localized "active" badge label. */
  status: string;
  /** Provenance caption for the art plate. */
  caption: string;
  links: { product: string; repo: string };
  labels: { product: string; repo: string };
}) {
  return (
    <div className="nm2-vanta">
      <div className="nm2-vanta__lead">
        <div className="nm2-vanta__identity" data-scroll-reveal="">
          <div className="nm2-ledger-name">
            <h3 className="nm2-vanta__name">{copy.name}</h3>
            <StatusBadge status="active" label={status} />
          </div>
          <p className="nm2-vanta__tagline">{copy.tagline}</p>
        </div>
        <div className="nm2-prose" data-scroll-reveal="">
          <p className="nm2-lead">{copy.problem}</p>
          <p>{copy.body}</p>
        </div>
        <div className="nm2-actions" data-scroll-reveal="">
          <ActionLink href={links.product}>{labels.product}</ActionLink>
          <ActionLink href={links.repo} external variant="text" className="nm2-vanta__repo">
            {labels.repo}
          </ActionLink>
        </div>
      </div>
      <ArtFigure
        caption={caption}
        className="nm2-vanta__figure"
        frameClassName="nm2-vanta__art"
      >
        <VantaStrata layers={copy.art.layers} core={copy.art.core} />
      </ArtFigure>
      <div className="nm2-vanta__ledger">
        <div className="nm2-vanta__retrieval" data-scroll-reveal="">
          <h4 className="nm2-vanta__label">{copy.retrievalLabel}</h4>
          <ol className="nm2-vanta__pipeline">
            {copy.pipeline.map((step, index) => (
              <li key={step.name}>
                <span className="nm2-vanta__pipe-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="nm2-vanta__pipe-name">{step.name}</span>
                <span className="nm2-vanta__pipe-detail">{step.detail}</span>
              </li>
            ))}
          </ol>
          <p className="nm2-vanta__note">{copy.retrievalNote}</p>
        </div>
        <div className="nm2-vanta__specs" data-scroll-reveal="">
          <h4 className="nm2-vanta__label">{copy.specsLabel}</h4>
          <SpecList rows={copy.specs} className="nm2-facts" />
        </div>
      </div>
    </div>
  );
}
