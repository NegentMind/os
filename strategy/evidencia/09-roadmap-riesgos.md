# 09 — Roadmap, riesgos y decisiones

> Plan de 12 meses, registro de riesgos y bitácora de decisiones.
> Última actualización: **28 de septiembre de 2026**

---

## 1. Los tres bloqueos

Antes del roadmap, lo que realmente frena a Negent Mind. No son features.

| # | Bloqueo | Por qué bloquea | Depende de nadie |
|---|---|---|---|
| **B1** | **Ningún cliente** | Sin un Mapa de Caos real, todo el modelo es hipótesis. Regla NegentMind: hay que obtener evidencia, no entusiasmo | Se resuelve trabajando |
| **B2** | **No hay entidad legal** | Sin factura no hay B2B serio. La decisión D5 "aplazar hasta entidad" bloquea cualquier factura | Requiere decisión y papeleo |
| **B3** | **Colisión de marca** | Ya existe "Syntropy — AI Agent Governance Platform". Un cliente prospecto puede confundirnos | Se resuelve con investigación de marca |

**Todo lo demás es secundario frente a estos tres.**

---

## 2. Plan de 12 meses

### Fase 0 — Días 1 a 30: quitar bloqueos

| # | Tarea | Entregable | Bloquea |
|---|---|---|---|
| 0.1 | **Primer Diagnóstico real** (gratuito o barato) en una empresa conocida | Mapa de Caos documentado + foto de la entrega | B1 |
| 0.2 | Investigar la colisión de marca: qué ofrece syntropyai.app, quién está detrás | Informe de 1 página + recomendación de nombre | B3 |
| 0.3 | Definir la relación Negent Mind ↔ VantaDB (¿transferencia? ¿comercial conjunto?) | Decisión documentada en este directorio | B2, en parte |
| 0.4 | Escribir los 4 instrumentos de diagnóstico (ver `05`, sección 7) | Cuestionario, guion, planilla de impacto, plantilla de Mapa | 0.1 y siguientes |
| 0.5 | Registro en Polar 1.000 Empresas | Formulario enviado | Acceso a formación |

### Fase 1 — Meses 2 a 3: primer producto vendible

| # | Tarea | Criterio de éxito |
|---|---|---|
| 1.1 | Segundo y tercer Diagnóstico, **de pago** | 2 clientes que pagan USD 1.500+ |
| 1.2 | Cerrar la **entidad legal** | Poder emitir factura |
| 1.3 | Definir formalmente el primer holón (Cardinal) | RFC escrito con caos asociado y señal de validación |
| 1.4 | Completar los 9 módulos de Formación de Polar | Certificado Sello Polar |

### Fase 2 — Meses 4 a 6: primer holón en producción

| # | Tarea | Criterio de éxito |
|---|---|---|
| 2.1 | Construir Cardinal como capa sobre VantaDB | Cardinal respondiendo consultas de contexto reales |
| 2.2 | **Primer proyecto de implementación de pago** | USD 8.000+ facturados |
| 2.3 | **Primer contrato de suscripción** | USD 300+/mes recurrente |
| 2.4 | Publicar VantaDB en npm / PyPI / crates.io | Descargas reales de developers |

> El punto 2.3 es el más importante del plan. **Si no hay un cliente que pague
> un servicio recurrente, Negent Mind es una consultora, no una empresa.** Es la
> hipótesis que hay que probar más temprano.

### Fase 3 — Meses 7 a 12: probar la recurrencia

| # | Tarea | Criterio de éxito |
|---|---|---|
| 3.1 | 5 Diagnósticos adicionales | 13 Mapas de Caos acumulados |
| 3.2 | 3 implementaciones adicionales | 4 holones entregados a clientes reales |
| 3.3 | **5 suscripciones activas** | Ingreso recurrente probado y medido |
| 3.4 | Primera cohorte de Capacitación | 1 cohorte pagada, leads generados |
| 3.5 | Evaluar segundo holón según datos de los Mapas | Decisión basada en evidencia, no en intuición |

### Métrica de control

| Indicador | Objetivo mes 6 | Objetivo mes 12 |
|---|---|---|
| Suscripciones activas | 1 | 5 |
| Diagnósticos pagados | 2 | 13 |
| Holones en producción con cliente | 1 | 2 |
| Ingreso recurrente mensual | USD 300 | USD 3.000 |
| Ingreso total del periodo | ~USD 20.000 | ~USD 88.000 |

---

## 3. Registro de riesgos

Probabilidad e impacto en escala 1 a 5.

| # | Riesgo | P | I | Mitigación | Propietario |
|---|---|---|---|---|---|
| R1 | **Trampa de consultoría**: no escala, depende del fundador | 5 | 5 | Suscripción obligatoria desde el día 1. Si a mes 6 no hay 5 renewing, el modelo está roto y hay que pivotar | Fundador |
| R2 | **Nadie paga el Diagnóstico** | 3 | 5 | Probarlo en los primeros 30 días, con precio real, no gratis | Fundador |
| R3 | **No hay disposición a pagar suscripción** | 4 | 5 | Es el supuesto más frágil del modelo. Probarlo con el primer cliente de implementación | Fundador |
| R4 | **Colisión de marca** con syntropyai.app | 4 | 3 | Investigar en Fase 0. Si es grave, commercializar bajo VantaDB | Fundador |
| R5 | **Riesgo de cliente por contexto geopolítico** (OFAC, sector petrolero) | 3 | 4 | Evaluar cliente antes de firmar. El local-first reduce exposición — es argumento de venta | Fundador |
| R6 | **Falla eléctrica / conectividad** durante la implementación | 5 | 3 | Es el argumento de venta del producto, no un obstáculo. Pero afecta la operación interna | Fundador |
| R7 | **VantaDB bloqueado** por el `AGENTS.md` que prohíbe modificarlo desde Negent Mind | 4 | 4 | Decisión 2026-10-01: contribución upstream (issues/PRs al repo `ness-e`), sin fork ni modificación local. Si upstream rechaza repetidamente, se reabre con opción D (store propio) | Fundador |
| R8 | **No hay entidad legal** y llega un cliente que la exige | 4 | 3 | Cerrarla en Fase 1. Antes, vender como persona natural con factura simplificada si el volumen lo permite | Fundador |
| R9 | **El fundador se quema**: todo depende de una persona | 4 | 5 | El Diagnóstico como producto reduce dependencia de horas. Capacitación transfiere conocimiento | Fundador |
| R10 | **Polar resultara no ser el canal**: capital semilla no llega o no califica | 3 | 2 | La formación masiva es gratuita y útil igual. No apostar el plan solo a Polar | Fundador |

