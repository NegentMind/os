# Especimen — exploración de color y tipografía

**Estado:** exploración interna, **no publicada**. Composición representativa;
no es una migración de la web en vivo ni del perfil de GitHub. Es una
**previsualización**, no producción: nada de lo elegido aquí toca `web/`,
`github-profile/` ni `brand/exports/`.

## Qué es

`verdigris-copper.html` — página estática autocontenida (CSS + vanilla JS, sin
dependencias ni build) para evaluar paletas de color estructura/atención sobre
neutros y combinaciones tipográficas, en tema claro y oscuro. Cuatro bloques:
**Web**, **Marca**, **GitHub** (mock ilustrativo, cromo neutro) y **Paleta**
(tokens exactos, proporción 85/10/5 y tabla de contraste medido).

## Controles

Barra superior (sticky en escritorio, estática en móvil):

- **Claro / Oscuro** — alterna el tema (`data-theme` + `aria-pressed`).
- **«Paleta y fuentes»** (panel `<details>`; abierto por defecto en escritorio,
  plegado en móvil):
  - **Paleta** — Verdigrís y cobre · Petróleo y ocre · Pizarra y burdeos ·
    Oliva y arcilla.
  - **Títulos y marca** — Manrope · Sora · Space Grotesk · IBM Plex Sans ·
    Chakra Petch (referencia).
  - **Texto** — Source Sans 3 · DM Sans · IBM Plex Sans · Inter (referencia).
  - **Restablecer** — vuelve a los valores por defecto.
- Resumen de la combinación activa (paleta · títulos + texto · modo),
  `aria-live="polite"`.

**Defaults:** Verdigrís y cobre · claro · Manrope + Source Sans 3.
Todas las combinaciones son independientes (4×5×4×2). Las fuentes cargan de
Google Fonts; sin conexión cae al fallback sans/mono del sistema.

### Persistencia

La elección se guarda en `localStorage` (clave `nm-specimen-v2`) dentro de
`try/catch`: si el almacenamiento está bloqueado, la página funciona igual con
los defaults. Al restaurar solo se aceptan IDs conocidos (whitelist).

## Arquitectura de tokens

Cada preset define 9 tokens por tema (`bg, surface, ink, muted, line,
structure, attention, action, on-action`; `--link` = `action`), expuestos como
`--light-*` y `--dark-*` y alias semánticos `--bg/--surface/--ink/--muted/
--line/--structure/--attention/--action/--on-action` según `data-theme`.
Las fichas de Marca usan los tokens de cada tema de forma fija (claro y oscuro
simultáneos). Las tablas de paleta y contraste se rellenan por JS
(`createElement`/`textContent`) con los datos congelados del preset — ratios
precalculados para estos presets, no recomputados.

Reglas de aplicación: estructura = hairlines, marcadores, diagramas (texto
pequeño solo sobre fondo base; en paneles, tinta + marcador); atención = un
solo punto por pieza (la variante funcional de acción cubre texto pequeño,
enlaces y botones). La tabla de contraste del especimen muestra los 5 pares de
aplicación del preset y modo activos; 4.5:1 (AA texto normal) es guía de
pares, no auditoría.

## Cómo verlo

Abrir directo en el navegador:

```
file:///C:/Users/Eros/Negent%20Mind/os/brand/specimens/verdigris-copper.html
```

## Capturas

`out/` (ignorado por git): renders de verificación — escritorio/móvil en ambos
temas, paletas y fuentes alternativas, detalle de marca/GitHub/paleta.

## Pendiente si se aprueba

Decisión de marca en Notion → actualizar `brand/brand-sheet.html`,
`brand/exports/*`, `media/remotion/src/tokens.ts` y, solo tras exportar,
`github-profile/` → `.github`. Este archivo no toca nada de eso.

Migración web (también futura y sujeta a aprobación): mapear los tokens a
`web/` (variables CSS de superficie/tinta/estructura/atención, colores
hardcodeados en componentes y paleta del shader/canvas del hero) y regenerar
las capturas EN/ES de la home. Nada de esto está hecho aquí.
