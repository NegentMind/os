# Biblioteca interna de componentes (`components/`)

Regla del proyecto: **todo elemento o componente de la página debe vivir en la
biblioteca interna para reutilizarse.** Nada de piezas ad-hoc embebidas en una
ruta que otro frente pueda necesitar.

Tres capas:

| Capa | Estado | Qué es |
|---|---|---|
| `nm/v1/` | Legado reutilizable | Componentes de la generación anterior (Void/Bone/Pulse). Fuera de producción; se conservan para reutilización y rediseño, no están muertos. |
| `nm/v2/` | Activa | Componentes del sitio Orbital actual (carbón/plata). Es lo que el marketing sirve. |
| `../ui/` | Base | Primitivas shadcn new-york. Nunca se editan a mano: `npx shadcn add <x>`; la personalización vive en `nm/` vía `cva` + tokens. |

El copy que consume la biblioteca v2 vive en `lib/content/{es,en}.ts`.
`lib/i18n/` aporta el contrato `Locale`/`Dict`; el contenido de sus
diccionarios está retirado y solo lo tipan los componentes v1.

## `nm/v1/` — biblioteca legado (restaurada 2026-11-18)

Eliminados en `2281bb9` como dead code y restaurados a petición del usuario
para conservarlos como material reutilizable. Tokens V1 (Bone/Pulse/Fog); si
se adoptan en una superficie Orbital hay que retokenizarlos a `--nm2-*`.
Todos los que dibujan respetan `prefers-reduced-motion` en su propio código.

- `AsciiField.tsx` — campo ASCII de ruido fractal que converge en orden al hacer scroll; instrumentos con valores medidos.
- `DescentSection.tsx` — sección «mecanismo + prueba»: converge el `AsciiField` y monta instrumentos en vivo.
- `EntropyTrace.tsx` — trazado de osciloscopio de entropía medida (0–8 bits, escala Shannon por byte); solo datos por props.
- `Faq.tsx` — acordeón FAQ con `motion/react`, una respuesta abierta a la vez.
- `FlipText.tsx` — hover letter-by-letter roll-up (port de webTemplates/mondragon2).
- `FlowBoard.tsx` — stage board pineado al scroll (port de nice-squash): tabs de etapa, panel de código, grafo de queries y panel de métricas.
- `HalftoneCanvas.tsx` — motor canvas 2D halftone/línea: seis instrumentos animados (chip scan, esfera, grafo, barras, onda, órbita). Re-exporta `HalftoneKind` desde `lib/marketing-types`.
- `HolonGrid.tsx` — grid de capacidades bordeada (port de nice-squash `Platform`): tarjetas técnicas numeradas con instrumento halftone.
- `Immersive.tsx` — escultura halftone scroll-driven en pista de 400vh (port de nice-squash `Immersive`).
- `InstrumentCounter.tsx` — contador instrumento con numerales tabulares mono; solo valores medidos o constantes documentadas.
- `Marquee.tsx` — marquee de texto infinito (port de mondragon2; loop lineal 22s, contenido duplicado para el wrap −50%).
- `NumberedRows.tsx` — filas numeradas «01–NN» con micro-interacción hover de inversión de tinta (port de sequenceone).
- `OssCards.tsx` — sección open-source con patrón price-card: etiqueta → cifra grande → descripción → lista incluida (mondragon2).
- `Reveal.tsx` — entrada discreta única; la coreografía scrubbed pertenece a GSAP.
- `RoadmapRail.tsx` — rail de roadmap pineado con carro y progreso (port de strand «Scroll Progress Section»).
- `SectionHeading.tsx` — encabezado de sección V1 (título + lede) previo a `nm/v2/section-heading`.
- `SilkHero.tsx` — hero con shader WebGL «liquid silk» iridiscente (port verbatim de mondragon2).
- `SiteFooter.tsx` — footer con wordmark gigante a escala de viewport, sitemap centrado y meta row (patrón de templates/ox).
- `SiteHeader.tsx` — nav flotante: transparente sobre hero, colapsa a superficie al hacer scroll (port de mondragon2 `Nav`).
- `TerminalDemo.tsx` — terminal con líneas tecleadas, spinner y estados ok/live (port de nice-squash `Terminal`).
- `Ticker.tsx` — marquee mono con reloj UTC en vivo; pausado con `prefers-reduced-motion`.
- `WorkSection.tsx` — zona «The Work»: pipeline RFC, bento de métricas verificables, founder y contacto.
- `sculpture.ts` — motor de escultura de puntos halftone: nubes 3D paramétricas (torusKnot, sphere, lattice, twistTorus, rings, chip, shell, geodesic) proyectadas a canvas 2D.
- `useLuminance.ts` — sonda de luminancia para chrome fijo (port de noveq): muestrea el fondo bajo el header para invertir tinta.

## `nm/v2/` — biblioteca activa (Orbital)

