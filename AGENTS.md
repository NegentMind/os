# Negent Mind — instrucciones para agentes

Único AGENTS.md del workspace (unifica los anteriores de raíz, `brand/` y `social/`).
Nivel workspace. Empieza por `README.md` para la orientación general.

## Mapa del workspace

| Ruta | Qué es | Git |
|---|---|---|
| `os/` | **Monorepo privado**: specs/ strategy/ skills/ brand/ media/ web/ social/ + docs raíz | `NegentMind/os` · **privado** (origen de todo; espejo de este workspace) |
| `.github/` | Perfil + gobernanza (único público activo) | `NegentMind/.github` · público |
| `brand/` | Casa de la marca: plataforma, tablero, exports, checklist | versionado en `os/` |
| `media/` | Fábrica de imagen y video (`remotion/` + `hyperframes/` + `openmontage/`) | versionado en `os/` |
| `web/` | Sitio + app (Next.js + Supabase + Cloudflare Pages) | versionado en `os/` |
| `social/` | Hub social (`mcp-hub`) + automatización (`postiz/`, `n8n/`) + 7 redes | local (sin repo; `.env` con secretos, no commitear) |
| `.tools/` | Scripts: `i18n-holons.py`, `gen-skills.py`, `drift-check.py` | local |
| `.opencode/` | **Sistema de ingeniería de VantaDB.** No es de Negent Mind | local, no tocar |
| `.playwright-mcp/` / `.vscode/` | Artefactos de capturas / config del editor | local |

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

1. **VantaDB (`ness-e/Vantadb`) es de otro proyecto.** Leer está permitido. **Modificar,
   commitear o reusar sus assets está prohibido.** Naranja `#FF5500`, la esfera y
   Anton/SpaceMono se quedan allá. Ruptura total de marca con VantaDB.
2. **`.opencode/` no es de Negent Mind.** Task-system, agentes `vanta-*` y skills de
   VantaDB. **No mover, no modificar, no borrar.** (Por eso `opencode.json` vive en la
   raíz del workspace: es la config propia y OpenCode la carga desde el cwd.)
3. **`brand/` es local pero versionable**: su `.gitignore` excluye `out/`,
   `node_modules/` y `dist/`. Solo `brand/exports/` sale hacia GitHub.
4. **El perfil de GitHub está congelado.** Todo cambio de marca nace en `brand/` y se
   exporta; no se edita `profile/` a mano.
5. **La estrategia es privada y evidenceada.** Toda afirmación de mercado cita su fuente;
   si no está en `strategy/evidencia/02-evidencia-mercado.md`, no se afirma. Si un
   documento contradice `strategy/NEGENT-MIND.md`, **`NEGENT-MIND.md` gana**.
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

Los `README_ES.md` se tocan a mano. **Los `README.md` en inglés de los holones se
regeneran**: `holons/<slug>/README.md` lo reescribe entero `.tools/i18n-holons.py`
desde la tabla `HOLONS`; editarlo a mano no sirve. `ROOT` hardcodeado a
`C:\Users\Eros\Negent Mind\negentmind\holons` (actualizar si cambia).

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

Fuente de verdad: `brand/docs/brand-platform.md` (concepto, misión, voz) +
`brand/brand-sheet.html` (mesa visual) + `media/remotion/src/tokens.ts` (valores).
Checklist vivo: `brand/negentmind.md`. Espejos del perfil:
`brand/docs/profile-README-{EN,ES}.md`.

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

Open items (no son lurking bugs): colisión con `syntropyai.app`, disponibilidad de
`syntropyos.com`, y si la relación Negent Mind ↔ VantaDB implica transferencia
(hoy prohibida por el límite §1).
