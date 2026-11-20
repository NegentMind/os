# web/ — sitio de Negent Mind (Next.js + Cloudflare Workers vía OpenNext)

Actualizado: 2026-11-18.

Marketing Orbital bilingüe, organización primero, con cinco páginas por locale.
Stack: Next.js 15 App Router, React 19, Tailwind 4, shadcn/Radix, Motion y GSAP;
Paper Shaders para el fondo progresivo del hero. La antigua superficie de
producto (`/app`, `/login`, Supabase) fue retirada: hoy el paquete es solo
el sitio marketing.

## Rutas

`[lang]` admite `en` y `es`; los slugs interiores se conservan entre idiomas.

| Ruta | Contenido |
|---|---|
| `/[lang]` | Organización, trabajo actual y participación |
| `/[lang]/projects` | Portafolio con estados activo / incubación / visión |
| `/[lang]/projects/vantadb` | Flagship activo y enlaces a su repositorio/documentación |
| `/[lang]/about` | Laboratorio: propósito, principios y fundador |
| `/[lang]/contribute` | Contribución, Discussions, soporte, conducta y seguridad |

`/` negocia `/en` o `/es` por `Accept-Language`. Las cinco páginas tienen
metadata propia y forman el sitemap bilingüe. Las galerías
`/[lang]/design-system` y `/[lang]/design-system/art` son **solo development**:
`noindex`, fuera del sitemap y `notFound()` fuera de development.

## Configuración

Todas las URLs y flags viven en `lib/site.ts` (`SITE_URL`, `ORG_URL`,
`VANTADB_REPO`, `VANTADB_DOCS`, enlaces de comunidad/gobernanza, `HANDBOOK_URL`,
`CONTACT_EMAIL`, `CONTACT_EMAIL_ENABLED`). No hardcodear URLs en
componentes ni diccionarios. Handbook sigue en `null` y el email público tras
flag `false`; no implicar que esos canales están habilitados. `.env.local`
nunca se commitea.

## Estructura

- `app/(marketing)/[lang]/`: cinco páginas y galerías internas. Su root layout
  importa `app/orbital.css`, aplica `fontVarsV2` y comparte `MotionProvider`,
  `SiteHeader`, `main#main-content` y `SiteFooter`.
- `app/orbital.css`: entrada de tokens y estilos compartidos. Importa, en orden, `orbital-hero.css`, `orbital-pages.css`, `orbital-scenes.css`, `orbital-home.css` y `orbital-shell.css`; shell cierra las reglas entre superficies.
- `components/nm/v2/`: composición interna sobre `components/ui/` (shadcn),
  incluidas las historias de home (SystemStory, HolonExplorer, EvidencePath,
  PrincipleRules, VantaShowcase), `section-transition/` (bandas + TransitionLab)
  y `smooth-scroll.tsx` (Lenis).
- `lib/content/`: copy EN/ES; `lib/site-routes.ts`: cinco `PageId` y enlaces;
  `lib/marketing-metadata.ts`: metadata por página.
- `app/robots.ts`, `app/sitemap.ts`, `app/icon.svg`, `public/og.png` (1200×630).
- `../brand/orbital/`: assets coordinados; copias para web en `public/brand/`.
  El wordmark y el monograma son lettering SVG original; además existe
  **Orbital Display v0.2** (A–Z + a–z) en `../brand/orbital/font/` para
  momentos display (palabra rotativa, eval `data-headings="orbital"`).
- `lib/i18n/` conserva solo el contrato de locale (`LOCALES`, `isLocale`,
  `Locale`, `Dict` para la biblioteca `_archive/nm-v1`); el copy real vive en
  `lib/content/`.

