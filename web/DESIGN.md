---
name: "Negent Mind — Orbital"
description: "Laboratorio independiente: carbón y plata funcionales, espectro expresivo y movimiento opcional."
colors:
  bg: "#000000"
  section: "#070809"
  surface: "#0E1013"
  raised: "#1C2026"
  text: "#F1F3F5"
  muted: "#ADB5C0"
  line: "#343B46"
  structure: "#A7B4C7"
  action: "#E7EDF5"
  on-action: "#000000"
  paper-bg: "#E7EDF5"
  paper-ink: "#111418"
  paper-muted: "#4D5662"
  paper-line: "#AFBAC8"
  paper-panel: "#DAE1EA"
  spectrum-teal: "#5BADA0"
  spectrum-blue: "#465DCF"
  spectrum-violet: "#965CCB"
  spectrum-rose: "#DC5E89"
  spectrum-amber: "#D9A45E"
  spectrum-ice: "#B7CDD7"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "clamp(3rem, 5.7vw, 5.5rem)"
    fontWeight: 450
    lineHeight: 1.025
    letterSpacing: "-0.035em"
  display-mobile:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "clamp(2.65rem, 8.3vw, 3.75rem)"
    fontWeight: 450
    lineHeight: 1.025
    letterSpacing: "-0.035em"
  page-title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 5.8vw, 5.5rem)"
    fontWeight: 450
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  lede:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
rounded:
  sm: "12px"
  card: "20px"
  hero: "32px"
  pill: "999px"
spacing:
  container: "72rem"
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  frame-gap: "clamp(12px, 1.66vw, 24px)"
  section: "clamp(3.5rem, 8vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.structure}"
    rounded: "{rounded.pill}"
  navigation:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.hero}"
    padding: "0.75rem clamp(20px, 3vw, 40px)"
  status-badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.structure}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
  project-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "clamp(1.5rem, 3vw, 2.25rem)"
  disclosure:
    textColor: "{colors.text}"
    padding: "1.125rem 0"
---

# Design System: Negent Mind — Orbital

## Overview

**Creative North Star: "Orbital / carbón y plata"**

Negent Mind presenta su trabajo como un laboratorio de ingeniería independiente. La organización va primero; VantaDB aporta una entrada concreta al trabajo existente. Carbón y plata organizan la lectura, mientras una materia fluida y cromática expresa el campo de posibilidades alrededor de los modelos.

Orbital es lettering vectorial original, no la fuente de la interfaz. Los títulos Outfit, el texto DM Sans y las superficies redondeadas comparten una geometría amable sin homogeneizar las composiciones. El contenido y las acciones están disponibles desde el primer render; la animación es una mejora opcional.

**Key Characteristics:**

- Organización primero.
- Carbón y plata funcionales; espectro expresivo acotado.
- Lettering propio y tipografía redondeada.
- Composiciones variadas con radios y contenedores compartidos.
- Contenido inmediato y movimiento opcional.

Ámbito: marketing Orbital escrito localmente, con correcciones en curso,
revisión visual final y typecheck/build del usuario pendientes. Los valores
proceden de `app/orbital.css` y sus hojas de hero, páginas, escenas, home y shell;
las fuentes, de `lib/fonts.ts` (`fontVarsV2`). No acredita despliegue.
V1 queda en `globals.css` y su código de compatibilidad; Remotion y el perfil
GitHub publicado/congelado no se migran con esta ficha.

## Colors

Carbón y plata separan funciones de lectura, estructura y acción; el espectro
aporta materia, no una segunda jerarquía de controles. El frontmatter contiene
los valores canónicos; cada nombre corto corresponde a `--nm2-<nombre>`.

### Primary

- **action / on-action:** plata de acción con texto negro; también orienta el foco.
- **structure:** plata estructural para enlaces y detalles de soporte.

### Neutral

- **bg / section:** fondo y bandas de lectura.
- **surface / raised:** superficies y énfasis por diferencia tonal.
- **text / muted:** texto principal y secundario.
- **line:** bordes y separadores, secundarios al fill y al espacio.

### Papel Y Tinta

`paper-bg`, `paper-ink`, `paper-muted`, `paper-line` y `paper-panel` definen
las secciones claras dentro de una sola identidad. `.nm2-section--paper`
invierte juntos los roles semánticos, incluidas acciones y foco. No hay
selector de tema ni texto oscuro improvisado sobre componentes oscuros.

### Material expresivo

