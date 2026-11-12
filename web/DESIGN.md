---
name: "Negent Mind — home"
description: "Fractal descent: noise resolves into signal as you scroll."
colors:
  void: "#08090C"
  panel: "#0E131B"
  bone: "#EDEAE3"
  fog: "#98A1B3"
  pulse: "#8B7CFF"
  linedark: "#232B38"
  ink: "#14161C"
  pulsedeep: "#5B4FE0"
  linelight: "#D4D0C6"
  chaos-magenta: "#FF0055"
  chaos-cyan: "#00F0FF"
  chaos-acid: "#CCFF00"
  chaos-orange: "#FF6600"
  inkSoft: "#3A3630"       # texto cuerpo sobre Bone (price-card li)
  inkMute: "#5A5248"       # label mono sobre Bone (price-card .plan)
  inkFaint: "#8A8177"      # secundario sobre Bone (price-card .per/.inc)
  codeBg: "#06070A"        # panel de código inmersivo
  codeHead: "#1C2430"      # hairline dentro del panel de código
  codeMute: "#777777"      # head de terminal, dots inactivos
  codeComment: "#5E6B80"   # comentarios en code panels
  codeDim: "#6E7688"       # puntuación/paths en código
  codeMid: "#A9AEC2"       # funciones/misc en código
  codeLite: "#C9CEDD"      # fn itálicas en código
  codeBodyText: "#D6D6D6"  # cuerpo de terminal
  codeStr: "#E8E8E8"       # strings/números en código
  silkInk: "#FFFFFF"       # texto/blend sobre la seda (hero zone)
  termDot: "#3A3A3A"       # dots inactivos del chrome de terminal
  termMute: "#6E6E6E"      # prompt/mute del chrome de terminal
  termRun: "#A9A9A9"       # líneas run (spinner) de terminal
  navShadow: "rgba(0,0,0,.28)" # sombra del nav pill (firma mondragon2)
typography:
  display:
    fontFamily: "Chakra Petch, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "0.04em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  monoRamp:
    hudLabel: "9.5px"      # HUD de instrumento feat-grid (nice-squash)
    marginalia: "10px"     # índices de sección, coordenadas, captions densas
    tagLabel: "10.5px"     # tags inmersivos, heads de panel
    microLabel: "11px"     # etiquetas de datos, nav, ticker, footer legal
    base: "12px"           # mono de sistema por defecto
    codeBody: "12.5–13px"  # cuerpo de terminal/código legible
    metricUnit: "11px"
    metricValue: "40px"    # numerales del board (Flow)
  # `scale` = rampa enumerada que el detector lee: pasos discretos usados
  # por las zonas portadas (mondragon2/nice-squash) además del monoRamp.
  scale:
    s9_5: "9.5px"
    s10: "10px"
    s10_5: "10.5px"
    s11: "11px"
    s12: "12px"
    s12_5: "12.5px"
    s13: "13px"
    s14: "14px"
    s15: "15px"
    s15_5: "15.5px"
    s17: "17px"
    s18: "18px"
    s19: "19px"
    s20: "20px"
    s22: "22px"
    s24: "24px"
    s26: "26px"
    s28: "28px"
    s31: "31px"
    s34: "34px"
    s40: "40px"
    s48: "48px"
    s52: "52px"
    s53: "53px"
    s56: "56px"
    s64: "64px"
    s85: "85px"
    s96: "96px"
    s120: "120px"
    s240: "240px"
    s340: "340px"
rounded:
  sm: "2px"
  md: "8px"
  card: "14px"     # zonas portadas: hero-card, price-card, nav pill (mondragon2)
  pill: "999px"    # pills de nav/CTA (mondragon2)
  scroll: "5px"    # thumb del scrollbar
spacing:
  section: "96px 128px"
  container: "1152px"
components:
  button-primary:
    backgroundColor: "{colors.pulse}"
    textColor: "{colors.void}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
---

## Overview

Home de **Negent Mind** (la organización, no solo VantaDB): híbrido por zonas — cada zona conserva la estética de la plantilla de la que se extrajo. Hero = seda líquida WebGL (mondragon2, hiper-cromática). Cuerpo = instrumentos halftone + board blueprint + escultura de puntos (nice-squash, monocromo Bone). Cards Bone sobre Void + nav pill + price-cards (mondragon2). Rail de roadmap (strand), filas numeradas invert (sequenceone), panel de acento (arccheo), nav por luminancia (noveq). Wordmark gigante (ox). Pulse cierra. La estructura es org-first: 11 secciones y VantaDB ocupa solo la 06 (FLAGSHIP ENGINE).

## Colors

