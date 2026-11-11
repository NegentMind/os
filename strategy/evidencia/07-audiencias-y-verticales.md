# 07 — Audiencias, verticales y superficies

> Negent Mind no es solo para empresas. El mismo holón debe servir a cinco
> audiencias distintas sin fragmentar el producto.

---

## 1. Las cinco audiencias

| Audiencia | Qué compra | Holón de entrada | Por qué puede pagar |
|---|---|---|---|
| **Personas naturales** | Herramienta personal de organization y contexto | **Cardinal** | orderlyén sus propias facturas, contratos, documentos, decisiones |
| **Pymes (<100 empleados)** | Diagnóstico + implementación + suscripción | **Cardinal → Meta** | 68% del mercado. No pueden contratar equipo de IA |
| **Transnacionales** | Soberanía, cumplimiento, continuidad | **Meta** | Riesgo OFAC y.normativa. Ya tienen presupuesto |
| **Desarrolladores** | Biblioteca, SDK, servidor MCP | **VantaDB** | Consume por volumen, no por proyecto |
| **Sistemas de IA y agentes** | Infraestructura local de memoria y contexto | **VantaDB + Execute** | Consume por llamadas. Es el mercado más grande y el más silencioso |

### Nota sobre la 5ª audiencia

**Sistemas de IA y agentes** es la audiencia más grande en volumen potencial y la
que menos atención comercial requiere: si VantaDB es bueno, un framework lo usa
solo. No necesita ninguna campaña. Necesita que esté en npm, PyPI,
crates.io y Speaks MCP.

**Esa audiencia financia la infraestructura de las otras cuatro** sin costo de
adquisición. Es el orden correcto: primero se hace público lo que developers
consumen, y sobre esa base se construye lo que se le vende a empresas.

---

## 2. Verticalesdez sectoras

Priorizadas por el dolor medido, no por tamaño de mercado.

| # | Vertical | Caos dominante | Por qué | Prioridad |
|---|---|---|---|---|
| 1 | **Industria y manufactura** (18% del mercado) | Contexto + Percepción | Órdenes, planos, especificaciones, registros de calidad en papel | 🔴 1ª |
| 2 | **Energía y recursos naturales** (13%) | Contexto + Confianza | Trazabilidad normativa, registros de seguridad, cumplimiento | 🔴 1ª |
| 3 | **Alimentos y consumo** (7%) | Contexto | Trazabilidad de lote, vencimientos, proveedores | 🟡 2ª |
| 4 | **Banca y seguros** | Confianza | Verificabilidad de decisiones. El sector con más Regulatorio | 🟡 2ª |
| 5 | **Retail y comercio** | Percepción | Facturas escaneadas, catálogos impresos, precios que cambian cada mes | 🟡 2ª |
| 6 | **Agroindustria** (6%) | Contexto | Trazabilidad de origen, seasonally registros de cosecha | 🟡 2ª |
| 7 | **Construcción** | Percepción | Planos, contratos, actas | 🟢 3ª |
| 8 | **Turismo y hospitalidad** | Contexto | Reservas, historial de huésped, claim de servicio | 🟢 3ª |
| 9 | **Salud** | Confianza | Historia clínica. El más regulado y el más difícil de entrar | ⚪ Fuera al inicio |
| 10 | **Educación** | Contexto | Registros académicos, expedientes | ⚪ Fuera al inicio |
| 11 | **Servicios profesionales** | Contexto | Expedientes, contratos, tiempos | ⚪ Fuera al inicio |

**Criterio de entrada en una vertical:** que exista un dolor **medible en
horas o en USD** y que el holón de entrada ya esté construido. No se entra a una
vertical "porque es interesante".

### El wedge fiscal (transversal)

Aplica a **todas** las verticales, y por eso es el mejor primer cliente:

| Evidencia | Dato |
|---|---|
| Carga tributaria entre los 3 primeros dolores | 54% |
| Sin tecnología en gestión fiscal | 24% |
| Inflación que obliga a recalcular | 263,4% |
| Cero automatización fiscal en 4 de cada 10 | 40% |

**Es gasto forzado.** El cliente no tiene que decidir si invierte: tiene que
cumplir. Eso elimina la barrera de venta más difícil del B2B.

---

## 3. Las cuatro superficies de cada holón

Cada holón se expone igual a las cinco audiencias. Es un requisito de diseño,
no una feature.

| Superficie | Para quién | Forma | Ejemplo de holón |
|---|---|---|---|
| **Desarrollador** | Quien construye | API, SDK, servidor MCP, CLI | Cardinal: API de contexto |
| **Agente** | Sistema de IA | Herramientas MCP invocables | Execute: invocación con trazabilidad |
| **Humana** | Persona no técnica | Interfaz, chat, informe | Iris: carga y corrección de documentos |
| **Empresa** | Tiene que responder ante alguien | Panel de gobierno, auditoría, SLA, aislamiento | Meta: bitácora de decisiones |

### Reglas de esta arquitectura

| Regla | Razón |
|---|---|
| La superficie de desarrollo **no** puede exigir el resto | Si no, los developers no lo adoptan |
| La superficie humana **no** puede requerir conocimiento técnico | El cliente es pyme, no ING |
| La superficie de empresa **siempre** incluye auditoría | Sin bitácora no hay venta enterprise |
| Toda superficie humana **tiene** equivalente en API | Si no, el producto queda atrapado en el proveedor |

**La última regla es la que evita la trampa de consultoría:** si una capacidad
solo existe dentro de una interfaz humana, es una consultoría disfrazada de
software. Todo lo que se le hace al cliente tiene que existir como API.

---

## 4. Ejes de la matriz de audiencia × superficie

| | Desarrollador | Agente | Humana | Empresa |
|---|---|---|---|---|
| **Personas naturales** | — | — | ● principal | — |
| **Pymes** | ○ | ● | ● principal | ○ |
| **Transnacionales** | ○ | ● | ○ | ● principal |
| **Desarrolladores** | ● principal | ● | ○ | ○ |
| **Sistemas de IA** | ● | ● principal | — | ○ |

● = principal · ○ = secundario · — = no aplica

**Lectura:** la superficie humana pesa para pyme y persona natural; la de
empresa pesa para transnacional; la de developer pesa para las tres últimas. Un
producto que solo tenga una de estas columnas no sirve a nadie.

---

## 5. Qué se vende a quién, en una frase

| Audiencia | La frase |
|---|---|
| Personas naturales | "Tu vida administrativa, ordenada y consultable." |
| Pymes | "Tu empresa no puede confiar en su propia información. Esto sí." |
| Transnacionales | "Soberanía y trazabilidad sin depender de la nube de otro." |
| Desarrolladores | "Memoria ACID y recuperación híbrida, local, en cinco languages." |
| Sistemas de IA y agentes | "Infraestructura de contexto soberana vía MCP." |

---

## 6. Nota sobre la colisión de audiencias

Existe ya **Syntropy (syntropyai.app)**, un "AI Agent Governance Platform".

Eso **solapa directamente con la 5ª audiencia** (sistemas de IA y agentes) y con
la columna de agentes de las cuatro superficies.

Consecuencia operativa: la audiencia de developers y agentes de Negent Mind debe
comunicarse **bajo VantaDB o bajo un nombre de producto**, no bajo Negent Mind, al
menos hasta resolver la marca. Decisión documentada también en
`03-panorama-competitivo.md` y `09-roadmap-riesgos.md`.
