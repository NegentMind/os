# Orbital Display — MVP

Estado: **build de desarrollo 0.1.0**, no es una fuente publicada ni aprobada
para uso tipográfico general. Implementa la primera hoja de
`../TYPEFACE-STUDY.md`: mayúsculas A–Z, espacio y el punto de registro.

## Qué contiene

- `glyphs/A.svg … Z.svg` — fuente vectorial por glifo (centerline, trazo 13,
  bevel joins, líneas y=16/56/96). Es la fuente de verdad editable.
- `build-font.py` — pipeline reproducible: parsea los SVG, expande el trazo a
  contornos cerrados (skia-pathops, butt caps + bevel joins), escala a
  UPM 1024 (cap 700, baseline 0), aplica sidebearings y emite TTF + WOFF2.
- `orbital-display.ttf` / `orbital-display.woff2` — exports generados.
- `specimen.html` — mesa de glifos (paths centerline, como en el logo).
- `font-proof.html` — prueba de render de la fuente compilada.

## Cobertura

- A–Z completas: las 7 letras del logo (D, E, G, I, M, N, T) verbatim + 19
  nuevas diseñadas sobre la misma gramática.
- Espacio (U+0020) y punto de registro en U+002E (relleno, no trazo).

## Decisiones de diseño (revisables)

- **C, O, Q** usan la familia de arcos grandes (r40, altura completa como D);
  **G** conserva su círculo r30 del logo (queda ópticamente menor que O — rasgo
  deliberado del original, visible en SIGHT/VOICE).
- **B, P, R** usan bowls r20; **J, U** hooks r20/r24.
- **S** se construye con arcos + diagonal central (no es una S de curvas
  continuas); **Z** es rectilínea — pares S/Z son distinguibles pero S es la
  letra más tensa del set.
- **W** deriva de la construcción de M con el vértice interior ajustado (y=50
  vs 62). Es diseño espejo deliberado, no un flip mecánico — si se revisa, W es
  candidata a geometría propia.
- **Q**: cola diagonal que cruza el bowl y baja de la línea base (única
  descendente del set).
- Métricas: ancho variable por letra, sidebearing base 52+52 con correcciones
  ópticas manuales (`OPTICAL` en build-font.py). Sin kerning.

## Pendiente (no fingir que está hecho)

- Minúsculas (o decisión explícita de unicase), dígitos, puntuación completa,
  ¿¡, acentos españoles (ÁÉÍÓÚ Ñ Ü).
- Kerning (GPOS): los pares con diagonales (AV, WA, TY, LY) están flojos.
- Overshoots ópticos: las curvas tocan 16/96 sin sobresalir; a tamaños
  pequeños las redondas leen ligeramente bajas.
- Contorno de I frente a 1/l: hoy I es una barra única sin rasgos
  distintivos — ambiguo fuera de contexto de mayúsculas.
- Revisión de calidad: G pequeña junto a O grande puede leerse como error en
  textos largos; S puede confundirse con 5 en tamaños mínimos.
- Licencia y nombre definitivo sin decidir (ver TYPEFACE-STUDY.md). No
  etiquetar como OFL.
- hinting, versión variable, subsetting.
