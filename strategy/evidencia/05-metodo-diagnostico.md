# 05 — El método: los 6 caos y el Diagnóstico

> Este es el instrumento que se vende primero. Si el método no es repetible,
> el Diagnóstico no tiene precio fijo y el modelo de `04-modelo-de-negocio.md`
> se cae.

---

## 1. Por qué 5 y no más

No es un número de marketing. Es el mínimo que cubre el ciclo operativo de una
empresa sin solaparse:

| # | Caos | Pregunta que responde |
|---|---|---|
| 1 | **Contexto** | ¿Qué sabemos, cuándo y de quién? |
| 2 | **Percepción** | ¿Qué no podemos leer porque es imagen o papel? |
| 3 | **Ejecución** | ¿Qué se rompe y nadie repara? |
| 4 | **Aprendizaje** | ¿Qué repetimos porque nunca aprendimos? |
| 5 | **Confianza** | ¿Cómo verificamos que la IA dijo la verdad? |

Los 5 son **secuenciales**: no se puede confiar (5) en algo que no está en
contexto (1). No se puede ejecutar (3) sobre algo que no se puede leer (2). Y no
se puede aprender (4) de un sistema en el que no se confía (5).

**El orden de diagnóstico es el mismo orden de remediación.**

---

## 2. Qué se mide en cada caos

| Caos | Métricas del diagnóstico | Fuente de evidencia |
|---|---|---|
| **1. Contexto** | N° de sistemas donde vive el dato · % de datos con fecha y origen · tiempo medio para responder "¿cuándo supimos esto?" | Entrevista a dirección + recorrido por sistemas |
| **2. Percepción** | % de facturas, contratos y órdenes que hoy **no se pueden consultar** · volumen documental anual estimado | Muestra de 200 documentos reales |
| **3. Ejecución** | N° de automatizaciones activas · % de automatizaciones sin registro ni alerta · tiempo de recuperación ante fallo | Revisión de procesos y herramientas |
| **4. Aprendizaje** | % de correcciones que vuelven a la persona · tiempo de reaprendizaje por cambio de precio o norma | Registro de cambios y retrabajos |
| **5. Confianza** | Existe bitácora de decisiones automatizadas · % de decisiones sin responsable identificado · confianza declarada por el equipo | Revisión de_outputs y entrevistas |

---

## 3. Estructura del Diagnóstico (2 semanas)

| Fase | Días | Actividad | Entregable parcial |
|---|---|---|---|
| **F0. Alineación** | 1 – 2 | Reunión de arranque, mapa de procesos, accesos | Mapa de procesos validado |
| **F1. Contexto** | 3 – 5 | Inventario de sistemas, fechas, orígenes, responsiveness | Hallazgos de caos de contexto |
| **F2. Percepción** | 6 – 8 | Muestra documental, medición de ilegibilidad | Hallazgos de caos de percepción |
| **F3. Ejecución** | 9 – 11 | Revisión de automatizaciones, sin registro, sin alerta | Hallazgos de caos de ejecución |
| **F4. Aprendizaje** | 12 | Revisión de retrabajos y correcciones | Hallazgos de caos de aprendizaje |
| **F5. Confianza** | 13 | Revisión de decisiones automatizadas y bitácoras | Hallazgos de caos de confianza |
| **F6. Priorización** | 14 | Mapeo caos -> holón -> impacto económico | **Mapa de Caos priorizado** |
| **F7. Entrega** | 15 | Presentación a dirección | **Documento final + plan de 90 días** |

### Entregable: el Mapa de Caos

Estructura fija, una página por caos:

1. **Veredicto:** presente / parcial / ausente
2. **Evidencia:** las métricas medidas, con fuente
3. **Impacto económico estimado** (en USD, no en adjetivos)
4. **Holón que lo resuelve**
5. **Esfuerzo estimado** de remediación
6. **Qué pasa si no se hace nada** — la línea de tiempo de la pérdida

El punto 6 es el que cierra ventas. No es "el proceso es Manual". Es
"cada mes pierde X horas de su equipo, y en un año eso son Y".

---

## 4. Reglas del método

Se aplican al diagnóstico. Heredadas de la disciplina interna del proyecto
(gates, ADRs, verify-log), que es la ventaja de Negent Mind: **esto ya se hace
internamente con un estándar alto**.

| # | Regla | Origen |
|---|---|---|
| R1 | Toda afirmación lleva evidencia y fuente | verify-log |
| R2 | Se separa lo observado de lo inferido | ADR-light |
| R3 | Se registra la premisa antes de_optimizar | lección interna repetida |
| R4 | Se documenta el fallo con evidencia, no con opinión | auditoría de código |
| R5 | Un hallazgo sin impacto en USD no entra en el Mapa | disciplina de gates |
| R6 | Si el diagnóstico no encuentra caos, es un resultado. Se cobra igual | honestidad de etapa |

**R6 es la más importante.** Si el diagnóstico dice "el problema no es
tecnológico", esa es una conclusión válida y facturable. Una consultora que
solo sabe decir "sí hay un problema" no es una consultora: es una máquina de
facturar.

---

## 5. Qué NO hace el diagnóstico

| No hace | Razón |
|---|---|
| No vende software | Vendería la conclusión antes de entenderla |
| No promete plazos de implementación | El plazo depende del tamaño de la empresa |
| No diagnostica más de 5 dimensiones | Si todo es prioridad, nada lo es |
| No es gratuito de forma permanente | Un diagnóstico gratuito no se toma en serio, ni el cliente lo valora |
| No garantiza resultados | Garantizar sin historial es mentir |

---

## 6. El primer diagnóstico es un piloto con precio reducido

> **Resuelve la contradicción con la fila anterior.** El Diagnóstico siempre tiene
> precio. El **primero** se cobra a precio piloto —USD 400 en vez de USD 1.500–3.000—
> y se cobra **después** de entregar, no antes.

Por qué no gratis, por qué no precio completo:

| Precio | Qué produce |
|---|---|
| Gratis | Un favor. No obliga a nada y no se tasifica. Además atrae a quien no va a comprar |
| Precio completo | Silencio. El pyme de ≤100 empleados no tiene ese presupuesto antes de ver valor |
| **Piloto post-pago** | Says que sí es barato, y que tú también |

El piloto se documenta igual: mapa de caos completo, con fotografía de la entrega.
Ese artefacto vale más que cualquier presentación porque es el producto
funcionando, no prometido, y es la investigación de mercado que no se puede falsificar.

A partir del **segundo** diagnóstico, precio completo. Si el piloto no se paga, el
problema no es el precio: es que el hallazgo no era un hallazgo.

---

## 7. Instrumentos de arranque

Para ejecutar el primer diagnóstico hace falta:

| Instrumento | Estado | Nota |
|---|---|---|
| Cuestionario de las 5 dimensiones | **Pendiente** | Es lo primero que hay que escribir |
| Guion de entrevista a dirección | **Pendiente** | 6 preguntas por caos |
| Planilla de medición de impacto en USD | **Pendiente** | Sin esto, R5 no se cumple |
| Plantilla del Mapa de Caos | **Pendiente** | Formato fijo de 6 puntos |
| Corpus de calibración | **No aplica todavía** | Se construye con el primer mapa real |

**Los 4 pendientes son la ruta crítica de los próximos 30 días.** No son
documentación: son el producto.
