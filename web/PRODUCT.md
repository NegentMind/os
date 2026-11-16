# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitantes que evalúan NegentMind: desarrolladores y líderes técnicos que trabajan con LLMs y agentes de IA, y necesitan infraestructura verificable (memoria, contexto, verificación, ejecución). Audiencia secundaria: comunidad (blog, secciones públicas).

## Product Purpose

Sitio marketing bilingüe (EN/ES) de Negent Mind — Applied AI Research & Product Engineering. La home (modo Persuade) debe hacer inteligible la oferta en segundos: infraestructura para una IA agéntica más persistente, controlable, eficiente y confiable, con VantaDB como flagship. Éxito = el visitante entiende qué es, por qué importa y qué hacer (GitHub / leer la especificación / Public Handbook cuando se publique). La app con login existe en código pero está desactivada en el lanzamiento.

## Positioning

Negent Mind desarrolla infraestructura y arquitecturas para construir sistemas de IA agéntica más persistentes, controlables, eficientes y confiables. Tesis: mientras el mercado vende inteligencia, Negent Mind vende la capacidad de confiar en ella. Concepto visual: negentropía (orden desde el caos). Fuente de verdad estratégica: Notion (🧭 Identidad y Estrategia).

## Operating Context

Next.js 15 App Router + React 19 + Tailwind v4 + Supabase Auth (magic link). Rutas: `/` → `/en` | `/es` (middleware), marketing en `app/(marketing)/[lang]`; `/login` y `/app` en `app/(product)`, **desactivadas al lanzar** (`NEXT_PUBLIC_APP_ENABLED=false` → 404). URLs y flags en `lib/site.ts`. Deploy: Cloudflare Workers vía `@opennextjs/cloudflare` (ver `DEPLOY.md`). Sin CI; commits directos a `main`, sin push sin orden explícita.

## Capabilities and Constraints

- Capacidades confirmadas: home marketing EN/ES, robots/sitemap/hreflang, login magic link y área privada `/app` con gate de sesión (ambas tras flag, apagadas), componentes shadcn base (button, card, input, label).
- Portafolio público: VantaDB (Activo), Scopegrain (Incubación — "in incubation, not yet released", sin enlace ni fecha), holones (Visión: mapa de capacidades a largo plazo, no productos). Roadmap detallado privado; dirección y estado en el Public Handbook.
- Pendiente (alcance futuro, no de esta pasada): registro, recuperación de contraseña, blog, secciones completas del sitio.
- Restricción técnica: animación por capas (`motion/react` micro-interacciones; `gsap` timelines/scroll; no mezclar en el mismo componente). `prefers-reduced-motion` = sin animación.
- Terminología: Negentropía (concepto: orden desde el caos), Entropía (ruido estocástico), Lanikea (estructura cósmica de referencia visual), Fractales (patrón de escala).

## Brand Commitments

- Decisión 2026-11-12 (ronda de preguntas): la home adopta el sistema dual orden/caos del brief (orden monocromático + caos hiper-cromático con glow/sombras solo en momentos de caos); el resto del sistema conserva Pulse como acento único.
- Tokens ley en `media/remotion/src/tokens.ts`; proyección web en `app/globals.css` (`@theme`). Tipos: Chakra Petch 700 display, Inter texto, JetBrains Mono técnico.
- ASCII como material nativo (bloques, braille, dithering, glitch, scanlines, CRT) investigado en ascii-magic.com.

## Evidence on Hand

- Notion · 🎨 Marca (concepto y voz), `brand/brand-sheet.html`, `media/remotion/src/tokens.ts`.
- Contratos web: `README.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `DATA_MODELS.md`, `AGENTS.md`.
- Investigación ascii-magic.com (2026-11-12): estilos ASCII, bloques, braille, dots/halftone, glitch/RGB split, scanlines/CRT, LED matrix, voxel, mosaicos.
- Ausencias que no deben fabricarse: testimonios, clientes, benchmarks, precios, descargas/estrellas/usuarios, fechas internas de roadmap, claims de capacidades no construidas. No mencionar VantaDB Studio ni precios.

## Product Principles

1. El orden se demuestra, no se declara: cada sección dramatiza el mecanismo (ruido → señal).
2. La terminal es el hogar: monoespacio, retícula y ASCII antes que decoración.
3. El caos es material acotado: aparece, se procesa y converge; nunca es el fondo permanente.
4. Rendimiento como respeto: 60fps, sin animación sin propósito, contenido visible por defecto.
5. Comunidad abierta: cualquier nivel participa; el sitio lo invita, no lo filtra.

## Accessibility & Inclusion

WCAG AA mínimo (contraste 4.5:1 texto). Foco visible siempre. `prefers-reduced-motion` desactiva animación.
