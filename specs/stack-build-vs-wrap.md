# Herramientas, frameworks y MCP — qué existe y qué sirve

> **Estado: evidencia histórica previa a la decisión del 16-11-2026 (estrategia en Notion).**
> Las decisiones de esta página no son vigentes; los holones son visión, no productos.

> Investigación del 29 de septiembre de 2026. Datos de la API de GitHub en la fecha:
> estrellas, licencia, lenguaje y fecha del último push. Nada de esto es humo de
> marketing: es lo que los repositorios dicen de sí mismos.

---

## 1. Principio de selección

Negent Mind no compite en capacidad. Compite en **verificabilidad y soberanía**. Eso
descarta herramientas por dos criterios, antes de mirar la función:

| Criterio | Por qué | Rechaza a |
|---|---|---|
| **Licencia abierta y auditable** | El cliente tiene que poder leer lo que corre sobre sus datos | AGPL encerrado, SaaS sin self-host |
| **Self-hosted o local** | Un pyme venezolano no puede depender de una API en el extranjero que se cae o le cambia el precio | SaaS únicamente cloud |

Con esos dos filtros, la lista se acorta sola.

---

## 2. Observabilidad y evaluación — el corazón de Meta

Meta es el diferenciador: es la capacidad que convierte *la IA dijo* en *hay prueba de
que lo dijo*. No existe "una herramienta de confianza". Lo que existe son plataformas de
**trazabilidad y evaluación**, y Meta es la capa que las convierte en evidencia
auditable.

