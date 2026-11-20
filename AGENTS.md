# Negent Mind — instrucciones para agentes

Único AGENTS.md del workspace (unifica los anteriores de raíz, `brand/` y `social/`).
Vive en `os/`; la raíz del workspace solo tiene un puntero. Empieza por `README.md`
para la orientación general. Las rutas sin prefijo son relativas a `os/`.

## Mapa del workspace

**Raíz del workspace** (`C:\Users\Eros\Negent Mind`, repo git local sin remoto):

| Ruta | Qué es | Git |
|---|---|---|
| `os/` | **Monorepo privado**: origen de todo (ver tabla siguiente) | `NegentMind/os` · **privado** |
| `.github/` | Clon de trabajo del repo público del perfil + gobernanza | `NegentMind/.github` · público (espejo de `os/github-profile/`) |
| `templates/`, `webTemplates/`, `shots/` | Referencias de diseño locales (plantillas y capturas de terceros) | **ignorados por git; nunca se publican** |
| `.opencode/` | **Sistema de ingeniería de VantaDB.** No es de Negent Mind | local, no tocar |
| `.playwright-mcp/` / `.vscode/` | Artefactos de capturas / config del editor | local, ignorados |

**Dentro de `os/`:**

| Ruta | Qué es | Git |
|---|---|---|
| `specs/` | Especificación de arquitectura (holones = mapa de capacidades, visión) | interno en `os/` (repo público eliminado 16-11-2026; respaldo en `C:\Users\Eros\Backups`) |
| `github-profile/` | Perfil del org (`profile/`) + gobernanza | espejo → `NegentMind/.github` · público |
| `skills/` | 5 skills del diagnóstico B2B — **experimento congelado** | interno en `os/` (repo privado eliminado 16-11-2026; respaldo en `C:\Users\Eros\Backups`) |
| `brand/` | Casa de la marca: tablero, exports, specimens | versionado en `os/` |
| `brand/media/` | Fábrica de imagen y video (`remotion/` + `hyperframes/` + `openmontage/`) | versionado en `os/` |
| `web/` | Sitio + app (Next.js; despliegue previsto en Cloudflare Workers vía `@opennextjs/cloudflare`, ver `web/DEPLOY.md`) | versionado en `os/` |
| `brand/social/` | Hub social (`mcp-hub`) + automatización (`postiz/`, `n8n/`) + carpetas por red. **Tooling**, no canales de comunidad | versionado en `os/` (`.env` con secretos, nunca commitear) |
| `.tools/` | Scripts: `gen-skills.py` (congelado) | versionado en `os/` |

VantaDB **no vive aquí**: repo propio `ness-e/Vantadb` (v0.9.0; transferencia a
`NegentMind/vantadb` pendiente).

### Espejos (regla)

`github-profile/` es la **fuente**; el repo `NegentMind/.github` es su espejo
(el único que queda tras eliminar `negentmind` y `skills` el 16-11-2026).
**Se edita siempre en `os/`** y después se sincroniza al repo espejo (el push lo hace
el fundador). No editar el espejo directamente: el siguiente sync lo pisaría.

**Estrategia, identidad, concepto de marca, decisiones e investigación viven en
Notion** (página raíz «Negent Mind»: 🧭 Identidad y Estrategia · 🎨 Marca ·
🧭 Registro de Decisiones · 🔬 Investigaciones y Revisiones). El repo conserva
el cómo: código, specs y documentos que consumen herramientas.

Identidad v2 aprobada para la nueva web y nuevos assets: Orbital, carbón y plata,
tipografía y superficies redondeadas, espectro del hero como material expresivo.
Implementación en curso; valores web en `web/app/orbital.css`.
Identidad v1 (Void/Bone/Pulse): compatibilidad de Remotion y perfil publicado,
congelados hasta una migración explícita; no modificar su pipeline en esta tarea.
Contacto: `negent@negentmind.com` · `negentmind.com` (pendiente compra).

### Los dos documentos de `.github/` (fuente: `github-profile/`)

GitHub renderiza **`profile/README.md`**, no el `README.md` de la raíz:

- `profile/` → lo que se ve en github.com/NegentMind (banner GIF dual, proyectos, enlaces).
  Los `src` relativos (`org-banner.gif`) resuelven dentro de `profile/`.
