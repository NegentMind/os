import { ArrowRight, Database, Layers, Repeat2 } from "lucide-react";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { PageHero } from "@/components/nm/v2/page-hero";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { Surface } from "@/components/nm/v2/surface";
import { getSiteCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { metadataForPage, type MarketingPageProps } from "@/lib/marketing-metadata";
import { DISCUSSIONS_URL, VANTADB_DOCS, VANTADB_REPO } from "@/lib/site";
import { hrefFor } from "@/lib/site-routes";

export function generateMetadata({ params }: MarketingPageProps) {
  return metadataForPage(params, "vantadb");
}

const MECHANISM_ICONS = [Database, Layers, Repeat2];

export default async function VantadbPage({ params }: MarketingPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getSiteCopy(lang);
  const v = c.vantadb;

  return (
    <>
      <PageHero title={v.title} description={v.description} variant="memory">
        <ActionLink href={hrefFor(lang, "projects")} variant="text">{c.common.allProjects}</ActionLink>
        <div className="nm2-product-status">
          <StatusBadge status="active" label={c.common.active} />
        </div>
        <div className="nm2-actions">
          <ActionLink href={VANTADB_DOCS} external>{v.start.docsAction}</ActionLink>
          <ActionLink href={VANTADB_REPO} external variant="secondary">{c.common.source}</ActionLink>
        </div>
      </PageHero>
      <Section className="nm2-mechanism-section">
        <p className="nm2-product-thesis">{v.intro}</p>
        <SectionHeading title={v.diagram.title} description={v.diagram.description} />
        <figure className="nm2-mechanism">
          <ol className="nm2-mechanism-steps">
            {v.diagram.steps.map((step, index) => {
              const Icon = MECHANISM_ICONS[index];
              return (
                <li key={step.title}>
                  <div className="nm2-mechanism-symbol">
                    {Icon && <Icon aria-hidden="true" />}
                    <ArrowRight className="nm2-mechanism-arrow" aria-hidden="true" />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <p className="nm2-mechanism-detail">{step.detail}</p>
                </li>
              );
            })}
          </ol>
          <figcaption>{v.diagram.note}</figcaption>
        </figure>
      </Section>
      <Section>
        <div className="nm2-editorial nm2-use-cases">
          <SectionHeading title={v.fit.title} />
          <div className="nm2-method-list">
            {v.fit.items.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>
      <Section className="nm2-facts-section">
        <div className="nm2-editorial">
          <div>
            <SectionHeading title={v.facts.title} />
            <p className="nm2-facts-boundary">{v.facts.boundary}</p>
          </div>
          <dl className="nm2-facts">
            {v.facts.rows.map((row) => (
              <div key={row.term}>
                <dt>{row.term}</dt>
                <dd>{row.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
      <Section className="nm2-invitation-section">
        <Surface tone="spectrum" className="nm2-invitation">
          <SectionHeading title={v.start.title} description={v.start.body} />
          <div className="nm2-actions">
            <ActionLink href={VANTADB_DOCS} external>{v.start.docsAction}</ActionLink>
            <ActionLink href={VANTADB_REPO} external variant="secondary">{v.start.codeAction}</ActionLink>
          </div>
          <div className="nm2-question-link">
            <p>{v.start.question}</p>
            <ActionLink href={DISCUSSIONS_URL} external variant="text">{c.common.discussions}</ActionLink>
          </div>
        </Surface>
      </Section>
    </>
  );
}
