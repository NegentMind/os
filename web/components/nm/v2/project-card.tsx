import type { ReactNode } from "react";
import type { ProjectState } from "@/lib/marketing-types";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { ActionLink } from "@/components/nm/v2/action-link";

type ProjectCardProps = {
  name: string;
  summary: string;
  status: ProjectState;
  statusLabel: string;
  href?: string;
  actionLabel?: string;
  featured?: boolean;
  headingLevel?: 2 | 3;
  children?: ReactNode;
  className?: string;
};

export function ProjectCard({
  name,
  summary,
  status,
  statusLabel,
  href,
  actionLabel,
  featured = false,
  headingLevel = 3,
  children,
  className,
}: ProjectCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={["nm2-project-card", className].filter(Boolean).join(" ")}
      data-featured={featured || undefined}
    >
      <div className="nm2-project-card__top">
        <Heading className="nm2-project-card__name">{name}</Heading>
        <StatusBadge status={status} label={statusLabel} />
      </div>
      <p className="nm2-project-card__summary">{summary}</p>
      {children ? <div className="nm2-project-card__body">{children}</div> : null}
      {href && actionLabel ? (
        <div className="nm2-project-card__actions">
          <ActionLink href={href} variant="text">
            {actionLabel}
          </ActionLink>
        </div>
      ) : null}
    </article>
  );
}
