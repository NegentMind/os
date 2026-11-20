# Media tooling — decisiones

Estado real de los pipelines de imagen y video de la marca. La regla: **un
framework activo por tarea**; el resto son evaluaciones documentadas, no código.

## Activo

| Herramienta | Carpeta | Para qué |
|---|---|---|
| **Remotion** | `remotion/` | Stills de marca (avatar, wordmark, hero) + frames del banner V1. `npm run typecheck` / `studio` / `render:*` |
| **Playwright + ffmpeg** | `../orbital/banner-final/` | GIFs del perfil Orbital v2 (captura `render-final.html`, encode con alfa). Es el generador del banner publicado |

## Evaluadas — solo README, sin código

`hyperframes/`, `openmontage/`, `revideo/`, `motion-canvas/` son stubs de
evaluación para futuros videos de producto. **No instalar nada ni asumir que
funcionan**: cada carpeta documenta una alternativa, no un pipeline. Si una se
activa, se convierte en proyecto real (package.json + lockfile) y se quita de
esta lista; si se descarta, se borra la carpeta.

## Reglas

- El GIF del perfil se genera en `banner-final/` (Playwright+ffmpeg), no en
  Remotion — Remotion solo produce stills. No migrar entre sí sin decisión.
- ffmpeg no está en PATH: `C:\Users\Eros\AppData\Local\hermes\tools\ffmpeg-9.0.1-win32-x64\bin\`.
- Salida a GitHub: perfil vía `github-profile/profile/`; marca vía `brand/exports/`.
