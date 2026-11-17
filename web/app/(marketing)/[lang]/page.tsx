import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { CapabilityStory } from "@/components/nm/v2/capability-story";
import { EvidenceWorkbench } from "@/components/nm/v2/evidence-workbench";
import { Faq } from "@/components/nm/v2/faq";
import { FieldCanvas } from "@/components/nm/v2/field-canvas";
import { Hero } from "@/components/nm/v2/hero";
import { HolonExplorer } from "@/components/nm/v2/holon-explorer";
import { MemoryDemo } from "@/components/nm/v2/memory-demo";
import { ProjectCard } from "@/components/nm/v2/project-card";
import { ScopeStudy } from "@/components/nm/v2/scope-study";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { SectionTransition } from "@/components/nm/v2/section-transition/section-transition";
import {
  TransitionLab,
  TransitionLabProvider,
} from "@/components/nm/v2/section-transition/transition-lab";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { SystemStory } from "@/components/nm/v2/system-story";
import { getSiteCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { metadataForPage, type MarketingPageProps } from "@/lib/marketing-metadata";
import { DISCUSSIONS_URL, ORG_URL, VANTADB_DOCS, VANTADB_REPO } from "@/lib/site";
import { hrefFor } from "@/lib/site-routes";

export function generateMetadata({ params }: MarketingPageProps) {
  return metadataForPage(params, "home");
}

export default async function Home({ params }: MarketingPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getSiteCopy(lang);
  const h = c.home;

  return (
    <TransitionLabProvider>
    <div className="nm2-home">
      <div id="top">
        <Hero lang={lang} copy={c.hero} />
      </div>
      <SectionTransition id="org-in" variant="chromatic" />
      <Section id="org" className="nm2-statement-section nm2-section--paper">
        <div className="nm2-editorial">
          <SectionHeading title={h.statement.title} id="org-title" effect="assemble" />
          <div className="nm2-prose">
            <p className="nm2-lead">{h.statement.body}</p>
            <p>{h.statement.aside}</p>
            <ActionLink href={hrefFor(lang, "about")} variant="text">{c.common.principles}</ActionLink>
          </div>
        </div>
        <SystemStory copy={h.statement.system} caption={c.common.conceptual} />
      </Section>
      <SectionTransition id="org-out" variant="dither" from="light" to="dark" />
      <Section
        id="work"
        className="nm2-work-section"
        backdrop={<FieldCanvas variant="wave" className="nm2-backdrop-field nm2-backdrop-field--wave" />}
      >
        <span id="status" className="nm2-anchor" aria-hidden="true" />
        <SectionHeading title={h.work.title} description={h.work.description} effect="trace" />
        <span id="engine" className="nm2-anchor" aria-hidden="true" />
        <ProjectCard
          name={h.work.vantadbName}
          summary={h.work.vantadbSummary}
          status="active"
          statusLabel={c.common.active}
          featured
          href={hrefFor(lang, "vantadb")}
          actionLabel={c.common.exploreVantadb}
          className="nm2-home-project"
        >
          <div className="nm2-home-workbench">
            <div className="nm2-prose nm2-home-workbench__copy" data-scroll-reveal="">
              <p>{h.work.vantadbBody}</p>
              <ul className="nm2-fact-tags" aria-label={h.work.vantadbName}>
                {h.work.vantadbFacts.map((fact) => <li key={fact}>{fact}</li>)}
              </ul>
            </div>
            <MemoryDemo
              steps={c.vantadb.diagram.steps}
              controlsLabel={h.work.memoryControls}
              caption={c.common.conceptual}
            />
          </div>
        </ProjectCard>
        <div className="nm2-home-scope">
          <div className="nm2-home-scope__ledger" data-scroll-reveal="">
            <div className="nm2-ledger-name">
              <h3>{h.work.scopegrainName}</h3>
              <StatusBadge status="incubation" label={c.common.incubation} />
            </div>
            <div className="nm2-prose">
              <p className="nm2-ledger-summary">{h.work.scopegrainSummary}</p>
              <p>{h.work.scopegrainBody}</p>
            </div>
            <ActionLink href={hrefFor(lang, "projects")} variant="text">{c.common.allProjects}</ActionLink>
          </div>
          <ScopeStudy copy={h.work.scopeStudy} caption={c.common.conceptual} />
        </div>
      </Section>
      <Section id="modules" className="nm2-capability-section">
        <SectionHeading title={h.capabilities.title} description={h.capabilities.description} effect="decode" />
        <CapabilityStory copy={h.capabilities} caption={c.common.conceptual} />
      </Section>
      <Section
        id="holons"
        className="nm2-home-holons"
        backdrop={<FieldCanvas variant="orbit" className="nm2-backdrop-field nm2-backdrop-field--orbit" />}
      >
        <SectionHeading title={h.holons.title} effect="focus" />
        <HolonExplorer copy={h.holons} visionLabel={c.common.vision} caption={c.common.conceptual} />
      </Section>
      <SectionTransition id="proof-in" variant="tear" />
      <Section id="proof" className="nm2-section--paper nm2-home-evidence">
        <span id="oss" className="nm2-anchor" aria-hidden="true" />
        <SectionHeading title={h.method.title} description={h.method.description} effect="trace" />
        <EvidenceWorkbench
          copy={h.method}
          links={{ repository: VANTADB_REPO, documentation: VANTADB_DOCS, discussions: DISCUSSIONS_URL }}
          labels={{ documentation: c.common.readDocs, discussions: c.common.discussions }}
          caption={c.common.conceptual}
        />
        <ActionLink href={hrefFor(lang, "about")} variant="text">{h.method.methodAction}</ActionLink>
      </Section>
      <SectionTransition id="proof-out" variant="blocks" from="light" to="dark" />
      <Section id="faq" className="nm2-faq-section">
        <div className="nm2-editorial">
          <SectionHeading title={h.faqTitle} effect="assemble" />
          <Faq items={h.faq} />
        </div>
      </Section>
      <Section id="contribute" className="nm2-invitation-section">
        <div className="nm2-home-invitation">
          <div className="nm2-home-invitation__copy">
            <SectionHeading title={h.invitation.title} description={h.invitation.body} effect="focus" />
            <div className="nm2-actions">
              <ActionLink href={hrefFor(lang, "contribute")}>{h.invitation.action}</ActionLink>
              <ActionLink href={ORG_URL} external variant="text">{c.nav.github}</ActionLink>
            </div>
          </div>
          <div className="nm2-home-invitation__art" aria-hidden="true">
            <FieldCanvas variant="wave" />
          </div>
        </div>
      </Section>
      <TransitionLab />
    </div>
    </TransitionLabProvider>
  );
}
