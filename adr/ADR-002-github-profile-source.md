# ADR-002 — Fuente de verdad del perfil de GitHub

**Estado:** aceptada · **Fecha:** 2026-11-20 · **Espejo de:** Notion · Registro de Decisiones

## Contexto

El perfil público de la organización existe en dos lugares: `os/github-profile/`
(dentro del monorepo privado) y el clon `Negent Mind/.github` (repo público que
GitHub renderiza). GitHub exige que el perfil viva en un repo llamado `.github`;
no lee `os/`.

## Decisión

`os/github-profile/` es la **fuente versionada**; `Negent Mind/.github` es su
**espejo publicado**. Se edita en `os/` y se sincroniza al espejo (el push lo
hace el fundador o un agente con orden explícita). No se edita el espejo a mano.

## Consecuencias

- La duplicación es deliberada, no accidental: el monorepo conserva la fuente
  junto a sus generadores (`brand/orbital/banner-final/` → `profile/`).
- Si en el futuro se decide trabajar `.github` directamente, `os/github-profile`
  puede retirarse — una sola fuente de verdad basta. Pendiente de decisión.
- Los assets del perfil se generan desde `brand/`; `github-profile/profile/`
  nunca contiene masters.
