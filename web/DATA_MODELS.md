# DATA_MODELS.md — tipos y contratos

> **Estado:** la antigua superficie de producto (`/login`, `/app`, Supabase
> Auth) fue **retirada del paquete** (2026-11). Si vuelve un producto con
> backend (p. ej. VantaDB Studio), este documento se reescribe con sus
> contratos. Lo que sigue describe los tipos vivos del sitio marketing.

## Fuente de verdad

No hay backend ni base de datos: el sitio es estático/SSR de marketing.
Los contratos vivos son de contenido:

- `lib/content/{en,es}.ts` — copy bilingüe; `SiteCopy = typeof en` fuerza la
  paridad de forma ES↔EN en typecheck.
- `lib/marketing-types.ts` — contratos compartidos (`NavCopy`,
  `ProjectState`, `HalftoneKind` para la biblioteca `nm/v1`, etc.).
- `lib/site-routes.ts` — `PageId`, `PUBLIC_PAGES`, `hrefFor(lang, page)`.
- `lib/i18n/` — `LOCALES`, `isLocale`, `Locale`; `Dict` solo como tipo de la
  biblioteca `nm/v1` (su contenido está retirado).

## Reglas

- Sin `any` en tipos de datos.
- URLs externas solo en `lib/site.ts`; copy solo en `lib/content/`.
- Estados honestos: `ProjectState` ("active" | "incubation" | "vision") se
  escribe, no se infiere de color ni de decoración.
