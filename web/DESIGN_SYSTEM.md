# DESIGN_SYSTEM.md — tokens, UI y reglas visuales

Actualizado: 2026-11-18.

## Autoridad y límite V1

Para **marketing Orbital**, los valores ejecutables viven en `app/orbital.css`,
que importa, en orden, `orbital-hero.css`, `orbital-pages.css`,
`orbital-scenes.css`, `orbital-home.css` y `orbital-shell.css`. `DESIGN.md` es la ficha
visual extraída; la dirección aprobada está en `docs/dev/site-v2-design.md`.
Este contrato describe código local con la ronda de navegador ya realizada y
typecheck/build manuales pendientes, no un despliegue ni una auditoría de
accesibilidad aprobada.

`app/globals.css`, `lib/i18n/Dict` y las fuentes V1 se conservan para la
compatibilidad del contexto de producto. Los componentes V1, eliminados en
`2281bb9`, fueron **restaurados como biblioteca legado reutilizable en
`components/nm/v1/`** (2026-11-18): fuera de producción, conservados para
reutilización y rediseño —no código muerto—; si se adoptan en una
superficie Orbital hay que retokenizarlos a `--nm2-*`. El tipo
`HalftoneKind` sigue en `lib/marketing-types.ts` como fuente única y
`nm/v1/HalftoneCanvas.tsx` lo re-exporta. **No sincronizar Orbital a
`../brand/media/remotion/src/tokens.ts` ni al perfil GitHub
publicado/congelado.** Void/Bone/Pulse y Chakra Petch/Inter dejan de ser
autoridad para marketing, no se borran ni se migran sus pipelines en esta
fase.

## Colores (`app/orbital.css`)

| Token canónico | Valor | Uso |
|---|---|---|
| `--nm2-bg` | `#000000` | Fondo carbón |
| `--nm2-section` | `#070809` | Bandas y zonas de lectura |
| `--nm2-surface` | `#0E1013` | Superficies y cards |
| `--nm2-raised` | `#1C2026` | Superficie elevada/seleccionada |
| `--nm2-text` | `#F1F3F5` | Texto principal |
| `--nm2-muted` | `#ADB5C0` | Texto secundario |
| `--nm2-line` | `#343B46` | Bordes y separadores |
| `--nm2-structure` | `#A7B4C7` | Estructura, enlaces y detalles |
| `--nm2-action` | `#E7EDF5` | Acción primaria y foco |
| `--nm2-on-action` | `#000000` | Texto sobre acción primaria |
| `--nm2-paper-bg` | `#FFFFFF` | Fondo papel, de borde a borde |
| `--nm2-paper-ink` | `#111418` | Tinta principal sobre papel |
| `--nm2-paper-muted` | `#4D5662` | Texto secundario sobre papel |
| `--nm2-paper-line` | `#D3D9E1` | Líneas sobre papel |
| `--nm2-paper-panel` | `#F2F4F7` | Superficies y tarjetas sobre papel |
| `--nm2-paper-raised` | `#E6EAF0` | Superficies elevadas sobre papel |
| `--nm2-spectrum-teal` | `#5BADA0` | Material expresivo |
| `--nm2-spectrum-blue` | `#465DCF` | Material expresivo |
| `--nm2-spectrum-violet` | `#965CCB` | Material expresivo |
| `--nm2-spectrum-rose` | `#DC5E89` | Material expresivo |
| `--nm2-spectrum-amber` | `#D9A45E` | Material expresivo |
| `--nm2-spectrum-ice` | `#B7CDD7` | Material expresivo |

Una sola identidad, sin selector de tema. `.nm2-section--paper` cambia juntos fondo, tinta, texto secundario, líneas, paneles y roles de acción; no es un segundo tema. Tokens de papel: `--nm2-paper-bg` `#FFFFFF`, `--nm2-paper-ink` `#111418`, `--nm2-paper-muted` `#4D5662`, `--nm2-paper-line` `#D3D9E1`, `--nm2-paper-panel` `#F2F4F7`, `--nm2-paper-raised` `#E6EAF0`.

