# openmontage/ — orquestador agéntico (workflow, no runtime)

Vendorizado ligero: solo los pipelines YAML que se usen + versión pineada. AGPL-3.0 (copyleft: si se expone en red, liberar fuente).

## Para qué / cuándo no

- Sí: brief→script→assets→compose con gates humanos, documentales con footage, fábrica de clips.
- No: renders directos (delega a Remotion/HyperFrames/FFmpeg según `render_runtime`).

## Uso

```sh
git clone + make setup   # Python 3.10+, FFmpeg, Node 18+
```

Mínimo: `README.md` (versión pineada), `pipelines/` (solo usados), `docs/PROVIDERS.md` (extracto). Sin `tools/` completo.