- raíz → `CONTRIBUTING`, `SECURITY`, `CODE_OF_CONDUCT`, `CONTRIBUTORS`, `LICENSE`,
  `NOTICE`. Aplican a **todo** el org. El roadmap es **privado** (Notion): no se publica.
- En `profile/`, enlaces a otros documentos con **URLs absolutas** a
  `github.com/NegentMind/...`, no rutas relativas.

---

## Límites duros

1. **VantaDB es el flagship de Negent Mind** (decisión 16-11-2026). Transferencia de
   `ness-e/Vantadb` a la org pendiente (hito H2). Hasta entonces, sus cambios se hacen
   en su propio repo. Sus assets de producto (naranja `#FF5500`, la esfera,
   Anton/SpaceMono) no se usan en la marca Negent Mind hasta decidir la marca de
   producto (Registro de Decisiones).
2. **`.opencode/` no es de Negent Mind.** Task-system, agentes `vanta-*` y skills de
   VantaDB. **No mover, no modificar, no borrar.** (Por eso `opencode.json` vive en la
   raíz del workspace: es la config propia y OpenCode la carga desde el cwd.)
3. **`brand/` es local pero versionable**: su `.gitignore` excluye `out/`,
   `node_modules/` y `dist/`. Solo `brand/exports/` sale hacia GitHub.
4. **El perfil de GitHub está congelado.** Todo cambio de marca nace en `brand/` y se
   exporta; no se edita `github-profile/profile/` a mano.
5. **La estrategia es privada y vive en Notion.** Toda afirmación de mercado cita su
   fuente (Investigaciones y Revisiones en Notion). Si un documento local contradice
   Notion, **Notion gana**.
6. **Sin push sin orden explícita.**

---

## Git: la práctica real

- Commits **directos a `main`**, un solo autor, **Conventional Commits en inglés**.
- `.github/CONTRIBUTING.md` documenta fork → rama → PR. **Es aspiracional en parte:** hay CI mínimo (typecheck + build de `web/`
  en `.github/workflows/ci.yml`, desde 2026-11-20) pero sin tests ni lint;
  las plantillas de issue/PR viven en `github-profile/`. Los merges del monorepo son `git subtree`, no merges de PR.

## Convención de idiomas (público)

```
NAME.md      English  ← principal, el que GitHub muestra
NAME_ES.md   Español
```

Los `README_ES.md` se tocan a mano.

---

## Comandos

```sh
cd brand/media/remotion
npm install            # una vez; ya existe package-lock.json
npm run studio         # vista previa
npm run typecheck      # debe salir exit 0 (tsc --noEmit)
npm run render:banner        # frames dark  -> out/negentmind-frames
npm run render:banner-light  # frames light -> out/negentmind-light-frames
cd ../../web
npm install            # una vez
npm run dev            # desarrollo
npm run typecheck      # debe salir exit 0 (tsc --noEmit)
```

- Remoción de fondos GIF: receta chroma-key en `brand/media/remotion/README.md` (120f/30fps/
  960×240 → 60f/4s, `palettegen=max_colors=64`; `colorkey=0x08090C` dark, `0xEDEAE3` light).