Los aliases `--nm2-art-*` apuntan a `--nm2-spectrum-*`: no definen otra
paleta. El hero usa además `#101C27` como sombreado de material expresivo,
no como token de UI. El espectro se comparte entre shader, ilustraciones y
detalles acotados; no colorea cada botón ni el texto de lectura. Los estados
de proyecto tienen etiqueta explícita, nunca dependen solo del color.

Los aliases `@theme inline` conectan los neutrales con shadcn/Tailwind:
`background/foreground`, `card`, `popover`, `primary`, `secondary`, `muted`,
`accent`, `border`, `input` y `ring`. Usar esos roles o los tokens `nm2` en
la capa interna, no hex nuevos en el markup.

## Tipografía y geometría

Orbital nació como **lettering SVG original**; desde 2026-11 existe además
**Orbital Display v0.3**, una fuente real compilada desde la misma
geometría (`../brand/orbital/font/`: `orbital-display.ttf/.woff2`,
`build-font.py`, proofs) y **servida en la web como font-face real**
(`next/font/local` en `lib/fonts.ts` → `--font-orbital-display` en
`<html>`, alias `--font-orbital` en `@theme`; archivo en
`public/fonts/orbital-display.woff2`). Es material de marca para momentos
display —los titulares de sección por defecto
(`nm2-animated-heading--orbital`, efectos de entrada aplicados al texto),
la palabra rotativa del hero y el toggle `orbitalHeadings` del
TransitionLab (`<html data-headings="orbital">` ⇄ `"sans"` vuelve a
Outfit)—, no fuente de interfaz: párrafos, navegación y controles siguen
en Outfit/DM Sans. `lib/fonts.ts` exporta `fontVarsV2` para el root
layout de marketing.

Cobertura de la fuente (75 glifos): A–Z, a–z, espacio y 20 signos de
puntuación —**sin acentos ni dígitos**. Los caracteres no cubiertos caen a
Outfit por la pila de `font-family` (varias líneas de titulares en ES
contienen á/é/í/ó/ú; verificar al ampliar el set). El mapa SVG de
`nm/v2/orbital-glyphs.tsx` queda como biblioteca/fallback para glifos sin
fuente y contextos sin webfont.

Regla de nombre: la organización se escribe **NEGENT MIND en mayúsculas**
en copy y documentación pública; el wordmark SVG ya la dibuja así.

| Rol | Fuente | Uso implementado |
|---|---|---|
| Display | Orbital Display (`--font-orbital-display`) | Titulares de sección (tracking `0.12em`, mayúsculas) y palabra rotativa del hero |
| Títulos | Outfit (`--font-heading`) | Hero `clamp(3rem, 5.7vw, 5.5rem)`; fallback de titulares y de glifos no cubiertos por Orbital Display |
| Texto / UI | DM Sans (`--font-body`, `--font-sans`) | Body `1rem / 1.6`; lede `1.0625rem / 1.65` |
| Código | JetBrains Mono (`--font-mono`) | Código/identificadores + micro-etiquetas de diagrama (`0.6875rem`, tracking `0.08em`) |

Los títulos Outfit usan sentence case, tracking ajustado y líneas
equilibradas; los titulares Orbital Display se renderizan en mayúsculas
(`text-transform`) con tracking `0.12em`, la cadencia del lettering SVG
(gap de 16 unidades sobre la caja de 120).
Las medidas adaptativas concretas están extraídas en `DESIGN.md`.

| Token | Valor |
|---|---|
| `--nm2-radius-sm` | `12px` |
| `--nm2-radius-card` | `20px` |
| `--nm2-radius-hero` | `32px` |
| `--nm2-radius-pill` | `999px` |
| `--nm2-container` | `72rem` |
| `--nm2-gutter` | `clamp(1.25rem, 4vw, 3rem)` |
| `--nm2-frame-gap` | `12px` (`8px` < 768px) |

