# 06 — Holones redefinidos

> Cada holón se define por **el caos que resuelve**, no por la tecnología que
> usa. Si un holón no tiene un caos asociado, no existe todavía.
>
> Marco: holón (Koestler, 1967) — *autonomía local + integración al todo*.

---

## 0. Mapa completo

| Holón | Función | Caos que resuelve | Estado | Orden |
|---|---|---|---|---|
| **VantaDB** | Memory | Sustrato de todos | 🟢 v0.7.0 en producción | 0 |
| **Cardinal** | Orientation | 1 · Contexto | 🔵 Definido | 1º |
| **Iris** | Vision | 2 · Percepción | 🔵 Definido | 2º |
| **Meta** | Metacognition | 5 · Confianza | 🔵 Definido | 3º |
| **Execute** | Execution | 3 · Ejecución | 🔵 Definido | 4º |
| **Sage** | Learning | 4 · Aprendizaje | 🔵 Definido | 5º |
| **Plan** | Planning | Transversal | 🔵 Definido | 6º |
| **Orchestra** | Coordination | Runtime | 🔵 Definido | soporte |
| **Reverb** | Audio | Fuera de alcance | ⚪ Aplazado | — |
| **Reason** | Reasoning | Fuera de alcance | ⚪ Aplazado | — |

**Comunicación: descartada.** Cubierta por los LLMs. Se mantiene la decisión del
ROADMAP original.

---

## 1. VantaDB — Memory (construido)

| Campo | Detalle |
|---|---|
| **Qué es** | Base de datos con ACID, MVCC, WAL e índices HNSW / IVF / SCANN |
| **Bindings** | Rust, Python, TypeScript/WASM, Node (napi), MCP server |
| **Estado** | v0.7.0 en producción |
| **Rol en Negent Mind** | **Implementación de referencia de memoria.** Los holones usan VantaDB como backend de referencia; ninguno depende de features nuevos de él. Materializa local-first hoy |

**Por qué el sustrato importa más que el holón:** con 8 centros de datos en el
país, cero capacidad de cómputo de alto rendimiento (ILIA) y 18% de empresas
reportando impacto alto de licencias OFAC, cualquier sistema que dependa de
nubes de EE.UU. tiene un problema de riesgo. VantaDB es lo que permite prometer
soberanía sin ser dogmático.

**Sustrato vs holón (test de independencia, 2026-10-01):** un holón se define por
su ámbito, su entregable y su métrica — no por dónde persiste. Cardinal posee la
semántica episódica; VantaDB es su implementación de referencia, no su identidad.
Los logs de Meta/Execute/Plan/Sage son entregables de esos holones; su almacén es
reemplazable. Ninguno de los nueve exige features nuevos a VantaDB.

**Acción pendiente (R7, decisión 2026-10-01):** la relación Negent Mind ↔ `ness-e/Vantadb` se resuelve por **contribución upstream (opción B)**: Negent Mind envía issues/PRs al repo cuando un holón necesite una capacidad que no exista, sin fork y sin modificar desde aquí. El límite de `AGENTS.md` (no modificar VantaDB desde este workspace) se mantiene intacto; la contribución viaja por el canal del propio repo. Si upstream rechazara repetidamente capacidades necesarias, se reabre la decisión con la opción D (store propio).

---

## 2. Cardinal — Orientation (1º a construir)

### Caos que resuelve
**La empresa no sabe qué sabe, ni cuándo lo supo, ni de quién lo supo.**

### Teoría
Todo hecho tiene tres atributos que lo hacen verificable: **posición** (dónde
vive), **tiempo** (cuándo era cierto) y **procedencia** (quién lo afirmó).
Sin los tres, la información se puede leer pero no se puede confiar. Y sin
confianza no hay orden posible.

Cardinal es el holón que convierte datos en **contexto consultable**.

### Qué produce
- Índice gobernado del conocimiento organizacional con metadatos
  espacio-temporales
- Capacidad de responder "¿cuándo supimos esto?" y "¿de dónde salió?"
- Base sobre la que los otros holones escriben y leen

### Por qué es el primero
- Es **prerrequisito** de todos los demás. Sin contexto, Meta no tiene nada que
  calibrar y Execute no tiene nada sobre lo que operar.
- Es el **más barato** de construir: VantaDB ya tiene aristas temporales,
  namespaces, recuperación híbrida y MCP.
