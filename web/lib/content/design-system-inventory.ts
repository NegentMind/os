/**
 * Design-system inventory — the data behind the dev gallery ledger.
 *
 * `usedIn` lists live consumers only: routes that mount the piece, or
 * library components that are themselves mounted. An empty list means
 * the piece is library stock with no live import. Keeping this list
 * honest is a manual step: audit with
 * `grep -rn "nm/v2/<file>" app/ components/` when the tree changes.
 */

export type InventoryCategory =
  | "layout"
  | "chrome"
  | "content"
  | "scenes"
  | "legacy"
  | "ui";

export interface InventoryEntry {
  /** Public component or module name. */
  name: string;
  /** Path inside `components/`. */
  file: string;
  category: InventoryCategory;
  purpose: { es: string; en: string };
  /** Live consumers: route paths or component/module names. Empty = stock. */
  usedIn: string[];
}

export const COMPONENT_INVENTORY: InventoryEntry[] = [
  // ---- nm/v2 · layout -----------------------------------------------------
  {
    name: "Section",
    file: "nm/v2/section.tsx",
    category: "layout",
    purpose: {
      es: "Ritmo de sección (--nm2-section-gap, tonos, backdrop).",
      en: "Section rhythm (--nm2-section-gap, tones, backdrop).",
    },
    usedIn: ["/", "/about", "/contribute", "/projects", "/projects/vantadb", "/design-system"],
  },
  {
    name: "SectionHeading",
    file: "nm/v2/section-heading.tsx",
    category: "layout",
    purpose: {
      es: "Encabezado de sección: título animado + descripción.",
      en: "Section heading: animated title + description.",
    },
    usedIn: ["/", "/about", "/contribute", "/projects", "/projects/vantadb", "/design-system", "page-cta"],
  },
  {
    name: "AnimatedHeading",
    file: "nm/v2/animated-heading.tsx",
    category: "layout",
    purpose: {
      es: "Titular con efectos assemble/focus/trace/decode; Orbital Display u Outfit.",
      en: "Heading with assemble/focus/trace/decode effects; Orbital Display or Outfit.",
    },
    usedIn: ["section-heading", "page-hero", "page-cta", "transition-lab", "/design-system"],
  },
  {
    name: "Surface",
    file: "nm/v2/surface.tsx",
    category: "layout",
    purpose: {
      es: "Elevación por relleno y espaciado; borde secundario.",
      en: "Elevation via fill and spacing; secondary border.",
    },
    usedIn: ["/about", "/contribute", "/design-system"],
  },
  {
    name: "PageHero",
    file: "nm/v2/page-hero.tsx",
    category: "layout",
    purpose: {
      es: "Composición asimétrica compartida de héroes interiores.",
      en: "Shared asymmetric composition for interior heroes.",
    },
    usedIn: ["/about", "/contribute", "/projects", "/projects/vantadb"],
  },
  {
    name: "PageCta",
    file: "nm/v2/page-cta.tsx",
    category: "layout",
    purpose: {
      es: "Cierre con llamada a la acción de páginas interiores.",
      en: "Interior-page closing call to action.",
    },
    usedIn: ["/about", "/contribute", "/projects", "/projects/vantadb"],
  },
  // ---- nm/v2 · chrome -----------------------------------------------------
  {
    name: "SiteHeader",
    file: "nm/v2/site-header.tsx",
    category: "chrome",
    purpose: {
      es: "Navegación fija, cambio de idioma y menú móvil Sheet.",
      en: "Fixed navigation, language switch and Sheet mobile menu.",
    },
    usedIn: ["layout"],
  },
  {
    name: "SiteFooter",
    file: "nm/v2/site-footer.tsx",
    category: "chrome",
    purpose: {
      es: "Footer compartido: monograma, enlaces, campo, línea base.",
      en: "Shared footer: monogram, links, field, baseline.",
    },
    usedIn: ["layout"],
  },
  {
    name: "MotionProvider",
    file: "nm/v2/motion-provider.tsx",
    category: "chrome",
    purpose: {
      es: "Estado global de movimiento; espejo en html[data-motion].",
      en: "Global motion state; mirrored on html[data-motion].",
    },
    usedIn: ["layout"],
  },
  {
    name: "MotionPreference",
    file: "nm/v2/motion-preference.tsx",
    category: "chrome",
    purpose: {
      es: "Control de pausa/reanudación de movimiento en el footer.",
      en: "Motion pause/resume control in the footer.",
    },
    usedIn: ["site-footer"],
  },
  {
    name: "SmoothScroll",
    file: "nm/v2/smooth-scroll.tsx",
    category: "chrome",
    purpose: {
      es: "Lenis solo con movimiento permitido; raf en el ticker de GSAP.",
      en: "Lenis only while motion is allowed; raf on the GSAP ticker.",
    },
    usedIn: ["layout"],
  },
  {
    name: "PointerFeedback",
    file: "nm/v2/pointer-feedback.tsx",
    category: "chrome",
    purpose: {
      es: "Anillo decorativo de puntero; nunca captura interacción.",
      en: "Decorative pointer ring; never captures interaction.",
    },
    usedIn: ["layout"],
  },
  {
    name: "ViewportFade",
    file: "nm/v2/viewport-fade.tsx",
    category: "chrome",
    purpose: {
      es: "Borde óptico inferior de capas de blur enmascaradas.",
      en: "Optical bottom edge made of masked blur layers.",
    },
    usedIn: ["layout"],
  },
  // ---- nm/v2 · content ----------------------------------------------------
  {
    name: "ActionLink",
    file: "nm/v2/action-link.tsx",
    category: "content",
    purpose: {
      es: "Acción primaria/secundaria/texto sobre Button de shadcn.",
      en: "Primary/secondary/text action over the shadcn Button.",
    },
    usedIn: [
      "/", "/about", "/contribute", "/projects", "/projects/vantadb", "/design-system",
      "hero", "page-cta", "project-card", "evidence-path", "vantadb-showcase",
    ],
  },
  {
    name: "BrandMark",
    file: "nm/v2/brand-mark.tsx",
    category: "content",
    purpose: {
      es: "Wordmark/monograma con la geometría vectorial Orbital.",
      en: "Wordmark/monogram drawn with the Orbital vector geometry.",
    },
    usedIn: ["site-header", "site-footer", "hero", "/about", "/design-system"],
  },
  {
    name: "Faq",
    file: "nm/v2/faq.tsx",
    category: "content",
    purpose: {
      es: "Acordeón con details/summary nativo; accesible sin JS.",
      en: "Native details/summary disclosure; accessible without JS.",
    },
    usedIn: ["/", "/contribute", "/design-system"],
  },
  {
    name: "SpecList",
    file: "nm/v2/spec-list.tsx",
    category: "content",
    purpose: {
      es: "Gramática <dl> → <dt>/<dd> compartida (facts, principles).",
      en: "Shared <dl> → <dt>/<dd> grammar (facts, principles).",
    },
    usedIn: ["/design-system"],
  },
  {
    name: "PrincipleRules",
    file: "nm/v2/principle-rules.tsx",
    category: "content",
    purpose: {
      es: "Principios como manifiesto numerado: regla, marca geométrica y pie de comprobación.",
      en: "Principles as a numbered manifesto: rule, geometric mark and a check footnote.",
    },
    usedIn: ["/", "/design-system"],
  },
  {
    name: "StatusBadge",
    file: "nm/v2/status-badge.tsx",
    category: "content",
    purpose: {
      es: "Estado como texto primero; el punto de color solo apoya.",
      en: "Status as text first; the color dot only supports.",
    },
    usedIn: ["/about", "/projects", "/projects/vantadb", "/design-system", "holon-explorer", "project-card", "vantadb-showcase"],
  },
  {
    name: "ProjectCard",
    file: "nm/v2/project-card.tsx",
    category: "content",
    purpose: {
      es: "Tarjeta de proyecto con estado honesto.",
      en: "Project card with an honest status.",
    },
    usedIn: ["/projects", "/design-system"],
  },
  {
    name: "StoryControls / StoryControl",
    file: "nm/v2/story-controls.tsx",
    category: "content",
    purpose: {
      es: "Selectores segmentados aria-pressed; solo los montan memory-demo y scope-study, ambas sin uso.",
      en: "aria-pressed segmented controls; only mounted by memory-demo and scope-study, both unused.",
    },
    usedIn: [],
  },
  {
    name: "StoryDetail",
    file: "nm/v2/story-detail.tsx",
    category: "content",
    purpose: {
      es: "Región viva aria-live que anuncia la selección.",
      en: "aria-live region announcing the current selection.",
    },
    usedIn: ["holon-explorer"],
  },
  {
    name: "EvidencePath",
    file: "nm/v2/evidence-path.tsx",
    category: "content",
    purpose: {
      es: "Camino de evidencia: código → contexto escrito → conversación sobre un raíl trazado.",
      en: "Evidence path: code → written context → conversation on a drawn rail.",
    },
    usedIn: ["/", "/design-system"],
  },
  {
    name: "EvidenceWorkbench",
    file: "nm/v2/evidence-workbench.tsx",
    category: "content",
    purpose: {
      es: "Banco de evidencia por pestañas; #proof pasó a evidence-path.",
      en: "Tabbed evidence bench; #proof moved to evidence-path.",
    },
    usedIn: [],
  },
  {
    name: "VantaShowcase",
    file: "nm/v2/vantadb-showcase.tsx",
    category: "content",
    purpose: {
      es: "Bloque flagship de VantaDB: identidad, estratos, pipeline, ficha.",
      en: "VantaDB flagship block: identity, strata, pipeline, spec sheet.",
    },
    usedIn: ["/", "/design-system"],
  },
  // ---- nm/v2 · scenes -----------------------------------------------------
  {
    name: "Hero",
    file: "nm/v2/hero.tsx",
    category: "scenes",
    purpose: {
      es: "Composición server del hero de home.",
      en: "Server composition of the home hero.",
    },
    usedIn: ["/"],
  },
  {
    name: "HeroBackground",
    file: "nm/v2/hero-background.tsx",
    category: "scenes",
    purpose: {
      es: "Poster local + mejora WebGL progresiva.",
      en: "Local poster plus progressive WebGL enhancement.",
    },
    usedIn: ["hero", "/design-system"],
  },
  {
    name: "HeroEntrance",
    file: "nm/v2/hero-entrance.tsx",
    category: "scenes",
    purpose: {
      es: "Entrada CSS del primer render del hero.",
      en: "CSS entrance for the hero's first render.",
    },
    usedIn: ["hero"],
  },
  {
    name: "HeroArtPlate / HeroWarp",
    file: "nm/v2/hero-warp.tsx",
    category: "scenes",
    purpose: {
      es: "Warp Paper Shaders del hero (pool de 3 variantes).",
      en: "Hero Paper Shaders warp (pool of 3 variants).",
    },
    usedIn: ["hero-background", "art-mount", "/design-system/art"],
  },
  {
    name: "hero-preset",
    file: "nm/v2/hero-preset.ts",
    category: "scenes",
    purpose: {
      es: "Presets de arte Orbital/strata-01; fuente única para arte en vivo y exports.",
      en: "Orbital/strata-01 art presets; single source for live art and exports.",
    },
    usedIn: ["hero-background", "hero-warp", "art-mount", "core-orb", "drift-canvas", "rotating-word", "section-transition/variants", "/"],
  },
  {
    name: "RotatingWord",
    file: "nm/v2/rotating-word.tsx",
    category: "scenes",
    purpose: {
      es: "Palabra rotativa del hero en Orbital Display con tinta espectral.",
      en: "Hero rotating word in Orbital Display with spectral ink.",
    },
    usedIn: ["hero", "/design-system"],
  },
  {
    name: "FieldCanvas",
    file: "nm/v2/field-canvas.tsx",
    category: "scenes",
    purpose: {
      es: "Campos Canvas 2D wave/orbit/network/memory con fallback SVG SSR.",
      en: "wave/orbit/network/memory Canvas 2D fields with SSR SVG fallback.",
    },
    usedIn: ["/", "/about", "/contribute", "/projects", "/projects/vantadb", "/design-system", "site-footer", "page-cta", "page-hero", "core-orb", "drift-canvas", "holon-field", "vanta-strata"],
  },
  {
    name: "DriftCanvas",
    file: "nm/v2/drift-canvas.tsx",
    category: "scenes",
    purpose: {
      es: "Corrientes monocromáticas carbón→plata con cresta espectral.",
      en: "Monochrome carbon→silver currents with a spectral crest.",
    },
    usedIn: ["system-story", "/design-system"],
  },
  {
    name: "CoreOrb",
    file: "nm/v2/core-orb.tsx",
    category: "scenes",
    purpose: {
      es: "Orbe-instrumento de puntos en Canvas 2D con punto espectral fijable.",
      en: "Canvas-2D dot-sphere instrument with a pinable spectral point.",
    },
    usedIn: ["system-story", "/design-system"],
  },
  {
    name: "SystemStory",
    file: "nm/v2/system-story.tsx",
    category: "scenes",
    purpose: {
      es: "Historia del sistema de home: stage sticky con ensamblaje GSAP.",
      en: "Home system story: sticky stage with GSAP assembly.",
    },
    usedIn: ["/", "/design-system"],
  },
  {
    name: "HolonExplorer",
    file: "nm/v2/holon-explorer.tsx",
    category: "scenes",
    purpose: {
      es: "Explorador interactivo del mapa de holones.",
      en: "Interactive explorer for the holon map.",
    },
    usedIn: ["/"],
  },
  {
    name: "HolonField",
    file: "nm/v2/holon-field.tsx",
    category: "scenes",
    purpose: {
      es: "Campo canvas tras la composición del explorador; en /projects monta la mini-lámina de solo lectura del boundary.",
      en: "Canvas field behind the explorer composition; on /projects it mounts the boundary's read-only mini plate.",
    },
    usedIn: ["holon-explorer", "/projects", "/design-system"],
  },
  {
    name: "VantaStrata",
    file: "nm/v2/vanta-strata.tsx",
    category: "scenes",
    purpose: {
      es: "Lámina canvas de estratos .vanta L1–L3 con tránsitos.",
      en: ".vanta strata canvas plate, L1–L3, with consolidation transits.",
    },
    usedIn: ["vantadb-showcase", "/projects/vantadb", "/design-system"],
  },
  {
    name: "BlueprintScene",
    file: "nm/v2/blueprint-scene.tsx",
    category: "scenes",
    purpose: {
      es: "Diagramas SVG semánticos con etiquetas HTML posicionadas.",
      en: "Semantic SVG diagrams with positioned HTML labels.",
    },
    usedIn: ["system-story", "page-hero", "/design-system"],
  },
  {
    name: "ArtFigure",
    file: "nm/v2/art-figure.tsx",
    category: "scenes",
    purpose: {
      es: "Lámina de arte con marco y figcaption de procedencia.",
      en: "Art plate with frame and a provenance figcaption.",
    },
    usedIn: ["holon-explorer", "vantadb-showcase", "/projects", "/design-system"],
  },
  {
    name: "ArtMount",
    file: "nm/v2/art-mount.tsx",
    category: "scenes",
    purpose: {
      es: "Monta presets de arte en superficies no-hero.",
      en: "Mounts art presets on non-hero surfaces.",
    },
    usedIn: ["/", "/design-system"],
  },
  {
    name: "ScrollScene",
    file: "nm/v2/scroll-scene.tsx",
    category: "scenes",
    purpose: {
      es: "Escena con trazo y flotación GSAP/ScrollTrigger.",
      en: "GSAP/ScrollTrigger trace-and-float scene.",
    },
    usedIn: ["section", "holon-explorer"],
  },
  {
    name: "SectionTransition / TransitionLab",
    file: "nm/v2/section-transition/",
    category: "scenes",
    purpose: {
      es: "Bandas canvas entre tonos + laboratorio de transición solo-dev.",
      en: "Canvas bands between tones plus the dev-only transition lab.",
    },
    usedIn: ["/", "/about", "/contribute", "/projects", "/projects/vantadb", "/design-system"],
  },
  {
    name: "MemoryDemo",
    file: "nm/v2/memory-demo.tsx",
    category: "scenes",
    purpose: {
      es: "Demo de memoria persistente: stack de placas con detalle vivo.",
      en: "Persistent-memory demo: plate stack with a live detail.",
    },
    usedIn: [],
  },
  {
    name: "ScopeStudy",
    file: "nm/v2/scope-study.tsx",
    category: "scenes",
    purpose: {
      es: "Estudio Scopegrain acotado/explosionado; la sección salió del home.",
      en: "Bounded/exploded Scopegrain study; the section left the home.",
    },
    usedIn: [],
  },
  {
    name: "OrbitalWord",
    file: "nm/v2/orbital-glyphs.tsx",
    category: "scenes",
    purpose: {
      es: "Glifos SVG del lettering Orbital; fallback sin webfont.",
      en: "SVG glyphs of the Orbital lettering; no-webfont fallback.",
    },
    usedIn: [],
  },
  // ---- nm/v1 · legacy -----------------------------------------------------
  {
    name: "AsciiField",
    file: "nm/v1/AsciiField.tsx",
    category: "legacy",
    purpose: { es: "Campo ASCII de ruido que converge al hacer scroll.", en: "ASCII noise field converging on scroll." },
    usedIn: [],
  },
  {
    name: "DescentSection",
    file: "nm/v1/DescentSection.tsx",
    category: "legacy",
    purpose: { es: "Sección mecanismo+prueba sobre AsciiField.", en: "Mechanism-plus-proof section on AsciiField." },
    usedIn: [],
  },
  {
    name: "EntropyTrace",
    file: "nm/v1/EntropyTrace.tsx",
    category: "legacy",
    purpose: { es: "Osciloscopio de entropía medida (0–8 bits).", en: "Measured-entropy oscilloscope (0–8 bits)." },
    usedIn: [],
  },
  {
    name: "Faq (v1)",
    file: "nm/v1/Faq.tsx",
    category: "legacy",
    purpose: { es: "Acordeón FAQ con motion/react.", en: "FAQ accordion with motion/react." },
    usedIn: [],
  },
  {
    name: "FlipText",
    file: "nm/v1/FlipText.tsx",
    category: "legacy",
    purpose: { es: "Roll-up letra a letra en hover.", en: "Letter-by-letter hover roll-up." },
    usedIn: [],
  },
  {
    name: "FlowBoard",
    file: "nm/v1/FlowBoard.tsx",
    category: "legacy",
    purpose: { es: "Board de etapas pineado al scroll.", en: "Scroll-pinned stage board." },
    usedIn: [],
  },
  {
    name: "HalftoneCanvas",
    file: "nm/v1/HalftoneCanvas.tsx",
    category: "legacy",
    purpose: { es: "Motor halftone canvas 2D con seis instrumentos.", en: "Canvas-2D halftone engine with six instruments." },
    usedIn: [],
  },
  {
    name: "HolonGrid",
    file: "nm/v1/HolonGrid.tsx",
    category: "legacy",
    purpose: { es: "Grid de capacidades bordeada con halftone.", en: "Bordered capability grid with halftone." },
    usedIn: [],
  },
  {
    name: "Immersive",
    file: "nm/v1/Immersive.tsx",
    category: "legacy",
    purpose: { es: "Escultura halftone scroll-driven en 400vh.", en: "Scroll-driven halftone sculpture on a 400vh track." },
    usedIn: [],
  },
  {
    name: "InstrumentCounter",
    file: "nm/v1/InstrumentCounter.tsx",
    category: "legacy",
    purpose: { es: "Contador instrumento con numerales tabulares mono.", en: "Instrument counter with tabular mono numerals." },
    usedIn: [],
  },
  {
    name: "Marquee",
    file: "nm/v1/Marquee.tsx",
    category: "legacy",
    purpose: { es: "Marquee de texto infinito (loop 22s).", en: "Infinite text marquee (22s loop)." },
    usedIn: [],
  },
  {
    name: "NumberedRows",
    file: "nm/v1/NumberedRows.tsx",
    category: "legacy",
    purpose: { es: "Filas 01–NN con inversión de tinta en hover.", en: "01–NN rows with hover ink inversion." },
    usedIn: [],
  },
  {
    name: "OssCards",
    file: "nm/v1/OssCards.tsx",
    category: "legacy",
    purpose: { es: "Sección OSS con patrón price-card.", en: "OSS section in the price-card pattern." },
    usedIn: [],
  },
  {
    name: "Reveal",
    file: "nm/v1/Reveal.tsx",
    category: "legacy",
    purpose: { es: "Entrada discreta única.", en: "Single discreet entrance." },
    usedIn: [],
  },
  {
    name: "RoadmapRail",
    file: "nm/v1/RoadmapRail.tsx",
    category: "legacy",
    purpose: { es: "Rail de roadmap pineado con progreso.", en: "Pinned roadmap rail with progress." },
    usedIn: [],
  },
  {
    name: "SectionHeading (v1)",
    file: "nm/v1/SectionHeading.tsx",
    category: "legacy",
    purpose: { es: "Encabezado V1 previo a nm/v2/section-heading.", en: "V1 heading predating nm/v2/section-heading." },
    usedIn: [],
  },
  {
    name: "SilkHero",
    file: "nm/v1/SilkHero.tsx",
    category: "legacy",
    purpose: { es: "Hero con shader WebGL «liquid silk».", en: "WebGL “liquid silk” shader hero." },
    usedIn: [],
  },
  {
    name: "SiteFooter (v1)",
    file: "nm/v1/SiteFooter.tsx",
    category: "legacy",
    purpose: { es: "Footer con wordmark a escala de viewport.", en: "Footer with a viewport-scale wordmark." },
    usedIn: [],
  },
  {
    name: "SiteHeader (v1)",
    file: "nm/v1/SiteHeader.tsx",
    category: "legacy",
    purpose: { es: "Nav flotante que colapsa a superficie al hacer scroll.", en: "Floating nav collapsing to a surface on scroll." },
    usedIn: [],
  },
  {
    name: "TerminalDemo",
    file: "nm/v1/TerminalDemo.tsx",
    category: "legacy",
    purpose: { es: "Terminal con líneas tecleadas y estados ok/live.", en: "Terminal with typed lines and ok/live states." },
    usedIn: [],
  },
  {
    name: "Ticker",
    file: "nm/v1/Ticker.tsx",
    category: "legacy",
    purpose: { es: "Marquee mono con reloj UTC en vivo.", en: "Mono marquee with a live UTC clock." },
    usedIn: [],
  },
  {
    name: "WorkSection",
    file: "nm/v1/WorkSection.tsx",
    category: "legacy",
    purpose: { es: "Zona «The Work»: pipeline RFC, bento, contacto.", en: "“The Work” zone: RFC pipeline, bento, contact." },
    usedIn: [],
  },
  {
    name: "sculpture",
    file: "nm/v1/sculpture.ts",
    category: "legacy",
    purpose: { es: "Motor de esculturas de puntos halftone a canvas 2D.", en: "Halftone point-sculpture engine projected to canvas 2D." },
    usedIn: [],
  },
  {
    name: "useLuminance",
    file: "nm/v1/useLuminance.ts",
    category: "legacy",
    purpose: { es: "Sonda de luminancia para invertir tinta del chrome fijo.", en: "Luminance probe to invert the fixed chrome's ink." },
    usedIn: [],
  },
  // ---- ui/ · shadcn -------------------------------------------------------
  {
    name: "Button",
    file: "ui/button.tsx",
    category: "ui",
    purpose: { es: "Botón base con variantes cva.", en: "Base button with cva variants." },
    usedIn: ["action-link", "/design-system", "/app", "/login"],
  },
  {
    name: "Card",
    file: "ui/card.tsx",
    category: "ui",
    purpose: { es: "Tarjeta shadcn; se regenera, no se edita a mano.", en: "shadcn card; regenerated, never hand-edited." },
    usedIn: ["/design-system"],
  },
  {
    name: "Input",
    file: "ui/input.tsx",
    category: "ui",
    purpose: { es: "Campo de texto base.", en: "Base text field." },
    usedIn: ["/login", "/design-system"],
  },
  {
    name: "Label",
    file: "ui/label.tsx",
    category: "ui",
    purpose: { es: "Etiqueta Radix para formularios.", en: "Radix label for forms." },
    usedIn: ["/login", "/design-system"],
  },
  {
    name: "Sheet",
    file: "ui/sheet.tsx",
    category: "ui",
    purpose: { es: "Panel lateral Radix del menú móvil.", en: "Radix side panel for the mobile menu." },
    usedIn: ["site-header"],
  },
  // ---- ext/ · adapted registries --------------------------------------------
  // Pieces ported from React Bits / Aceternity, retokenized to --nm2-* and wired
  // to the site motion gate. Library stock mounted only in the gallery so far.
  {
    name: "DecryptedText",
    file: "nm/ext/decrypted-text.tsx",
    category: "content",
    purpose: {
      es: "Revelado de texto con scramble de glifos al entrar en vista (React Bits).",
      en: "Text reveal via glyph scramble on view (React Bits).",
    },
    usedIn: ["/design-system"],
  },
  {
    name: "BlurText",
    file: "nm/ext/blur-text.tsx",
    category: "content",
    purpose: {
      es: "Entrada escalonada por palabra o letra con blur (React Bits).",
      en: "Staggered word/letter entrance with blur (React Bits).",
    },
    usedIn: ["/design-system"],
  },
  {
    name: "ShinyText",
    file: "nm/ext/shiny-text.tsx",
    category: "content",
    purpose: {
      es: "Barrido de brillo animado sobre el texto (React Bits).",
      en: "Animated shine sweep over text (React Bits).",
    },
    usedIn: ["/design-system"],
  },
  {
    name: "TextType",
    file: "nm/ext/text-type.tsx",
    category: "content",
    purpose: {
      es: "Máquina de escribir en bucle sobre una lista de palabras (React Bits).",
      en: "Looping typewriter over a word list (React Bits).",
    },
    usedIn: ["/design-system"],
  },
  {
    name: "SpotlightCard",
    file: "nm/ext/spotlight-card.tsx",
    category: "scenes",
    purpose: {
      es: "Superficie de tarjeta con spotlight que sigue al cursor (React Bits).",
      en: "Card surface with a cursor-following spotlight (React Bits).",
    },
    usedIn: ["/design-system"],
  },
  {
    name: "Orb",
    file: "nm/ext/orb.tsx",
    category: "scenes",
    purpose: {
      es: "Orbe de shader animado; visual ambiental (React Bits).",
      en: "Animated shader orb; ambient visual (React Bits).",
    },
    usedIn: ["/design-system"],
  },
  {
    name: "Waves",
    file: "nm/ext/waves.tsx",
    category: "scenes",
    purpose: {
      es: "Fondo de líneas onduladas animadas (React Bits).",
      en: "Animated wave-line background (React Bits).",
    },
    usedIn: ["/design-system"],
  },
  {
    name: "BackgroundBeams",
    file: "nm/ext/background-beams.tsx",
    category: "scenes",
    purpose: {
      es: "Haces SVG animados de fondo (Aceternity).",
      en: "Animated SVG background beams (Aceternity).",
    },
    usedIn: ["/design-system"],
  },
  {
    name: "motion-gate",
    file: "nm/ext/motion-gate.ts",
    category: "scenes",
    purpose: {
      es: "Helpers de las piezas ext: gate de motion del sitio y resolución de tokens --nm2-* para canvas/WebGL.",
      en: "Shared helpers for the ext pieces: site motion gate and --nm2-* token resolution for canvas/WebGL.",
    },
    usedIn: ["DecryptedText", "Orb", "ShinyText", "SpotlightCard", "Waves"],
  },
];

