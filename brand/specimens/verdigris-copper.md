# Especimen — verdigris + terracota (exploración de color)

**Estado:** exploración interna, **no publicada**. Composición representativa;
no es una migración de la web en vivo ni del perfil de GitHub.

## Qué es

`verdigris-copper.html` — página estática autocontenida (CSS + vanilla JS, sin
dependencias ni build) que muestra la identidad Negent Mind con una paleta
candidata de verdigris (estructura) + terracota/cobre (atención) sobre neutros,
en tema claro y oscuro. Cuatro bloques: **Web**, **Marca**, **GitHub** (mock
ilustrativo, cromo neutro) y **Paleta** (tokens exactos, proporción 85/10/5 y
tabla de contraste medido).

## Cómo verlo

Abrir directo en el navegador:

```
file:///C:/Users/Eros/Negent%20Mind/os/brand/specimens/verdigris-copper.html
```

El botón **Claro / Oscuro** de la barra superior alterna el tema (atributo
`data-theme` + `aria-pressed`); claro es el tema por defecto. Las fuentes
(Chakra Petch / Inter / JetBrains Mono) cargan de Google Fonts; sin red cae al
fallback sans/mono del sistema.

## Tokens de referencia

| Rol | Claro | Oscuro |
|---|---|---|
| Fondo | `#F4F3EF` | `#141615` |
| Superficie elevada | `#EAEDE7` | `#1D211E` |
| Tinta | `#1C1E1D` | `#E6E8E6` |
| Texto secundario | `#5C665F` | `#A4AFA8` |
| Línea decorativa | `#C9D3CA` | `#35453C` |
| Estructura (verdigris) | `#2D5A4C` | `#4E8A77` |
| Atención marca | `#C85A32` | `#E07A55` |
| Atención funcional (acción/enlaces pequeños) | `#AC4928` | `#E07A55` |

Reglas de aplicación: verdigris = estructura (hairlines, marcadores, diagramas);
terracota = un solo punto de atención por pieza (punto del lockup, CTA, decisión
terminal). La terracota de marca no sirve para texto pequeño ni botones en claro
(contraste medido insuficiente); para eso está la variante funcional. En oscuro,
texto verde pequeño solo sobre el fondo base — en paneles elevados, tinta +
marcador verde. La tabla completa de ratios está dentro del especimen.

## Capturas

`out/` (ignorado por git): renders de verificación — light desktop 1440×1000,
dark desktop, mobile 390px y detalle marca/GitHub.

## Pendiente si se aprueba

Decisión de marca en Notion → actualizar `brand/brand-sheet.html`,
`brand/exports/*`, `media/remotion/src/tokens.ts` y, solo tras exportar,
`github-profile/` → `.github`. Este archivo no toca nada de eso.

Migración web (también futura y sujeta a aprobación): mapear los tokens a
`web/` (variables CSS de superficie/tinta/estructura/atención, colores
hardcodeados en componentes y paleta del shader/canvas del hero) y regenerar
las capturas EN/ES de la home. Nada de esto está hecho aquí.
