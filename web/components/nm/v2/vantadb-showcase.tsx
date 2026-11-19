import { ActionLink } from "@/components/nm/v2/action-link";
import { ArtFigure } from "@/components/nm/v2/art-figure";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { VantaStrata } from "@/components/nm/v2/vanta-strata";
import type { SiteCopy } from "@/lib/content/en";

/*
 * VantaShowcase — the flagship block of the home work section.
 *
 * Composition: identity + problem/body copy and actions on the left, the
 * VantaStrata plate as the dominant piece on the right. The retrieval
 * pipeline and spec sheet live on /projects/vantadb, where that level of
 * detail belongs. Content only; reveals are owned by the section's
 * ScrollScene.
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
    </div>
  );
}
