import { ActionLink } from "@/components/nm/v2/action-link";
import type { SiteCopy } from "@/lib/content/en";
import { displayUrl } from "@/lib/site";

/*
 * EvidencePath — the home "working method" section (#proof) as a route
 * instead of a workbench: a rail carries three stations — source code,
 * written context, conversation — each one a real artifact the visitor
 * can open. Hollow nodes mark the two inspection stops; the filled
 * terminal node is the conversation, the destination of the path.
 *
 * No interactivity of its own: the rail is an SVG path with `data-draw`
 * and each station carries `data-scroll-reveal`, so the Section's
 * ScrollScene traces the line and staggers the stops on entry. Server
 * component; reduced motion or no JS leaves the full route drawn.
 */

type EvidencePathProps = {
  copy: SiteCopy["home"]["method"];
  links: { repository: string; documentation: string; discussions: string };
  labels: { documentation: string; discussions: string };
};

export function EvidencePath({ copy, links, labels }: EvidencePathProps) {
  const stations = [
    {
      kind: copy.evidence.code,
      title: copy.items[0].title,
      body: copy.items[0].body,
      href: links.repository,
      action: copy.sourceAction,
    },
    {
      kind: copy.evidence.context,
      title: copy.items[1].title,
      body: copy.items[1].body,
      href: links.documentation,
      action: labels.documentation,
    },
    {
      kind: copy.evidence.conversation,
      title: copy.evidence.conversationTitle,
      body: copy.evidence.conversationBody,
      href: links.discussions,
      action: labels.discussions,
    },
  ];

  return (
    <div className="nm2-evidence-path">
      {/* Horizontal rail (desktop) and vertical rail (mobile): the section's
          ScrollScene draws whichever is visible as the visitor arrives. */}
      <svg
        className="nm2-evidence-path__rail nm2-evidence-path__rail--h"
        viewBox="0 0 1000 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M2 12H998" data-draw="" />
      </svg>
      <svg
        className="nm2-evidence-path__rail nm2-evidence-path__rail--v"
        viewBox="0 0 24 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M12 2V998" data-draw="" />
      </svg>
      <ol className="nm2-evidence-path__stations">
        {stations.map((station, index) => (
          <li
            key={station.kind}
            className="nm2-evidence-path__station"
            data-terminal={index === stations.length - 1 || undefined}
            data-scroll-reveal=""
          >
            <span className="nm2-evidence-path__node" aria-hidden="true" />
            <p className="nm2-evidence-path__meta">
              <span className="nm2-evidence-path__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              {station.kind}
            </p>
            <h3 className="nm2-evidence-path__title">{station.title}</h3>
            <p className="nm2-evidence-path__body">{station.body}</p>
            <div className="nm2-evidence-path__route">
              <ActionLink href={station.href} external variant="text">
                {station.action}
              </ActionLink>
              <span className="nm2-evidence-path__dest">{displayUrl(station.href)}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
