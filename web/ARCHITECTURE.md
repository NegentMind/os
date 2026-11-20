# ARCHITECTURE.md — estructura, patrones y decisiones

Actualizado: 2026-11-18.

Marketing Orbital escrito localmente; home, arte y shell aceptados estáticamente
y la ronda de navegador realizada; typecheck/build manuales pendientes.
Dirección aprobada en `docs/dev/site-v2-design.md` y ejecución en
`docs/dev/plans/2026-11-16-orbital-site-v2.md`. Sus diagnósticos iniciales no
describen el árbol nuevo.

## Estructura de directorios

```text
web/
├── middleware.ts             # Solo matcher "/": redirige a /en o /es (Accept-Language)
├── app/                      # App Router. Sin app/layout.tsx: dos root layouts por route group
│   ├── orbital.css           # Entrada marketing: tokens nm2 + aliases Tailwind/shadcn
│   ├── orbital-hero.css      # Composición hero; importado por orbital.css
│   ├── orbital-pages.css     # Composiciones de páginas/galería; mismo entry
│   ├── orbital-scenes.css    # FieldCanvas y geometrías SVG originales
│   ├── orbital-home.css      # Composiciones y controles de historias de home
│   ├── orbital-shell.css     # Shell compartido; último import entre superficies
│   ├── icon.svg              # Favicon Orbital coordinado con brand/orbital
│   ├── robots.ts             # /robots.txt (allow all + sitemap)
│   ├── sitemap.ts            # Cinco páginas × dos locales; sin galerías
│   ├── (marketing)/[lang]/
│   │   ├── layout.tsx        # Root <html lang>; orbital.css + fontVarsV2 + shell compartido
│   │   ├── page.tsx          # Home EN/ES (Server Component)
│   │   ├── projects/page.tsx
│   │   ├── projects/vantadb/page.tsx
│   │   ├── about/page.tsx    # Laboratorio
│   │   ├── contribute/page.tsx
│   │   └── design-system/    # page.tsx + art/page.tsx: solo development, noindex
├── components/
│   ├── nm/README.md          # Biblioteca interna: nm/v1 legado, nm/v2 activa, ui shadcn
│   ├── nm/v1/                # (retirada 2026-11-20 → _archive/nm-v1/)
│   ├── nm/v2/                # Marca, secciones, acciones, proyectos, FAQ, shell y hero Orbital
│   └── ui/                   # shadcn — NO editar a mano; `npx shadcn add <x>` (button/card/input/label/sheet)
├── lib/
│   ├── site.ts               # URLs externas y flags (ver abajo)
│   ├── site-routes.ts        # PageId, PUBLIC_PAGES, hrefFor(lang, page)
│   ├── marketing-metadata.ts # Metadata localizada por página
│   ├── marketing-types.ts    # Contratos compartidos de copy y estados de proyecto
│   ├── content/              # Nuevo copy: EN canónico, ES con la misma forma; getSiteCopy
│   ├── i18n/                 # Contrato vivo (LOCALES/isLocale/Locale/Dict); contenido de diccionarios retirado → copy real en lib/content/
│   ├── fonts.ts              # next/font: fontVarsV2 (Outfit, DM Sans, JetBrains, Orbital Display local)
│   └── utils.ts              # cn()
├── public/brand/             # Copias de assets Orbital locales, incluido poster
├── public/fonts/             # orbital-display.woff2 (servido vía next/font/local)
├── public/og.png             # OG Orbital 1200×630
└── _archive/hooks/   # hooks de la biblioteca V1 archivada
```

## Routing, shell y SEO

`PageId = "home" | "projects" | "vantadb" | "about" | "contribute"` es el
contrato de `lib/site-routes.ts`. Sus rutas son `/[lang]`,
`/[lang]/projects`, `/[lang]/projects/vantadb`, `/[lang]/about` y
`/[lang]/contribute`, con `lang` en `en | es`. El cambio de idioma conserva
la página; los locales inválidos terminan en `notFound()`.

