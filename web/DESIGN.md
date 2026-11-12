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
    marginalia: "10px"     # índices de sección, coordenadas, captions densas
    microLabel: "11px"     # etiquetas de datos, nav, ticker, footer legal
    base: "12px"           # mono de sistema por defecto
    codeBody: "12.5–13px"  # cuerpo de terminal/código legible
rounded:
  sm: "2px"
  md: "8px"
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

Home Persuade de Negent Mind: descenso fractal — el scroll baja de escala (10⁰ → 10⁻⁴) y el ruido se resuelve en orden. Orden monocromo; caos hiper-cromático solo dentro de los fields (hero 3D + ASCII). Pulse cierra (CTA, estados, NM.).

## Colors

- Fondo Void `#08090C`, superficies Panel `#0E131B`, tinta Bone, secundario Fog. Hairlines `linedark` 1px. Tema claro reservado (bg/ink/pulsedeep).
- Caos solo en fields: magenta, cyan, ácido, naranja — con glow — nunca en chrome, texto ni controles.
- Pulse `#8B7CFF`: CTA primario, foco, estados activos, punto del lockup. Nada más lo usa.

## Typography

- Display Chakra Petch 700, mayúsculas, tracking 0.04em (hero) / 0.12em (wordmark). Sin kickers: el heading carga solo.
- Texto Inter 400/500, medida ≤60ch, `text-pretty` en prosa.
- Técnico JetBrains Mono tabular para instrumentos, índices de escala (`SCALE 10⁻ⁿ`), captions de figura y navegación de datos.
- Rampa mono (`monoRamp`): 10px marginalia/índices, 11px micro-etiquetas/nav/ticker, 12px base, 12.5–13px cuerpo de terminal. Fuera de esta rampa no hay tamaños literales.

## Layout

- Contenedor `max-w-6xl`, gutters `px-4 sm:px-6`. Secciones `py-24 sm:py-32`; más aire arriba del heading que debajo.
- Hero `min-h-svh` con campo 3D absoluto detrás; contenido en flujo normal.
- Secciones ancladas llevan `scroll-mt-24` por el header fijo.
- Ledger (systems): filas con hairline top, grid 180px/1fr/auto en desktop, apilado en móvil. Sin cards.

## Elevation & Depth

- Profundidad = hairlines, no sombras. Excepción fijada por el mundo: glow en glifos de caos dentro de los fields (canvas/WebGL), nunca en UI chrome.
- Header fijo: fondo Void sólido + hairline, sin blur ni vidrio.

## Shapes

- Radio `--radius 0.5rem` (shadcn); pills solo en controles pequeños. Avatar/marca NM. en pastilla 22%.

## Components

- `nm/SilkHero` (zona hero — estética de plantilla conservada): shader "liquid silk" WebGL portado verbatim de `webTemplates/mondragon2` + hero-card redondeada, loader de anillo con progreso real (ligado a `onReady`), métricas reales y banda wordmark `mix-blend-mode: difference`. Frame estático con `prefers-reduced-motion`.
- `nm/HalftoneCanvas` (portado de `webTemplates/nice-squash-242352`): engine halftone 2D con 6 instrumentos (chip `runtime`, esfera `memory`, grafo `orchestration`, barras `observability`, grid `evaluations`, órbita `security`). INK→Bone, ACC→Pulse, DIM→Fog; frame único con `prefers-reduced-motion`.
- `nm/DescentSection`: bloque dossier 02–03 — `AsciiField` (canvas fractal, scrub GSAP + imán de puntero) + `EntropyTrace` (fig. 03, últimas 120 muestras) + `InstrumentCounter` (entropía Shannon, % resuelto, FPS reales).
- `nm/TerminalDemo` (mecánica portada de nice-squash): cmd tipeado char a char, líneas `run` con spinner braille, `ok`/`live` con iconos `✓/→/●`, replay ↻, caret parpadeante. Sesión = comportamiento documentado de VantaDB; con `prefers-reduced-motion` muestra la sesión completa.
- `nm/FeatureRail`: ledger de capacidades VantaDB; índice sticky en desktop, lista numerada en móvil, instrumento `HalftoneCanvas` por fila. Item activo en Pulse.
- `nm/Faq`: acordeón ledger con hairlines; sin cards.
- `nm/Ticker`: banda mono con reloj UTC real; claims solo verificables.
- `nm/InstrumentCounter`: numeral tabular mono + etiqueta; solo valores medidos o constantes documentadas (120f/30fps del loop GIF).
- `nm/SectionHeading`: índice de sección mono + H2 display + lede opcional. Sin kicker.
- `nm/Reveal`: una sola entrada por viewport (`whileInView`, expo-out 0.6s). El scroll coreografiado (scrub) pertenece a `AsciiField`/GSAP, no aquí.
- `nm/SiteHeader` / `nm/SiteFooter`: chrome mínimo, sitemap sin rutas inventadas, contacto real, legales pendientes marcados como pendientes. El footer lleva el wordmark gigante `footer-word` (patrón portado de `templates/ox`, ~17vw) + links centrados + meta row.

## Do's and Don'ts

- Haz: un momento de motion por sección (el descenso); contenido visible por defecto; foco visible Pulse; scrollbar/selección/caret del mundo; `prefers-reduced-motion` = estado final estático.
- No hagas: cards (ni anidadas), kickers sobre headings, degradados, vidrio/shadows decorativas, serif editorial, emojis como iconos, rutas o claims inventados (blog, precios, testimonios, clientes), `style={{}}` para layout, editar `components/ui/*` a mano.
