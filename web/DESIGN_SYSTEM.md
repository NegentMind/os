# DESIGN_SYSTEM.md — tokens, UI y reglas visuales

## Autoridad y límite V1

Para **marketing Orbital**, los valores ejecutables viven en `app/orbital.css`,
que importa, en orden, `orbital-hero.css`, `orbital-pages.css`,
`orbital-scenes.css`, `orbital-home.css` y `orbital-shell.css`. `DESIGN.md` es la ficha
visual extraída; la dirección aprobada está en `docs/dev/site-v2-design.md`.
Este contrato describe código local con la ronda de navegador ya realizada y
typecheck/build manuales pendientes, no un despliegue ni una auditoría de
accesibilidad aprobada.

`app/globals.css`, `lib/i18n/Dict`, las fuentes/componentes V1 y el contexto de
producto se conservan para compatibilidad. **No sincronizar Orbital a
`../media/remotion/src/tokens.ts` ni al perfil GitHub publicado/congelado.**
Void/Bone/Pulse y Chakra Petch/Inter dejan de ser autoridad para marketing,
no se borran ni se migran sus pipelines en esta fase.

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
| `--nm2-paper-bg` | `#E7EDF5` | Fondo papel/plata |
| `--nm2-paper-ink` | `#111418` | Tinta principal sobre papel |
| `--nm2-paper-muted` | `#4D5662` | Texto secundario sobre papel |
| `--nm2-paper-line` | `#AFBAC8` | Líneas sobre papel |
| `--nm2-paper-panel` | `#DAE1EA` | Paneles sobre papel |
| `--nm2-spectrum-teal` | `#5BADA0` | Material expresivo |
| `--nm2-spectrum-blue` | `#465DCF` | Material expresivo |
| `--nm2-spectrum-violet` | `#965CCB` | Material expresivo |
| `--nm2-spectrum-rose` | `#DC5E89` | Material expresivo |
| `--nm2-spectrum-amber` | `#D9A45E` | Material expresivo |
| `--nm2-spectrum-ice` | `#B7CDD7` | Material expresivo |

Una sola identidad, sin selector de tema. `.nm2-section--paper` cambia juntos fondo, tinta, texto secundario, líneas, paneles y roles de acción; no es un segundo tema. Tokens de papel: `--nm2-paper-bg` `#E7EDF5`, `--nm2-paper-ink` `#111418`, `--nm2-paper-muted` `#4D5662`, `--nm2-paper-line` `#AFBAC8`, `--nm2-paper-panel` `#DAE1EA`.

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

Orbital es **lettering SVG original**, separado de las fuentes de interfaz.
`lib/fonts.ts` exporta `fontVarsV2` para el root layout de marketing.

| Rol | Fuente | Uso implementado |
|---|---|---|
| Títulos | Outfit (`--font-heading`) | Hero `clamp(3rem, 5.7vw, 5.5rem)`; heading de sección `clamp(1.75rem, 3.4vw, 2.5rem)` |
| Texto / UI | DM Sans (`--font-body`, `--font-sans`) | Body `1rem / 1.6`; lede `1.0625rem / 1.65` |
| Código | JetBrains Mono (`--font-mono`) | Solo código/identificadores técnicos; specimen de código `0.75rem` |

Los títulos usan sentence case, tracking ajustado y líneas equilibradas.
Las medidas adaptativas concretas están extraídas en `DESIGN.md`; no hay
una nueva rampa tipográfica ni una fuente llamada Orbital.

| Token | Valor |
|---|---|
| `--nm2-radius-sm` | `12px` |
| `--nm2-radius-card` | `20px` |
| `--nm2-radius-hero` | `32px` |
| `--nm2-radius-pill` | `999px` |
| `--nm2-container` | `72rem` |
| `--nm2-gutter` | `clamp(1.25rem, 4vw, 3rem)` |
| `--nm2-frame-gap` | `clamp(12px, 1.66vw, 24px)` |

Radios y tokens de layout tienen su fuente en `app/orbital.css`;
`app/orbital-hero.css` conserva el hero de dos columnas y el wordmark completo,
con altura máxima de 20svh (16svh en pantallas bajas). Header y hero comparten
marco fluido de ancho `calc(100% - 2 * var(--nm2-frame-gap))`, con gap `12px`
(8px por debajo de 768px) y sin máximo de 1760px. El hero
reserva 104px para la navegación superpuesta y puede crecer en móvil o zoom.
`app/orbital-shell.css` define la barra flotante a ancho de marco y el layout
asimétrico de `PageHero`, con altura mínima `clamp(480px, 70svh, 720px)`.