El root layout de marketing importa **solo `app/orbital.css`** como entrada
visual, aplica `fontVarsV2` y `body.nm2-site`, y compone `MotionProvider`,
`SiteHeader`, `<main id="main-content">` y `SiteFooter`. Las páginas no duplican
ese shell. El skip link apunta a `main-content`.

Cada página genera title/description, canonical, alternates de idioma y OG
mediante `lib/marketing-metadata.ts`; no heredar un canonical de home para
las interiores. El sitemap enumera las cinco páginas bilingües. La galería
`/[lang]/design-system` y su ruta `/art` son internas, `noindex`, sin sitemap
y con `notFound()` fuera de `NODE_ENV === "development"`.

## Flags (`lib/site.ts`)

| Constante | Origen | Por defecto |
|---|---|---|
| `SITE_URL` | `NEXT_PUBLIC_SITE_URL` | `https://negentmind.com` |
| `HANDBOOK_URL` | `NEXT_PUBLIC_HANDBOOK_URL` | `null` → texto sin enlace |
| `CONTACT_EMAIL_ENABLED` | `NEXT_PUBLIC_CONTACT_EMAIL_ENABLED === "true"` | `false` → sin `mailto` |
| `VANTADB_REPO` | constante | `https://github.com/ness-e/Vantadb` (transferencia pendiente) |
| `VANTADB_DOCS` | derivada del repositorio | README del proyecto; no host inventado |
| `ORG_URL`, `CONTACT_EMAIL` y enlaces de comunidad/gobernanza | constantes | Centralizados en este archivo |

`NEXT_PUBLIC_*` se incrustan en build: cambiar un flag exige rebuild.
Los enlaces de contribución, Discussions, conducta, seguridad, marcas y
soporte también salen de este módulo. No exponer URLs privadas de Notion.

## Fronteras server/client y movimiento

| Capa | Responsabilidad |
|---|---|
| Server | Páginas, contenido localizado, metadata, gates y composición del shell/hero |
| `motion-provider.tsx` | Estado compartido de pausa y preferencia reducida; no gatea el contenido |
| `site-header.tsx` | Navegación fija/flotante, cambio de idioma y menú móvil Sheet/Radix |
| `page-hero.tsx` | Composición server asimétrica compartida por las cuatro rutas interiores |
| `section-heading.tsx`, `animated-heading.tsx` | Interfaz de titulares y animaciones Motion `assemble`/`focus`/`trace`/`decode`, visibles desde SSR |
| `field-canvas.tsx`, `blueprint-scene.tsx`, `scroll-scene.tsx` | Campos Canvas 2D con fallback SVG, geometrías originales y relaciones GSAP/ScrollTrigger |
| `core-orb.tsx` | Orbe-instrumento de `#org`: esfera de puntos en Canvas 2D con un punto espectral fijable; poster SVG como superficie SSR/reduced |
| `section-transition/` | Bandas canvas entre tonos (`variants.ts` con 5 renderers puros), `section-transition.tsx` (prop `height` opcional) y el lab dev en dos piezas: `transition-lab.tsx` (contexto + provider + hooks, ligero) y `transition-lab-panel.tsx` (UI, chunk lazy `ssr:false`) |
| `system-story.tsx`, `holon-explorer.tsx`, `evidence-path.tsx`, `principle-rules.tsx`, `vantadb-showcase.tsx` | Historias interactivas de home; cada una compone ScrollScene + una sola gramática gráfica |
| `art-mount.tsx` | Monta presets de arte (warp Paper o campos) en superficies no-hero, p. ej. la tarjeta de invitación |
| `smooth-scroll.tsx` | Lenis dinámico solo con movimiento permitido; raf sincronizado con GSAP; anchors con `scroll-margin-top` |
| `motion-preference.tsx`, `viewport-fade.tsx`, `pointer-feedback.tsx` | Control global en footer y efectos decorativos sin capturar interacción; el fade se oculta bajo el hero |
| `hero-background.tsx`, `hero-warp.tsx`, `hero-preset.ts` | Poster y mejora WebGL progresiva con Paper; pool de 3 warps elegido al azar por carga; fullbleed por defecto |
| `hero-entrance.tsx` | Entrada CSS de primer render; sin reseteo asíncrono ni dependencia de GPU. |
| `faq.tsx` | Disclosure nativo `details/summary`; no necesita otro motor ni dependencia |

