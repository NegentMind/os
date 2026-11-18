# Orbital Display — MVP

Estado: **build de desarrollo 0.2.0**, no es una fuente publicada ni aprobada
para uso tipográfico general. Implementa la primera hoja de
`../TYPEFACE-STUDY.md`: mayúsculas A–Z, minúsculas a–z, espacio y el punto
de registro.

## Qué contiene

- `glyphs/A.svg … Z.svg` — fuente vectorial por glifo (centerline, trazo 13,
  bevel joins, líneas y=16/56/96). Es la fuente de verdad editable.
- `glyphs/lowercase/a.svg … z.svg` — minúsculas en el mismo contrato
  (x-height y=56, descender y=116; los `<circle>` rellenos son el tittle).
  Subdirectorio obligatorio: `a.svg` colisionaría con `A.svg` en un
  filesystem case-insensitive.
- `build-font.py` — pipeline reproducible: parsea los SVG, expande el trazo a
  contornos cerrados (skia-pathops, butt caps + bevel joins), une los
  círculos rellenos, escala a UPM 1024 (cap 700, baseline 0), aplica
  sidebearings y emite TTF + WOFF2.
- `orbital-display.ttf` / `orbital-display.woff2` — exports generados.
- `specimen.html` — mesa de glifos (paths centerline, como en el logo).
- `preview.html` — prueba de render de la fuente compilada.
- `font-proof.html` — prueba de render heredada del build 0.1.

## Cobertura

- A–Z completas: las 7 letras del logo (D, E, G, I, M, N, T) verbatim + 19
  nuevas diseñadas sobre la misma gramática.
- a–z completas (v0): las 26 diseñadas sobre la gramática del estudio.
- Espacio (U+0020) y punto de registro en U+002E (relleno, no trazo).
- Total: 55 glifos en la fuente compilada.

## Decisiones de diseño — minúsculas (revisables)

- **x-height = línea y=56** (350 funits, ratio 0.5 del cap). Es la única
  línea media del contrato y ya aloja los crossbars de E/F/H; ratio bajo
  deliberado, coherente con una display técnica. Si se prueba y lee
  pequeña, la alternativa sería ~2/3 del cap, pero rompería la grilla.
- **Ascendentes a y=16** (cap): b, d, f, h, k, l, t. **Descendentes a
  y=116** (20 unidades bajo baseline, −175 funits de centro): g, j, p, q, y.
- **Módulo de bowl r20** centrado en (32,76), compartido por a, b, d, g, o,
  p, q; arcos r20 en h, m, n, u y hooks r20 (familia J) en g, j, y. Trazo
  13 y bevel joins sin excepciones.
- **a y g single-story** (decisión explícita): a = d sin ascendente, g =
  bowl + asta con hook r20 — gramática geométrica, no humanista.
- **c/e** comparten el arco r20 abierto ~80° a la derecha (misma apertura
  que la C mayúscula); e añade barra media en y=76.
- **f** = asta + cuarto de arco r20 que termina a cap-height apuntando a la
  derecha + crossbar en y=56. **t** = asta a cap-height + crossbar en y=56.
- **i/j/l** con asta centrada en el margen izquierdo; tittle = círculo
  relleno r6 en (cx,34), la geometría exacta del punto de registro.
- **r** = asta + arco de hombro de ~140° que termina alto (47.3,63.1) sin
  pata descendente derecha — distingue r de n cortada.
- **s** replica la construcción de la S mayúscula con arcos r14 + diagonal;
  **w** replica la de W (astas en bordes + vértice interior y=72); v, x, z
  son versiones rectilíneas a x-height.
- Métricas: `sxHeight=350`, descender tipográfico −200, `usWinDescent=240`
  (los descendentes con media stroke llegan a −232). Sidebearing base
  52+52 con `OPTICAL_LOWER` para astas estrechas y letras abiertas.

## Decisiones de diseño — mayúsculas (revisables)

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

- Dígitos, puntuación completa, ¿¡, acentos españoles (ÁÉÍÓÚ Ñ Ü áéíóú ñ ü).
- Kerning (GPOS): los pares con diagonales (AV, WA, TY, LY, y ahora los
  pares con v/w/y minúsculas) están flojos.
- Overshoots ópticos: las curvas tocan 16/56/96 sin sobresalir; a tamaños
  pequeños las redondas leen ligeramente bajas.
- Contorno de I frente a 1/l: hoy I es una barra única sin rasgos
  distintivos — ambiguo fuera de contexto de mayúsculas.
- Minúsculas candidatas a revisión (v0, señaladas honestamente):
  - **t** con asta a cap-height puede leerse casi como l+barra; si molesta,
    bajar la asta a ~y=28 o añadir hook inferior derecho.
  - **f** sin descendente y con terminal horizontal a cap-height — formal
    pero atípica; revisar en palabras como "fi"/"fl".
  - **a vs d** solo se distinguen por la altura de asta (correcto en sans
    geométricas, pero verificar en palabras mixtas).
  - **r** con hombro corto puede leerse débil junto a n en texto corrido.
  - **g single-story** con cola abierta a la izquierda: revisar cierre
    óptico frente a q (g termina en punta, q en asta).
- Revisión de calidad: G pequeña junto a O grande puede leerse como error en
  textos largos; S puede confundirse con 5 en tamaños mínimos.
- Licencia y nombre definitivo sin decidir (ver TYPEFACE-STUDY.md). No
  etiquetar como OFL.
- hinting, versión variable, subsetting.
