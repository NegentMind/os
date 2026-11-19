import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { FieldCanvas } from "@/components/nm/v2/field-canvas";
import { PageCta } from "@/components/nm/v2/page-cta";
import { PageHero } from "@/components/nm/v2/page-hero";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { SectionTransition } from "@/components/nm/v2/section-transition/section-transition";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { VantaStrata } from "@/components/nm/v2/vanta-strata";
import { getSiteCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { metadataForPage, type MarketingPageProps } from "@/lib/marketing-metadata";
import { DISCUSSIONS_URL, VANTADB_DOCS, VANTADB_REPO } from "@/lib/site";
import { hrefFor } from "@/lib/site-routes";

export function generateMetadata({ params }: MarketingPageProps) {
  return metadataForPage(params, "vantadb");
}

export default async function VantadbPage({ params }: MarketingPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getSiteCopy(lang);
  const v = c.vantadb;

  return (
    <div className="nm2-page">
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
      <Section
        className="nm2-mechanism-section"
        backdrop={
          <FieldCanvas
            variant="memory"
            className="nm2-backdrop-field nm2-backdrop-field--memory"
          />
        }
      >
        <p className="nm2-product-thesis">{v.intro}</p>
        <SectionHeading title={v.diagram.title} description={v.diagram.description} effect="decode" />
        <figure className="nm2-mechanism">
          <div className="nm2-mechanism__composition">
            {/* The artifact the steps act on: the .vanta strata plate,
                same signature drawing the home work section carries. */}
            <div className="nm2-mechanism-art">
              <VantaStrata layers={v.diagram.art.layers} core={v.diagram.art.core} />
            </div>
            <ol className="nm2-mechanism-steps">
              {v.diagram.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="nm2-mechanism-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <p className="nm2-mechanism-detail">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
          <figcaption>{v.diagram.note}</figcaption>
        </figure>
      </Section>
      <Section>
        <div className="nm2-editorial nm2-use-cases">
          <SectionHeading title={v.fit.title} effect="decode" />
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
      <SectionTransition id="vantadb-paper" variant="chromatic" />
      <Section className="nm2-facts-section nm2-section--paper">
        <div className="nm2-editorial">
          <div>
            <SectionHeading title={v.facts.title} effect="decode" />
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
        <PageCta
          title={v.start.title}
          description={v.start.body}
          action={{ href: VANTADB_DOCS, label: v.start.docsAction, external: true }}
          secondary={{ href: VANTADB_REPO, label: v.start.codeAction, external: true }}
          note={{
            text: v.start.question,
            link: { href: DISCUSSIONS_URL, label: c.common.discussions, external: true },
          }}
          variant="memory"
          effect="decode"
        />
      </Section>
    </div>
  );
}
