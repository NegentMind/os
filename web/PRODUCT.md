# Product

<!-- impeccable:product-schema 1 -->

<!-- Actualizado: 2026-11-18 -->

## Platform

web

## Users

Visitantes que evalúan Negent Mind: desarrolladores y líderes técnicos que trabajan con LLMs y agentes de IA, y necesitan distinguir trabajo existente de visión. Audiencia secundaria: colaboradores open source y comunidad que busca proyectos, principios y vías reales de participación.

## Product Purpose

Sitio marketing bilingüe (EN/ES) de un laboratorio de ingeniería independiente. Organización primero: explicar qué construye Negent Mind alrededor de los modelos y ofrecer una entrada al trabajo verificable mediante VantaDB, flagship activo. Éxito = entender organización, estado de los proyectos y siguiente acción (explorar proyectos, consultar el repositorio o contribuir). Cinco páginas por locale, no una home que concentre toda la información. La app con login que existía en código se retiró (2026-11-20): el sitio es solo marketing.

## Positioning

Negent Mind desarrolla infraestructura y arquitecturas alrededor de los modelos; no es proveedor de modelos. Memoria persistente es la entrada concreta actual; percepción, razonamiento, acción verificable y las demás capacidades expresan dirección de largo plazo, no una oferta ya construida. Fuente estratégica: Notion (Identidad y Estrategia), ya contrastada para esta dirección. Scopegrain está en incubación pública WIP. Los nueve holones son visión; Cardinal no es VantaDB ni un producto entregado.

## Operating Context

Next.js 15 App Router + React 19 + Tailwind 4, shadcn/Radix, Motion, GSAP y Paper Shaders. `/` → `/en` | `/es` por middleware. Marketing en `app/(marketing)/[lang]` tiene home, `/projects`, `/projects/vantadb`, `/about` (Laboratorio) y `/contribute` bajo ambos locales. `lib/site-routes.ts` centraliza cinco `PageId`; `lib/marketing-metadata.ts` genera metadata propia y el sitemap incluye las cinco rutas bilingües.

Un único root layout vive en `app/(marketing)/[lang]/layout.tsx`: `orbital.css`, `fontVarsV2`, `MotionProvider`, header, `main#main-content`, footer, `ViewportFade` y `SmoothScroll` (Lenis, solo con movimiento permitido). La superficie de producto (`/login`, `/app`, Supabase Auth, `APP_ENABLED`) se eliminó por completo; la biblioteca de componentes V1 se archivó en `web/_archive/nm-v1/`. Boundaries propios (`not-found`, `error`, `loading`) dentro del shell localizado. URLs/flags en `lib/site.ts`, copy en `lib/content/`. Cloudflare Workers vía `@opennextjs/cloudflare` es la vía documentada en `DEPLOY.md`, aún no ejecutada: no hay adaptador ni despliegue del rediseño. Sin CI; la práctica general de Git está en AGENTS.

## Capabilities and Constraints

- Escrito localmente: cinco páginas EN/ES, metadata por página, sitemap bilingüe, biblioteca `components/nm/v2`, hero con poster/fallback y mejora progresiva. No equivale a validación runtime ni cierre visual.
- VantaDB está activo en `https://github.com/ness-e/Vantadb`; la transferencia a NegentMind aún no se ha hecho. No cambiar por anticipado su URL ni su marca de producto.
- Scopegrain: repositorio público WIP en incubación, sin anuncio de lanzamiento, fecha ni oferta comercial. Nueve holones: visión explícita, no nueve productos disponibles.
- Galerías `/[lang]/design-system` y `/[lang]/design-system/art` (`en | es`): internas, solo development, `noindex`, fuera del sitemap y `notFound()` fuera de development.
- Handbook sigue en `null`; email tras flag `false`. No publicar enlaces privados de Notion ni prometer canales operativos sin habilitación.
- Auth ampliada, blog, research, precios y otras superficies no forman parte de este alcance ni son próximos lanzamientos comprometidos. No sustituir contenido inexistente por secciones vacías.
- El movimiento no gatea contenido. Motion gestiona navegación, titulares y controles; la entrada del hero es CSS de primer render; GSAP gestiona reveals de sección vía `ScrollScene` y la respuesta del shader al puntero. Nunca se importan ambos motores en un mismo componente ni comparten un wrapper transformado. `MotionProvider` centraliza la pausa y la preferencia del sistema, con control en el footer y contenido siempre visible. Reduced motion = poster estático/sin GPU; pausa y visibilidad controlan el efecto continuo.

## Brand Commitments

