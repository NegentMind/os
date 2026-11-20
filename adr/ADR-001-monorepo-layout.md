# ADR-001 — Layout del monorepo `os/`

**Estado:** aceptada · **Fecha:** 2026-11-20 · **Espejo de:** Notion · Registro de Decisiones

## Contexto

`os/` es el monorepo privado de la organización. `media/` (fábrica de video) y
`social/` (hub MCP + automatización) vivían como áreas de primer nivel junto a
`brand/`, aunque funcionalmente son producción y distribución **de la marca**.

## Decisión

`media/` y `social/` pasan a `brand/media/` y `brand/social/`. `brand/` es la
casa de todo lo que produce y distribuye la identidad: assets, especímenes,
exports, video y tooling social.

## Consecuencias

- Toda ruta documentada se actualizó (`AGENTS.md`, `README`, `brand/README`,
  `web/DESIGN_SYSTEM`, `mcp-hub/README`).
- `brand/social/.env` (secretos) se movió intacto y sigue ignorado por git.
- `sync-env.ps1` resuelve `.env` por ruta relativa a sí mismo: sigue correcto.
- Regla de espejo sin cambios: solo `brand/exports/` y los artefactos de
  `banner-final/` salen hacia GitHub.
