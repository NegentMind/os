# Especimen — materia negra (exploración de marca)

**Estado:** exploración interna, **no publicada**. Composición representativa;
no es una migración de la web en vivo ni del perfil de GitHub. Es una
**previsualización**, no producción: nada de lo elegido aquí toca `web/`,
`github-profile/` ni `brand/exports/`.

## Qué es

`verdigris-copper.html` — página estática autocontenida (CSS + vanilla JS, sin
dependencias ni build) para evaluar un sistema de marca **black-first**:
superficies estratificadas sobre negro real, paletas estructura/atención,
tipografía editorial y **lettering de marca independiente**. Cuatro bloques:
**Web**, **Marca**, **GitHub** (mock ilustrativo, cromo neutro) y **Paleta**
(tokens exactos, clave de superficie, proporción 85/10/5 y contraste medido).

## Materia negra — filosofía

El negro no es un fondo: es materia. El espacio negativo #000 real separa los
contenidos sin bordes decorativos; cada región respira dentro de un volumen
continuo en lugar de apilarse sobre tarjetas iguales.

Las superficies son estratos físicos, no bordes: base, banda de sección,
tarjeta y panel elevado suben en luz como capas de un mismo material mate. La
jerarquía nace de la profundidad y el espaciado; las hairlines solo sellan.

El lettering es exclusivo: el logotipo no comparte la fuente de los titulares
ni depende de una OTF ajena. Es dibujo vectorial propio con punto de registro
único en atención — la firma que sobrevive a cualquier cambio tipográfico.

El acento es escaso por diseño: ~10 % estructura, ~5 % atención. La sobriedad
es la marca; la artesanía está en el espaciado óptico, no en ornamento,
gradientes, sombras ni ruido.

## Lettering original vs. referencias

Las tres familias (`#wm-*`/`#mn-*` como `<symbol>`+`<use>`,
stroke `currentColor` + punto `var(--logo-dot)`) son **bocetos vectoriales
originales para elegir dirección**: no son una fuente OTF de producción ni
una identidad registrada, no son Arcspoke, Fuigant ni Unflow, no trazan las
imágenes de referencia y no usan sus archivos de fuente. Referencias de
dirección (fuentes comerciales **no incluidas**):

- **Arcspoke** — Build Interactive · elements.envato.com/es/arcspoke-geometric-ai-robotics-sans-font-K5JH36T
- **Fuigant** — Imoodev · elements.envato.com/es/fuigant-clean-futuristic-font-NXMFYQK
- **Unflow** — Sunday Lab · elements.envato.com/es/unflow-typeface-Z34UE3Y

Recomendación editorial del especimen: Orbital o Corte para el laboratorio;
Flujo como línea experimental.

## Controles

Barra superior (sticky en escritorio, estática en móvil):

- **Claro / Oscuro** — el tema claro existe solo como prueba comparativa;
  el sistema es oscuro por defecto.
- **«Paleta, logo y fuentes»** (panel `<details>`):
  - **Paleta** — Carbón y plata · Negro y liquen · Negro y hielo ·
    Negro y ámbar (los cuatro con fondo oscuro #000).
  - **Logo y banner** — Orbital — geométrico · Corte — industrial ·
    Flujo — orgánico. **Independiente** de títulos y texto: cambiar la
    fuente nunca deforma el lettering.
  - **Títulos** — Manrope · Sora · Space Grotesk · IBM Plex Sans ·
    Chakra Petch (referencia).
  - **Texto** — Source Sans 3 · DM Sans · IBM Plex Sans · Inter (referencia).
  - **Restablecer** — oscuro · Carbón y plata · Orbital · Manrope +
    Source Sans 3.
- Resumen siempre visible (logo · paleta · títulos + texto · modo),
  `aria-live="polite"`.

La galería de Marca muestra las tres direcciones a la vez, con descripción y
botón «Usar» sincronizado con el select. Las fichas clara/oscura y los avatares
muestran la familia activa en ambos temas simultáneamente.

### Persistencia

`localStorage` clave `nm-specimen-v3` (cambio de clave deliberado: el estado v2
con paletas tierra/brand acoplado no se restaura). `try/catch` + whitelist de
IDs; storage bloqueado o malformado no rompe nada.

## Arquitectura de tokens

11 tokens por tema (`bg, section, surface, raised, ink, muted, line, structure,
attention, action, on-action`; `--link` = `action`), expuestos como
`--light-*`/`--dark-*` con alias semánticos por `data-theme`. Roles físicos:
`--bg` fondo · `--section` banda (Marca/Paleta) · `--surface` tarjeta ·
`--raised` panel (VantaDB, diagrama, contraste); el banner seleccionado usa
`--bg` para mostrar el lettering sobre un campo negro.
La clave de superficie de la sección Paleta renderiza los 4 niveles con su hex
real del preset activo. Tablas de paleta y contraste generadas por JS
(`createElement`/`textContent`) con datos congelados — ratios precalculados
para estos presets, no recomputados; 4.5:1 AA es guía de pares, no auditoría.

## Cómo verlo

```
file:///C:/Users/Eros/Negent%20Mind/os/brand/specimens/verdigris-copper.html
```

## Capturas

`out/` (ignorado por git): renders de verificación — escritorio/móvil, las tres
direcciones de lettering, superficies por paleta, tema claro comparativo.

## Pendiente si se aprueba

Decisión de marca en Notion → actualizar `brand/brand-sheet.html`,
`brand/exports/*`, `media/remotion/src/tokens.ts` y, solo tras exportar,
`github-profile/` → `.github`. Este archivo no toca nada de eso.

Migración web (también futura y sujeta a aprobación): mapear los tokens a
`web/` (variables CSS, colores hardcodeados de componentes, paleta del
shader/canvas del hero) y regenerar las capturas EN/ES. Nada de esto está
hecho aquí.
