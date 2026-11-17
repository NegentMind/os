import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { ProjectCard } from "@/components/nm/v2/project-card";
import { PageHero } from "@/components/nm/v2/page-hero";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
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
    <>
      <PageHero title={p.title} description={p.description} variant="network" />
      <Section className="nm2-portfolio">
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
      <Section className="nm2-vision-boundary">
        <div className="nm2-editorial">
          <SectionHeading title={p.boundary.title} />
          <div className="nm2-prose">
            <p>{p.boundary.body}</p>
            <StatusBadge status="vision" label={c.common.vision} />
            <ActionLink href={`${hrefFor(lang, "about")}#vision`} variant="text">{p.boundary.action}</ActionLink>
          </div>
        </div>
      </Section>
    </>
  );
}