- Fondo Void `#08090C`, superficies Panel `#0E131B`, tinta Bone, secundario Fog. Hairlines `linedark` 1px. Tema claro reservado (bg/ink/pulsedeep).
- Caos solo en fields: la seda del hero (rainbow domain-warped) y los campos ASCII; nunca en chrome, texto ni controles.
- Pulse `#8B7CFF`: CTA primario, foco, estados activos/IN BUILD, punto del lockup, accent del board. Nada más lo usa.
- Sobre superficies Bone (price-card, nav pill): rampa de tinta `ink #14161C` → `inkSoft #3A3630` → `inkMute #5A5248` → `inkFaint #8A8177`.
- Sobre paneles de código inmersivos (`codeBg #06070A`): rampa de tokens `codeComment/Dim/Mid/Lite/BodyText/Str` — tonos gris-azulados derivados del panel, fuera de la paleta de UI normal.

## Typography

- Display Chakra Petch 700, mayúsculas, tracking 0.04em (hero) / 0.12em (wordmark). Sin kickers: el heading carga solo.
- Texto Inter 400/500, medida ≤60ch, `text-pretty` en prosa.
- Técnico JetBrains Mono tabular para instrumentos, índices de escala (`SCALE 10⁻ⁿ`), captions de figura y navegación de datos.
- Rampa mono (`monoRamp`): 9.5px HUD, 10px marginalia, 10.5px tags/heads, 11px micro-etiquetas/nav, 12px base, 12.5–13px cuerpo de terminal, 40px numeral de board.
- La `scale` del frontmatter enumera además los pasos de las zonas portadas: 14–15.5px body denso, 17–19px lede, 20–26px h3/stages, 31–34px h2/slogan, 48–85px marquee, 96–340px wordmark. Fuera de estas dos rampas no hay tamaños literales.

## Layout

- Contenedor `max-w-6xl`, gutters `px-4 sm:px-6`. Secciones `py-24 sm:py-32`; más aire arriba del heading que debajo.
- Secciones tipo `.nmsec` con hairline top + crosshairs + chrome `.sechead.split` (lbl mono + h2 + secsub, patrón nice-squash).
- Dos tracks de scroll pinneado: Immersive 400vh (escultura) y Flow 400vh (board); ambos degradan a layout estático en móvil.
- `sc__board` lleva retícula blueprint 32px (hairlines con degradado de 1px) — es superficie de medición deliberada, no textura decorativa.
- Secciones ancladas llevan `scroll-mt-24` por el header fijo.
- Ledger (problems/compare): filas con hairline top, sin cards. Cards solo dentro de zonas portadas (feat-grid, price-card).

## Elevation & Depth

- Profundidad = hairlines, no sombras. Excepciones fijadas: glow en glifos de caos dentro de los fields (canvas/WebGL), y la sombra `0 4px 24px` + `backdrop-blur` del nav pill y tags inmersivos (firma mondragon2/nice-squash, solo en esas zonas).
- Nav flotante (mondragon2): transparente sobre la seda → pill Bone 92% + blur + sombra al pasar 60px (transición de `padding`, encogimiento deliberado del pill).

## Shapes

- Radio `--radius 0.5rem` (shadcn); `card 14px` en zonas portadas (hero-card, price-card, nav pill); `pill 999px` en CTAs/nav. Avatar/marca NM. en pastilla 22%.

## Components

