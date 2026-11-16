# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitantes que evalúan NegentMind: desarrolladores y líderes técnicos que trabajan con LLMs y agentes de IA, y necesitan infraestructura verificable (memoria, contexto, verificación, ejecución). Audiencia secundaria: comunidad (blog, secciones públicas).

## Product Purpose

Sitio marketing + app con login de NegentMind. La home (modo Persuade) debe hacer inteligible y deseable la oferta en segundos: infraestructura determinista y verificable para ecosistemas de LLMs. Éxito = el visitante entiende qué es, por qué importa y qué hacer (login / explorar docs / contacto).

## Positioning

Negentropía aplicada: orden determinista sobre caos estocástico. Ningún vecino puede copiar con verdad el mecanismo "del ruido a la señal" porque es la tesis fundacional documentada en Notion (🧭 Identidad y Estrategia).

## Operating Context

Next.js 15 App Router + React 19 + Tailwind v4 + Supabase Auth (magic link). Rutas: `/` marketing público (Server Component), `/login` (Client), `/app/*` privada con sesión verificada en servidor. Deploy futuro: Cloudflare Pages. Sin CI; commits directos a `main`, sin push sin orden explícita.

## Capabilities and Constraints

- Capacidades confirmadas: home marketing, login magic link, área privada `/app` con gate de sesión, componentes shadcn base (button, card, input, label).
- Pendiente (alcance futuro, no de esta pasada): registro, recuperación de contraseña, blog, secciones completas del sitio.
- Restricción técnica: animación por capas (`motion/react` micro-interacciones; `gsap` timelines/scroll; no mezclar en el mismo componente). `prefers-reduced-motion` = sin animación.
- Terminología: Negentropía (orden emergente), Sintropía (orden dirigido), Entropía (ruido estocástico), Lanikea (estructura cósmica de referencia visual), Fractales (patrón de escala).

## Brand Commitments

- Decisión 2026-11-12 (ronda de preguntas): la home adopta el sistema dual orden/caos del brief (orden monocromático + caos hiper-cromático con glow/sombras solo en momentos de caos); el resto del sistema conserva Pulse como acento único.
- Tokens ley en `media/remotion/src/tokens.ts`; proyección web en `app/globals.css` (`@theme`). Tipos: Chakra Petch 700 display, Inter texto, JetBrains Mono técnico.
- ASCII como material nativo (bloques, braille, dithering, glitch, scanlines, CRT) investigado en ascii-magic.com.

## Evidence on Hand

- Notion · 🎨 Marca (concepto y voz), `brand/brand-sheet.html`, `media/remotion/src/tokens.ts`.
- Contratos web: `README.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `DATA_MODELS.md`, `AGENTS.md`.
- Investigación ascii-magic.com (2026-11-12): estilos ASCII, bloques, braille, dots/halftone, glitch/RGB split, scanlines/CRT, LED matrix, voxel, mosaicos.
- Ausencias que no deben fabricarse: testimonios, clientes, benchmarks, precios, claims de capacidades no construidas.

## Product Principles

1. El orden se demuestra, no se declara: cada sección dramatiza el mecanismo (ruido → señal).
2. La terminal es el hogar: monoespacio, retícula y ASCII antes que decoración.
3. El caos es material acotado: aparece, se procesa y converge; nunca es el fondo permanente.
4. Rendimiento como respeto: 60fps, sin animación sin propósito, contenido visible por defecto.
5. Comunidad abierta: cualquier nivel participa; el sitio lo invita, no lo filtra.

## Accessibility & Inclusion

WCAG AA mínimo (contraste 4.5:1 texto). Foco visible siempre. `prefers-reduced-motion` desactiva animación.
