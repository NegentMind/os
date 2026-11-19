# Vistas previas de templates de referencia (entorno local)

Estado de la curaduría de templates de referencia tras la limpieza. Las
plantillas son apps Vite **locales** en los directorios ignorados `templates/`
y `webTemplates/` del workspace; no forman parte del despliegue de producción
ni se publican. La web de Negent Mind usa Next.js y se versiona en `os/web`.

## Estado actual

| Servicio | Origen | URL | Rol |
|---|---|---|---|
| Web Negent Mind | `os/web` (Next.js) | `http://localhost:3000/es` · `/en` | Web de producción (dev local) |
| Mondragon2 — referencia | `webTemplates/mondragon2` | `http://localhost:4205/` | Snapshot original (ver abajo) |
| Mondragon2 — adaptación | mismo directorio | `http://localhost:4205/adaptacion.html` | Reinterpretación React marca NM |
| Nice Squash | `webTemplates/nice-squash-242352` | `http://localhost:4206` | Referencia |
| Provenance | `webTemplates/provenance` | `http://localhost:4209` | Referencia |
| Strand | `webTemplates/strand` | `http://localhost:4211` | Referencia |

## Eliminados (curaduría)

Descartados por decisión del fundador; borrados permanentemente de
`templates/` y `webTemplates/`: **aion-template, arccheo, kontra-template,
noveq, ox, sequenceone** (ox solo existía en `templates/`).

## Mondragon2: referencia vs. adaptación

Al revisar la fidelidad se detectó que la raíz `:4205` anterior era una
**reconstrucción React con la marca Negent Mind**, no el original de referencia
(shader y layout distintos del diseño Framer original). Se reorganizó así:

- `/` sirve `index.html` = copia del HTML SSR capturado del site Framer
  (`templates/mondragon2/source.html`); `/works` y `/contact` desde
  `templates/mondragon2/pages/`. Es un **snapshot con dependencia de los CDN
  de Framer — requiere internet y no es una copia offline** ni el proyecto
  Framer editable. Solo se eliminó la etiqueta de analytics de Framer.
- `/adaptacion.html` sirve la app React anterior con `HashRouter`, de modo que
  sus rutas internas (`#/works`, `#/contact`) no colisionen con las rutas
  reales del snapshot.
- No se afirma fidelidad 1:1 offline ni que la reconstrucción anterior fuera
  el original; la raíz actual es el HTML capturado genuino servido tal cual.

## Notas

- Los puertos son convención local (`--strictPort`); cualquier cambio se
  refleja aquí.
- Los snapshots viven en `templates/mondragon2/` (ignorado por git); sus
  copias servidas están en `webTemplates/mondragon2/` (ignorado). No usar
  `git add -f` sobre ellas.
- `templates/unfixedstudio` está vacío y no se puede servir.
