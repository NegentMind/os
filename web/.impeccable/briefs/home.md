---
primary_target: "app/(marketing)/[lang]/page.tsx"
---

# Brief: home `/` (Persuade)

## Alcance y autoridad

Home pública `/en` · `/es`, modo Persuade; `/` negocia idioma.
Nombre de ficha y archivo conservados para mantener enlaces. Contrato
detallado: [superficie app-page-tsx](../surfaces/app-page-tsx.md).
Mundo visual: [Negent Mind — Orbital](../../DESIGN.md).

## Dirección aprobada

- Organización primero; VantaDB activo como entrada verificable a proyectos.
  Scopegrain es incubación pública WIP; nueve holones son visión, no oferta.
- Orbital / carbón y plata, lettering SVG propio, Outfit/DM Sans y mono solo
  para código. Espectro expresivo acotado, radios/contenedor compartidos,
  composiciones variadas; no dossier, ASCII ni Pulse como autoridad nueva.
- Acción principal: explorar proyectos; secundaria: contribuir. Prueba en
  artefactos reales, sin clientes, testimonios, métricas ni benchmarks inventados.
- Contenido desde SSR, poster/fallback inmediato y canvas Paper progresivo.
  Pausa, visibilidad y reduced motion sin GPU. Motion gestiona navegación, titulares y controles; la entrada del hero es CSS de primer render; GSAP gestiona reveals de sección vía `ScrollScene` y la respuesta del shader al puntero. Nunca se importan ambos motores en un mismo componente ni comparten un wrapper transformado. `MotionProvider` centraliza la pausa y la preferencia del sistema, con control en el footer y contenido siempre visible.

## Límites y pendientes

Las cinco páginas por locale ya están escritas localmente, con correcciones
en curso; no reabrir el diseño ni tratar interiores como trabajo futuro.
`/app` y `/login` siguen gated/desactivadas; Handbook `null` y email flag
`false`. Galerías design-system/art solo development, noindex, sin sitemap,
404 fuera de development. Sin loader, relojes, telemetría falsa, scroll hijack,
blog, research ni precios inventados. V1 queda para compatibilidad, sin
migrar Remotion, perfil GitHub congelado ni marca de VantaDB.

La ronda de navegador de esta iteración está realizada: cinco rutas por idioma en escritorio, home y héroes interiores a 390×844, y hero a 1024×600. Se ejercieron selección de diagramas, menú móvil con Escape y retorno de foco, pausa/reanudación sin perder la selección y preferencia reducida real de Chromium. La consola de una sesión normal nueva no mostró errores ni el aviso espurio de movimiento reducido. Evidencias locales en `../brand/specimens/out/orbital-review-2026-11-17/`, incluida `final/`.

Siguen pendientes `npm run typecheck` y `npm run build`, que ejecuta manualmente el usuario. Esta ronda no acredita despliegue, auditoría WCAG completa ni rendimiento medido. Las fotos `redesign-before` son baseline V1, no evidencia Orbital.
