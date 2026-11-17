---
version: 1
slug: "app-page-tsx"
primary_target: "app/(marketing)/[lang]/page.tsx"
related_targets:
  - "app/(marketing)/[lang]/layout.tsx"
  - "components/nm/v2/hero.tsx"
  - "lib/content/index.ts"
  - "app/orbital.css"
---

# Brief: home `/` (Persuade)

## Alcance y modo

Superficie: home pública `/en` · `/es`; `/` solo negocia locale.
Modo Persuade: entender qué es Negent Mind, qué trabajo existe y qué hacer.
Se conserva el slug `app-page-tsx` y el nombre de la ficha para mantener enlaces.
Dirección y alcance de cinco páginas aprobados; esta ficha no abre decisiones
de diseño ni acredita despliegue.

## Audiencia, trabajo, acción, prueba

- Audiencia: desarrolladores y líderes técnicos que evalúan infraestructura
  alrededor de modelos/agentes; colaboradores open source.
- Trabajo: distinguir organización, trabajo activo, incubación y visión.
- Acción principal: explorar proyectos; secundaria: contribuir. El trabajo
  verificable se enlaza desde el portafolio y la página de VantaDB.
- Prueba: repositorios y documentación existentes, no demostraciones de
  telemetría, métricas, clientes, testimonios ni benchmarks inventados.

## Dirección fijada — Orbital / carbón y plata

Organización primero, VantaDB como flagship activo y Scopegrain en incubación
pública WIP. El mapa de nueve holones expresa visión; Cardinal no es VantaDB.
La home introduce tesis, trabajo actual, capacidades/dirección, exploración
de holones, evidencia y participación sin absorber las páginas interiores.

Orbital es lettering SVG original; Outfit titula, DM Sans da lectura y
JetBrains Mono queda para código. Neutrales carbón/plata y espectro expresivo
compartido entre hero e ilustraciones; radios y contenedores comunes sin
homogeneizar las composiciones. Tokens y ficha: `app/orbital.css`,
`DESIGN_SYSTEM.md` y `DESIGN.md`, relativos a `web/`.

## Interacción y límites

- Contenido y acciones desde SSR; poster local/fallback inmediato. Paper
  0.0.82 usa `ShaderMount`/`warpFragmentShader` públicos con adaptador React
  mínimo para `try/catch`/cleanup, no GLSL propio ni runtime Framer.
- Canvas solo si permitido/visible. Pausa = `speed: 0`; oculto/fuera de viewport
  pausa; reduced motion conserva poster estático sin GPU.
- GSAP: entrada del hero y `ScrollScene`/ScrollTrigger para trazos SVG y
  desplazamiento acotado. Motion: navegación, titulares y controles.
  Nunca ambos motores en un componente ni transformando un mismo wrapper.
  Sin loader, relojes, telemetría falsa, scroll hijack ni pistas de 400vh.
- Una sola identidad con secciones carbón y papel/plata. Las escenas
  `FieldCanvas` y `BlueprintScene` tienen arte SSR determinista y respetan
  pausa, movimiento reducido, intersección y visibilidad de pestaña.
- Navbar transparente integrado al inicio y flotante al hacer scroll.
  Footer con monograma, campo monocromático y control global de movimiento;
  no repite el wordmark gigante ni deja un botón de pausa en el hero.
- Shell compartido: SiteHeader, `main#main-content` y SiteFooter. Copy en
  `lib/content/`; rutas y metadata en sus helpers centrales.
- Cinco páginas públicas por locale: home, projects, projects/vantadb, about
  (Laboratorio), contribute. Galería y art solo development, noindex, sin
  sitemap y 404 fuera de development. No son páginas públicas adicionales.
- `/login` y `/app` siguen gated/desactivadas. Handbook `null` y email flag
  `false`; no son acciones habilitadas. No añadir blog, research ni precios.
- V1 se conserva para compatibilidad; no migrar Remotion, el perfil GitHub
  congelado ni la marca de VantaDB.

## Estado y validación pendiente

Código local con correcciones en curso. Falta revisión visual final de EN/ES
y recibir `npm run typecheck` / `npm run build` ejecutados por el usuario.
La revisión integrada usa el servidor del usuario en `http://localhost:3000/`;
no se inicia otra instancia. Las capturas actuales quedan en
`brand/specimens/out/orbital-review-2026-11-17/`, relativas a `os/`.
No considerar una captura o comprobación realizada sin verificar su archivo
y contenido. La ronda visual e interactiva de esta iteración está realizada;
typecheck y build siguen pendientes de ejecución manual por el usuario.
La revisión no acredita una auditoría WCAG completa ni rendimiento medido.
Las fotos `brand/specimens/out/redesign-before` son baseline V1, no evidencia
del nuevo diseño. No afirmar despliegue, gates aprobados ni mejoras medidas
de FPS/rendimiento/bundle.
