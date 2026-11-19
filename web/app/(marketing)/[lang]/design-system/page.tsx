import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/nm/v2/action-link";
import { AnimatedHeading } from "@/components/nm/v2/animated-heading";
import { ArtFigure } from "@/components/nm/v2/art-figure";
import { ArtMount } from "@/components/nm/v2/art-mount";
import { BlueprintScene } from "@/components/nm/v2/blueprint-scene";
import { BrandMark } from "@/components/nm/v2/brand-mark";
import { CoreOrb } from "@/components/nm/v2/core-orb";
import { DriftCanvas } from "@/components/nm/v2/drift-canvas";
import { EvidencePath } from "@/components/nm/v2/evidence-path";
import { Faq } from "@/components/nm/v2/faq";
import { FieldCanvas } from "@/components/nm/v2/field-canvas";
import { HeroBackground } from "@/components/nm/v2/hero-background";
import { HERO_ART_SECTION } from "@/components/nm/v2/hero-preset";
import { HolonField, VANTA_INDEX } from "@/components/nm/v2/holon-field";
import { PrincipleRules } from "@/components/nm/v2/principle-rules";
import { ProjectCard } from "@/components/nm/v2/project-card";
import { RotatingWord } from "@/components/nm/v2/rotating-word";
import { Section } from "@/components/nm/v2/section";
import { SectionHeading } from "@/components/nm/v2/section-heading";
import { SectionTransition } from "@/components/nm/v2/section-transition/section-transition";
import { VARIANTS } from "@/components/nm/v2/section-transition/variants";
import { SpecList } from "@/components/nm/v2/spec-list";
import { StatusBadge } from "@/components/nm/v2/status-badge";
import { Surface } from "@/components/nm/v2/surface";
import { SystemStory } from "@/components/nm/v2/system-story";
import { VantaStrata } from "@/components/nm/v2/vanta-strata";
import { VantaShowcase } from "@/components/nm/v2/vantadb-showcase";
import { BackgroundBeams } from "@/components/nm/ext/background-beams";
import BlurText from "@/components/nm/ext/blur-text";
import DecryptedText from "@/components/nm/ext/decrypted-text";
import Orb from "@/components/nm/ext/orb";
import ShinyText from "@/components/nm/ext/shiny-text";
import SpotlightCard from "@/components/nm/ext/spotlight-card";
import TextType from "@/components/nm/ext/text-type";
import Waves from "@/components/nm/ext/waves";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSiteCopy } from "@/lib/content";
import { MotionPreview } from "@/lib/content/design-system-preview";
import {
  BRAND_ASSETS,
  COMPONENT_INVENTORY,
  INVENTORY_CATEGORIES,
  type InventoryCategory,
} from "@/lib/content/design-system-inventory";
import { isLocale } from "@/lib/i18n";
import type { MarketingPageProps } from "@/lib/marketing-metadata";
import {
  DISCUSSIONS_URL,
  displayUrl,
  VANTADB_DOCS,
  VANTADB_REPO,
} from "@/lib/site";
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
const HEADING_DEMO_EFFECTS = ["assemble", "focus", "trace", "decode"] as const;
const FIELD_DEMO_VARIANTS = ["wave", "orbit", "network", "memory"] as const;

