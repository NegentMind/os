# Negent Mind — instrucciones para agentes

Único AGENTS.md del workspace (unifica los anteriores de raíz, `brand/` y `social/`).
Nivel workspace. Empieza por `README.md` para la orientación general.

## Mapa del workspace

| Ruta | Qué es | Git |
|---|---|---|
| `os/` | **Monorepo privado**: specs/ skills/ brand/ media/ web/ social/ + docs raíz | `NegentMind/os` · **privado** (origen de todo; espejo de este workspace) |
| `.github/` | Perfil + gobernanza (único público activo) | `NegentMind/.github` · público |
| `brand/` | Casa de la marca: plataforma, tablero, exports, checklist | versionado en `os/` |
| `media/` | Fábrica de imagen y video (`remotion/` + `hyperframes/` + `openmontage/`) | versionado en `os/` |
| `web/` | Sitio + app (Next.js + Supabase + Cloudflare Pages) | versionado en `os/` |
| `social/` | Hub social (`mcp-hub`) + automatización (`postiz/`, `n8n/`) + 7 redes | local (sin repo; `.env` con secretos, no commitear) |
| `.tools/` | Scripts: `gen-skills.py` | local |
| `.opencode/` | **Sistema de ingeniería de VantaDB.** No es de Negent Mind | local, no tocar |
| `.playwright-mcp/` / `.vscode/` | Artefactos de capturas / config del editor | local |

**Estrategia, identidad, concepto de marca, decisiones e investigación viven en
Notion** (página raíz «Negent Mind»: 🧭 Identidad y Estrategia · 🎨 Marca ·
🧭 Registro de Decisiones · 🔬 Investigaciones y Revisiones). El repo conserva
el cómo: código, specs y documentos que consumen herramientas.

Identidad v1 (2026-11-11): Void `#08090C` · Bone `#EDEAE3` · Pulse `#8B7CFF`.
Contacto: `negent@negentmind.com` · `negentmind.com` (pendiente compra).

### Los dos documentos de `.github/`

GitHub renderiza **`profile/README.md`**, no el `README.md` de la raíz:

- `profile/` → lo que se ve en github.com/NegentMind (banner GIF dual, holones, enlaces).
  Los `src` relativos (`org-negentmind.gif`) resuelven dentro de `profile/`.
- raíz → `MANIFESTO`, `ROADMAP`, `CONTRIBUTING`, `SECURITY`, `CODE_OF_CONDUCT`,
  `CONTRIBUTORS`, `LICENSE`, `NOTICE`. Aplican a **todo** el org.
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
   exporta; no se edita `profile/` a mano.
5. **La estrategia es privada y vive en Notion.** Toda afirmación de mercado cita su
   fuente (Investigaciones y Revisiones en Notion). Si un documento local contradice
   Notion, **Notion gana**.
6. **Sin push sin orden explícita.**

---

## Git: la práctica real

- Commits **directos a `main`**, un solo autor, **Conventional Commits en inglés**.
- `.github/CONTRIBUTING.md` documenta fork → rama → PR. **Es aspiracional.** No hay CI
  ni plantillas de PR. Los merges del monorepo son `git subtree`, no merges de PR.

## Convención de idiomas (público)

```
NAME.md      English  ← principal, el que GitHub muestra
NAME_ES.md   Español
```

Los `README_ES.md` se tocan a mano.

---

## Comandos

```sh
cd media/remotion
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

- Remoción de fondos GIF: receta chroma-key en `media/remotion/README.md` (120f/30fps/
  960×240 → 60f/4s, `palettegen=max_colors=64`; `colorkey=0x08090C` dark, `0xEDEAE3` light).
- ffmpeg/ffprobe NO están en PATH:
  `C:\Users\Eros\AppData\Local\hermes\tools\ffmpeg-9.0.1-win32-x64\bin\`.
- Máquina: node 26.8.1, npm 11.6.0, Python 3.14.7, git 2.51, `gh`.

---

## Marca (ley, no se duplica en otro archivo)

Concepto, misión y voz: **Notion · 🎨 Marca**. Valores: esta sección +
`media/remotion/src/tokens.ts` + `brand/brand-sheet.html` (mesa visual).
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

## Remotion (`media/remotion/`)

GIF single-play dual-theme (retícula + lockup + punto Pulse) + stills
(Mark/Avatar/Wordmark/Hero dark+light). 120f, 30fps, 960×240, loop-safe, GIF-safe
(tintas planas, sin blur). Tokens en `src/tokens.ts`.

---

## Social (`social/` — reglas del hub)

1. MCP primario: `social-hub` (`mcp-hub/dist/index.js`). Config en `social/opencode.json`.
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