| Herramienta | Estrellas | Licencia | Lenguaje | Último push |
|---|---|---|---|---|
| [`langfuse/langfuse`](https://github.com/langfuse/langfuse) | 35,164 | MIT core | TypeScript | 2026-09-29 |
| [`Arize-ai/phoenix`](https://github.com/Arize-ai/phoenix) | 11,644 | Apache-2.0 | Python | 2026-09-29 |
| [`braintrustdata/braintrust`](https://github.com/braintrustdata/braintrust) | — | SaaS | — | solo cloud |
| [`langchain-ai/langgraph`](https://github.com/langchain-ai/langgraph) | 42,435 | MIT | Python | 2026-09-29 |

**Veredicto: Langfuse autoalojado es la base de Meta.**

- 35k estrellas, se empuja a diario, es self-hosted de verdad.
- Traza cada llamada de agente: qué modelo, qué prompt, qué herramienta, qué salida.
- Tiene *scoring* en línea, que es exactamente lo que Meta necesita: no "¿el modelo
  acertó?" sino "¿la confianza declarada era correcta?".

**Contra LangSmith, Langfuse, Arize Phoenix, Braintrust, Maxim, Galileo, Helicone** — hay
siete comparativas públicas que los ponen en la misma tabla. Todas coinciden en lo
relevante: **Langfuse gana en sovereignty** porque los demás son SaaS atado a su nube.

> **Esto no significa construir un clon de Langfuse.** Significa que Meta **envuelve** a
> Langfuse y añade lo que él no tiene: bitácora de decisiones con secuencia legal,
> umbral de escalamiento a humano, y el formato de prueba que un auditor Asking fizz en
> Venezuela entendería.

---

## 3. Memoria — el sustrato de Cardinal

Cardinal es memoria factual con posición, tiempo y procedencia. Hay tres libraries
reales que compiten ahí:

| Herramienta | Estrellas | Licencia | Qué es |
|---|---|---|---|
| [`mem0ai/mem0`](https://github.com/mem0ai/mem0) | 66,256 | Apache-2.0 | Extracción y consolidación de memoria |
| [`getzep/zep`](https://github.com/getzep/zep) | 4,939 | Apache-2.0 | **Grafo de conocimiento temporal** |
| [`letta-ai/letta`](https://github.com/letta-ai/letta) | 24,962 | Apache-2.0 | Memoria como estado de agente |

**Zep es el más cercano a lo que Cardinal promises.** Es un grafo temporal: sabe cuándo
algo fue cierto y cuándo dejó de serlo. Eso es literalmente la definición de Cardinal
(*posición, tiempo, procedencia*).

Mem0 tiene 13× más estrellas y es más simple, pero pierde el eje temporal. **Para un
holón cuyo argumento de venta es "cuándo supimos esto", perder el eje temporal es
perder el producto.**

> **Cardinal no debería reinventar el grafo temporal.** Debería ser una capa de
> gobernanza sobre VantaDB que ya habla SQL e índices vectoriales, tomando de Zep el
> modelo de versión temporal y la Lesson: **GraphQL temporal → índices bitemporales en
> VantaDB**, que es donde el moat está.

---

## 4. MCP — el contrato de las superficies

La regla de Negent Mind: *todo lo que se le hace al cliente tiene que existir como API*.
MCP es como un holón se vuelve invocable por un agente sin que nadie escriba un cliente.

### Servidores de referencia oficiales

[`modelcontextprotocol/servers`](https://github.com/modelcontextprotocol/servers) — 90,651
estrellas, empujado hoy:

| Servidor | Para qué lo necesita Negent Mind |
|---|---|
| `filesystem` | Iris: leer el archivo del cliente |
| `git` | Cardinals de cliente que viven en git |
| `memory` | Referencia para Cardinal |
| `sequentialthinking` | Referencia para Plan |
| `fetch` | Recepción de documentos por URL |
| `time` | El eje temporal de Cardinal |
| `everything` | Servidor de prueba |

### SDKs

| SDK | Estrellas | Licencia |
|---|---|---|
| [`python-sdk`](https://github.com/modelcontextprotocol/python-sdk) | 24,427 | MIT |
| [`typescript-sdk`](https://github.com/modelcontextprotocol/typescript-sdk) | 13,485 | MIT |
| [`registry`](https://github.com/modelcontextprotocol/registry) | 7,297 | catálogo oficial |

**Decisión:** MCP server por holón, SDK de Python para Cardinal (el stack de VantaDB es
Rust + Python), TypeScript para las superficies humanas.

> Execute ya dijo que "no compite con MCP: lo consume y le añade la capa de auditoría
> que MCP no trae". Sigue siendo la decisión correcta y ahora tiene números detrás: 90k
> estrellas de adopción significa que la capa de auditoría tiene mercado.

---

## 5. Frameworks de agentes — y por qué Negent Mind no usa ninguno

| Framework | Estrellas | Licencia |
|---|---|---|
| [`langchain-ai/langgraph`](https://github.com/langchain-ai/langgraph) | 42,435 | MIT |
| [`mastra-ai/mastra`](https://github.com/mastra-ai/mastra) | 28,406 | MIT core |
| [`microsoft/agent-framework`](https://github.com/microsoft/agent-framework) | 13,850 | MIT |

**Negent Mind no debería adoptar ninguno como dependencia central.** Tres razones:

1. **El criterio es la independence de publicación.** Un framework con release cycle
   propio es una dependencia que decide cuándo el cliente puede actualizar. La propuesta
   de valor es *soberanía*, no *comodidad*.
2. **Azure lo dice explícitamente:** un agente con herramientas "suele ser el valor por
   defecto". La orquestación multiagente es para fronteras de seguridad reales.
3. **El holón Orchestra existe para eso.** Si se adopta LangGraph, Orchestra se convierte
   en un reenvoltorio sin valor propio.

> **Lo que sí se usa:** un framework como referencia de diseño y, si hace falta, como
> implementación *interchangeable* de Orchestra. Nunca como dependencia de un holón
> cognitivo.

---

## 6. Durabilidad

[`temporalio/temporal`](https://github.com/temporalio/temporal) — 23,345 estrellas, MIT,
empujado hoy.

Para Execute y para los flujos de diagnóstico de varios días. Si un diagnóstico se corta
a la mitad y hay que retomarlo una semana después, ese flujo es durable o se perdió.
Temporal resuelve exactamente eso y es self-hosted.

---

## 7. Resumen: qué se usa, qué se envuelve, qué se evita

| Capa | Decisión |
|---|---|
| **Meta** | Envuelve Langfuse autoalojado. Añade bitácora de decisión y umbral de escalamiento |
| **Cardinal** | Índices bitemporales propios sobre VantaDB. Toma el modelo temporal de Zep, no su código |
| **Execute** | Servidor MCP propio + auditoría propia. Consume MCP, no lo compite |
| **Iris** | Sin herramienta externa: OCR propio sobre VantaDB. El mercado de OCR en la nube es exactamente el problema de soberanía |
| **Orchestra** | Runtime propio. LangGraph/Mastra como referencia, no como dependencia |
| **Sustrato** | Temporal para flujos largos. VantaDB (motor embebido con WAL, no PostgreSQL) para todo lo demás |

---

## 8. La conclusión incómoda

**Todo lo que Meta necesita ya existe como proyecto open source de 35.000 estrellas.**

Eso no es malo. Es la definición exacta de por qué Negent Mind no debe construir un motor de
confianza: debe construir **la capa de gobierno que convierte trazabilidad en
responsabilidad**, que es un problema organizacional y legal, no de ingeniería.

Y conecta directo con el hallazgo del documento 10: la gestión del cambio es la tercera
causa de fallo y no tiene holón. Langfuse no la resuelve. **Nadie la resuelve.** Por eso
es vendible.

---

## Fuentes

Datos de la API de GitHub, 29 de septiembre de 2026: estrellas, licencia SPDX, lenguaje
y `pushed_at` de cada repositorio listado.

- Azure Architecture Center, *AI Agent Orchestration Patterns*, actualizado 2026-09-21
- Model Context Protocol, repositorios oficiales y registro
- Comparativas públicas de Arize, Vellum y Confident AI sobre plataformas de
  observabilidad para agentes
