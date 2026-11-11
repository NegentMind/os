# Validación de los holones contra la industria

> Investigación del 29 de septiembre de 2026. Fuentes primarias: Microsoft Azure
> Architecture Center, la encuesta *Memory in the Age of AI Agents* (arXiv 2512.13564,
> 2,4k estrellas, publicada en Hugging Face Daily Papers #1) y datos de producción de
> proyectos de IA empresarial.
>
> Pregunta que responde: **¿son correctos los nueve holones? ¿los nombres? ¿los enfoques?**

---

## 1. La taxonomía canónica

### 1.1 Componentes de un sistema agéntico

Azure Architecture Center lo reduce a cuatro:

| Componente | Holón de Negent Mind | Estado |
|---|---|---|
| Perception | Iris | ✅ |
| Reasoning | Reason | ✅ (aplazado) |
| Memory | VantaDB + Cardinal | ✅ |
| Action | Execute | ✅ |

**Los cuatro componentes canónicos están cubiertos.** No falta ninguno.

### 1.2 Los tres niveles de orquestación

Azure define un espectro de complejidad y **advierte explícitamente** de no saltar de
nivel sin justificación:

| Nivel | Cuándo | Holón |
|---|---|---|
| Llamada directa a un modelo | Una pasada, sin herramientas | — |
| **Un agente con herramientas** | *"Suele ser el valor por defecto en casos empresariales"* | Execute |
| Orquestación multiagente | Dominios cruzados, fronteras de seguridad distintas | Orchestra |

> Cita literal: *"Often the right default for enterprise use cases."*

Esto tiene una consecuencia directa: **Execute es el nivel por defecto, no la excepción.**
Un agente con herramientas auditadas cubre la mayoría de los casos de pago. La
orquestación multiagente solo se justifica cuando hay fronteras de seguridad reales o
dominios que no pueden mezclarse.

### 1.3 Los cinco patrones de orquestación

| Patrón | Qué hace | Holón de Negent Mind |
|---|---|---|
| Sequential | Pipeline determinista | — (lo cubre Iris → Cardinal) |
| Concurrent | Paralelo, fan-in | — |
| Group chat | Debate, maker-checker | Meta (el checker) |
| Handoff | Transferencia dinámica | Orchestra |
| **Magentic** | **Plan-construye-ejecuta con un registro de tareas** | **Plan** |

Azure describe magentic así: un agente manager que construye un *task ledger* y lo va
refinando. **Plan no es inventado: es el patrón magentic de Azure con nombre propio.**

---

## 2. La taxonomía de memoria

La encuesta separa la memoria en tres funciones, no en tres capas:

| Función | Qué guarda | Holón |
|---|---|---|
| **Factual** | Conocimiento | Cardinal |
| **Experiencial** | Perspectivas y habilidades | Sage |
| **Working** | Gestión del contexto activo | **Ausente** |

Y en tres dinámicas:

| Dinámica | Qué es | Holón |
|---|---|---|
| **Formation** | Extracción | Cardinal |
| **Evolution** | Consolidación y olvido | Sage |
| **Retrieval** | Estrategias de acceso | Cardinal |

> **Cardinal cubre Formation + Retrieval de memoria factual. Falta Working memory.**

Working memory no es "otra base de datos": es decidir **qué entra en la ventana de
contexto** en cada llamada. Azure lo advierte: *"In multiagent orchestrations, context
windows can grow rapidly... Monitor accumulated context size and use compaction
techniques."*

---

## 3. El hallazgo que cambia algo

### 3.1 Por qué fracasan los proyectos de IA en empresas

| Dato | Fuente |
|---|---|
| 88% de los pilotos nunca llegan a producción | Iris.ai, 2026 |
| 95% no producen impacto medible en P&L | MIT, *State of AI in Business 2025* |
| USD 547 mil millones de gasto sin resultado medible (2025) | Análisis industrial |
| 73% de los proyectos fallidos no tenían definición de éxito acordada | Institute of AI PM |
| Proyectos con métricas acordadas de antemano: **54%** de éxito vs **12%** sin ellas |íd. |
| 57% atribuyó el fallo a esperar demasiado, demasiado rápido | íd. |
| Soluciones de proveedor: **67%** de éxito vs **33%** de 내부 builds | íd. |
| 60% de los proyectos sin datos listos se abandonarán en 2026 | Gartner |

**Y la causa no es técnica.** Los tres problemas de fondo:

| Causa raíz | Holón que la cubre |
|---|---|
| 1. Brecha de preparación de datos | Cardinal + Iris ✅ |
| 2. Sin definición acordada de éxito | Meta parcial ⚠️ |
| 3. **Deuda de gestión del cambio** | **Ninguno** ❌ |

### 3.2 Lo que hacen los que sí llegan

Los 12% que sí llegan a producción, antes de escribir código:

1. Hacen un **pre-mortem**, no solo un plan
2. **Acotan a un flujo de trabajo** estrecho y repetitivo
3. Tienen un **responsable de producción nombrado** desde el día uno
4. **Miden comportamiento de usuarios**, no solo precisión del modelo
5. Definen **criterios de parada** explícitos

**Ninguno de los cinco es técnico. Los cinco son organizacionales.**

---

## 4. Dictamen

### 4.1 Los nombres: correctos

| Holón | Función | ¿El nombre funciona? |
|---|---|---|
| Cardinal | Orientación / contexto | ✅ *Cardinal* = esencial, fundamental. Correcto para un sustrato |
| Iris | Visión / percepción | ✅ Del griego; el iris del ojo |
| Meta | Confianza / metacognición | ✅ *Metacognición* es exactamente autoconmonitorar la propia confianza |
| Execute | Ejecución | ✅ Directo |
| Sage | Aprendizaje | ✅ *Sage* = el que sabe |
| Plan | Descomposición | ✅ Directo |
| Orchestra | Coordinación | ✅ Sin objeción |
| Reverb | Audio | ✅ Reverb es un efecto de audio real |
| Reason | Razonamiento | ✅ Directo |

**Ningún nombre necesita cambio.** Son memorables, en inglés, y no colisionan con nombres
de otras empresas de IA que haya encontrado.

### 4.2 Los ocho holones cognitivos: correctos

Ocho de nueve mapean 1:1 contra componentes canónicos. La correspondencia no es
arbitraria: es la descomposición que la propia industria usa.

### 4.3 Plan es el que se sale del molde — y está bien

Plan no es un componente de nivel superior en ninguna taxonomía. Es una función de la
orquestación. **Pero existe con nombre propio en Azure: el patrón magentic.**

Decisión: **mantenerlo, documentarlo como tal.** No es una pieza inventada, es una pieza
nombrada. Su README debe citar el patrón, no fingir que es un componente canónico.

### 4.4 El hueco real: gestión del cambio

**Este es el hallazgo que más importa.** El tercer tipo de fallo — y el más subestimado
— no tiene holón.

Hoy las cuatro "superficies" de cada holón incluyen la humana (interfaz, carga,
corrección), pero eso es una *superficie de entrega*, no una *capacidad*. La adopción no
es una capacidad que se construya; es un proceso que se gestiona.

Tres opciones, en orden de coste:

| Opción | Qué implica | Coste |
|---|---|---|
| **A. Ampliar Sage** | Sage pasa de "aprendizaje de máquina" a "adaptación": máquina *y* personas. La corrección humana entra como dato de primera clase | Bajo. Ningún repo nuevo |
| **B. Décimo holón** | Un holón de *Adopción* que entrega la gestión del cambio como artefacto facturable | Alto. Precio, definición, cliente |
| **C. No hacerlo** | Se sigue embracing la gestión del cambio dentro de la consultoría de diagnóstico | Cero. Y es la razón por la que el 88% fracasa |

**Recomendación: A.** La evidencia dice que la adopción es el problema. Ampliar Sage lo
trata sin crear un décimo holón que hoy nadie sabe vender. Y encaja con el criterio de
construcción: *se construye cuando un diagnóstico encuentra el caos.*

Si un diagnóstico encuentra que el cuello de botella es la resistencia al cambio, Sage
se activa. Si no, sigue siendo solo aprendizaje de máquina. El mecanismo ya existe.

### 4.5 Working memory: segundo hueco

Cardinal cubre memoria factual (formation + retrieval). Falta:
- **Working memory**: qué entra en la ventana de contexto en cada llamada
- **Consolidación y olvido**: qué se descarta, qué se compacta

Azure insiste en esto y los frameworks lo tratan mal. Pero es **problema de Cardinal**,
no un holón nuevo: es la función de retrieval con presupuesto de tokens. Se documenta
como requisito de Cardinal, no como pieza separada.

---

## 5. Qué NO cambia

| Elemento | Veredicto |
|---|---|
| Los nueve nombres | Correctos |
| Cardinal primero | Correcto: es prerrequisito de Iris, Meta y Sage |
| Meta tercero | Correcto: es el diferenciador vendible |
| Execute antes de Sage | Correcto: automatizar sin confianza acumula pasivos |
| Reverb y Reason aplazados | Correcto: no son el cuello de botella del cliente objetivo |
| Monorepo | Correcto mientras no se publique nada |
| VantaDB aparte | Correcto: se publica, entonces lleva repo propio |

---

## 6. Consecuencia para el negocio

El dato que más pesa del informe del Institute of AI PM:

> **Soluciones de proveedor: 67% de éxito. Interno: 33%.**

Negent Mind vende **implementación**, no una herramienta que el cliente tiene que operar
solo. Eso está en el lado correcto de la estadística, y es un argumento de venta que
todavía no está escrito en ninguna parte.

Es también la justificación de por qué el diagnóstico vale dinero: **el cliente no
necesita más IA, necesita que la IA que ya tiene llegue a producción.** El 88% de
fracaso no es un problema de modelo. Es un problema de adopción, datos y criterio de
éxito.

---

## 7. Fuentes

| Fuente | Qué aporta |
|---|---|
| Azure Architecture Center, *AI Agent Orchestration Patterns* (actualizado 2026-09-21) | 5 patrones, espectro de complejidad, gestión de contexto, recomendación de single-agent |
| Hu, Liu, Yue et al., *Memory in the Age of AI Agents*, arXiv 2512.13564 | Taxonomía de memoria: formas, funciones, dinámicas |
| MIT, *State of AI in Business 2025* | 95% sin impacto en P&L |
| Iris.ai, análisis empresarial 2026 | 88% nunca llega a producción |
| Institute of AI PM, mayo 2026 | Causas raíz, checklist de 10 puntos, qué hacen los que sí llegan |
| Gartner (citado por Institute of AI PM) | 60% sin datos listos se abandona |

Todas con fecha. Ninguna afirmación de este documento existe sin fuente verificable.