- `nm/SilkHero` (zona hero — estética de plantilla conservada): shader "liquid silk" WebGL portado verbatim de `webTemplates/mondragon2` + hero-card redondeada, loader de anillo con progreso real (ligado a `onReady`), métricas reales y banda wordmark `mix-blend-mode: difference`. Frame estático con `prefers-reduced-motion`.
- `nm/sculpture` (portado verbatim de nice-squash `lib/sculpture.ts`): engine de nubes de puntos paramétricas 3D→2D canvas. Formas `sphere/lattice/twistTorus/rings/torusKnot`, morph por `setShape` o `externalProgress`, ripple de puntero, `dispose()`.
- `nm/Immersive` (portado de nice-squash): track 400vh sticky — 46k puntos esfera→torusKnot→retícula por `externalProgress`, 4 fases con `aria-live`, tags con paralaje de puntero, ruler de progreso Pulse. Drag-to-rotate. Con reduced-motion salta a la retícula final.
- `nm/FlowBoard` (portado de nice-squash `Flow.tsx`): track 400vh sticky — 4 stage-tabs (`Connect/Index/Query/Commit`) que también son botones scroll-to, board blueprint con panel de código (tokens `t-*`), query graph SVG con aristas animadas, panel métrica (checks/bars/grid/line), form sculpture y connectors SVG dibujados por `pathLength`. Contenido = uso documentado de VantaDB.
- `nm/HolonGrid` (patrón `Platform` de nice-squash `Sections.tsx`): grid 3×2 de `.feat` — fhead (num/cat) + instrumento `HalftoneCanvas` + HUD (`ENGINE·v0.9.0`/`IN BUILD` en Pulse, resto `RFC`) + nombre + spec. Cards con reveal blur-rise (`hg-reveal`, 0.7s expo).
- `nm/HalftoneCanvas` (portado de `webTemplates/nice-squash-242352`): engine halftone 2D con 6 instrumentos (chip `runtime`, esfera `memory`, grafo `orchestration`, barras `observability`, grid `evaluations`, órbita `security`). INK→Bone, ACC→Pulse, DIM→Fog; frame único con `prefers-reduced-motion`.
- `nm/FlipText` (portado verbatim de mondragon2): roll-up letra a letra con stagger `--i` (0.5s, bezier .76,0,.24,1).
- `nm/SiteHeader` (portado de mondragon2): nav flotante transparente sobre la seda → pill Bone/Void al scroll; links con `FlipText`; CTA GitHub en pill void.
- `nm/Marquee` (portado de mondragon2): track tipográfico infinito 22s, nombres de sistema alternando sólido/hueco (`-webkit-text-stroke`).
- `nm/OssCards` (patrón price-card de mondragon2): card Bone sobre Void — plan mono + amount 52px + desc + filas included + btn-pill invertible. El "precio" es Apache-2.0.
- `nm/DescentSection`: bloque dossier 05 — `AsciiField` (canvas fractal, scrub + imán de puntero) + `EntropyTrace` (fig. 02, últimas 120 muestras) + `InstrumentCounter` (entropía Shannon, % resuelto, FPS reales).
- `nm/TerminalDemo` (mecánica portada de nice-squash): cmd tipeado char a char, líneas `run` con spinner braille, `ok`/`live` con iconos `✓/→/●`, replay ↻, caret parpadeante. Sesión = comportamiento documentado de VantaDB; con `prefers-reduced-motion` muestra la sesión completa.
- `nm/Faq`: acordeón ledger con hairlines; sin cards.
- `nm/Ticker`: banda mono con reloj UTC real; claims solo verificables.
- `nm/InstrumentCounter`: numeral tabular mono + etiqueta; solo valores medidos o constantes documentadas.
- `nm/SectionHeading`: índice de sección mono + H2 display + lede opcional (uso interno en `DescentSection`; las secciones nuevas usan `.sechead`).
- `nm/Reveal`: una sola entrada por viewport (`whileInView`, expo-out 0.6s).
- `nm/SiteFooter`: wordmark gigante `footer-word` (patrón portado de `templates/ox`, ~17vw) + links centrados + meta row; sitemap sin rutas inventadas.
- `nm/RoadmapRail` (estructura portada de `templates/strand` "Scroll Progress Section"; mecánica reconstruida con el patrón de la casa): espina vertical con relleno `--p` por scroll, hitos `R/00–R/05` alternados con chip `IN BUILD`/`RFC` (Pulse para build, outline para rfc). Reduced-motion: `--p:1` + todos `.is-on`.
- `nm/WorkSection`: zona 05 — bento hairline (método RFC 01–03, métricas verificables, founder, contacto). Solo constantes honestas.
- `nm/NumberedRows` (micro-interacción portada de `templates/sequenceone`): fill fade + inversión de tinta en hover/focus (Bone→Void), `tabIndex` para paridad de teclado.
- `nm/useLuminance` (portado de `templates/noveq` `runtime.ts`): sonda de luminancia bajo el nav — `elementsFromPoint` + cadena de backgrounds, umbral 0.55, fallback `scrollY>60`. `SiteHeader` lo expone como `data-tone`; en estado transparente sobre superficie clara la tinta flipea a Void.
- Zona 08 `.accent-panel` (estructura portada de `templates/arccheo` FAQ Section): panel Pulse full-bleed, cruces de esquina `+` (firma arccheo), top row mono + hairline, items con regla 2px superior.

## i18n

- Rutas `/en` y `/es` (segmento `[lang]` bajo route group `(marketing)`); `/login` y `/app` viven en el grupo `(product)` con su propio root layout `lang="en"`.
- `middleware.ts` redirige `/` por Accept-Language (`es*` → `/es`, resto `/en`). Locales inválidos → `notFound()`.
- Todo el copy vive en `lib/i18n/{en,es}.ts` (tipo `Dict = typeof en`, espejo estructural obligatorio). Componentes reciben slices por props; los nombres propios, código, flags técnicos (`live`) y claims de producto no se traducen.
- Switcher `EN / ES` en el nav (`.nm-nav-lang`) — swap del primer segmento preservando la ruta; activo en Pulse.
- `generateStaticParams` prerrenderiza ambos locales; `generateMetadata` localiza title/description/OG + `alternates.languages`.

## Do's and Don'ts

- Haz: un momento de motion por sección (descenso, morph, pin); contenido visible por defecto; foco visible Pulse; scrollbar/selección/caret del mundo; `prefers-reduced-motion` = estado final estático.
- No hagas: cards fuera de zonas portadas, kickers sobre headings, degradados fuera del shader/board-blueprint, vidrio/shadows fuera del nav pill y tags inmersivos, serif editorial, emojis como iconos, rutas o claims inventados (blog, precios, testimonios, clientes), `style={{}}` para layout, editar `components/ui/*` a mano.