Los seis **spectrum-teal / blue / violet / rose / amber / ice** se comparten
entre hero, ilustraciones y detalles acotados. Los aliases `--nm2-art-*`
resuelven a esos mismos canónicos; no son otra paleta. El sombreado del hero
incluye además un carbón azulado (`#101C27`) solo como material expresivo,
no como color funcional ni token nuevo.

**The Functional Silver Rule.** Texto de lectura y controles permanecen
neutrales; el espectro no convierte las acciones en botones multicolores.
El estado de proyecto siempre tiene etiqueta, no solo un punto de color.

## Typography

**Display Font:** Outfit, con fallback system-ui/sans-serif.
**Body Font:** DM Sans, con fallback system-ui/sans-serif.
**Code Font:** JetBrains Mono, con fallback ui-monospace/monospace.

Outfit y DM Sans aportan curvas abiertas y lectura editorial sin imponer
la composición del wordmark a cada título. Orbital es geometría SVG, no un
`font-face` ni una cuarta familia de interfaz.

### Hierarchy

- **Display:** titular del hero; `display-mobile` recoge su override bajo
  768px. Tamaños, peso declarado, interlínea y tracking están en frontmatter.
- **Page title:** encabezados `PageHero`, con medida de hasta 14ch y override
  móvil `clamp(2.5rem, 9vw, 4rem)` bajo 48rem.
- **Headline:** títulos de sección, con descripción separada y lectura equilibrada.
- **Title:** nombre de ProjectCard; la variante destacada usa un tamaño
  fluido (`clamp(1.75rem, 3vw, 2.25rem)`).
- **Body / lede:** prosa y entradas editoriales; lede compartido con medida
  máxima de 62ch. La descripción del hero tiene su propio tamaño
  (`clamp(1rem, 1.3vw, 1.125rem)`) e interlínea (1.65).
- **Label:** estado textual de proyecto en DM Sans.
- **Mono:** código/identificadores técnicos; el specimen usa el tamaño
  registrado, no una rampa mono para navegación o todo el sitio.

Los tamaños documentados son usos reales de CSS, no una escala modular
inventada ni un catálogo exhaustivo de cada composición.

**The Lettering Is Not Type Rule.** Conservar el SVG original para la marca;
usar las fuentes de interfaz para títulos, texto y código, sin reconstruir
Orbital con letras tipográficas.

## Layout

Contenedor y gutter comunes según frontmatter. Las secciones comparten
ritmo vertical sin convertirse en cards: se alternan proyecto destacado,
ledger compacto, diagrama explicativo y pasaje editorial. El hero tiene un
marco propio redondeado, mientras el contenido interior usa la medida común.

El header fijo empieza transparente y comparte el marco del hero
(máximo 1760px). Al superar unos 72px se separa, sube 8px y adopta una
superficie flotante de hasta 64rem. El menú móvil usa Sheet; la navegación
de escritorio aparece desde 64rem. El footer cambia a dos columnas desde
48rem. Copy EN/ES y wordmark conservan su flujo natural en móvil y zoom.
La revisión de navegador de esta iteración se realizó en escritorio y móvil;
typecheck y build siguen pendientes de ejecución manual por el usuario.

`SiteHeader`, `main#main-content` y `SiteFooter` forman el shell compartido
de las cinco páginas por locale. El skip link llega al contenido principal;
el selector de idioma preserva la página. Mapa de rutas y SEO en
`ARCHITECTURE.md`, no en una composición exclusiva de home.

## Elevation & Depth

La profundidad nace del fill, las diferencias de tono y el espacio entre
elementos. Las superficies carbón permiten reservar plata para lectura y
acción; las líneas apoyan la estructura sin dibujar todas las jerarquías.
La pill del header mezcla su superficie con transparencia contenida;
la materia del hero se sombrea para mantener áreas legibles.

No hay una escala de sombras ni rampas tonales adicionales documentadas.
Neón y glow no son el lenguaje de elevación de la UI.

## Shapes

Radios nombrados en frontmatter: **sm** para superficies pequeñas,
**card** para contenedores, **hero** para el marco expresivo y **pill**
para navegación, acciones y badges. No redondear cada elemento con un
selector universal ni imponer una misma silueta a diagramas y texto.
La marca mantiene sus trazados Orbital originales.

## Components

La implementación reutilizable vive en `components/nm/v2/`. Compone
shadcn **Button** y el **Sheet** generado con Radix; `components/ui/*`
se conserva sin personalización manual. Variantes, tokens y composición
propios se resuelven en la capa interna.

