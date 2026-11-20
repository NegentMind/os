# ADR-003 — Retiro formal de la generación V1 (web)

**Estado:** aceptada · **Fecha:** 2026-11-20

## Contexto

La web pasó por dos generaciones: V1 (Void/Bone/Pulse, Chakra Petch, producto
con Supabase) y V2 Orbital (carbón/plata, Orbital Display, solo marketing). La
transición dejó restos conviviendo: `components/nm/v1/` (24 archivos),
`hooks/`, el diccionario `lib/i18n/en.ts` y `globals.css`, sin ruta viva pero
dentro del grafo de componentes.

## Decisión

Retiro formal sin borrado: todo lo V1 se mueve a `web/_archive/` (componentes,
hooks, diccionario), fuera de `components/` y del bundle mental de producción.
El tipo `Dict` se sigue importando desde el archivo archivado para que la
biblioteca siga compilando. La superficie de producto (`/login`, `/app`,
Supabase, `APP_ENABLED`) se eliminó por completo — el historial git la preserva.

## Consecuencias

- `components/` contiene solo lo vivo: `nm/v2/` (producción), `nm/ext/`
  (adaptadas, consumidas por la galería dev), `ui/` (shadcn).
- La identidad V1 de marca (Remotion stills, perfil ya publicado) sigue
  congelada por otra razón: es material publicado, no código web.
- Regla para futuras generaciones: la retirada es un movimiento a `_archive/`
  con actualización de inventario, nunca coexistencia silenciosa.