### Escala de ritmo única (2026-11-18)

Tres peldaños gobiernan todo el espaciado vertical; los valores sueltos de
sección están vetados. Los sublímites internos escalan con `calc()`, nunca
con otra escala.

| Token | Valor | Rol |
|---|---|---|
| `--nm2-section-gap` | `clamp(3rem, 6.5vw, 5.5rem)` | `padding-block` de `.nm2-section`, secciones `--paper` y footer |
| `--nm2-block-gap` | `clamp(2rem, 4.5vw, 4rem)` | Entre bloques internos: heading, stories, ledgers, figuras |
| `--nm2-band-space` | `clamp(1.75rem, 4.5vw, 3.5rem)` | Aire que conserva una sección junto a una banda `SectionTransition` |

Regla estructural: una banda `SectionTransition` ya aporta la separación
visual; `.nm2-transition + .nm2-section` usa `band-space` de entrada y
`.nm2-section:has(+ .nm2-transition)` de salida, para que banda + padding
no apilen hueco muerto. `nm2-page-intro` mantiene asimetría propia
(`×1.15` arriba, `×0.6` abajo) sobre `section-gap`; `invitation-section` y
`faq-section` arrancan a `×0.5` de `block-gap` salvo que una banda mande.
Solo `min-height` donde ayude a la composición; nunca `height` fija que
corte contenido.

Radios y tokens de layout tienen su fuente en `app/orbital.css`;
`app/orbital-hero.css` define el hero. **Fullbleed es la variante publicada
por defecto** (ancho completo, sin radio); el atributo
`data-fullbleed="false"` —que solo el TransitionLab escribe— recupera el
marco fluido `calc(100% - 2 * var(--nm2-frame-gap))` para comparación.
El wordmark Orbital sobresale intencionadamente del borde inferior
(`--nm2-hero-sign-h` / `--nm2-hero-sign-out` / `--nm2-hero-sign-reserved`
reservan la parte colgante para no cortarla) y la palabra rotativa usa la
fuente Orbital Display con tinta espectral vía `--nm2-rotor-ink`. El hero
reserva 104px para la navegación superpuesta y puede crecer en móvil o zoom.
`app/orbital-shell.css` define la barra flotante a ancho de marco y el layout
asimétrico de `PageHero`, con altura mínima `clamp(560px, 86svh, 960px)`
(`clamp(520px, 80svh, 760px)` por debajo de 768px).

Secciones con `padding-block: var(--nm2-section-gap)`. Contenedor común,
ensanchado a `88rem` solo en home (`orbital-home.css`),
texto con medida de lectura y composiciones variadas: proyecto destacado,
ledger, diagramas y pasajes editoriales, no una cuadrícula de cards idénticas.
Fill, diferencias tonales y espacio dan profundidad; bordes secundarios,
sin neón ni sombras/glows como identidad funcional.

Las utilidades de tono `.nm2-tone-paper`, `.nm2-tone-dark` y
`.nm2-tone-section` remapean juntos los roles semánticos `--nm2-*`
(fondo, superficie, tinta, líneas, acción) para una región concreta —
la tarjeta de invitación de home (`nm2-tone-dark` dentro de una zona
clara) o el ledger de Scopegrain (`nm2-tone-section`). Nunca un cambio
parcial de roles.

## Librería interna y primitivas

La biblioteca interna está documentada pieza a pieza en
`components/nm/README.md`: `nm/v1/` (legado reutilizable), `nm/v2/`
(activa) y `components/ui/` (shadcn). Regla vigente: todo elemento de la
página vive en la biblioteca para reutilizarse.

