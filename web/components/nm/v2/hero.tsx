import type { Locale } from "@/lib/i18n";
import type { HeroCopy } from "@/lib/marketing-types";
import { hrefFor } from "@/lib/site-routes";
import { ActionLink } from "@/components/nm/v2/action-link";
import { BrandMark } from "@/components/nm/v2/brand-mark";
import { HeroBackground } from "@/components/nm/v2/hero-background";
import { HeroEntrance } from "@/components/nm/v2/hero-entrance";
import { RotatingWord } from "@/components/nm/v2/rotating-word";

/**
 * Content and navigation are server-rendered. The two client leaves enhance
 * this composition; neither WebGL nor an entrance animation gates the page.
 */
export function Hero({ lang, copy }: { lang: Locale; copy: HeroCopy }) {
  return (
    <section className="nm2-hero" aria-labelledby="hero-heading">
      <HeroBackground />
      <HeroEntrance>
        <div className="nm2-hero__intro">
          <h1 id="hero-heading" className="nm2-hero__title" data-hero-reveal>
            {copy.title}
            <RotatingWord words={copy.titleWords} />
            <span className="sr-only">{copy.titleWords.join(", ")}</span>
          </h1>
        </div>
        <div className="nm2-hero__meta">
          <div className="nm2-hero__aside">
            <p className="nm2-hero__description" data-hero-reveal>
              {copy.description}
            </p>
            <div className="nm2-hero__actions" data-hero-reveal>
              <ActionLink href={hrefFor(lang, "projects")} variant="primary">
                {copy.primaryAction}
              </ActionLink>
              <ActionLink href={hrefFor(lang, "contribute")} variant="secondary">
                {copy.secondaryAction}
              </ActionLink>
            </div>
          </div>
          <p className="nm2-hero__note">{copy.note}</p>
        </div>
        <div className="nm2-hero__signature" data-hero-reveal>
          <BrandMark variant="wordmark" className="nm2-hero__wordmark" decorative />
        </div>
      </HeroEntrance>
    </section>
  );
}