- `action-link.tsx` — acciones primaria/secundaria/texto sobre Button de shadcn.
- `animated-heading.tsx` — titulares con efectos `assemble`/`focus`/`trace`/`decode` sobre el split por palabras; modo Orbital (default) renderiza en la fuente Orbital Display real, `data-headings="sans"` vuelve a Outfit.
- `art-figure.tsx` — lámina de arte canónica: `<figure>` con marco + `<figcaption>` de procedencia.
- `art-mount.tsx` — monta presets de arte (warp Paper o campos) en superficies no-hero.
- `blueprint-scene.tsx` — diagramas semánticos SVG con etiquetas HTML posicionadas por porcentaje (o sólidos decorativos sin etiquetas).
- `brand-mark.tsx` — wordmark/monograma con la geometría vectorial Orbital original; nunca `font-family` ni sustitución por texto.
- `vantadb-showcase.tsx` — bloque flagship de VantaDB en home (identidad, problema→cuerpo→CTAs, lámina de estratos L1–L3). El pipeline de recuperación y la ficha viven en `/projects/vantadb`.
- `core-orb.tsx` — orbe-instrumento de `#org`: esfera de puntos en Canvas 2D con punto espectral fijable; poster SVG como superficie SSR.
- `drift-canvas.tsx` — corrientes monocromáticas en Canvas 2D (ramp carbón→plata del preset `HERO_ART_ALT`): cintas ondulantes, partículas y una cresta espectral que viaja con `--nm2-system-progress`; poster CSS como superficie SSR/reduced-motion.
- `evidence-workbench.tsx` — banco de evidencia de home.
- `faq.tsx` — FAQ con `details/summary` nativo; accesible sin JS.
- `field-canvas.tsx` — campos Canvas 2D (`wave`/`orbit`/`network`/`memory`) con fallback SVG SSR determinista.
- `hero.tsx` — composición server del hero de home; hojas cliente para arte y palabra rotativa.
- `hero-background.tsx` — poster local + mejora WebGL progresiva.
- `hero-entrance.tsx` — entrada CSS del primer render del hero.
- `hero-preset.ts` — presets de arte Orbital/strata-01 (fuente única para arte en vivo y exports).
- `hero-warp.tsx` — warp Paper Shaders del hero (pool de 3 variantes al azar).
- `holon-explorer.tsx` — explorador interactivo del mapa de holones.
- `memory-demo.tsx` — demo de memoria persistente. **Biblioteca**: sin import vivo en el árbol de rutas actual.
- `motion-preference.tsx` — control global de pausa/reanudación en el footer.
- `motion-provider.tsx` — estado compartido de movimiento + `html[data-motion]`.
- `orbital-glyphs.tsx` — mapa de glifos SVG del lettering Orbital. **Fallback/biblioteca**: sin import vivo; la vía principal es la fuente woff2 y queda para glifos que la fuente no cubre (acentos, dígitos) y contextos sin webfont.
- `page-cta.tsx` — cierre con llamada a la acción de páginas interiores.
- `page-hero.tsx` — composición asimétrica compartida de héroes interiores.
- `pointer-feedback.tsx` — anillo decorativo de puntero; nunca captura interacción ni sustituye el cursor.
- `project-card.tsx` — tarjeta de proyecto con estado honesto.
- `rotating-word.tsx` — palabra rotativa del hero en Orbital Display real con tinta espectral (`--nm2-rotor-ink`).
- `scope-study.tsx` — estudio Scopegrain (BlueprintScene `scope` + toggle acotado/explosionado). **Biblioteca**: sin uso actual; Scopegrain volvió al home como franja compacta dentro de `#work` (2026-11), sin el estudio, y el proyecto sigue en `/projects`. Su contrato de copy es propio (`ScopeStudyCopy`), no depende de `SiteCopy`.
- `scroll-scene.tsx` — escena con trazo y flotación GSAP/ScrollTrigger.
- `section-heading.tsx` — encabezado de sección (título animado + descripción).
- `section.tsx` — ritmo de sección (`--nm2-section-gap`, tonos).
- `site-footer.tsx` — footer compartido: monograma, enlaces, campo, línea base.
- `site-header.tsx` — navegación fija/flotante, cambio de idioma, menú móvil Sheet.
- `smooth-scroll.tsx` — Lenis solo con movimiento permitido; raf en el ticker de GSAP.
- `spec-list.tsx` — gramática `<dl>` → `<dt>`/`<dd>` compartida (facts VantaDB, principles About).
- `status-badge.tsx` — estado como texto primero; el punto de color solo apoya.
- `story-controls.tsx` — selectores segmentados `aria-pressed` + `aria-controls`.
- `story-detail.tsx` — región viva `aria-live="polite"` que anuncia la selección.
- `surface.tsx` — elevación por relleno + espaciado; borde secundario.
- `system-story.tsx` — historia del sistema (`#org`) de home: stage sticky de corrientes (DriftCanvas + CoreOrb) con ensamblaje scroll-driven de nodos/spokes vía GSAP/ScrollTrigger.
- `vanta-strata.tsx` — lámina canvas del archivo `.vanta`: estratos L1–L3 concéntricos, cabezal append-only y tránsitos de consolidación; poster SVG SSR/reduced-motion.
- `viewport-fade.tsx` — borde óptico inferior de capas de blur enmascaradas; oculto bajo el hero.
- `section-transition/` — bandas canvas entre tonos: `section-transition.tsx`, `variants.ts` (5 renderers puros), `transition-lab.tsx` (contexto/provider/hooks) + `transition-lab-panel.tsx` (UI lazy `ssr:false`, solo dev).

## `../ui/` — primitivas shadcn (no tocar a mano)

- `button.tsx` — botón base con variantes `cva`.
- `card.tsx` — tarjeta shadcn (restaurada con la biblioteca; sin import vivo aún).
- `input.tsx` — campo de texto base.
- `label.tsx` — etiqueta Radix para formularios.
- `sheet.tsx` — panel lateral Radix del menú móvil.
