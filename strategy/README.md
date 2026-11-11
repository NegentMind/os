# Negent Mind — Estrategia

> Definición y evidencia de la tesis de negocio de NegentMind.
>
> **Punto de entrada:** [`NEGENT-MIND.md`](./NEGENT-MIND.md) — definición maestra.
> Si buscas "qué es Negent Mind y qué hace", empieza ahí. Si buscas "por qué con
> estos números", está en [`evidencia/`](./evidencia/).

**Estado:** definición cerrada, evidencia recopilada, pendiente de validación
con clientes. **Última actualización:** 2026-11-11

---

## Por qué este repositorio existe

NegentMind es una organización pública. Su repositorio `.github` contiene lo que
cualquiera debe ver: manifiesto, roadmap, perfil, gobernanza.

Eso **no puede** incluir la definición comercial, los precios, el análisis de
competencia ni el registro de riesgos. No porque sean secretos, sino porque
mezclar "esto es lo que creemos" con "esto es lo que sabemos del mercado"
degrade ambas cosas.

Este repositorio separa las dos. Es privado.

---

## Contenido

| Documento | Qué contiene |
|---|---|
| **[`NEGENT-MIND.md`](./NEGENT-MIND.md)** | Definición maestra: qué es, modelo de negocio, arquitectura, holones, audiencias, procesos, orden de construcción, comparación de mercado |
| [`evidencia/`](./evidencia/) | 15 documentos que sustentan la definición |

### Evidencia

| # | Documento | Qué contiene |
|---|---|---|
| 01 | [Visión y tesis](evidencia/01-vision-y-tesis.md) | La redefinición de la metáfora, la tesis y los 6 caos |
| 02 | [Evidencia de mercado](evidencia/02-evidencia-mercado.md) | KPMG, ILIA, infraestructura — con fuentes y límites |
| 03 | [Panorama competitivo](evidencia/03-panorama-competitivo.md) | Los competidores en Venezuela y el hueco de confiabilidad |
| 04 | [Modelo de negocio](evidencia/04-modelo-de-negocio.md) | Los mecanismos de ingreso, precios, economía unitaria |
| 05 | [Método de diagnóstico](evidencia/05-metodo-diagnostico.md) | Los 6 caos, las 8 fases, el entregable |
| 06 | [Holones redefinidos](evidencia/06-holones-redefinidos.md) | Definición teórica de los 9 holones + VantaDB |
| 07 | [Audiencias y verticales](evidencia/07-audiencias-y-verticales.md) | Sectores, audiencias, las 4 superficies de cada holón |
| 08 | [Polar 1000 Empresas](evidencia/08-polar-1000-empresas.md) | Investigación del programa y estrategia de ingreso |
| 09 | [Roadmap y riesgos](evidencia/09-roadmap-riesgos.md) | Plan de 12 meses, registro de riesgos y decisiones |
| 10 | [Validación holones](evidencia/10-validacion-holones.md) | Holones vs Azure + memoria agéntica + huecos |
| 11 | [Herramientas y stack](evidencia/11-herramientas-y-stack.md) | Qué se envuelve, qué se evita, stack |
| 12 | [Auditoría skills](evidencia/12-auditoria-skills.md) | 187→230 skills auditadas, huecos venta |
| 13 | [Flujos y plantillas](evidencia/13-flujos-y-plantillas.md) | Funnel + plantillas contacto |
| 14 | [Marca 1 página](evidencia/14-marca-1-pagina.md) | Colisión de marca Syntropy, dominios |
| 15 | [Rebrand y comunidad 2026-11-11](evidencia/15-rebrand-comunidad-2026-11-11.md) | Identidad v1, comunidad, automatización social, stack web |

---

## Reglas de este repositorio

1. **Toda afirmación de mercado cita su fuente.** Si no está en
   `evidencia/02`, no se afirma.
2. **Los holones se definen por el problema que resuelven**, no por la
   tecnología que usan.
3. **Honestidad de etapa.** Ningún documento afirma ingresos, clientes ni
   tracción que no existan.
4. **Si algo contradice `NEGENT-MIND.md`, la definición maestra gana.** La
   evidencia se actualiza para coincidir, no al revés.

---

## Estructura del workspace

Este repositorio corresponde a `C:\Users\Eros\Negent Mind\strategy\`.

| Ruta del workspace | Qué es | Dónde vive |
|---|---|---|
| `strategy/` | Este repo — definición y evidencia | `NegentMind/strategy` (privado) |
| `.github/` | Casa de la marca y gobernanza pública | `NegentMind/.github` (público) |
| `brand/` | Marca: brand, remotion, tokens | Local, gitignored por decisión |
| `negentmind/` | Monorepo de los 9 holones | `NegentMind/negentmind` (público) |
| `.opencode/` | Sistema de ingeniería de **VantaDB** | Local, no es de Negent Mind |
| `web/` | Reservado para el sitio | Vacío |

**Nota:** `.opencode/` en la raíz contiene el task-system, los agentes y las
skills del proyecto VantaDB. No pertenece a Negent Mind y no se versiona aquí.

---

## Licencia

Documentación interna de la organización. Apache 2.0 donde aplique.
