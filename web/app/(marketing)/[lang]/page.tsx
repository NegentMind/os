import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { ArtMount } from "@/components/nm/v2/art-mount";
import { EvidenceWorkbench } from "@/components/nm/v2/evidence-workbench";
import { Faq } from "@/components/nm/v2/faq";
import { FieldCanvas } from "@/components/nm/v2/field-canvas";
import { Hero } from "@/components/nm/v2/hero";
import { HERO_ART_ALT } from "@/components/nm/v2/hero-preset";
import { HolonExplorer } from "@/components/nm/v2/holon-explorer";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { SectionTransition } from "@/components/nm/v2/section-transition/section-transition";
import {
  TransitionLab,
  TransitionLabProvider,
} from "@/components/nm/v2/section-transition/transition-lab";
import { SpecList } from "@/components/nm/v2/spec-list";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { SystemStory } from "@/components/nm/v2/system-story";
import { VantaShowcase } from "@/components/nm/v2/vantadb-showcase";
import { getSiteCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { metadataForPage, type MarketingPageProps } from "@/lib/marketing-metadata";
import { DISCUSSIONS_URL, displayUrl, ORG_URL, VANTADB_DOCS, VANTADB_REPO } from "@/lib/site";
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
      <SectionTransition id="org-in" variant="tear" height={360} />
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
      <SectionTransition id="org-out" variant="tear" height={360} from="light" to="dark" />
      <Section
        id="work"
        className="nm2-vanta-section"
        backdrop={<FieldCanvas variant="memory" className="nm2-backdrop-field nm2-backdrop-field--memory" />}
      >
        <span id="status" className="nm2-anchor" aria-hidden="true" />
        <span id="engine" className="nm2-anchor" aria-hidden="true" />
        <span id="modules" className="nm2-anchor" aria-hidden="true" />
        <SectionHeading title={h.work.title} description={h.work.description} effect="trace" />
        <VantaShowcase
          copy={h.work.vanta}
          status={c.common.active}
          caption={c.common.conceptual}
          links={{ product: hrefFor(lang, "vantadb"), repo: VANTADB_REPO }}
          labels={{ product: c.common.exploreVantadb, repo: displayUrl(VANTADB_REPO) }}
        />
        <div id="scopegrain" className="nm2-anchor nm2-home-scope" data-scroll-reveal="">
          <div className="nm2-ledger-name">
            <h3>{h.work.scopegrainName}</h3>
            <StatusBadge status="incubation" label={c.common.incubation} />
          </div>
          <p className="nm2-home-scope__line">{h.work.scopegrainSummary} {h.work.scopegrainBody}</p>
          <ActionLink href={hrefFor(lang, "projects")} variant="text">{c.common.allProjects}</ActionLink>
        </div>
      </Section>
      <Section
        id="holons"
        className="nm2-home-holons"
        backdrop={<FieldCanvas variant="orbit" className="nm2-backdrop-field nm2-backdrop-field--orbit" />}
      >
        <SectionHeading title={h.holons.title} effect="focus" />
        <HolonExplorer
          copy={h.holons}
          visionLabel={c.common.vision}
          activeLabel={c.common.active}
          vantaLink={{ href: hrefFor(lang, "vantadb"), label: c.common.exploreVantadb }}
          caption={c.common.conceptual}
        />
      </Section>
      <SectionTransition id="proof-in" variant="tear" height={360} />
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
      <SectionTransition id="proof-out" variant="tear" height={360} from="light" to="dark" />
      <Section id="principles" className="nm2-principles-section">
        <div className="nm2-editorial">
          <SectionHeading title={h.principles.title} description={h.principles.description} effect="assemble" />
          <SpecList rows={h.principles.items} className="nm2-principles" />
        </div>
      </Section>
      <Section id="faq" className="nm2-faq-section">
        <div className="nm2-editorial">
          <SectionHeading title={h.faqTitle} effect="assemble" />
          <Faq items={h.faq} />
        </div>
      </Section>
      <Section id="contribute" className="nm2-invitation-section">
        <div className="nm2-home-invitation nm2-tone-dark">
          <ArtMount preset={HERO_ART_ALT} className="nm2-home-invitation__art" />
          <div className="nm2-home-invitation__copy">
            <SectionHeading title={h.invitation.title} description={h.invitation.body} effect="focus" />
            <div className="nm2-actions">
              <ActionLink href={hrefFor(lang, "contribute")}>{h.invitation.action}</ActionLink>
              <ActionLink href={ORG_URL} external variant="text">{c.nav.github}</ActionLink>
            </div>
          </div>
        </div>
      </Section>
      <TransitionLab />
    </div>
    </TransitionLabProvider>
  );
}