`MotionProvider` centraliza pausa, preferencia del sistema y `html[data-motion]`. El control global está en el footer; el hero no tiene botón local. El sistema nunca oculta contenido ni espera a una animación. `prefers-reduced-motion` conserva arte estático y deshabilita el control cuando la preferencia del sistema prevalece.

`SiteHeader` es una única navegación fija, transparente e integrada en el marco del hero al inicio. Motion observa posición/dirección de scroll; a partir de unos 72 px la barra se separa con un desplazamiento ascendente y una superficie flotante. El menú móvil sigue usando Sheet/Radix.

CSS posee la entrada del hero en primer render. Motion gestiona navegación, titulares y controles. GSAP gestiona reveals de sección y decor acotado en `ScrollScene` (trazo `top 90%` a `center 55%`, flotación `top bottom` a `bottom top`, scrub 0.8) y el easing del puntero sobre el shader Paper. `SmoothScroll` monta Lenis solo con movimiento permitido; su raf corre en el ticker de GSAP cuando el plugin está cargado, para que `ScrollTrigger` siga la posición suavizada. Los listeners se retiran al pausar o desmontar; el tween del puntero se cancela sin reiniciar el frame. Nunca se importan ambos motores en un mismo componente ni se transforman desde dos motores los mismos wrappers. Sin scroll hijack, pin ni pistas de 400vh.

`FieldCanvas` ofrece `wave`, `orbit`, `network` y `memory`, con fallback SVG SSR determinista. Canvas 2D solo anima con movimiento permitido, intersección y pestaña visible; no necesita otra librería. El límite es 1.400 puntos desktop o 600 móvil/puntero grueso, DPR máximo 1,5 y objetivo de planificación de 30 fps, no rendimiento medido. `BlueprintScene` ofrece diagramas semánticos con etiquetas HTML e iconos Lucide cuando recibe `labels`, o sólidos SVG decorativos cuando no las recibe. `ScrollScene` posee su trazo y flotación; ya no hay tilt ni bucles de la geometría explicativa.

`PageHero` comparte composición asimétrica entre Proyectos (`network`), VantaDB (`memory`), Laboratorio (`orbit`) y Contribuir (`wave`). La home alterna carbón con papel/plata y usa controles accesibles para explorar sistema, memoria, Scopegrain, holones y evidencia. El footer combina monograma, enlaces y campo monocromático, sin repetir el wordmark gigante. `ViewportFade` y `PointerFeedback` son decorativos, no capturan interacción y no sustituyen el cursor nativo.

Paper Shaders está fijado en **0.0.82, Apache-2.0**. El runtime elegido usa
`ShaderMount` vanilla público y `warpFragmentShader` de `@paper-design/shaders`
mediante un wrapper React local mínimo con `try/catch` y cleanup. La versión
React de Paper inicializa de forma asíncrona y su fallo no queda cubierto por
un ErrorBoundary; de ahí el adaptador, no un shader/loop propio. La librería
mantiene el shader y la gestión del loop/visibility. No se reutiliza el GLSL
V1 ni el runtime de Framer.

El poster local se entrega con SSR y actúa como fallback inmediato. El canvas
es progresivo, solo si el movimiento está permitido y el hero visible.
Pausa equivale a `speed: 0`; pestaña oculta o hero fuera de viewport pausa el
efecto. Con reduced motion se conserva el poster estático, sin GPU. El
contenido nunca espera a WebGL. No hay medición que permita afirmar mejoras
de FPS, rendimiento o bundle.

## Patrones obligatorios

1. **Server Components por defecto.** `"use client"` solo donde haya interactividad.
   Un gate (`notFound()`) nunca vive en un Client Component: se separa en `page.tsx`
   server + componente cliente.
3. **URLs centralizadas.** Ningún `https://github.com/...` ni email literal fuera de `lib/site.ts`.
4. **Copy separado de presentación.** Marketing usa `lib/content/`, con ES
   siguiendo la forma de EN. `lib/i18n/Dict` sigue disponible para V1; no
   mantener el nuevo copy en dos diccionarios paralelos.
