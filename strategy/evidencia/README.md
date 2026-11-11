# Estrategia de negocio — Evidencia de sustento

> ⚠️ **Este NO es el documento de definición.** La definición maestra vive en
> [`../NEGENT-MIND.md`](../NEGENT-MIND.md).
>
> Aquí está la **evidencia** que sustenta esa definición: los datos de mercado,
> el análisis de competencia, el detalle del modelo de negocio y el método de
> diagnóstico. Son documentos de trabajo, no de definición.
>
> Si buscas "qué es Negent Mind y qué hace", lee `NEGENT-MIND.md`. Si buscas "por qué
> con estos números", estás en el lugar correcto.

**Estado:** evidencia recopilada, pendiente de validación con clientes.
**Última actualización:** 2026-09-28

---

## Tesis en una línea

> Negent Mind no es una empresa de inteligencia artificial: es la única empresa
> venezolana que convierte el **caos operativo** de una organización en un
> sistema en el que **se puede confiar**.

---

## Documentos

| # | Documento | Qué contiene |
|---|---|---|
| 01 | [`01-vision-y-tesis.md`](./01-vision-y-tesis.md) | La redefinición de la metáfora, la tesis y los 6 caos |
| 02 | [`02-evidencia-mercado.md`](./02-evidencia-mercado.md) | Datos duros: KPMG, ILIA, infraestructura, con fuentes |
| 03 | [`03-panorama-competitivo.md`](./03-panorama-competitivo.md) | Competencia real en Venezuela y la diferenciación |
| 04 | [`04-modelo-de-negocio.md`](./04-modelo-de-negocio.md) | 4 líneas de ingreso, precios, economía unitaria |
| 05 | [`05-metodo-diagnostico.md`](./05-metodo-diagnostico.md) | El instrumento: los 6 caos, diagnóstico y entregable |
| 06 | [`06-holones-redefinidos.md`](./06-holones-redefinidos.md) | Definición teórica de los 9 holones + VantaDB |
| 07 | [`07-audiencias-y-verticales.md`](./07-audiencias-y-verticales.md) | Sectores, audiencias y las 4 superficies de cada holón |
| 08 | [`08-polar-1000-empresas.md`](./08-polar-1000-empresas.md) | Programa Polar: investigación y estrategia de ingreso |
| 09 | [`09-roadmap-riesgos.md`](./09-roadmap-riesgos.md) | Plan de 12 meses, registro de riesgos, registro de decisiones |
| 10 | [`10-validacion-holones.md`](./10-validacion-holones.md) | Validación vs Azure + memoria agéntica |
| 11 | [`11-herramientas-y-stack.md`](./11-herramientas-y-stack.md) | Herramientas, stack, qué envolver |
| 12 | [`12-auditoria-skills.md`](./12-auditoria-skills.md) | Auditoría skills + 5 nuevas venta |
| 13 | [`13-flujos-y-plantillas.md`](./13-flujos-y-plantillas.md) | Funnel + plantillas |

---

## Reglas de este directorio

1. **Toda afirmación de mercado cita su fuente.** Si no está en
   `02-evidencia-mercado.md`, no se afirma.
2. **Los holones se definen por el caos que resuelven**, no por la tecnología
   que usan. Si un holón no tiene un caos asociado, no existe todavía.
3. **La metáfora "del caos al orden" es obligatoria pero insuficiente.** Todo
   documento debe decir *qué* caos y *a qué* orden.
4. **Honestidad de etapa.** Ningún documento afirma ingresos, clientes o
   tracción que no existan. Regla NegentMind: *"una idea entusiasma internamente, pero el
   mercado no responde"* es la señal de alarma a evitar.

---

## Estado real (leído, no supuesto)

| Dimensión | Estado | Evidencia |
|---|---|---|
| Producto técnico | 🟢 Existe | VantaDB v0.7.0 en producción, ACID, 5 bindings, MCP |
| Metodología | 🟢 Existe | Sistema de gates, ADRs, verify-log (100+ entradas) |
| Identidad de marca | 🟢 Congelada | Sistema completo con reglas duras y vetos |
| Tesis comercial | 🟢 Documentada | Este directorio |
| Mercado validado | 🟡 Con datos | KPMG/ILIA, no con clientes |
| **Clientes** | 🔴 **Ninguno** | — |
| **Ingresos** | 🔴 **Cero** | — |
| **Entidad legal** | 🔴 **No existe** | Decisión D5: "aplazar hasta entidad" |
| Holones implementados | 🔴 0 de 9 | Solo VantaDB (memoria) |

---

## Navegación por intención

- **Quiero vender esto mañana** → [`05`](./05-metodo-diagnostico.md) +
  [`04`](./04-modelo-de-negocio.md)
- **Quiero invertir o pitchar** → [`01`](./01-vision-y-tesis.md) +
  [`02`](./02-evidencia-mercado.md) + [`03`](./03-panorama-competitivo.md)
- **Quiero construir los holones** → [`06`](./06-holones-redefinidos.md) +
  [`07`](./07-audiencias-y-verticales.md)
- **Quiero entrar a Polar 1000 Empresas** → [`08`](./08-polar-1000-empresas.md)
- **Quiero saber qué hago primero** → [`09`](./09-roadmap-riesgos.md)

