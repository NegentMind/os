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
 * Hierarchy: headline with the spectrum-inked rotating word, the actions
 * anchored left — each carrying its route as a mono micro-label — and the
 * support line closing the same row off-axis on the right.
 */
export function Hero({ lang, copy }: { lang: Locale; copy: HeroCopy }) {
  return (
    <section className="nm2-hero" aria-labelledby="hero-heading">
      {/* LCP: the hero poster is a CSS background on .nm2-hero-art__poster;
          preloading lets the browser fetch the webp while CSS still
          resolves. Scoped to this component so only the home route — the
          one that paints the poster — pays for it. React hoists the link
          to <head>. */}
      <link
        rel="preload"
        as="image"
        href="/brand/orbital-poster.webp"
        fetchPriority="high"
      />
      <HeroBackground />
      <HeroEntrance>
        <div className="nm2-hero__intro">
          <h1 id="hero-heading" className="nm2-hero__title" data-hero-reveal>
            {copy.title}
            <RotatingWord words={copy.titleWords} />
            <span className="sr-only">{copy.titleWords.join(", ")}</span>
          </h1>
          {/* DOM order matters: actions before lede so both share the grid's
              second row and baseline-align on desktop. */}
          <div className="nm2-hero__actions" data-hero-reveal>
            <div className="nm2-hero__action">
              <ActionLink href={hrefFor(lang, "projects")} variant="primary">
                {copy.primaryAction}
              </ActionLink>
              <span className="nm2-hero__action-path" aria-hidden="true">
                {hrefFor(lang, "projects")}
              </span>
            </div>
            <div className="nm2-hero__action">
              <ActionLink href={hrefFor(lang, "contribute")} variant="secondary">
                {copy.secondaryAction}
              </ActionLink>
              <span className="nm2-hero__action-path" aria-hidden="true">
                {hrefFor(lang, "contribute")}
              </span>
            </div>
          </div>
          <p className="nm2-hero__lede" data-hero-reveal>
            {copy.description}
          </p>
        </div>
        <div className="nm2-hero__meta">
          <p className="nm2-hero__note">{copy.note}</p>
        </div>
        <div className="nm2-hero__signature" data-hero-reveal>
          <BrandMark variant="wordmark" className="nm2-hero__wordmark" decorative />
        </div>
      </HeroEntrance>
    </section>
  );
}