5. **Motores separados.** Aplicar el contrato de movimiento anterior:
   navegación, titulares y controles con Motion; entrada del hero y
   `ScrollScene` con GSAP. Sin motores compartidos en un componente ni
   wrappers transformados por ambos. Sin loader, scroll hijack, pin ni pistas de 400vh.
6. **Estilos Orbital:** tokens `--nm2-*`, aliases Tailwind/shadcn y composición
   en `nm/v2`; preservar `components/ui/*` sin personalización manual.
   El ritmo vertical es una escala de tres tokens (`--nm2-section-gap`,
   `--nm2-block-gap`, `--nm2-band-space` en `app/orbital.css`); no introducir
   paddings/márgenes de sección con valores sueltos.
7. **Estados honestos.** Activo/incubación/visión se escriben; no dependen
   solo del color ni se convierten en telemetría simulada.

## Decisiones (ADR resumidos)

| Decisión | Por qué | Prohibido |
|---|---|---|
| Next.js App Router con route groups | Dos root layouts: marketing con `lang` dinámico, producto aparte | `pages/`, `getServerSideProps` |
| Tailwind v4 (`@theme`) | Tokens como utilidades | tailwind.config.js, hex sueltos |
| shadcn new-york | Primitivas accesibles copiadas al repo | Editar `components/ui/*` a mano |
| Orbital aislado de V1 | Nuevo marketing sin migrar producto, Remotion ni perfil publicado | Sincronizar nuevos colores al pipeline congelado |
| Paper vanilla + adaptador mínimo | Capturar fallos de montaje y liberar recursos sin copiar el motor | GLSL propio, runtime Framer o fallback dependiente del canvas |
| Cloudflare Workers vía `@opennextjs/cloudflare` | Vía de despliegue documentada, SSR + middleware; ver `DEPLOY.md` | VPS propio; `@cloudflare/next-on-pages` |

## Compatibilidad y validación pendiente

`lib/i18n/Dict` permanece (tipo de la biblioteca V1). Los componentes V1
eliminados en `2281bb9` fueron restaurados como **biblioteca legado en
`_archive/nm-v1/`** (archivada 2026-11-20): conservada para referencia y
rediseño, fuera del bundle de producción al no tener imports vivos.
`HalftoneKind` sigue en `lib/marketing-types.ts` como fuente única y
`_archive/nm-v1/HalftoneCanvas.tsx` lo re-exporta. La regla del proyecto —todo
elemento vive en la biblioteca interna— está en `components/nm/README.md`.
Los assets nuevos se coordinan en `../brand/orbital/` y se copian a
`public/brand/`, `app/icon.svg` y `public/og.png`; ni Remotion ni el perfil
GitHub congelado cambian por esta migración. `../brand/orbital/font/`
hospeda **Orbital Display v0.3** (A–Z + a–z + puntuación,
`orbital-display.ttf/.woff2`): se sirve como font-face real
(`next/font/local` → `--font-orbital-display`, archivo en
`public/fonts/`) para titulares y la palabra rotativa; caracteres fuera de
cobertura (acentos, dígitos) caen a Outfit por la pila de `font-family`.
El mapa SVG de `nm/v2/orbital-glyphs.tsx` queda como biblioteca/fallback.
El nombre de la organización se escribe NEGENT MIND en mayúsculas.

Este mapa documenta código local. La ronda de navegador de esta iteración está realizada: cinco rutas por idioma en escritorio, home y héroes interiores a 390×844, y hero a 1024×600. Se ejercieron selección de diagramas, menú móvil con Escape y retorno de foco, pausa/reanudación sin perder la selección y preferencia reducida real de Chromium. La consola de una sesión normal nueva no mostró errores ni el aviso espurio de movimiento reducido. Evidencias locales en `../brand/specimens/out/orbital-review-2026-11-17/`, incluida `final/`. Siguen pendientes `npm run typecheck` y `npm run build`, que ejecuta manualmente el usuario. Esta ronda no acredita despliegue, auditoría WCAG completa ni rendimiento medido. Comandos y detalle operativo en `README.md`.