- ffmpeg/ffprobe NO están en PATH:
  `C:\Users\Eros\AppData\Local\hermes\tools\ffmpeg-9.0.1-win32-x64\bin\`.
- Máquina: node 26.8.1, npm 11.6.0, Python 3.14.7, git 2.51, `gh`.

---

## Marca v2 (web y nuevos assets)

Decisión aprobada en **Notion · Marca**: Orbital (lettering SVG original),
Outfit para títulos, DM Sans para texto y JetBrains Mono para código.
Carbón y plata son la base; el hero admite un espectro cromático que se
reutiliza de manera acotada en ilustraciones y detalles. Radios y espacios
compartidos. Sin pantalla de carga bloqueante; movimiento reducido y pausa
para efectos continuos. Componentes internos sobre shadcn/Radix.

Valores web: `web/app/orbital.css`; contexto técnico aprobado:
`web/docs/dev/_archive/site-v2-design.md`. No duplicar los valores de la nueva web
en los tokens antiguos de Remotion: cambiaría los renders y el chroma-key.
Ni la marca propia de VantaDB ni el perfil ya publicado cambian implícitamente.

## Marca v1 (histórico / compatibilidad congelada)

Concepto, misión y voz: **Notion · 🎨 Marca**. Valores: esta sección +
`brand/media/remotion/src/tokens.ts` + `brand/brand-sheet.html` (mesa visual).
Espejos del perfil: `brand/docs/profile-README-{EN,ES}.md`.

```
void    #08090C   fondo base dark-first (chroma ffmpeg: se recorta a alfa)
panel   #0E131B   superficies
bone    #EDEAE3   tinta principal sobre dark
fog     #98A1B3   secundario
pulse   #8B7CFF   acento único (cierre, punto, foco)
line    #232B38   hairlines 1px sobre dark
--- tema claro ---
bg      #EDEAE3 · ink #14161C · pulse #5B4FE0 · line #D4D0C6
veto    #D97757 (Anthropic) · #FF5500 (VantaDB) · paleta anterior · degradados · sombras · neón · serif editorial
```

Tipos (Google Fonts, OFL): wordmark/display Chakra Petch 700 caps 0.12em · texto
Inter · técnico JetBrains Mono.

## Skills

- Fuente: `.opencode/skills/` (diseño, animación, video, frontend; sistema de VantaDB,
  no se versiona). Orquestador: `vanta-design-orchestrator`.
- Redacción: `writing-guidelines` + `copywriting`.
- Web research: `coordinated-web-search` (websearch → metasearch → argus → fallbacks).
  Citar URLs.
- Convenciones de trabajo: commits en inglés; specimens en `brand/`; verificar con
  screenshots antes de dar algo visual por terminado.

## Remotion (`brand/media/remotion/`)

GIF single-play dual-theme (retícula + lockup + punto Pulse) + stills
(Mark/Avatar/Wordmark/Hero dark+light). 120f, 30fps, 960×240, loop-safe, GIF-safe
(tintas planas, sin blur). Tokens en `src/tokens.ts`.

---

## Social (`brand/social/` — reglas del hub)

0. `brand/social/` es **tooling** (MCP, automatización), no la lista de canales. Canales de
   comunidad vigentes: GitHub + X (principal) + Reddit/HN en lanzamientos. **Discord
   solo al llegar a 500 estrellas**; `brand/social/discord/` no implica un canal abierto.
1. MCP primario: `social-hub` (`mcp-hub/dist/index.js`). Config en `brand/social/opencode.json`.
   No tocar `~/.config/opencode/opencode.json` ni otras carpetas.
2. Legacy (`bluesky`, `linkedin`, `reddit`, `youtube-transcript`, `twitter-free`,
   `twitter-isteam`): `enabled: false`, solo fallback. `buffer` remoto activo como
   companion hasta tener `BUFFER_ACCESS_TOKEN`.
3. Credenciales en `.env` (nunca commitear ni imprimir en logs). Falta una → reportar
   cuál y cómo crearla (`social_status` la lista sin valores), no inventarla.
4. Solo lectura por defecto. Escritura exige `confirm:true` + texto final visible antes.
5. Ritmo: una escritura por vez, sin spam ni engagement artificial. Browser X/LinkedIn
   con perfiles persistentes; primer uso = login manual 1 vez.
6. Rangos: investigar (`social_search`, `social_feed`, `social_xtweets`, …),
   interactuar (`social_post` 24 providers, `social_reply`, `social_react`),
   programar (`social_schedule` + `social_run_due`).
7. Si una tool falla (browser bloqueado, 403, OAuth pendiente): diagnosticar y proponer
   el fix en 1-2 pasos, no reintentar en bucle. Selectores de X/LinkedIn frágiles:
   si cambian, reportarlo.

---

## Verificación

- Remotion: `typecheck` exit 0 + `ffprobe` sobre frames + ver GIF en dark y light
  (single-play con `<picture>` por `prefers-color-scheme`).
- Perfil publicado: los 4 raw (README EN, README ES, 2 GIFs) devuelven 200.
- Capturas antes de dar algo visual por terminado (`brand/specimens/`).
- En repos Markdown: revisar el diff, sin enlaces relativos rotos.

Open item: transferencia de VantaDB a la org (hito H2).
