# Negent Mind — instrucciones para agentes

Este archivo es de **nivel workspace**. La raíz `C:\Users\Eros\Negent Mind` **no es un
repositorio git**: es un contenedor de tres repos independientes más directorios
locales. Nada de lo que se escriba aquí se versiona. Empieza por `README.md` /
`README_EN.md` para la orientación general.

Marca e identidad: la autoridad es [`brand/AGENTS.md`](./brand/AGENTS.md).
Este archivo no la duplica.

---

## Mapa del workspace

| Ruta | Qué es | Git |
|---|---|---|
| `os/` | **Monorepo privado**: specs/ strategy/ skills/ brand/ media/ web/ social/ + docs raíz | `NegentMind/os` · **privado** (origen de todo) |
| `.github/` | Perfil + gobernanza (único público activo; espejo en `os/github-profile/`) | `NegentMind/.github` · público |
| `social/` | Hub social (mcp-hub) + configuración | local (sin repo; `.env` con secretos, no commitear) |
| `old/` | Respaldo del 2026-09-28: copias con `.git` de los 3 repos + bundles. Nunca se sube a ningún sitio | ninguno |
| `.tools/` | `i18n-holons.py` (ver abajo) | local |
| `.opencode/` | **Sistema de ingeniería de VantaDB.** No es de Negent Mind | local |
| `web/` | Next.js + Supabase + Cloudflare Pages (marketing + app con login) | versionado en `os/` |
| `.playwright-mcp/` | Artefactos de capturas | local |

Identidad v1 (ruptura total 2026-11-11): Void `#08090C` · Bone `#EDEAE3` · Pulse `#8B7CFF`. Contacto: `negent@negentmind.com` · `negentmind.com` (pendiente compra).

Activos: `os/` y `.github` en `main` (un solo autor). Archivados: `negentmind`, `strategy`, `skills` (espejos de `os/`, historial preservado).

### Los dos documentos de `.github/`

GitHub renderiza **`profile/README.md`**, no el `README.md` de la raíz. Son documentos
distintos con trabajos distintos:

- `profile/` → lo que se ve en github.com/NegentMind (banner GIF dual, holones, enlaces).
  Los `src` relativos (`org-negentmind.gif`) resuelven dentro de `profile/`.
- raíz → `MANIFESTO`, `ROADMAP`, `CONTRIBUTING`, `SECURITY`, `CODE_OF_CONDUCT`,
  `CONTRIBUTORS`, `LICENSE`, `NOTICE`. Al vivir aquí aplican a **todo** el org.

Regla práctica: en `profile/` los enlaces a otros documentos son **URLs absolutas** a
`github.com/NegentMind/...`, no rutas relativas.

---

## Límites duros

1. **VantaDB (`ness-e/Vantadb`) es de otro proyecto.** Leer está permitido. **Modificar,
   commitear o reusar sus assets está prohibido.** Naranja `#FF5500`, la esfera y
   Anton/SpaceMono se quedan allá. Negent Mind tiene ruptura total de marca con VantaDB.
2. **`.opencode/` no es de Negent Mind.** Es el task-system, los agentes `vanta-*` y las
   skills de VantaDB. Habla de `insert_lock`, IQL y PyO3. **No lo muevas a Negent Mind y no
   lo borres.** Contiene además `node_modules copy/`, respaldo obsoleto de agosto: no se
   borra sin confirmación (tiene 3.615 archivos que no están en el `node_modules` activo).
3. **`brand/` es local pero versionable**: su `.gitignore` propio excluye `out/`, `node_modules/` y `dist/`. El trabajo en curso es invisible; solo `brand/exports/` sale hacia GitHub.
4. **El perfil de GitHub está congelado.** Cualquier cambio futuro de marca nace en
   `brand/` y se exporta; no se edita `profile/` a mano.
5. **La estrategia es privada y evidenceada.** Toda afirmación de mercado cita su fuente y
   si no está en `strategy/evidencia/02-evidencia-mercado.md`, no se afirma. Si un
   documento contradice `strategy/NEGENT-MIND.md`, **`NEGENT-MIND.md` gana**.
6. **Sin push sin orden explícita.**

---

## Git: la práctica real

- Commits **directos a `main`**, un solo autor, mensajes en **Conventional Commits en
  inglés** (`docs: …`, `Add 'holons/x/' from commit '…'`).
- `.github/CONTRIBUTING.md` documenta fork → rama `feature/*` → Pull Request. **Es
  aspiracional: no es lo que pasa.** No hay CI, ni plantillas de PR, ni protección de
  rama, ni tests ni linters. Los 9 merges del monorepo son importaciones `git subtree`,
  no merges de PR.
