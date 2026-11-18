import { ActionLink } from "@/components/nm/v2/action-link";
import type { HeadingEffect } from "@/components/nm/v2/animated-heading";
import { FieldCanvas, type FieldVariant } from "@/components/nm/v2/field-canvas";
import { SectionHeading } from "@/components/nm/v2/section-heading";

export type PageCtaLink = {
  href: string;
  label: string;
  external?: boolean;
};

type PageCtaProps = {
  title: string;
  description?: string;
  action: PageCtaLink;
  secondary?: PageCtaLink;
  /** Closing footnote: quiet line + text link (e.g. "questions → Discussions"). */
  note?: { text: string; link: PageCtaLink };
  /** Small identity art: the page's PageHero field drawn inside the card. */
  variant?: FieldVariant;
  effect?: HeadingEffect;
};

/**
 * Shared closing block for interior pages: a dark card that carries the
 * last ask before the footer. Sits at the end of the page's paper section,
 * so the carbon panel reads as the inverse of its chapter.
 */
export function PageCta({
  title,
  description,
  action,
  secondary,
  note,
  variant,
  effect,
}: PageCtaProps) {
  return (
    <div className="nm2-page-cta nm2-tone-dark">
      {variant ? (
        <FieldCanvas
          variant={variant}
          className="nm2-page-cta__field"
        />
      ) : null}
      <div className="nm2-page-cta__copy">
        <SectionHeading title={title} description={description} effect={effect} />
        <div className="nm2-actions">
          <ActionLink href={action.href} external={action.external}>
            {action.label}
          </ActionLink>
          {secondary ? (
            <ActionLink
              href={secondary.href}
              external={secondary.external}
              variant="secondary"
            >
              {secondary.label}
            </ActionLink>
          ) : null}
        </div>
        {note ? (
          <div className="nm2-question-link">
            <p>{note.text}</p>
            <ActionLink
              href={note.link.href}
              external={note.link.external}
              variant="text"
            >
              {note.link.label}
            </ActionLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
