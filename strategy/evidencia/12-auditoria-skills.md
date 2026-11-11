# Auditoría de las skills disponibles

> 29 de septiembre de 2026. Se leyeron los `SKILL.md` de
> `C:\Users\Eros\.agents\skills` (149 con `SKILL.md`) y `C:\Users\Eros\.claude\skills`
> (38). **187 skills en total.**
>
> Pregunta: ¿sirven para lo que Negent Mind está haciendo?

---

## 1. La respuesta corta

**No. La biblioteca está desbordada en la dirección equivocada.**

Están afinadas para **producir artefactos visuales**. Negent Mind necesita **encontrar,
diagnosticar y cerrar clientes**. Son trabajos distintos y casi no hay solapamiento.

| Área de trabajo | Skills | Prioridad para Negent Mind |
|---|---:|---|
| Marca y diseño visual | 60 | Baja — la marca ya está hecha |
| Video y animación | 30 | Muy baja — un solo banner GIF |
| Frontend y UI | 19 | Media — solo las superficies humanas |
| QA y seguridad | 10 | Media — inevitable en Cardinal |
| Proceso y documentación | 6 | Alta |
| Investigación web | 6 | Alta |
| Construir backend y BD | 6 | Alta |
| **Agentes y LLM** | **2** | **Muy alta** |
| **Venta y marketing** | 16 | **Alta, pero casi ninguna de venta** |

**60 + 30 + 19 = 109 de 187 skills son para diseño y video.** Es el 58% de la biblioteca
dedicado a producir cosas que Negent Mind ya produjo.

---

## 2. Los cuatro huecos

| Hueco | Para qué lo necesita Negent Mind | Skills |
|---|---|---:|
| **Prospección y correo en frío** | Es el único camino a los primeros USD | **0** |
| **Propuestas y cotizaciones** | El diagnóstico se cobra, y cotizar es el acto de cobrar | **0** |
| **OCR y extracción de documentos** | **Esto es Iris, literalmente** | **0** |
| **Entrevistas y diagnóstico** | **Esto es el producto** | **0** |

Los dos últimos son los importantes. El producto de Negent Mind es un diagnóstico, y un
diagnóstico es: extraer documentos heterogéneos, hacer las preguntas difíciles, escribir un mapa de
caos. **No hay una sola skill para ninguna de las dos mitades.**

> La única coincidencia con "finanzas" era `roier-seo`, que hizo match por contener "roi"
> dentro de "seo". Falso positivo.

---

## 3. Qué sí sirve, y para qué

Estas sí valen y conviene nombrarlas:

| Skill | Para qué en Negent Mind |
|---|---|
| `systematic-debugging` | Depurar Cardinal cuando la recuperación no cuadra |
| `writing-plans` | Los planes de construcción de holones |
| `brainstorming` | Antes de cada decisión de arquitectura |
| `coordinated-web-search` | Investigación de mercado y de competidores |
| `visual-review` | Verificar el banner en dark y light |
| `brand-guidelines`, `canvas-design`, `color-expert` | Solo si la marca se mueve |
| `a11y-*` (3) | Las superficies humanas de los holones |
| `supabase-postgres-best-practices`, `prisma-expert`, `database-*` | Cardinal |
| `react-*`, `next-best-practices`, `shadcn-ui` | Las superficies web |
| `docx`, `pdf`, `pptx` | Entregables del diagnóstico |

**Todo lo demás es o irrelevante o marginal.** Y las 30 de video, las 8 de GSAP, las 6 de
Three.js y las 3 de WebGPU son de otro proyecto.

---

## 4. Las skills de VantaDB no son nuestras

`.opencode/skills/` contiene ~74 skills más: 12 agentes `vanta-*`, el task-system y el
motor de skills. Según `AGENTS.md`, **`.opencode/` no es de Negent Mind.**

No las conté en las 187 y no deben moverse. Pero hay una observación que sí importa:
**el sistema de agentes de VantaDB es exactamente la infraestructura que Negent Mind
necesita y no tiene** — un orquestador, subagentes con roles, y un motor de skills.

| Pieza de VantaDB | ¿Lo necesita Negent Mind? |
|---|---|
| `task-system/` con ADRs y decisiones | **Sí.** Es la memoria organizacional que CardinalIndexer |
| 12 agentes con roles y gates | **Sí.** Es la versión interna de Execute |
| Motor de skills con carga dinámica | **Sí.** Es el runtime de las superficies |
| `opencode-loop` con metas | No, es de su proceso |

> **Esto es `Orchestra` por dentro.** El holón no es solo el runtime de los agentes
> cliente: también es el runtime del propio Negent Mind. Si la infraestructura ya existe y
> probada en VantaDB, el camino más corto es **adaptarla, no escribirla desde cero**.
>
> Y aquí está la contradicción que hay que resolver antes de vender nada: `AGENTS.md`
> prohíbe modificar VantaDB. Si Orchestra se construye sobre su infraestructura, hay que
> obtener permiso explícito de separación.

---

## 5. Recomendación

**No instalar más skills todavía.** Instalar sin diagnóstico es cómo se llega a 187.

Primero, escribir las cinco que faltan y que son las que pagan el negocio:

| # | Skill nueva | Por qué es la primera |
|---|---|---|
| 1 | `diagnostico-entrevista` | Es el producto. Guion, señales, cuándo parar |
| 2 | `cold-email-ve` | Es el canal a los primeros USD, y tiene que sonar venezolano |
| 3 | `propuesta-implementacion` | Convierte el diagnóstico en precio |
| 4 | `ocr-documentos` | Es Iris antes de que sea Iris |
| 5 | `mapa-de-caos` | Es el entregable que se cobra |

Las cuatro últimas del documento 13 (plantillas) las cubre la 2 y la 3.

**Después**, y solo después, limpiar: 109 skills de diseño/video que no van a volver a
usarse se pueden archivar en un directorio `skills/_archivadas/` sin borrarlas. Eso baja
el ruido del contexto de cada sesión, que es un coste real con 187 descriptors cargados.

---

## 6. El hallazgo de fondo

La biblioteca de skills refleja en qué setrabajó: **muchas horas en la marca y el
banner.** Es el trabajo que había que hacer y ya está hecho.

Lo que falta es todo el trabajo que **produce dinero**: encontrar al cliente, hacerle las
preguntas difíciles, escribir el precio, cerrar.

Las skills mirror la estrategia. Si la estrategia no tiene skills de venta, la estrategia
no tiene venta.

---

## Método

- Se leyó el frontmatter `name:` y `description:` de los 187 `SKILL.md`.
- La clasificación por área se hizo por patrón sobre el nombre y la descripción.
- Los huecos se buscaron por patrón negativo: si el patrón no aparece, no existe la skill.
- Las skills de `.opencode/` se listaron aparte porque no son de Negent Mind.
