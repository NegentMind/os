# DESIGN_SYSTEM.md — tokens, UI y reglas visuales

Fuente de verdad de valores: `media/remotion/src/tokens.ts`. Este archivo es su
proyección a web. Si un valor cambia, cambia en ambos.

## Tokens (`app/globals.css` → `@theme`)

| Token | Valor | Uso |
|---|---|---|
| `void` | `#08090C` | Fondo base dark-first |
| `panel` | `#0E131B` | Superficies |
| `bone` | `#EDEAE3` | Tinta principal sobre dark |
| `fog` | `#98A1B3` | Secundario |
| `pulse` | `#8B7CFF` | **Acento único** (cierre, punto, foco) |
| `linedark` | `#232B38` | Hairlines 1px sobre dark |
| `ink` | `#14161C` | Tinta sobre claro |
| `pulsedeep` | `#5B4FE0` | Acento sobre claro |
| `linelight` | `#D4D0C6` | Hairlines sobre claro |

Clases generadas: `bg-void`, `text-bone`, `text-pulse`, `border-linedark`, etc.

### Tipografía (OFL, `next/font/google` en `app/layout.tsx`)

| Rol | Fuente | Clase |
|---|---|---|
| Wordmark / display | Chakra Petch 700, caps, tracking 0.12em | `font-display` |
| Texto / UI | Inter 400/500/600 | `font-sans` (default body) |
| Técnico / código | JetBrains Mono | `font-mono` |

Vetado: serif editorial, degradados, sombras, neón, `#FF5500` (VantaDB),
`#D97757` (Anthropic), paleta anterior.

## Librería base: shadcn new-york

Componentes instalados: `button`, `card`, `input`, `label` (en `components/ui/`).
Añadir más con `npx shadcn@latest add <nombre>` — nunca copiar código de shadcn a mano.

Reglas de personalización:
- Variantes nuevas vía `cva` en el propio componente shadcn, reutilizando tokens.
- Iconos solo `lucide-react`. Nada de emojis como iconos de UI.
- Estados de foco visibles siempre (`--ring: pulse`).

## Reglas UI/UX

- **Mobile-first.** Breakpoints Tailwind por defecto (`sm:` `md:` `lg:`). Nada de
  `max-width` arbitrarios fuera de la escala.
- **Espaciado:** múltiplos de 4 (`p-4`, `gap-6`, `mt-8`). Nada de px mágicos.
- **Estados obligatorios** en todo lo que cargue datos: `loading` (skeleton, no
  spinner global), `empty` (mensaje + acción), `error` (mensaje + reintentar).
- **Contraste:** AA mínimo (4.5:1 texto). `fog` sobre `void` solo para texto
  secundario ≥14px.
- **Movimiento:** duraciones 150–300ms, easing springs; `gsap` para scroll/timelines,
  `motion` para micro-interacciones. `prefers-reduced-motion` = sin animación.
- **Dark-first.** El tema claro existe pero el default es dark; todo componente nuevo
  se diseña en dark y se verifica en light.