- Su valor es el más fácil de **medir**: tiempo de respuesta a preguntas de
  contexto.

### Señal de validación
> "Cuando el director pregunta algo, ¿cuánto tarda la empresa en dar una
> respuesta con fuente y fecha?"

### Superficie
| developmental | agentes | humana | empresa |
|---|---|---|---|
| API + SDK + MCP | herramienta de consulta | interfaz de consulta | auditoría de procedencia |

---

## 3. Iris — Vision (2º a construir)

### Caos que resuelve
**Facturas, contratos, formularios y catálogos son imágenes que nadie puede
consultar.**

### Teoría
No se puede razonar sobre lo que no se puede ver. En un entorno donde el
sustrato documental es mayoritariamente papel o imagen sin capa de datos,
la percepción es el primer bloqueo real. **Percepción precede a razonamiento.**

### Qué produce
- OCR y comprensión documental → registros estructurados con procedencia
- Los registros alimentan directamente a Cardinal (posición, tiempo, origen)

### Orden interno de construcción
| Fase | Alcance | Por qué primero |
|---|---|---|
| 1 | **OCR de facturas y órdenes** | Volumen alto, dolor evidente, ROI medible en horas |
| 2 | Extracción estructurada (campos clave) | Convierte lectura en dato usable |
| 3 | Diagramas y planos | Sector construcción e ingeniería |
| 4 | Interfaces de usuario (screenshots, flujos) | El más avanzado, el menos urgente |

### Señal de validación
> "¿Qué porcentaje de los documentos de la empresa se puede consultar hoy?"

### Superficie
| developmental | agentes | humana | empresa |
|---|---|---|---|
| API de ingesta + MCP | extracción de documento | carga y corrección | cola de revisión y SLA |

---

## 4. Meta — Metacognition (3º a construir · diferenciador de marca)

### Caos que resuelve
**Nadie puede verificar si la IA dijo la verdad.**

### Teoría
Un sistema que no expresa incertidumbre no puede recibir dinero. Con 263,4% de
inflación proyectada, 54% de carga tributaria como dolor principal y 18% de
impacto alto de licencias OFAC, **una respuesta automatizada equivocada tiene
consecuencia financiera y legal directa**.

Meta es el holón que convierte "la IA dijo" en "hay evidencia de que la IA dijo,
y con qué confianza".

### Qué produce
- Calibración de confianza por respuesta
- Bitácora de decisiones: fuente, versión del modelo, entrada, salida
- Escalamiento a humano cuando la confianza baja del umbral
- Explicación de por qué el sistema dijo lo que dijo

### Por qué es el diferenciador
La competencia vende **capacidad**: modelos, chatbots, RAG. **Nadie vende
confiabilidad.** Este holón es el que sostiene la frase central de Negent Mind.

| Competidor | Promete | Negent Mind promete |
|---|---|---|
| "Te hago un chatbot" | Que responda | Que puedas probar qué respondió y con qué respaldo |

### Señal de validación
> "Cuando el sistema da una respuesta, ¿alguien puede demostrar de dónde salió?"

### Superficie
| desarrollador | agentes | humana | empresa |
|---|---|---|---|
| API de auditoría + MCP | confianza por respuesta | explicación trazable |panel de cumplimiento, registro legal, SLA |

---

## 5. Execute — Execution (4º a construir)

### Caos que resuelve
**La automatización se rompe y nadie sabe por qué ni la repara.**

### Teoría
Automatización sin observabilidad es un pasivo, no un activo. Con 46% de
empresas reportando fallas en servicios públicos (+13%, el mayor alza del año),
un sistema que falla en silencio es peor que un sistema que no existe.

### Qué produce
- Capa de ejecución de acciones y herramientas
- Registro completo de cada acción: quién, cuándo, con qué entrada y salida
- Reproducción y reversión
- Alertas de fallo con causa

### Nota de relación con MCP
La ejecución de herramientas en el mundo de agentes **es** MCP. Execute es donde
el concepto de holón se cruza con el ecosistema MCP ya estandarizado. No se
compite con MCP: se es un consumidor disciplinado de él, con la capa de
auditoría que MCP no trae.

### Señal de validación
> "Cuando una automatización falla, ¿cuánto tardan en enterarse y en repararla?"

