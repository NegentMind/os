import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { BrandMark } from "@/components/nm/v2/brand-mark";
import { Faq } from "@/components/nm/v2/faq";
import { HeroBackground } from "@/components/nm/v2/hero-background";
import { ProjectCard } from "@/components/nm/v2/project-card";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { SpecList } from "@/components/nm/v2/spec-list";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { Surface } from "@/components/nm/v2/surface";
import { Button } from "@/components/ui/button";
import { getSiteCopy } from "@/lib/content";
import { MotionPreview } from "@/lib/content/design-system-preview";
import { isLocale } from "@/lib/i18n";
import type { MarketingPageProps } from "@/lib/marketing-metadata";
import { hrefFor } from "@/lib/site-routes";

export async function generateMetadata({ params }: MarketingPageProps): Promise<Metadata> {
  if (process.env.NODE_ENV !== "development") notFound();
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return {
    title: `${getSiteCopy(lang).common.gallery} — NEGENT MIND`,
    robots: { index: false, follow: false },
  };
}

const NEUTRALS = [
  "bg", "section", "surface", "raised", "text", "muted",
  "line", "structure", "action", "on-action",
];
const SPECTRUM = ["teal", "blue", "violet", "rose", "amber", "ice"];

export default async function DesignSystemPage({ params }: MarketingPageProps) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getSiteCopy(lang);
  const g = c.gallery;

  return (
    <>
      <Section className="nm2-page-intro">
        <SectionHeading as="h1" title={g.title} description={g.description} />
        <ActionLink href={`/${lang}/design-system/art`} variant="text">{g.artwork}</ActionLink>
      </Section>
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.brand} />
        <Surface className="nm2-gallery-brand">
          <BrandMark variant="wordmark" className="nm2-gallery-wordmark" />
          <BrandMark variant="monogram" className="nm2-gallery-monogram" />
        </Surface>
      </Section>
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.type} />
        <div className="nm2-type-specimen">
          <h3>{g.typeSample}</h3>
          <p>{g.bodySample}</p>
          <code>--nm2-text</code>
        </div>
      </Section>
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.neutrals} />
        <ul className="nm2-swatches">
          {NEUTRALS.map((token) => (
            <li key={token}>
              <span className={`nm2-swatch nm2-swatch-${token}`} aria-hidden="true" />
              <code>--nm2-{token}</code>
            </li>
          ))}
        </ul>
        <SectionHeading title={g.spectrum} className="nm2-gallery-subheading" />
        <ul className="nm2-swatches">
          {SPECTRUM.map((token) => (
            <li key={token}>
              <span className={`nm2-swatch nm2-swatch-${token}`} aria-hidden="true" />
              <code>--nm2-spectrum-{token}</code>
            </li>
          ))}
        </ul>
      </Section>
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.surfaces} />
        <div className="nm2-gallery-surfaces">
          <Surface><h3>{g.surface}</h3><p>{g.bodySample}</p></Surface>
          <Surface tone="raised"><h3>{g.raised}</h3><p>{g.bodySample}</p></Surface>
          <Surface tone="spectrum"><h3>{g.spectrumSurface}</h3><p>{g.bodySample}</p></Surface>
        </div>
      </Section>
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.actions} description={g.actionsNote} />
        <div className="nm2-actions">
          <ActionLink href={hrefFor(lang, "projects")}>{g.primary}</ActionLink>
          <ActionLink href={hrefFor(lang, "about")} variant="secondary">{g.secondary}</ActionLink>
          <ActionLink href={hrefFor(lang, "contribute")} variant="text">{g.text}</ActionLink>
          <Button disabled className="nm2-gallery-disabled">{g.disabled}</Button>
        </div>
        <SectionHeading title={g.status} className="nm2-gallery-subheading" />
        <div className="nm2-actions">
          <StatusBadge status="active" label={c.common.active} />
          <StatusBadge status="incubation" label={c.common.incubation} />
          <StatusBadge status="vision" label={c.common.vision} />
        </div>
      </Section>
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.cards} />
        <div className="nm2-gallery-projects">
          <ProjectCard
            name="VantaDB"
            summary={c.projects.vantadb.summary}
            status="active"
            statusLabel={c.common.active}
            featured
            href={hrefFor(lang, "vantadb")}
            actionLabel={c.common.exploreVantadb}
          >
            <p>{c.projects.vantadb.detail}</p>
          </ProjectCard>
          <ProjectCard
            name="Scopegrain"
            summary={c.projects.scopegrain.summary}
            status="incubation"
            statusLabel={c.common.incubation}
          >
            <p>{c.projects.scopegrain.body}</p>
          </ProjectCard>
        </div>
      </Section>
      <Section className="nm2-gallery-section">
        <SectionHeading title={c.vantadb.facts.title} />
        <SpecList className="nm2-facts" rows={c.vantadb.facts.rows} />
      </Section>
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.faq} />
        <Faq items={c.contribute.faq} />
      </Section>
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.motion} />
        <div className="nm2-gallery-art">
          <HeroBackground />
        </div>
        <MotionPreview copy={g} hero={c.hero} />
      </Section>
    </>
  );
}