export default async function DesignSystemPage({ params }: MarketingPageProps) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getSiteCopy(lang);
  const g = c.gallery;
  const h = c.home;

  const blueprintDemos = [
    {
      variant: "system",
      labels: h.statement.system.items.map((item) => item.label),
      selected: 1,
    },
    {
      variant: "memory",
      labels: c.vantadb.diagram.steps.map((step) => step.title),
      selected: 1,
    },
    {
      variant: "evidence",
      labels: [
        h.method.evidence.code,
        h.method.evidence.context,
        h.method.evidence.conversation,
      ],
      selected: 2,
    },
  ] as const;

  const categoryLabels: Record<InventoryCategory, string> = {
    layout: g.catLayout,
    chrome: g.catChrome,
    content: g.catContent,
    scenes: g.catScenes,
    legacy: g.catLegacy,
    ui: g.catUi,
  };

  return (
    <>
      <Section className="nm2-page-intro">
        <SectionHeading as="h1" title={g.title} description={g.description} />
        <ActionLink href={`/${lang}/design-system/art`} variant="text">{g.artwork}</ActionLink>
      </Section>

      {/* ---- foundations -------------------------------------------------- */}
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

      {/* ---- components ---------------------------------------------------- */}
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

      {/* ---- scenes --------------------------------------------------------- */}
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.liveScene} />
        <div className="nm2-gallery-art">
          <HeroBackground />
        </div>
        <SectionHeading title={g.motion} className="nm2-gallery-subheading" />
        <MotionPreview copy={g} hero={c.hero} />
      </Section>

      {/* ---- live demos -------------------------------------------------------
          Real mounts behind fixed plates; every canvas owns its viewport gate
          (useSceneActivity / its own observers) and honors useSiteMotion. */}
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.demos} description={g.demosNote} />
        <div className="nm2-demos">
          <div className="nm2-demo-group">
            <h3 className="nm2-demo-group__title">{g.demosHeadings}</h3>
            <div className="nm2-demo-grid nm2-demo-grid--headings">
              {HEADING_DEMO_EFFECTS.map((effect) => (
                <figure className="nm2-demo" key={effect}>
                  <div className="nm2-demo__mount nm2-demo__mount--heading">
                    <span className="nm2-demo__heading">
                      <AnimatedHeading text={g.typeSample} effect={effect} />
                    </span>
                  </div>
                  <figcaption className="nm2-demo__label">
                    <code>AnimatedHeading</code>
                    <code>{effect}</code>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="nm2-demo-note">{g.demosHeadingsNote}</p>
          </div>

          <div className="nm2-demo-group">
            <h3 className="nm2-demo-group__title">{g.demosFields}</h3>
            <div className="nm2-demo-grid">
              {FIELD_DEMO_VARIANTS.map((variant) => (
                <figure className="nm2-demo" key={variant}>
                  <FieldCanvas
                    variant={variant}
                    interactive={variant === "network"}
                  />
                  <figcaption className="nm2-demo__label">
                    <code>FieldCanvas</code>
                    <code>{variant}</code>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="nm2-demo-group">
            <h3 className="nm2-demo-group__title">{g.demosBands}</h3>
            <div className="nm2-demo-stack">
              {VARIANTS.map((variant, index) => (
                <figure className="nm2-demo" key={variant.id}>
                  <SectionTransition
                    id={`demo-${variant.id}`}
                    variant={variant.id}
                    height={112}
                    from={index % 2 === 0 ? "dark" : "light"}
                    to={index % 2 === 0 ? "light" : "dark"}
                  />
                  <figcaption className="nm2-demo__label">
                    <code>SectionTransition</code>
                    <code>{variant.id}</code>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="nm2-demo-group">
            <h3 className="nm2-demo-group__title">{g.demosInstruments}</h3>
            <div className="nm2-demo-grid">
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--plate">
                  <DriftCanvas />
                </div>
                <figcaption className="nm2-demo__label">
                  <code>DriftCanvas</code>
                  <code>currents</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--plate">
                  <HolonField selected={VANTA_INDEX} hovered={null} />
                </div>
                <figcaption className="nm2-demo__label">
                  <code>HolonField</code>
                  <code>vanta</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--plate">
                  <VantaStrata
                    layers={h.work.vanta.art.layers}
                    core={h.work.vanta.art.core}
                  />
                </div>
                <figcaption className="nm2-demo__label">
                  <code>VantaStrata</code>
                  <code>L1–L3</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--orb">
                  <CoreOrb actionLabel={h.statement.system.orbAction} />
                </div>
                <figcaption className="nm2-demo__label">
                  <code>CoreOrb</code>
                  <code>pin toggle</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--word">
                  <RotatingWord words={c.hero.titleWords} />
                </div>
                <figcaption className="nm2-demo__label">
                  <code>RotatingWord</code>
                  <code>spectrum</code>
                </figcaption>
              </figure>
              {blueprintDemos.map((scene) => (
                <figure className="nm2-demo" key={scene.variant}>
                  <div className="nm2-demo__mount">
                    <BlueprintScene
                      variant={scene.variant}
                      labels={scene.labels}
                      selected={scene.selected}
                    />
                  </div>
                  <figcaption className="nm2-demo__label">
                    <code>BlueprintScene</code>
                    <code>{scene.variant}</code>
                  </figcaption>
                </figure>
              ))}
              <figure className="nm2-demo nm2-demo--wide">
                <div className="nm2-demo__mount nm2-demo__mount--art">
                  <ArtMount preset={HERO_ART_SECTION} />
                </div>
                <figcaption className="nm2-demo__label">
                  <code>ArtMount</code>
                  <code>{HERO_ART_SECTION.id}</code>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* The composition pieces only read correctly under .nm2-home:
              that scope owns their grids, plates and figcaption grammar. */}
          <div className="nm2-demo-group">
            <h3 className="nm2-demo-group__title">{g.demosComposed}</h3>
            <p className="nm2-demo-note">{g.demosComposedNote}</p>
            <div className="nm2-home nm2-demo-home">
              <div className="nm2-demo-block">
                <p className="nm2-demo-tag">
                  <code>EvidencePath · #proof</code>
                </p>
                <EvidencePath
                  copy={h.method}
                  links={{
                    repository: VANTADB_REPO,
                    documentation: VANTADB_DOCS,
                    discussions: DISCUSSIONS_URL,
                  }}
                  labels={{
                    documentation: c.common.readDocs,
                    discussions: c.common.discussions,
                  }}
                />
              </div>
              <div className="nm2-demo-block">
                <p className="nm2-demo-tag">
                  <code>PrincipleRules</code>
                </p>
                <PrincipleRules items={h.principles.items} />
              </div>
              <div className="nm2-demo-block">
                <p className="nm2-demo-tag">
                  <code>ArtFigure · BlueprintScene/scope</code>
                </p>
                <ArtFigure
                  caption={c.common.conceptual}
                  frameClassName="nm2-demo__art"
                >
                  <BlueprintScene variant="scope" />
                </ArtFigure>
              </div>
              <div className="nm2-demo-block">
                <p className="nm2-demo-tag">
                  <code>VantaShowcase</code>
                </p>
                <VantaShowcase
                  copy={h.work.vanta}
                  status={c.common.active}
                  caption={c.common.conceptual}
                  links={{
                    product: hrefFor(lang, "vantadb"),
                    repo: VANTADB_REPO,
                  }}
                  labels={{
                    product: c.common.exploreVantadb,
                    repo: displayUrl(VANTADB_REPO),
                  }}
                />
              </div>
              <div className="nm2-demo-block">
                <p className="nm2-demo-tag">
                  <code>SystemStory · orb</code>
                </p>
                <SystemStory
                  copy={h.statement.system}
                  caption={c.common.conceptual}
                />
              </div>
            </div>
          </div>

          <div className="nm2-demo-group">
            <h3 className="nm2-demo-group__title">{g.demosUi}</h3>
            <div className="nm2-demo-block">
              <p className="nm2-demo-tag">
                <code>Card · Label · Input · Button</code>
              </p>
              <Card className="nm2-demo__ui-card">
                <CardHeader>
                  <CardTitle>{g.uiCardTitle}</CardTitle>
                  <CardDescription>{g.uiCardNote}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Label htmlFor="nm2-demo-email">{g.uiField}</Label>
                  <Input
                    id="nm2-demo-email"
                    type="email"
                    placeholder={g.uiPlaceholder}
                  />
                </CardContent>
                <CardFooter>
                  <Button>{g.uiSubmit}</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- adapted externals ------------------------------------------------
          Registry pieces retokenized to --nm2-* and wired to the site motion
          gate; library stock in components/nm/ext/, not mounted in routes. */}
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.external} description={g.externalNote} />
        <div className="nm2-demos">
          <div className="nm2-demo-group">
            <h3 className="nm2-demo-group__title">{g.externalText}</h3>
            <div className="nm2-demo-grid">
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--heading">
                  <span className="nm2-demo__heading">
                    <DecryptedText
                      text={g.typeSample}
                      animateOn="view"
                      sequential
                      speed={40}
                      scrambleColor="var(--nm2-spectrum-violet)"
                    />
                  </span>
                </div>
                <figcaption className="nm2-demo__label">
                  <code>DecryptedText</code>
                  <code>ext · @react-bits</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--heading">
                  <span className="nm2-demo__heading">
                    <BlurText text={g.typeSample} animateBy="words" delay={120} />
                  </span>
                </div>
                <figcaption className="nm2-demo__label">
                  <code>BlurText</code>
                  <code>ext · @react-bits</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--heading">
                  <span className="nm2-demo__heading">
                    <ShinyText text={g.typeSample} speed={3} />
                  </span>
                </div>
                <figcaption className="nm2-demo__label">
                  <code>ShinyText</code>
                  <code>ext · @react-bits</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--heading">
                  <span className="nm2-demo__heading">
                    <TextType
                      as="span"
                      text={c.hero.titleWords}
                      typingSpeed={70}
                      pauseDuration={1600}
                    />
                  </span>
                </div>
                <figcaption className="nm2-demo__label">
                  <code>TextType</code>
                  <code>ext · @react-bits</code>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="nm2-demo-group">
            <h3 className="nm2-demo-group__title">{g.externalScenes}</h3>
            <div className="nm2-demo-grid">
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--heading">
                  <SpotlightCard
                    spotlightColor="var(--nm2-spectrum-ice)"
                    intensity={0.2}
                  >
                    <p className="nm2-ext-card-text">{g.bodySample}</p>
                  </SpotlightCard>
                </div>
                <figcaption className="nm2-demo__label">
                  <code>SpotlightCard</code>
                  <code>ext · @react-bits</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo">
                <div className="nm2-demo__mount nm2-demo__mount--orb">
                  <div className="nm2-ext-orb">
                    <Orb />
                  </div>
                </div>
                <figcaption className="nm2-demo__label">
                  <code>Orb</code>
                  <code>ext · @react-bits</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo nm2-demo--wide">
                <div className="nm2-demo__mount nm2-demo__mount--plate">
                  <Waves accentColor="var(--nm2-spectrum-teal)" />
                </div>
                <figcaption className="nm2-demo__label">
                  <code>Waves</code>
                  <code>ext · @react-bits</code>
                </figcaption>
              </figure>
              <figure className="nm2-demo nm2-demo--wide">
                <div className="nm2-demo__mount nm2-demo__mount--plate">
                  <BackgroundBeams />
                  <p className="nm2-ext-content">{g.typeSample}</p>
                </div>
                <figcaption className="nm2-demo__label">
                  <code>BackgroundBeams</code>
                  <code>ext · @aceternity</code>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- branding -------------------------------------------------------- */}
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.branding} description={g.brandingNote} />
        <ul className="nm2-asset-grid">
          {BRAND_ASSETS.map((asset) => (
            <li key={asset.file} className="nm2-asset-card" data-wide={asset.wide || undefined}>
              <div className="nm2-asset-card__preview">
                {/* Plain <img>: the point is previewing the file itself, not a component. */}
                <img src={asset.src} alt={asset.file} data-format={asset.format} loading="lazy" />
              </div>
              <div className="nm2-asset-card__meta">
                <code className="nm2-asset-card__file">{asset.file}</code>
                <span className="nm2-asset-card__dims">{asset.dims} · {asset.format}</span>
                <p className="nm2-asset-card__use">{asset.use[lang]}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---- inventory -------------------------------------------------------- */}
      <Section className="nm2-gallery-section">
        <SectionHeading title={g.inventory} description={g.inventoryNote} />
        <div className="nm2-inv">
          {INVENTORY_CATEGORIES.map((category) => {
            const entries = COMPONENT_INVENTORY.filter((entry) => entry.category === category);
            return (
              <div className="nm2-inv-group" key={category}>
                <h3 className="nm2-inv-group__title">
                  {categoryLabels[category]}
                  <span className="nm2-inv-group__count">
                    {entries.length} {g.pieces}
                  </span>
                </h3>
                <ul className="nm2-inv-list">
                  {entries.map((entry) => {
                    const active = entry.usedIn.length > 0;
                    return (
                      <li className="nm2-inv-row" key={entry.file}>
                        <div className="nm2-inv-id">
                          <span className="nm2-inv-name">{entry.name}</span>
                          <code className="nm2-inv-file">{entry.file}</code>
                        </div>
                        <div className="nm2-inv-body">
                          <p className="nm2-inv-purpose">{entry.purpose[lang]}</p>
                          <div className="nm2-inv-meta">
                            <span
                              className="nm2-inv-status"
                              data-status={active ? "active" : "library"}
                            >
                              {active ? g.inUse : g.libraryOnly}
                            </span>
                            {active ? (
                              <ul className="nm2-inv-used" aria-label={g.usedInLabel}>
                                {entry.usedIn.map((consumer) => (
                                  <li key={consumer}><code>{consumer}</code></li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