Secciones con padding vertical `clamp(3.5rem, 8vw, 7rem)`. Contenedor común,
texto con medida de lectura y composiciones variadas: proyecto destacado,
ledger, diagramas y pasajes editoriales, no una cuadrícula de cards idénticas.
Fill, diferencias tonales y espacio dan profundidad; bordes secundarios,
sin neón ni sombras/glows como identidad funcional.

## Librería interna y primitivas

`components/nm/v2/` contiene BrandMark, ActionLink, Surface, Section,
SectionHeading/AnimatedHeading, PageHero, StatusBadge, ProjectCard, Faq,
SiteHeader/SiteFooter, hero, FieldCanvas, BlueprintScene, ScrollScene,
MotionPreference, ViewportFade y PointerFeedback.
Se compone sobre la base shadcn new-york en `components/ui/`:

- `ActionLink` compone el **Button** existente y conserva las variantes
  primaria, secundaria y de enlace de texto.
- Menú móvil mediante **Sheet** generado con shadcn/Radix; conservar sus
  comportamientos de foco, cierre y teclado.
- FAQ con **`details/summary` nativo**; no requiere otra dependencia.
- Conservar `button`, `card`, `input`, `label` y `sheet` sin personalización
  manual en `components/ui/*`. Variantes, composición y tokens propios van
  en `nm/v2`, no en la primitiva regenerable.
- Iconos de UI con `lucide-react`; marca con su geometría SVG original.
- Header, skip link a `main#main-content` y footer compartidos por las cinco
  páginas. Estados de foco visibles en plata, no Pulse.

`ActionLink` conserva Button de shadcn. Las acciones primarias y secundarias usan un borde material de dos capas neutras y un reflejo de hover/foco, nunca un botón multicolor. El rol de acción se invierte junto con el papel. La biblioteca real vive en `components/nm/v2/`; las muestras HTML estáticas son ilustrativas.

Las galerías `/[lang]/design-system` y `/[lang]/design-system/art` son de
development, `noindex`, fuera del sitemap y 404 fuera de development;
no una sexta página pública.

## Material y movimiento

- **Paper Shaders 0.0.82 (Apache-2.0)** sustituye GLSL propio/runtime Framer.
  Runtime vanilla público `ShaderMount` + `warpFragmentShader` de
  `@paper-design/shaders`, con wrapper React local mínimo para
  `try/catch`/cleanup. La inicialización asíncrona del wrapper React de
  Paper no queda cubierta por ErrorBoundary; no copiar el shader ni su loop.
- Poster local desde SSR y fallback inmediato; canvas progresivo solo si
  permitido y visible. Pausa = `speed: 0`; oculto/fuera de viewport = pausa;
  reduced motion = poster estático y ninguna GPU.
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
- Sin loader bloqueante, relojes decorativos, telemetría falsa, scroll
  hijack ni pistas de 400vh. Sin afirmaciones de rendimiento, FPS o tamaño
  de bundle medidos: no hay resultados que las sostengan.

## Accesibilidad y revisión pendiente

Objetivo WCAG AA: contraste de texto, foco visible, teclado, etiquetas de
estado y contenido navegable sin depender del canvas. No usar animación o
color como única fuente de información. El fondo animado debe mantener
áreas de lectura controladas y la marca completa en móvil.

La ronda de navegador de esta iteración está realizada: cinco rutas por idioma en escritorio, home y héroes interiores a 390×844, y hero a 1024×600. Se ejercieron selección de diagramas, menú móvil con Escape y retorno de foco, pausa/reanudación sin perder la selección y preferencia reducida real de Chromium. La consola de una sesión normal nueva no mostró errores ni el aviso espurio de movimiento reducido. Evidencias locales en `../brand/specimens/out/orbital-review-2026-11-17/`, incluida `final/`.

Siguen pendientes `npm run typecheck` y `npm run build`, que ejecuta manualmente el usuario. Esta ronda no acredita despliegue, auditoría WCAG completa ni rendimiento medido. Las capturas `redesign-before` son baseline V1; no validan el diseño nuevo. Ver `README.md` para los comandos.