export interface BrandAsset {
  /** Filename on disk. */
  file: string;
  /** URL where the site serves it. */
  src: string;
  /** Intrinsic size (viewBox for SVG). */
  dims: string;
  format: "SVG" | "PNG" | "WebP" | "GIF";
  use: { es: string; en: string };
  /** Span two columns in the asset grid. */
  wide?: boolean;
}

export const BRAND_ASSETS: BrandAsset[] = [
  {
    file: "orbital-wordmark.svg",
    src: "/brand/orbital-wordmark.svg",
    dims: "836×120",
    format: "SVG",
    use: {
      es: "Wordmark vectorial principal; el lockup canónico del nombre.",
      en: "Primary vector wordmark; the canonical name lockup.",
    },
    wide: true,
  },
  {
    file: "orbital-monogram.svg",
    src: "/brand/orbital-monogram.svg",
    dims: "180×120",
    format: "SVG",
    use: {
      es: "Monograma NM para contextos compactos.",
      en: "NM monogram for compact contexts.",
    },
  },
  {
    file: "orbital-icon.svg",
    src: "/brand/orbital-icon.svg",
    dims: "64×64",
    format: "SVG",
    use: {
      es: "Icono cuadrado con monograma sobre carbón.",
      en: "Square icon with the monogram on carbon.",
    },
  },
  {
    file: "orbital-avatar.png",
    src: "/brand/orbital-avatar.png",
    dims: "512×512",
    format: "PNG",
    use: {
      es: "Avatar de perfil para redes y org.",
      en: "Profile avatar for socials and the org.",
    },
  },
  {
    file: "orbital-banner.png",
    src: "/brand/orbital-banner.png",
    dims: "2400×800",
    format: "PNG",
    use: {
      es: "Banner estático de cabecera.",
      en: "Static header banner.",
    },
    wide: true,
  },
  {
    file: "orbital-og.png",
    src: "/brand/orbital-og.png",
    dims: "1200×630",
    format: "PNG",
    use: {
      es: "Tarjeta Open Graph del dominio.",
      en: "Open Graph card for the domain.",
    },
    wide: true,
  },
  {
    file: "orbital-poster.webp",
    src: "/brand/orbital-poster.webp",
    dims: "1920×1080",
    format: "WebP",
    use: {
      es: "Poster del hero; precargado como LCP.",
      en: "Hero poster; preloaded as LCP.",
    },
    wide: true,
  },
  {
    file: "orbital-grain.png",
    src: "/brand/orbital-grain.png",
    dims: "192×192",
    format: "PNG",
    use: {
      es: "Textura de grano en mosaico para superficies.",
      en: "Tiled grain texture for surfaces.",
    },
  },
  {
    file: "org-banner.gif",
    src: "/brand/org-banner.gif",
    dims: "960×240 · 60f/4s",
    format: "GIF",
    use: {
      es: "Banner animado del perfil de GitHub, tema oscuro.",
      en: "Animated GitHub profile banner, dark theme.",
    },
    wide: true,
  },
  {
    file: "org-banner-light.gif",
    src: "/brand/org-banner-light.gif",
    dims: "960×240 · 60f/4s",
    format: "GIF",
    use: {
      es: "Banner animado del perfil de GitHub, tema claro.",
      en: "Animated GitHub profile banner, light theme.",
    },
    wide: true,
  },
  {
    file: "icon.svg",
    src: "/icon.svg",
    dims: "64×64",
    format: "SVG",
    use: {
      es: "Favicon de la app (app/icon.svg).",
      en: "App favicon (app/icon.svg).",
    },
  },
  {
    file: "apple-touch-icon.png",
    src: "/apple-touch-icon.png",
    dims: "180×180",
    format: "PNG",
    use: {
      es: "Icono táctil de Apple.",
      en: "Apple touch icon.",
    },
  },
  {
    file: "og.png",
    src: "/og.png",
    dims: "1200×630",
    format: "PNG",
    use: {
      es: "Open Graph de fallback en la raíz de public/.",
      en: "Fallback Open Graph at the public/ root.",
    },
    wide: true,
  },
];

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
  "layout",
  "chrome",
  "content",
  "scenes",
  "legacy",
  "ui",
];
