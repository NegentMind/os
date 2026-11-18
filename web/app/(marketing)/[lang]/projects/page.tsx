import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { FieldCanvas } from "@/components/nm/v2/field-canvas";
import { PageCta } from "@/components/nm/v2/page-cta";
import { PageHero } from "@/components/nm/v2/page-hero";
import { ProjectCard } from "@/components/nm/v2/project-card";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { SectionTransition } from "@/components/nm/v2/section-transition/section-transition";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { getSiteCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { metadataForPage, type MarketingPageProps } from "@/lib/marketing-metadata";
import { VANTADB_REPO } from "@/lib/site";
import { hrefFor } from "@/lib/site-routes";

export function generateMetadata({ params }: MarketingPageProps) {
  return metadataForPage(params, "projects");
}

export default async function ProjectsPage({ params }: MarketingPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getSiteCopy(lang);
  const p = c.projects;

  return (
    <div className="nm2-page">
      <PageHero title={p.title} description={p.description} variant="network" />
      <Section
        className="nm2-portfolio"
        backdrop={
          <FieldCanvas
            variant="network"
            className="nm2-backdrop-field nm2-backdrop-field--network"
          />
        }
      >
        <ProjectCard
          name="VantaDB"
          summary={p.vantadb.summary}
          status="active"
          statusLabel={c.common.active}
          href={hrefFor(lang, "vantadb")}
          actionLabel={c.common.exploreVantadb}
          featured
          headingLevel={2}
          className="nm2-portfolio-flagship"
        >
          <div className="nm2-project-detail nm2-project-detail-text">
            <div className="nm2-prose">
              <p>{p.vantadb.body}</p>
              <p>{p.vantadb.detail}</p>
              <ActionLink href={VANTADB_REPO} external variant="text">{c.common.source}</ActionLink>
            </div>
            <ul className="nm2-project-materials">
              {c.home.work.vantadbFacts.map((fact) => <li key={fact}>{fact}</li>)}
            </ul>
          </div>
        </ProjectCard>
        <ProjectCard
          name="Scopegrain"
          summary={p.scopegrain.summary}
          status="incubation"
          statusLabel={c.common.incubation}
          headingLevel={2}
          className="nm2-portfolio-prototype"
        >
          <div className="nm2-prose">
            <p>{p.scopegrain.body}</p>
            <p>{p.scopegrain.detail}</p>
          </div>
        </ProjectCard>
      </Section>
      <SectionTransition id="projects-paper" variant="blocks" />
      <Section className="nm2-vision-boundary nm2-section--paper">
        <div className="nm2-editorial">
          <SectionHeading title={p.boundary.title} effect="trace" />
          <div className="nm2-prose">
            <p>{p.boundary.body}</p>
            <StatusBadge status="vision" label={c.common.vision} />
            <ActionLink href={`${hrefFor(lang, "about")}#vision`} variant="text">{p.boundary.action}</ActionLink>
          </div>
        </div>
        <PageCta
          title={p.closing.title}
          description={p.closing.body}
          action={{ href: hrefFor(lang, "vantadb"), label: c.common.exploreVantadb }}
          secondary={{ href: hrefFor(lang, "contribute"), label: c.nav.contribute }}
          variant="network"
          effect="trace"
        />
      </Section>
    </div>
  );
}
