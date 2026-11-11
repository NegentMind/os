# Negent Mind — AGENTS.md

Instrucciones para agentes que trabajan en este proyecto (identidad y assets de la org `negentmind`, display **NegentMind**).

## Proyecto

- **Qué es**: soluciones para ecosistemas de LLMs y agentes de IA (no es un LLM ni una capa de datos: la infraestructura alrededor). VantaDB (memoria local) es su primer holón (proyecto separado en `ness-e/Vantadb`).
- **Límite duro**: leer VantaDB está permitido; **modificarlo, commitear en él o reusar sus assets está prohibido**. Naranja `#FF5500`, esfera, Anton/SpaceMono quedan allá.

## Skills

- Fuente: `../../.opencode/skills/` (74 skills de diseño, animación, video y frontend).
  **No están dentro de `local/`** — viven en la raíz del workspace y pertenecen al
  sistema de ingeniería de VantaDB. No se versionan con Negent Mind.
- Orquestador: `vanta-design-orchestrator`. Redacción: `writing-guidelines` (fetch fresco de Vercel) + `copywriting`.
- Web research: `coordinated-web-search` (cascada keyless → Argus → MetaSearchMCP → fallbacks). Citar URLs.

## Brand tokens (ley)

```
void    #08090C   fondo base dark-first (chroma ffmpeg: se recorta a alfa)
panel   #0E131B   superficies
bone    #EDEAE3   tinta principal sobre dark
fog     #98A1B3   secundario
pulse   #8B7CFF   acento único (cierre, punto, foco)
line    #232B38   hairlines 1px sobre dark
--- tema claro ---
bg      #EDEAE3   fondo claro
ink     #14161C   tinta sobre claro
pulse   #5B4FE0   acento sobre claro (mismo hue, más profundo)
veto    #D97757 (Anthropic) · #FF5500 (VantaDB) · #F0EEE6/#141413/#4A6B53 (identidad anterior) · degradados · sombras · neón · serif editorial
```

Tipos (Google Fonts, OFL): wordmark/display Chakra Petch 700 caps 0.12em · texto Inter · técnico JetBrains Mono.

## Remotion (`remotion/`)

```sh
cd remotion
npm install          # una vez
npm run studio       # vista previa
npm run typecheck    # debe pasar exit 0
npm run render:banner  # PNGs a out/negentmind-frames
```

GIF single-play dual-theme (retícula + lockup + punto Pulse) con ffmpeg (ruta completa, no está en PATH); receta en `remotion/README.md`. Composiciones: 120f, 30fps, 960×240, loop-safe, GIF-safe (tintas planas, sin blur). Stills: Mark/Avatar/Wordmark/Hero dark+light.

## Convenciones

- Commits en inglés, Conventional Commits. Sin push sin orden explícita.
- Specimens y tableros viven en `brand/`; solo `brand/exports/` sale hacia GitHub.
- Verificar visualmente con screenshots antes de dar algo por terminado.