`components/nm/v2/` contiene BrandMark, ActionLink, Surface, Section,
SectionHeading/AnimatedHeading, PageHero, PageCta, StatusBadge, ProjectCard,
Faq, SiteHeader/SiteFooter, hero, FieldCanvas, BlueprintScene, CoreOrb,
ScrollScene, MotionPreference, ViewportFade, PointerFeedback, SmoothScroll,
SectionTransition/TransitionLab y las historias de home (SystemStory,
HolonExplorer, EvidencePath, PrincipleRules, VantaShowcase).
Patrones repetidos consolidados (2026-11-18):

- `ArtFigure` (`art-figure.tsx`): `<figure>` + marco de arte + `<figcaption>`
  de procedencia —antes inline en las seis historias de home. `decorative`
  controla el `aria-hidden` del marco (`false` cuando el arte es
  interactivo: orbe de SystemStory, mapa de HolonExplorer).
- `StoryControls`/`StoryControl` (`story-controls.tsx`): el grupo
  `role="group"` y el botón segmentado con contrato `aria-pressed` +
  `aria-controls` + tap scale condicionado a `canAnimate` (SystemStory,
  MemoryDemo, ScopeStudy).
- `StoryDetail` (`story-detail.tsx`): la región viva `aria-live="polite"` +
  `aria-atomic` que anuncia la selección (SystemStory, MemoryDemo,
  EvidenceWorkbench, HolonExplorer).
- `SpecList` (`spec-list.tsx`): la gramática `<dl>` → `<div>` → `<dt>`/`<dd>`
  compartida por `nm2-facts` (VantaDB) y `nm2-principles` (About); la piel
  divergente vive en la clase que pasa el call site. Adoptada en la galería;
  la sustitución en las dos páginas queda pendiente del frente que las
  trabaja.
Las escenas SVG con
etiquetas HTML posicionadas por porcentaje (`BlueprintScene`, conexiones de
`HolonExplorer`) usan `preserveAspectRatio="none"` a propósito —un `meet`
con letterboxing desalinearía las tarjetas—; `MemoryStack`, sin capa HTML,
conserva `xMidYMid meet`.
Se compone sobre la base shadcn new-york en `components/ui/`:

- `ActionLink` compone el **Button** existente y conserva las variantes
  primaria, secundaria y de enlace de texto.
- Menú móvil mediante **Sheet** generado con shadcn/Radix; conservar sus
  comportamientos de foco, cierre y teclado.
- FAQ con **`details/summary` nativo**; no requiere otra dependencia.
- Conservar `button`, `card`, `input`, `label` y `sheet` sin
  personalización manual en `components/ui/*` (`card` se restauró con la
  biblioteca; aún sin import vivo).
  Variantes, composición y tokens propios van en `nm/v2`, no en la
  primitiva regenerable.
- Iconos de UI con `lucide-react`; marca con su geometría SVG original.
- Header, skip link a `main#main-content` y footer compartidos por las cinco
  páginas. Estados de foco visibles en plata, no Pulse.

`ActionLink` conserva Button de shadcn. Las acciones primarias y secundarias usan un borde material de dos capas neutras y un reflejo de hover/foco, nunca un botón multicolor. El rol de acción se invierte junto con el papel. La biblioteca real vive en `components/nm/v2/`; las muestras HTML estáticas son ilustrativas.

Las galerías `/[lang]/design-system` y `/[lang]/design-system/art` son de
development, `noindex`, fuera del sitemap y 404 fuera de development;
no una sexta página pública.

## Gramática gráfica de escenas (2026-11-18)

Una sola gramática visual gobierna diagramas, campos e historias:

