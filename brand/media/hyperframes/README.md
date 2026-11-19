# hyperframes/ — motion-graphics HTML deterministas

Composición = HTML plano + atributos `data-*`. El JS (GSAP/Lottie/Three.js) solo hace motion seekable, nunca timing. Apache-2.0.

## Para qué / cuándo no

- Sí: social cards, slides→video, adaptaciones 16:9→9:16→1:1, plantillas generadas por agentes.
- No: data-driven con componentes React (eso es `../remotion/`).

## Cómo renderizar

```sh
npm install
hyperframes preview     # live-reload
hyperframes render      # MP4/WebM/GIF/PNG-seq a out/
```

Mínimo: `README.md`, `package.json`, `index.html`, `compositions/`, `assets/`, `hyperframes.json`, `out/` (ignorado).
