# Negent Mind AI — Organización

Soluciones para ecosistemas de LLMs y agentes de IA. Negent Mind no es un LLM: construye la infraestructura alrededor — coherente, estable — porque un LLM sin buena infraestructura es caos.

Creador de holones: todos en su ámbito, partes de un todo mayor. VantaDB (memoria local) es el primero. Marco oficial: **holón** (Koestler, 1967).

## Dónde está la definición

Esta carpeta es **solo la casa de la marca**. La definición del negocio vive en
**Notion**: «Negent Mind» → 🧭 Identidad y Estrategia · 🧭 Registro de
Decisiones · 🔬 Investigaciones y Revisiones. **Si algo no está ahí, no está
definido.** El concepto y la voz de marca viven en Notion · 🎨 Marca; los valores
exactos en `../AGENTS.md` §Marca y `media/remotion/src/tokens.ts`.

## Estructura

| Ruta | Qué es |
|---|---|
| `brand-sheet.html` | Tablero de marca V3 (referencia visual vigente) |
| `brand/specimens/` | Planchas y pruebas previas (wordmarks, avatares, capturas) |
| `brand/exports/` | PNG/GIF finales listos para subir (avatar 500px, hero, banners) |
| Notion · 🎨 Marca | Plataforma de marca: concepto, tokens, voz, reglas (fuera del repo) |
| `docs/profile-README-{EN,ES}.md` | Espejos del perfil publicado (se regeneran, no se editan) |
| `remotion/` | Proyecto Remotion propio para GIFs y PNGs de empresa/producto |

## Reglas

- La marca de Negent Mind vive aquí. La definición del negocio vive en **Notion** (Identidad y Estrategia).
- VantaDB es el flagship de Negent Mind (decisión 16-11-2026); la transferencia de `ness-e/Vantadb` a la org está pendiente (hito H2).
- **Las skills de diseño, animación, video y frontend NO están en esta carpeta.** Viven en `../../.opencode/skills/`, que es el sistema de ingeniería de VantaDB y no se versiona con Negent Mind.
- Paleta v1 (dark-first): Void `#08090C`, Bone `#EDEAE3`, acento Pulse `#8B7CFF` (dark) / `#5B4FE0` (light). Vetados: terracota `#D97757`, naranja VantaDB `#FF5500`, paleta anterior, degradados, sombras, neón, serif editorial.
- Wordmark `NEGENT MIND.` (Chakra Petch 700, caps, tracking 0.12em, punto Pulse como cierre). Marca: monograma NM en pastilla. Avatar: `avatar-dark/light.png`.

## Flujo de producción de imágenes

1. Diseñar en `brand/` (tableros HTML → captura).
2. Animar en `remotion/` (`npm run render:banner`, luego GIF con ffmpeg).
3. Exportar a `brand/exports/` y subir a GitHub desde la UI o `gh`.