| Rasgo | Regla |
|---|---|
| Trazo estructural | `stroke-width: 1.5` en conectores, caras, placas e iconos de diagrama |
| Trazo ambiental | `0.65` en filamentos de campo, guías y meridianos del orbe |
| Nodos | `fill` de superficie + `border: 1px solid var(--nm2-line)` + `--nm2-radius-*`; selección invierte al par `action`/`on-action`; **sin sombras** |
| Etiquetas | índice/estado en mono `0.6875rem` tracking `0.08em` muted; texto de etiqueta en sans `0.8125rem` |
| Conectores | `--nm2-line` a 1.5; el estado seleccionado cambia solo el color (`--nm2-text` o trazo structure→text), nunca el grosor |
| Espectro | puntual: bandas de transición, palabra rotativa, detalles de estado y arte acotado; nunca en controles ni texto de lectura |

## Material y movimiento

- **Lenis** (`lenis` ^1.3) da smooth scroll al shell de marketing vía
  `SmoothScroll`: import dinámico, vive solo con movimiento permitido —
  reduced motion o la pausa del footer destruyen la instancia y restauran
  el scroll nativo. Los anchors se manejan localmente (no la opción
  `anchors` de Lenis) y `scrollTo` respeta `scroll-margin-top`; cuando GSAP
  está cargado el ticker propio alimenta `lenis.raf` y `ScrollTrigger.update`.
- **Paper Shaders 0.0.82 (Apache-2.0)** sustituye GLSL propio/runtime Framer.
  Runtime vanilla público `ShaderMount` + `warpFragmentShader` de
  `@paper-design/shaders`, con wrapper React local mínimo para
  `try/catch`/cleanup. La inicialización asíncrona del wrapper React de
  Paper no queda cubierta por ErrorBoundary; no copiar el shader ni su loop.
- Poster local desde SSR y fallback inmediato; canvas progresivo solo si
  permitido y visible. Pausa = `speed: 0`; oculto/fuera de viewport = pausa;
  reduced motion = poster estático y ninguna GPU.
- El poster del hero (`/brand/orbital-poster.webp`, superficie LCP) es un
  fondo CSS en `.nm2-hero-art__poster`; el layout de marketing precarga el
  webp con `<link rel="preload" as="image" fetchPriority="high">` para
  adelantar el fetch al del CSS. Coste conocido: la precarga es global al
  grupo `(marketing)` —`/projects` no pinta el poster y lo descarga igual
  (~690 KB)—; la mejora profunda pendiente en `hero-background.tsx` (fichero
  de otro frente) es servirlo con `next/image` + `priority`/`fetchPriority`
  o un preload con scope por ruta.
- CSS posee la entrada del hero en primer render. Motion gestiona navegación,
  titulares y controles. GSAP gestiona reveals de sección y decor acotado en
  `ScrollScene` (trazo `top 90%` a `center 55%`, flotación `top bottom` a
  `bottom top`, scrub 0.8) y el easing del puntero sobre el shader Paper. Los
  listeners se retiran al pausar o desmontar; el tween del puntero se cancela
  sin reiniciar el frame. Nunca se importan ambos motores en un mismo
  componente ni se transforman desde dos motores los mismos wrappers.
- `MotionProvider` centraliza pausa, preferencia del sistema y `html[data-motion]`.
  El control global está en el footer; el hero no tiene botón local.
  `prefers-reduced-motion` conserva arte estático y deshabilita el control
  cuando la preferencia del sistema prevalece.
- `ViewportFade` (borde óptico inferior) se oculta mientras el hero de home
  cubre su franja (`data-hidden` vía IntersectionObserver); en páginas
  interiores sin hero permanece visible.
- Sin loader bloqueante, relojes decorativos, telemetría falsa, scroll
  hijack ni pistas de 400vh. Sin afirmaciones de rendimiento, FPS o tamaño
  de bundle medidos: no hay resultados que las sostengan.

## Transiciones entre secciones

