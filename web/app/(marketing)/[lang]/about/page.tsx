import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { BrandMark } from "@/components/nm/v2/brand-mark";
import { PageHero } from "@/components/nm/v2/page-hero";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { Surface } from "@/components/nm/v2/surface";
import { getSiteCopy } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { metadataForPage, type MarketingPageProps } from "@/lib/marketing-metadata";
import { FOUNDER_URL } from "@/lib/site";
import { hrefFor } from "@/lib/site-routes";

export function generateMetadata({ params }: MarketingPageProps) {
  return metadataForPage(params, "about");
}

// Public vision labels, not product-to-capability assignments.
const HOLONS = [
  "Cardinal", "Iris", "Meta", "Execute", "Sage",
  "Plan", "Orchestra", "Reverb", "Reason",
];

export default async function AboutPage({ params }: MarketingPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getSiteCopy(lang);
  const a = c.about;

  return (
    <>
      <PageHero title={a.title} description={a.description} variant="orbit" />
      <Section className="nm2-mission-section">
        <div className="nm2-editorial">
          <SectionHeading title={a.mission.title} />
          <div className="nm2-prose">
            <p className="nm2-lead">{a.mission.body}</p>
            <p>{a.mission.boundary}</p>
          </div>
        </div>
      </Section>
      <Section id="principles" className="nm2-principles-section">
        <SectionHeading title={a.principles.title} />
        <dl className="nm2-principles">
          {a.principles.items.map((item) => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section id="vision" className="nm2-vision-section">
        <SectionHeading title={a.vision.title} description={a.vision.description} />
        <Surface className="nm2-holon-map">
          <div className="nm2-holon-map-header">
            <StatusBadge status="vision" label={c.common.vision} />
            <p>{c.common.conceptual}</p>
          </div>
          <ul className="nm2-holon-names" aria-label={c.common.vision}>
            {HOLONS.map((name) => <li key={name}>{name}</li>)}
          </ul>
          <p className="nm2-holon-note">{a.vision.note}</p>
        </Surface>
      </Section>
      <Section className="nm2-founder-section">
        <div className="nm2-editorial">
          <SectionHeading title={a.founder.title} />
          <div className="nm2-founder">
            <BrandMark variant="monogram" className="nm2-founder-mark" decorative />
            <div>
              <h3>{a.founder.name}</h3>
              <p className="nm2-founder-role">{a.founder.role}</p>
              <p>{a.founder.body}</p>
              <ActionLink href={FOUNDER_URL} external variant="text">{a.founder.action}</ActionLink>
            </div>
          </div>
        </div>
      </Section>
      <Section className="nm2-invitation-section">
        <Surface tone="spectrum" className="nm2-invitation">
          <SectionHeading title={a.invitation.title} description={a.invitation.body} />
          <ActionLink href={hrefFor(lang, "contribute")}>{a.invitation.action}</ActionLink>
        </Surface>
      </Section>
    </>
  );
}