- Orbital / carbón y plata: dirección y cinco páginas aprobadas. La actualización de Notion Marca ya se efectuó y aprobó; no implica publicación de assets ni despliegue. El nombre público se escribe NEGENT MIND en mayúsculas.
- Orbital es lettering SVG original y, desde 2026-11, también **Orbital Display v0.2** (A–Z + a–z en `../brand/orbital/font/`): fuente de marca solo para momentos display (palabra rotativa, titulares Orbital en evaluación). Outfit para títulos, DM Sans para texto, JetBrains Mono para código y micro-etiquetas técnicas. Radios, contenedores y una escala de ritmo de tres tokens (`--nm2-section-gap`, `--nm2-block-gap`, `--nm2-band-space`) compartidos con composiciones variadas.
- Marketing toma tokens de `app/orbital.css`: neutrales funcionales y seis tonos `--nm2-spectrum-*` para material expresivo puntual (bandas de transición, palabra rotativa, detalles de estado, arte acotado). Fill, tonos y espacio crean profundidad, sin neón ni botones multicolores; los gráficos de sección comparten una gramática única (trazo 1.5/0.65, nodos fill+border sin sombra, etiquetas mono).
- Paper Shaders 0.0.82 (Apache-2.0), API vanilla pública `ShaderMount` + `warpFragmentShader` con adaptador React mínimo para `try/catch`/cleanup. No GLSL propio/runtime Framer; no copiar el loop ni atribuir mejoras medidas de rendimiento.
- Sin loader, relojes decorativos, telemetría falsa ni scroll hijack/tracks de 400vh. Contenido y acciones desde SSR; animación opcional.
- Assets coordinados en `../brand/orbital/`, copias en `public/brand/`, favicon `app/icon.svg` y OG `public/og.png` (1200×630). V1 queda como compatibilidad: Remotion y perfil GitHub publicado/congelado no cambian.

## Evidence on Hand

- Notion: Identidad y Estrategia, Marca y contexto del Handbook ya contrastados. El Handbook no es todavía un enlace público habilitado.
- Dirección y ejecución aprobadas: `docs/dev/site-v2-design.md` y `docs/dev/plans/2026-11-16-orbital-site-v2.md`. Sus diagnósticos previos son baseline, no estado actual del código.
- Contratos web: `README.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `DATA_MODELS.md`, `AGENTS.md`.
- Implementación local: `components/nm/v2/`, `lib/content/`, `app/orbital*.css`; ficha visual `DESIGN.md`. La ronda de navegador de esta iteración está realizada: cinco rutas por idioma en escritorio, home y héroes interiores a 390×844, y hero a 1024×600. Se ejercieron selección de diagramas, menú móvil con Escape y retorno de foco, pausa/reanudación sin perder la selección y preferencia reducida real de Chromium. La consola de una sesión normal nueva no mostró errores ni el aviso espurio de movimiento reducido. Evidencias locales en `../brand/specimens/out/orbital-review-2026-11-17/`, incluida `final/`. Siguen pendientes `npm run typecheck` y `npm run build`, que ejecuta manualmente el usuario. Esta ronda no acredita despliegue, auditoría WCAG completa ni rendimiento medido.
- `../brand/specimens/out/redesign-before/` conserva fotos de V1: no son evidencia visual del nuevo sitio.
- Ausencias que no deben fabricarse: testimonios, clientes, métricas de adopción, benchmarks, research/blog, precios, fechas internas, capacidades no construidas o mejoras de FPS/bundle/rendimiento sin medición. No presentar VantaDB Studio ni planes comerciales.

## Product Principles

1. Organización primero; VantaDB como entrada concreta, no sustituto de toda la organización.
2. Evidencia antes que marketing: separar activo, incubación y visión; enlazar artefactos reales.
3. Carbón y plata organizan la lectura; el espectro expresa posibilidades sin convertirse en telemetría ni oferta ficticia.
4. Contenido inmediato y movimiento opcional: poster/fallback, reduced motion, pausa y visibilidad antes que espectáculo bloqueante.
5. Participación con caminos reales y colaboración escrita; no prometer canales ni material todavía no públicos.

## Accessibility & Inclusion

Objetivo WCAG AA (contraste de texto 4.5:1), foco visible, navegación por teclado y etiquetas de estado explícitas. Menú Sheet/Radix con gestión de foco; FAQ `details/summary` nativo sin otra dependencia. Contenido legible desde el primer render y utilizable sin WebGL; `prefers-reduced-motion` mantiene poster estático sin GPU. Son criterios de aceptación pendientes de revisión final, no una certificación de conformidad.
