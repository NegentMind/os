# AGENTS.md — web/ (instrucciones operativas para IA)

Válido solo dentro de `web/`. Para el workspace, ver `../../AGENTS.md`.

## Cómo trabajar aquí

1. **Leer antes de tocar:** `README.md` (stack) → `ARCHITECTURE.md` (dónde va cada
   cosa) → `DESIGN_SYSTEM.md` (tokens) → `DATA_MODELS.md` (tipos). No inventar
   arquitectura: ya está decidida.
2. **Descomponer** en pasos pequeños: un componente o una ruta por cambio.
   Proponer el plan en 1-3 líneas antes de escribir código si el cambio toca >2 archivos.
3. **Validación manual del usuario:** indicar los comandos necesarios antes de ejecutarlos. En esta fase el usuario ejecuta npm run typecheck y npm run build y comparte los resultados; el agente no lanza tests, builds, tsc, servidores ni comandos equivalentes sin autorización explícita. Se permite inspeccionar el servidor que ya está activo y generar assets acordados. No declarar estos gates aprobados sin su salida.

## Estándares de código (no negociables)

- TypeScript `strict`. **Prohibido `any`** (usar `unknown` + narrowing si hace falta).
- Componentes `PascalCase`, archivos `kebab-case`, hooks `use-*`, tipos en `PascalCase`.
- Server Components por defecto; `"use client"` solo con interactividad real.
- Sin `console.log` en código entregado. Errores con mensaje accionable, nunca silenciosos.
- Imports con alias `@/`; prohibidas rutas relativas que suban más de un nivel (`../../x`).
- Tailwind solo con tokens (`bg-void`, no `#08090C`). Prohibido `style={{}}` para layout.

## Animación

- `motion/react`: micro-interacciones, entrada/salida, `AnimatePresence`, layout.
- `gsap` (+ `ScrollTrigger` si hace falta): timelines, choreography con scroll.
- No mezclar ambas en el mismo componente. `useLayoutEffect`/`useEffect` con cleanup
  (`ctx.revert()` o `gsap.context`) para GSAP. Respetar `prefers-reduced-motion`.

## shadcn

- Añadir con `npx shadcn@latest add <nombre>`. Nunca editar `components/ui/*` a mano
  (se regeneran). Personalizar vía `cva` + tokens, iconos `lucide-react`.

## Commits y ramas

- Convencional en inglés (`feat(web): …`, `fix(web): …`), directos a `main`, un autor.
- **Sin push sin orden explícita.**