**Concentración de riesgo:** R1, R2, R3, R7, R9 son el mismo riesgo disfrazado
— **dependencia de una sola persona, sin ingresos recurrentes, con la
infraestructura bloqueada**. Si se resuelven esos cinco, Negent Mind tiene una
empresa. Si no, tiene un proyecto con buena documentación.

---

## 4. Registro de decisiones

Formato: fecha · contexto · decisión · alternativas descartadas · razón.

| Fecha | Decisión | Alternativas | Razón |
|---|---|---|---|
| 2026-09-28 | **"Del caos al orden" se reformula** a caos operativo → orden verificable | Mantener la metáfora original; otra metáfora | La original era infalsificable. No decía qué caos, ni a qué orden, ni era medible |
| 2026-09-28 | **El Diagnóstico es el producto de entrada**, no un servicio previo | Empezar por consultoría; empezar por software | El Diagnóstico genera caja inmediata, dato real de mercado y prueba de método, en 2 semanas |
| 2026-09-28 | **Sector para registro: Tecnología y software** | Servicios profesionales | Negent Mind es infraestructura. "Servicios profesionales" lo ubicaría en el terreno ya ocupado por 6 competidores |
| 2026-09-28 | **Etapa para registro: Solo es una idea** | Validando el producto; Primeras ventas | Es lo cierto. El programa acepta explícitamente ideas en papel. Declarar más contradice la disciplina que el programa mismo enseña |
| 2026-09-28 | **Prioridad de holones: Cardinal → Iris → Meta → Execute** | Fiel al ROADMAP original (Cardinal, Sage, Iris) | Meta sube a 3º porque es el diferenciador de marca. Sage baja a 5º porque aprender sobre contexto no confiable amplifica el error |
| 2026-09-28 | **Reverb y Reason se mantienen aplazados** | Empezar por Audio | Coherente con el ROADMAP original. El criterio de reactivación está escrito en `06` |
| 2026-09-28 | **Reescribir los 9 README de holón** con la definición de `06` | Dejarlos como están | Los 9 stubs idénticos comunican placeholder, no infraestructura seria. Es un costo de credibilidad alto |
| 2026-08-06 | **Open core: Apache-2.0 + `vantadb-pro` propietario** | Propietaria estricta; repo privado | Decisión heredada (ADR-013). Sigue vigente: el open core da distribución, el propietario da sostenibilidad |
| 2026-08-07 | **Pago aplazado hasta tener entidad** (D5) | Abrir entidad ahora | Se mantiene, pero se convierte en **tarea bloqueante** (B2) porque sin factura no hay B2B serio |
| 2026-08-07 | **Marca sin registrar por ahora** (D6) | Buscar y registrar | Se mantiene, pero la **colisión con syntropyai.app** obliga a revisitar esta decisión |
| 2026-10-01 | **Los holones poseen semántica propia; VantaDB es implementación de referencia de storage** | Declarar los holones features del sustrato | Un holón se define por ámbito, entregable y métrica, no por dónde persiste. Evita arquitectura rehén y deja escrito el test de independencia (3 preguntas en `negentropy/README.md`) |
| 2026-10-01 | **Relación Negent Mind ↔ VantaDB: contribución upstream (B)** | A contrato mínimo; C transferencia; D store propio | El límite de `AGENTS.md` se mantiene: la capacidad que falte viaja como issue/PR al repo `ness-e`, sin fork. Si upstream rechaza repetidamente, se reabre con D |

---

## 5. Qué haría el primer día, si solo pudiera hacer una cosa

**Producir un Mapa de Caos real.**

No escribir más documentación. No definir más holones. No investigar más
mercado. Un Mapa de Caos entregado a una empresa real resuelve de una vez:

| Pregunta | Cómo la responde |
|---|---|
| ¿El método funciona? | Se ve en el entregable |
| ¿Hay disposición a pagar? | Se pregunta y se observa |
| ¿Qué holón se vende primero? | Sale del hallazgo del cliente 1 |
| ¿Qué le digo al inversor? | Se lo enseño, no se lo describo |
| ¿Cuál es el primer cliente de la suscripción? | Está en la misma empresa |

Todo lo demás en esta carpeta es preparación. El Mapa de Caos es la
**validación**.

---

## 6. Métrica de honestidad del proyecto

Una sola pregunta, revisable en cualquier momento:

> ¿Cuántas empresas confían hoy en un sistema de Negent Mind, y cuántas pagan
> por mantenerlo?

Hoy: **0 y 0**. Todo el resto de los números de este directorio son
razonamiento documentado, no resultados. Esa distinción debe permanecer
explícita.