### Superficie
| desarrollador | agentes | humana | empresa |
|---|---|---|---|
| SDK de herramientas + MCP | invocación con trazabilidad | panel de acciones | registro de auditoría y cumplimiento |

---

## 6. Sage — Learning (5º a construir)

### Caos que resuelve
**El sistema no aprende de las correcciones propias. Se re-enseña todo cada vez.**

### Teoría
La adaptación útil es **por organización**, no global. Un modelo afinado para
una empresa que vendeibbean subsidiary no sirve para otra. El aprendizaje que
importa es el que se queda dentro de la organización y no se va a un proveedor
externo.

### Qué produce
- Captura de correcciones como datos de entrenamiento propios
- Adaptación local por dominio y por cliente
- Aislamiento: el aprendizaje de un cliente no contamina a otro

### Por qué va quinto
Aprender sobre contexto no confiable **amplifica** el error en lugar de
corregirlo. Sage necesita a Cardinal e Iris funcionando primero.

### Señal de validación
> "¿Cuántas veces hay que re-enseñar lo mismo porque el sistema olvidó una
> corrección anterior?"

### Superficie
| desarrollador | agentes | humana | empresa |
|---|---|---|---|
| API de feedback + MCP | corrección en línea | etiquetado | aislamiento por cliente y cumplimiento de datos |

---

## 7. Plan — Planning (6º a construir)

### Caos que resuelve
**Transversal: nadie descompone el trabajo, y todos hacen todo.**

### Teoría
La descomposición de tareas en pasos ejecutables y verificables es lo que
convierte una intención en un plan verificable. Sin Plan, Execute ejecuta
cosas sin orden y Meta no tiene contra qué comparar.

### Qué produce
- Descomposición de objetivo en pasos con criterio de aceptación
- Dependencias, orden, verificación
- Registro de qué se hizo y por qué

### Por qué es menos diferenciador
Todo framework de agentes ya hace esto. Negent Mind no compite ahí; lo usa. Se
construye cuando Execute y Meta estén operativos, porque su valor es
complementario, no propio.

### Superficie
| desarrollador | agentes | humana | empresa |
|---|---|---|---|
| API de planes + MCP | generar y seguir plan | vista de plan | plantillas por proceso |

---

## 8. Orchestra — Coordination (soporte, no cognitivo)

### Qué es
No es un holón cognitivo. Es el **runtime** que hace que los otros cooperen:
propagación de contexto, política común, salud del sistema, ciclo de vida.

### Por qué está aquí y no es holón
Un holón es "un todo en su ámbito y parte de un todo mayor". Orchestra no tiene
ámbito cognitivo propio: coordina. Por eso la clasificación del ROADMAP lo
puso aparte, y esa decisión sigue siendo correcta.

### Cuándo se construye
Cuando haya **dos o más holones vivos**. Antes es especulación.

### Superficie
| desarrollador | agentes | humana | empresa |
|---|---|---|---|
| API de orquestación + MCP | coordinación de holones | estado del sistema | topología, políticas, aislamiento |

---

## 9. Holones aplazados

### Reverb — Audio

Aplazado, como en el ROADMAP original. Razonamiento honesto: la voz es
importante, pero no es el cuello de botella del cliente objetivo. Una pyme
venezolana con 24% de su fiscal sin automatizar no pierde dinero por no
transcribir llamadas. Se mantiene la decisión.

**Condición de reactivación:** cuando el diagnóstico detecte caos de
percepción dominado por audio, o cuando entre un cliente con caso de uso claro.

### Reason — Reasoning

Aplazado. El razonamiento neuro-simbólico es un salto de nivel que hoy no
aporta al problema del cliente. Cardinal + Meta cubren el 80% del valor.

**Condición de reactivación:** cuando Meta necesite symbolically grounds y los
diagnósticos muestren que el cuello ya no es confianza sino inferencia.

---

## 10. Criterio de existencia

> Si un holón no se puede mapear a un caos diagnosticado en una empresa real,
> no se construye.

Este criterio es la diferencia entre Negent Mind y un roadmap de promises. Los
9 repos actuales sin código son el ejemplo de lo que pasa sin este criterio.

**Acción concreta:** los 9 README de holón deben reescribirse con la definición
de este documento, y añadir un campo `caos_asociado` y `senal_de_validacion`.
