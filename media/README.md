# media/ — fábrica de imagen y video

Todo lo que genera imagen/video vive aquí. Código se versiona; `out/` y binarios, nunca.

| Carpeta | Runtime | Cuándo usarlo |
|---|---|---|
| `remotion/` | Remotion 4 (React) | Data-driven, batch por JSON, player embebible, GIFs del perfil |
| `hyperframes/` | HyperFrames (HTML+`data-*`) | Motion-graphics agent-friendly, slides→video, social cards, 16:9→9:16→1:1 |
| `openmontage/` | OpenMontage (workflow) | Orquestador: brief→script→assets→compose; elige runtime (Remotion/HyperFrames/FFmpeg) |
| `revideo/` | Revideo (TS headless) | Solo si se necesita render desatendido/CI estilo Motion Canvas |
| `motion-canvas/` | Motion Canvas (archivado) | NO usar en proyectos nuevos (inactivo desde 2024); solo referencia |
| `_shared/` | — | (por crear) `assets/`, `footage/`, `audio/`, `fonts/` (con licencias), `renders/` finales |

## Reglas

- Cada runtime con su `README.md` (para qué / cuándo no / cómo renderizar).
- `out/`, `node_modules/`, `dist/` ignorados en todas.
- Tokens de marca: `remotion/src/tokens.ts` es la única fuente de valores.
- Licencias: Remotion (gratis ≤3 personas), HyperFrames Apache-2.0, Revideo MIT, OpenMontage AGPL-3.0 (nota copyleft).
