# Remotion — NegentMind

Proyecto propio para imágenes de empresa/producto. Separado del Remotion de VantaDB.

## Uso

```sh
npm install
npm run studio          # vista previa
npm run typecheck       # debe pasar
npm run render:banner        # frames dark (chroma Void #08090C)
npm run render:banner-light  # frames light (chroma Bone #EDEAE3)
```

## GIF single-play dual-theme

1. Renderizar frames de ambas variantes.
2. Convertir con ffmpeg (colorkey del fondo → alfa real, paleta 64, `-loop -1` = una sola reproducción):

```sh
ffmpeg -y -framerate 15 -start_number 0 -i out/negentmind-frames/element-%02d.png -filter_complex "[0:v]scale=960:240:flags=lanczos,colorkey=0x08090C:0.03:0,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5" -loop -1 out/org-negentmind.gif
```

Para light, fondo `#EDEAE3` y `colorkey=0xEDEAE3:0.03:0`. Verificar transparencia (índice alfa) y legibilidad en ambos temas antes de subir a `NegentMind/.github` (`profile/org-negentmind{,-light}.gif`).

## Stills

Composiciones `Mark*`, `Avatar*`, `Wordmark*`, `Hero*` (dark/light):

```sh
npx remotion still MarkDark out/mark-dark.png
```

Los PNG canónicos viven en `../brand/exports/` (+ copia del avatar en la raíz del workspace). Los SVG del mismo directorio son fuente editable.

## Reglas de composición

120f, 30fps, 960×240, loop-safe, GIF-safe (tintas planas, sin blur). Tokens en `src/tokens.ts` — única fuente de valores.
