import { BookOpen, Bug, GitPullRequest } from "lucide-react";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { Faq } from "@/components/nm/v2/faq";
import { FieldCanvas } from "@/components/nm/v2/field-canvas";
import { PageCta } from "@/components/nm/v2/page-cta";
import { PageHero } from "@/components/nm/v2/page-hero";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { SectionTransition } from "@/components/nm/v2/section-transition/section-transition";
import { Surface } from "@/components/nm/v2/surface";
import { getSiteCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { metadataForPage, type MarketingPageProps } from "@/lib/marketing-metadata";
import {
  CODE_OF_CONDUCT_URL, CONTRIBUTING_URL, DISCUSSIONS_URL, SECURITY_URL, SUPPORT_URL,
} from "@/lib/site";

export function generateMetadata({ params }: MarketingPageProps) {
  return metadataForPage(params, "contribute");
}

const PATH_ICONS = [BookOpen, Bug, GitPullRequest];

export default async function ContributePage({ params }: MarketingPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getSiteCopy(lang);
  const p = c.contribute;

  return (
    <div className="nm2-page">
      <PageHero title={p.title} description={p.description} variant="wave">
        <div className="nm2-actions">
          <ActionLink href={DISCUSSIONS_URL} external>{c.common.discussions}</ActionLink>
          <ActionLink href={CONTRIBUTING_URL} external variant="secondary">{c.common.contributionGuide}</ActionLink>
        </div>
      </PageHero>
      <Section
        className="nm2-contribution-section"
        backdrop={
          <FieldCanvas
            variant="wave"
            className="nm2-backdrop-field nm2-backdrop-field--wave"
          />
        }
      >
        <SectionHeading title={p.pathsTitle} effect="assemble" />
        <div className="nm2-contribution-paths">
          {p.paths.map((path, index) => {
            const Icon = PATH_ICONS[index];
            return (
              <article key={path.title}>
                {Icon && <Icon className="nm2-path-icon" aria-hidden="true" />}
                <h3>{path.title}</h3>
                <p>{path.body}</p>
                <p className="nm2-path-evidence">{path.evidence}</p>
              </article>
            );
          })}
        </div>
      </Section>
      <Section className="nm2-contribution-expectations">
        <div className="nm2-editorial">
          <SectionHeading title={p.expectations.title} effect="assemble" />
          <div className="nm2-prose">
            <p className="nm2-lead">{p.expectations.body}</p>
            <p>{p.expectations.note}</p>
            <ActionLink href={CONTRIBUTING_URL} external variant="text">{c.common.contributionGuide}</ActionLink>
          </div>
        </div>
      </Section>
      <Section className="nm2-conversation-section">
        <Surface tone="spectrum" className="nm2-invitation">
          <SectionHeading title={p.conversation.title} description={p.conversation.body} effect="assemble" />
          <div className="nm2-actions">
            <ActionLink href={DISCUSSIONS_URL} external>{c.common.discussions}</ActionLink>
            <ActionLink href={SUPPORT_URL} external variant="text">{p.conversation.support}</ActionLink>
          </div>
        </Surface>
      </Section>
      <Section className="nm2-safety-section">
        <SectionHeading title={p.safety.title} effect="assemble" />
        <div className="nm2-safety">
          <article>
            <h3>{p.safety.conductTitle}</h3>
            <p>{p.safety.conductBody}</p>
            <ActionLink href={CODE_OF_CONDUCT_URL} external variant="text">{p.safety.conductAction}</ActionLink>
          </article>
          <article>
            <h3>{p.safety.securityTitle}</h3>
            <p>{p.safety.securityBody}</p>
            <ActionLink href={SECURITY_URL} external variant="text">{p.safety.securityAction}</ActionLink>
          </article>
        </div>
      </Section>
      <SectionTransition id="contribute-paper" variant="tear" />
      <Section id="faq" className="nm2-faq-section nm2-section--paper">
        <SectionHeading title={p.faqTitle} effect="assemble" />
        <Faq items={p.faq} />
        <PageCta
          title={p.closing.title}
          description={p.closing.body}
          action={{ href: CONTRIBUTING_URL, label: c.common.contributionGuide, external: true }}
          secondary={{ href: DISCUSSIONS_URL, label: c.common.discussions, external: true }}
          variant="wave"
          effect="assemble"
        />
      </Section>
    </div>
  );
}