La migración web no cambia Remotion ni el perfil GitHub publicado/congelado.
Ver `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `PRODUCT.md` y `DESIGN.md`.

## Shell, arte y movimiento

`MotionProvider` centraliza pausa, preferencia del sistema y `html[data-motion]`. El control global está en el footer; el hero no tiene botón local. El sistema nunca oculta contenido ni espera a una animación. `prefers-reduced-motion` conserva arte estático y deshabilita el control cuando la preferencia del sistema prevalece.

`SiteHeader` es una única navegación fija, transparente e integrada en el marco del hero al inicio. Motion observa posición/dirección de scroll; a partir de unos 72 px la barra se separa con un desplazamiento ascendente y una superficie flotante. El menú móvil sigue usando Sheet/Radix.

CSS posee la entrada del hero en primer render. Motion gestiona navegación, titulares y controles. GSAP gestiona reveals de sección y decor acotado en `ScrollScene` (trazo `top 90%` a `center 55%`, flotación `top bottom` a `bottom top`, scrub 0.8) y el easing del puntero sobre el shader Paper. `SmoothScroll` (Lenis, import dinámico) suaviza el scroll solo con movimiento permitido y sincroniza su raf con el ticker de GSAP cuando está cargado; los anchors respetan `scroll-margin-top`. Los listeners se retiran al pausar o desmontar; el tween del puntero se cancela sin reiniciar el frame. Nunca se importan ambos motores en un mismo componente ni se transforman desde dos motores los mismos wrappers. Sin scroll hijack, pin ni pistas de 400vh.

El ritmo vertical sigue una escala única de tres tokens en `app/orbital.css`: `--nm2-section-gap` (padding de secciones), `--nm2-block-gap` (bloques internos) y `--nm2-band-space` (aire junto a las bandas `SectionTransition`, que ya aportan separación). Detalle y reglas de adyacencia en `DESIGN_SYSTEM.md`.

`FieldCanvas` ofrece `wave`, `orbit`, `network` y `memory`, con fallback SVG SSR determinista. Canvas 2D solo anima con movimiento permitido, intersección y pestaña visible; no necesita otra librería. El límite es 1.400 puntos desktop o 600 móvil/puntero grueso, DPR máximo 1,5 y objetivo de planificación de 30 fps, no rendimiento medido. `BlueprintScene` ofrece diagramas semánticos con etiquetas HTML e iconos Lucide cuando recibe `labels`, o sólidos SVG decorativos cuando no las recibe. `ScrollScene` posee su trazo y flotación; ya no hay tilt ni bucles de la geometría explicativa.

`PageHero` comparte composición asimétrica entre Proyectos (`network`), VantaDB (`memory`), Laboratorio (`orbit`) y Contribuir (`wave`). La home alterna carbón con papel/plata unidos por bandas `SectionTransition` (cinco variantes en `variants.ts`; `tear` a `height={360}` es la variante por defecto de home) y usa controles accesibles para explorar sistema, memoria, Scopegrain, holones y evidencia. El footer combina monograma, enlaces y campo monocromático, sin repetir el wordmark gigante. `ViewportFade` se oculta mientras el hero cubre su franja; junto con `PointerFeedback` es decorativo, no captura interacción y no sustituye el cursor nativo.

## Comandos manuales

Los ejecuta el usuario desde `os/web`; no son gates ya aprobados.
Para un entorno nuevo, instalar dependencias y copiar `.env.example` a
`.env.local` sin sobrescribir una configuración existente:

```powershell
npm install
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Validación pendiente del rediseño local:

```powershell
npm run typecheck
npm run build
```

Antes de `npm run build`, detener el servidor de desarrollo para evitar
escrituras simultáneas en `.next`.

El arranque es manual con `npm run dev`. El servidor del usuario en el puerto
3000 permanece activo durante el QA integrado; no detenerlo, reiniciarlo ni
iniciar una segunda instancia. El agente no lanza ni reinicia servidores sin
autorización explícita.

## Estado local y referencias

Las cinco páginas y la dirección Orbital están aprobadas y escritas localmente.
La ronda de navegador de esta iteración está realizada: cinco rutas por idioma en escritorio, home y héroes interiores a 390×844, y hero a 1024×600. Se ejercieron selección de diagramas, menú móvil con Escape y retorno de foco, pausa/reanudación sin perder la selección y preferencia reducida real de Chromium. La consola de una sesión normal nueva no mostró errores ni el aviso espurio de movimiento reducido. Evidencias locales en `../brand/specimens/out/orbital-review-2026-11-17/`, incluida `final/`.

Se aplicó después una ronda correctiva de composición y movimiento (marco, entrada del hero, diagramas semánticos, bordes reales y respuesta al puntero); la aceptación visual de esa ronda queda pendiente del usuario.

Ronda de consistencia 2026-11-18: escala de ritmo única (`--nm2-section-gap`/`--nm2-block-gap`/`--nm2-band-space` + adyacencia de bandas), gramática gráfica unificada de escenas (trazos 1.5/0.65, nodos fill+border sin sombra, micro-etiquetas mono), textura monocromática en superficies sosas y ajustes de ritmo a 390px. En paralelo, otra línea de trabajo añade el hero fullbleed por defecto, wordmark sobre el borde, palabra rotativa con tinta espectral, Lenis y `tear` como variante de transición por defecto.

Siguen pendientes `npm run typecheck` y `npm run build`, que ejecuta manualmente el usuario. Esta ronda no acredita despliegue, auditoría WCAG completa ni rendimiento medido. Las fotos de
`../brand/specimens/out/redesign-before/` son baseline V1, no evidencia de Orbital.

- Dirección aprobada: [`docs/dev/_archive/site-v2-design.md`](docs/dev/_archive/site-v2-design.md).
- Plan: [`docs/dev/_archive/plans/2026-11-16-orbital-site-v2.md`](docs/dev/_archive/plans/2026-11-16-orbital-site-v2.md).
- Los apartados de diagnóstico previo de esos registros describen el punto de
  partida; los contratos locales de esta carpeta describen el código Orbital.

## Deploy

Ver `DEPLOY.md` para el procedimiento de OpenNext/Cloudflare, dominio,
variables y flags. No se ha desplegado como parte de esta tarea.