`SectionTransition` (`components/nm/v2/section-transition/`) es una banda de ancho completo, sin márgenes negativos, de altura `clamp(160px, 20vw, 288px)` (128px por debajo de 768px). Pinta un canvas escalado con resolución según variante: suaves hasta 960×360 (480 en móvil), discretas hasta 640×260 (320 en móvil) para conservar celdas nítidas, entre el fondo `--nm2-bg` y el papel `--nm2-paper-bg`; `from`/`to` invierten el sentido. El canvas disuelve el lado `to` en alfa y la propia banda toma el color de destino como fondo CSS, de modo que el tono de unión es siempre exactamente el de la sección adyacente (sin «caja» de otro color). Sin JS queda un degradado CSS. Solo anima si el movimiento está permitido, la banda es visible y la pestaña activa (≈30 fps como objetivo de planificación); con movimiento reducido o pausa se pinta un único frame estático y sin listeners.

El núcleo puro está en `variants.ts` (`renderVariant`). Cinco variantes, con sus valores por defecto (`intensity`, `speed`, `cell`, `spectrum`):

| Variante | Defaults | Notas |
|---|---|---|
| `dither` | 1 · 1 · 2 · 0 | Bayer 8×8 con celda `cell` |
| `blocks` | 1 · 1 · 3 · 0 | Celdas `cell*2` con desplazamiento por filas |
| `tear` | 1,5 · 2 · 3 · 0 | Frontera dentada con astillas; **variante por defecto de home** |
| `chromatic` | 1 · 1 · 3 · 0,55 | Dispersión por canal; el espectro del hero tiñe el borde |
| `iridescent` | 1 · 1 · 3 · 1 | Grano iridiscente con la paleta del hero |

El scroll desplaza la frontera (±0,12·`intensity`) y el puntero fino la abomba con una gaussiana; el grano es un hash determinista, no `Math.random`. Home usa `tear` en las cuatro bandas (`org-in`, `org-out`, `proof-in`, `proof-out`) con `height={360}` — la altura es una prop opcional de `SectionTransition` que fija `--nm2-transition-h`; el lab sigue pudiendo sobreescribirla por banda. Las secciones adyacentes conservan solo `--nm2-band-space` de aire (ver la escala de ritmo).

`TransitionLab` es una herramienta de desarrollo: solo aparece con `NODE_ENV=development` o `?transitions=1`, permite cambiar variante, parámetros y altura en vivo, invertir `from`/`to` por banda, reenmarcar el hero (`fullbleed: false` recupera la variante enmarcada para comparación; fullbleed es el default publicado), alternar el arte de `#org` (orbe ↔ blueprint), forzar un efecto de titulares y evaluar titulares en la fuente Orbital Display real (`data-headings="orbital"` ⇄ `"sans"` = Outfit); guarda la configuración en `localStorage` (`nm2-transition-lab`). No forma parte del diseño publicado ni del bundle público: `transition-lab.tsx` conserva solo contexto, provider, storage y los hooks que leen los componentes vivos; la UI del panel vive en `transition-lab-panel.tsx` tras un límite `next/dynamic` (`ssr: false`) que solo se descarga cuando el lab está activo.

## Accesibilidad y revisión pendiente

Objetivo WCAG AA: contraste de texto, foco visible, teclado, etiquetas de
estado y contenido navegable sin depender del canvas. No usar animación o
color como única fuente de información. El fondo animado debe mantener
áreas de lectura controladas y la marca completa en móvil.

La ronda de navegador de esta iteración está realizada: cinco rutas por idioma en escritorio, home y héroes interiores a 390×844, y hero a 1024×600. Se ejercieron selección de diagramas, menú móvil con Escape y retorno de foco, pausa/reanudación sin perder la selección y preferencia reducida real de Chromium. La consola de una sesión normal nueva no mostró errores ni el aviso espurio de movimiento reducido. Evidencias locales en `../brand/specimens/out/orbital-review-2026-11-17/`, incluida `final/`.

Siguen pendientes `npm run typecheck` y `npm run build`, que ejecuta manualmente el usuario. Esta ronda no acredita despliegue, auditoría WCAG completa ni rendimiento medido. Las capturas `redesign-before` son baseline V1; no validan el diseño nuevo. Ver `README.md` para los comandos.