- Restaurar desde el respaldo, si hiciera falta:
  `git clone old/_bundles/syntropy.bundle negentropy` (idem `.github`, `strategy`).

---

## Convención de idiomas (público)

```
NAME.md      English  ← principal, el que GitHub muestra
NAME_ES.md   Español
```

Aplica al perfil, manifiesto, roadmap, monorepo y los 9 holones. El español existe
porque los clientes son venezolanos, no porque sea de segunda. **Los `README_ES.md` se
tocan a mano; los `README.md` no** (ver abajo).

---

## Los README en inglés de los holones están generados

`holons/<slug>/README.md` **se reescribe entero** por `.tools/i18n-holons.py` a partir de
la tabla `HOLONS` del propio script. Editar a mano ese README no sirve: el siguiente
`python .tools/i18n-holons.py` lo revierte.

```sh
python .tools/i18n-holons.py
```

- Es idempotente respecto al español: si `README_ES.md` ya existe, no lo toca.
- El `ROOT` está hardcodeado a `C:\Users\Eros\Negent Mind\negentmind\holons` (ruta absoluta).
- Para cambiar un holón hay que editar la tabla `HOLONS` y re-ejecutar.

---

## Comandos

El único proyecto con comandos reales es el Remotion de marca. **No hay suite de tests,
lint, typecheck ni build en el resto del workspace** — el contenido son Markdown.

```sh
cd media/remotion
npm install            # una vez; ya existe package-lock.json
npm run studio         # vista previa
npm run typecheck      # debe salir exit 0 (tsc --noEmit)
npm run render:banner        # frames dark  -> out/negentmind-frames
npm run render:banner-light  # frames light -> out/negentmind-light-frames
```

Receta del GIF (chroma key a alfa real, single-play) en `remotion/README.md`. Resumen:
composición 120f a 30fps en 960×240, se renderizan frames con `--every-nth-frame=2` y
ffmpeg los lee a `-framerate 15` → 60f / 4s, con `-loop -1` (una sola reproducción),
`palettegen=max_colors=64`. El fondo se recorta con `colorkey=0x08090C` (dark, = Void) o
`0xEDEAE3` (light, = Bone).

ffmpeg/ffprobe NO están en PATH: usar `C:\Users\Eros\AppData\Local\hermes\tools\ffmpeg-9.0.1-win32-x64\bin\`.

Presentes en la máquina: node 26.8.1, npm 11.6.0, Python 3.14.7, git 2.51, `gh`.

---

## Marca

La ley vive en tres sitios, todos gitignored:

- `brand/docs/brand-platform.md` — concepto, misión, voz, reglas duras.
- `brand/brand-sheet.html` — la mesa visual (B0, B1b, B9).
- `media/remotion/src/tokens.ts` — tokens en código.

Checklist vivo: `brand/negentmind.md`. Fuente de la que el perfil se publica:
`brand/docs/profile-README-{EN,ES}.md`.

Lo mínimo que hay que saber sin abrir nada: dark-first, fondo Void `#08090C`,
tinta Bone `#EDEAE3`, un solo acento **Pulse `#8B7CFF`** (dark) / `#5B4FE0` (light),
flat 100%, hairlines 1px, retícula de puntos. Vetados: degradados, sombras, neón,
serif editorial, terracota `#D97757` (Anthropic), naranja de VantaDB, paleta anterior
(paper `#F0EEE6`, ink `#141413`, Sage), minúscula cruda estilo Anthropic.

---

## Verificación

Como no hay automatizado, "done" se demuestra a ojo y con herramientas:

- Remotion: `npm run typecheck` exit 0 + `ffprobe` sobre los frames + ver el GIF en
  **dark y light** (los GIFs son single-play con `<picture>` por `prefers-color-scheme`).
- Perfil publicado: los 4 raw (README EN, README ES, 2 GIFs) devuelven 200.
- Cualquier cosa visual: capturas antes de darla por terminada. Las pruebas de marca
  archivadas están en `brand/specimens/`.
- En los repos de Markdown, revisar el diff y que no queden enlaces relativos rotos —
  ya se rompió esa convención una vez (la tabla invertía `X.md`/`*_EN.md`).

Open items que ya están registradas y no son lurking bugs: colisión de marca con
`syntropyai.app`, disponibilidad de `syntropyos.com`, y si la relación Negent Mind ↔
VantaDB implica transferencia de repo, marca o distribución conjunta (hoy el AGENTS.md
lo prohíbe, lo que bloquearía una venta conjunta).