- **button-primary:** acción plata/negro en pill, compuesta por `ActionLink`
  sobre Button; borde material neutro de dos capas y reflejo en hover/foco.
- **button-secondary:** superficie neutra, texto principal y borde material;
  invierte sus roles junto con la sección de papel.
- **text-link:** enlace estructural sin fill; hover pasa a text y subraya.
- **navigation:** barra transparente al inicio y flotante al hacer scroll,
  enlaces neutrales y fondo raised en el activo. Menú móvil Sheet con cierre
  y gestión de foco; el cambio de idioma conserva la página.
- **status-badge:** etiqueta explícita activo/incubación/visión sobre surface;
  un punto de apoyo cromático nunca sustituye el texto.
- **project-card:** surface, radio card y nombre Outfit; la destacada usa
  raised. Resumen con medida de lectura y acción separada.
- **disclosure:** FAQ de filas con `details/summary` nativo, separadores line,
  título Outfit, respuesta muted e indicador de apertura; sin otra dependencia.

Las muestras HTML/CSS de `.impeccable/design.json` son esquemas estáticos,
no sustitutos del componente real ni una segunda implementación de su runtime.

Todos los controles conservan foco visible; los estados hover no son la
única pista de interacción. `BrandMark`, `Surface`, `Section` y
`SectionHeading` mantienen geometría, tono y ritmo comunes.

### Hero y movimiento opcional

Poster local disponible desde SSR y fallback inmediato. Paper Shaders
**0.0.82 (Apache-2.0)** aporta el shader/loop/visibility: API vanilla pública
`ShaderMount` con `warpFragmentShader` de `@paper-design/shaders`, montada
por un wrapper React local mínimo con `try/catch` y cleanup. El wrapper
React de Paper inicializa async y un ErrorBoundary no captura ese fallo;
el adaptador no copia el shader ni sustituye su motor.

Canvas progresivo solo si permitido y visible. Pausa = `speed: 0`;
oculto/fuera de viewport = pausa; reduced motion = poster estático sin GPU.
GSAP aplica la entrada del hero y el trazado/desplazamiento de `ScrollScene`
(`top 80%` a `bottom 25%`, `scrub: 0.5`). Motion gestiona navegación,
titulares `assemble`/`focus`/`trace` y controles; nunca se importan ambos
motores en un mismo componente ni comparten un wrapper transformado.
No hay mejoras medidas de FPS, rendimiento o bundle que documentar.

`FieldCanvas` mantiene un SVG SSR y cuatro patrones Canvas 2D: `wave`,
`orbit`, `network` y `memory`. `BlueprintScene` aporta cinco geometrías SVG
originales con proyección isométrica común. La actividad depende de la pausa
global, la preferencia del sistema, la intersección y la visibilidad de pestaña.
El control global está en el footer; el hero no tiene botón de pausa local.
El fondo del footer, el fade del viewport y la respuesta del puntero no
interceptan controles ni sustituyen el cursor nativo.

Assets coordinados en `../brand/orbital/`, copias en `public/brand/`,
favicon en `app/icon.svg` y OG en `public/og.png` (1200×630).

**The Immediate Content Rule.** La animación no gatea lectura, acciones ni
navegación. Sin loader, relojes decorativos, telemetría falsa, scroll hijack
ni pistas de 400vh.

## Do's and Don'ts

### Do

- Presentar primero la organización y enlazar trabajo verificable.
- Mantener carbón y plata para lectura, estructura y acciones.
- Reutilizar el espectro del hero en arte y detalles acotados.
- Variar composiciones conservando radios, contenedores y ritmo comunes.
- Ofrecer contenido inmediato, poster/fallback, pausa y reduced motion sin GPU.
- Conservar foco visible, teclado y estados activo/incubación/visión escritos.
- Mantener V1 como compatibilidad sin migrar Remotion ni el perfil publicado.

### Don't

- No presentar los glifos del logo como una fuente completa ni mezclar las paletas V1 y Orbital.
- No usar neón, botones multicolores ni una jerarquía basada solo en bordes.
- No ocultar contenido hasta que termine una entrada o cargue WebGL.
- No añadir loaders, relojes, telemetría falsa, scroll hijack ni pistas de 400vh.
- No mezclar GSAP y Motion en el mismo componente ni copiar el motor Paper.
- No personalizar manualmente `components/ui/*`.
- No inventar métricas, clientes, testimonios, capacidades, research/blog ni precios.
- No presentar las fotos `redesign-before` como evidencia del rediseño ni declarar validación o despliegue sin resultados.
