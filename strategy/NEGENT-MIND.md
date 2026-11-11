# Negent Mind — Definición Maestra

> Documento único de definición. Reemplaza a la dispersión de documentos
> anteriores. Si algo no está aquí, no está definido.
>
> Versión 1.0 · 28 de septiembre de 2026

---

## 1. Qué es Negent Mind

**Negent Mind construye y mantiene los componentes que hacen que un sistema de
IA sea confiable en producción.**

No es un framework de agentes. No entrena modelos. No vende chatbots. Construye
las piezas de las que un sistema de agentes depende para no fallar, y las
mantiene funcionando.

**La tesis, en una frase:** el problema no es la inteligencia artificial, es que
ningún sistema de IA sobrevive a la realidad operativa — la luz se corta, el
documento es un PDF de 2019, nadie sabe de dónde salió el dato, y la persona que
lo configuró se fue.

---

## 2. El modelo de negocio

**Un solo modelo, cuatro mecanismos de ingreso.**

> **Negent Mind vende un sistema confiable, y cobra por mantenerlo.**

| # | Mecanismo | Qué es | Precio entrada (Eros, 0 clientes) | Por qué existe |
|---|---|---|---|---|
| 1 | **Diagnóstico** | Auditoría de 2 semanas. Identifica dónde y cuánto dinero pierde la empresa por no confiar en su propia información. Entregable fijo | Piloto USD 100 adelantado (5 días, 1 proceso, descontable) → Diagnóstico USD 400 – 1.500 | Genera caja inmediata, produce datos reales y demuestra el método |
| 2 | **Implementación** | Se construyen los componentes que resuelven los problemas encontrados | USD 1.000 – 4.000 por holón acotado | Venta grande de entrada, mid-market luego 8-25k |
| 3 | **Suscripción** | Mantenimiento, monitoreo, auditoría de decisiones y actualización | USD 200 – 500/mes | **Convierte el oficio en empresa** |
| 4 | **Capacitación** | Formación operativa por empresa, transfiere uso y genera leads | USD 800 – 1.500/taller | Retención + canal de entrada, no línea principal |

**La formación es 4ª línea y retención a la vez:** si
el cliente no sabe operar lo que compró, no renueva. Y es el canal de leads: las
pymes no pueden contratar, salen del curso siendo clientes.

### El diagnóstico es un producto, no un anzuelo

Se cobra y se entrega **aunque el cliente no contrate la implementación**. Si se
usa para forzar la segunda compra, deja de ser un producto.

---

## 3. La arquitectura — y por qué no es arbitraria

Los componentes de Negent Mind **no son una invención**. Corresponden 1:1 a la
descomposición canónica de la arquitectura de agentes que publica Microsoft en
su Azure Architecture Center, y a la que describen Redis y los patrones
multi-agente del ecosistema.

| Componente canónico de la industria | Holón Negent Mind | Estado |
|---|---|---|
| Perception & input processing | **Iris** | Definido |
| Reasoning engines | **Plan** | Definido |
| Memory systems (corto y largo plazo) | **VantaDB** | 🟢 En producción |
| **Episodic memory** (eventos con tiempo y contexto) | **Cardinal** | En construcción · 1º |
| Tool execution | **Execute** | Definido |
| Orchestration & state management | **Orchestra** | Definido (soporte) |
| Knowledge retrieval & augmentation (RAG híbrido) | **Cardinal** | En construcción |
| Integration, observability, **audit y governance** | **Meta** | En construcción · 3º |
| Feedback loops / adaptation | **Sage** | Definido |
| Audio perception | **Reverb** | Aplazado |
| Neuro-symbolic reasoning | **Reason** | Aplazado |

**Esto no es decoración.** Significa que:

1. La arquitectura es **defendible técnicamente** ante un arquitecto.
2. No competimos con los frameworks: somos la capa que les falta.
3. **Episodic memory** es identificada por la industria como una capacidad
   *"que falta"* y *"que la mayoría de frameworks de producción sigue tratando de
   forma básica"*. Eso es exactamente Cardinal, y es un hueco real.

### Los 5 patrones de orquestación de Microsoft y su holón

| Patrón | Qué hace | Holón que lo implementa |
|---|---|---|
| **Sequential** (pipeline) | Cadena lineal de agentes | Cadena de holones |
| **Concurrent** (fan-out/in) | Análisis paralelo desde perspectivas distintas | Holones en paralelo |
| **Group chat** / **maker-checker** | Uno crea, otro valida contra criterios, itera | **Meta** — el bucle de verificación |
| **Handoff** | Delegación dinámica al especialista adecuado | **Orchestra** |
| **Magentic** (task ledger) | El manager construye y adapta el plan | **Plan** |

El patrón **maker-checker** es literalmente lo que hace Meta: un agente produce,
otro verifica contra criterios explícitos, rechaza y devuelve con feedback hasta
aprobar o alcanzar el tope de iteraciones. Microsoft exige *"criterios de
aceptación claros para el agente verificador"* — eso es la especificación de
Meta.

---

## 4. Los holones: qué es cada uno y qué beneficio da

| Holón | Qué es | Beneficio para el cliente | Precio |
|---|---|---|---|
| **VantaDB** | Motor de datos con ACID, WAL e índices HNSW/IVF/SCANN. Memoria de corto y largo plazo, recuperación híbrida (vectorial + BM25 + metadatos) | La memoria del sistema sobrevive reinicios y no se corrompe. Base local | En producción |
| **Cardinal** | Memoria episódica: cada hecho con **posición, tiempo y procedencia**. Responde "¿cuándo supimos esto?" y "¿de dónde salió?" | La empresa deja de poder opinar sin respaldo. Resuelve el 80% del problema de confianza con datos | USD 8.000 – 15.000 |
| **Iris** | Percepción documental: convierte facturas, contratos y órdenes en datos estructurados con procedencia | Lo que hoy es un archivo muerto pasa a ser consultable. El mejor ROI medible | USD 10.000 – 18.000 |
| **Meta** | Calibración de confianza, bitácora de decisiones, escalamiento a humano, maker-checker | Se puede **demostrar** qué dijo el sistema, con qué respaldo y qué confianza. Sin esto no hay venta a banca ni transnacional | USD 12.000 – 25.000 |
| **Execute** | Ejecución de herramientas y acciones con registro, reproducción y reversión | La automatización deja de ser un riesgo ciego. Se sabe qué hizo, cuándo y por qué | USD 15.000 – 25.000 |
| **Sage** | Captura de correcciones y adaptación local por organización | El sistema deja de repetir errores ya corregidos, y el aprendizaje no sale de la empresa | Por definir |
| **Plan** | Descomposición de objetivos en pasos con criterio de aceptación | Se sabe qué falta y cómo se comprueba | Por definir |
| **Orchestra** | Runtime: coordinación de contexto, política, salud y checkpoints | Los holones cooperan sin perderse ni duplicar trabajo | No se vende suelto |
| **Reverb** | Transcripción y clasificación de audio | — | **Aplazado** |
| **Reason** | Razonamiento neuro-simbólico | — | **Aplazado** |

### Criterio de construcción

> Un holón **no se construye porque esté en un roadmap**. Se construye cuando un
> diagnóstico en una organización real encuentra el problema que resuelve.

### Por qué Cardinal es el primero

1. La industria lo identifica como **capacidad faltante** en frameworks de producción.
2. Es prerrequisito de Iris y Meta: sin contexto confiable no hay nada que verificar.
3. Posee la semántica episódica (posición, tiempo, procedencia) y usa VantaDB como implementación de referencia, que ya tiene aristas temporales, namespaces y recuperación híbrida.
4. Es el más barato de los tres primeros.

---

## 5. Qué se ofrece a cada audiencia

### 5.1 Empresas (pymes y transnacionales)

**El problema:** la empresa no puede confiar en su propia información. Eso tiene
costo medible en horas, en errores y en riesgo.

| Lo que recibe | Cómo |
|---|---|
| Un mapa de dónde y cuánto pierde por ese problema | Diagnóstico de 2 semanas |
| Los componentes construidos y funcionando | Implementación |
| La garantía de que sigue funcionando | Suscripción |

**Lo que NO recibe:** un chatbot. Un modelo entrenado. Una promesa.

### 5.2 Desarrolladores

**Lo que reciben:** VantaDB. Una base de datos con ACID, índices vectoriales y
servidor MCP, en Rust, con bindings para Python, TypeScript, Node y WASM.

- Se instala desde `crates.io`, `PyPI` y `npm`
- Es Apache 2.0
- Funciona local, sin cuenta, sin nube

**Por qué es gratis:** porque los developers son el canal de distribución de la
audiencia de agentes. Un framework que lo adopta lo instala solo.

### 5.3 Equipos de desarrollo

**Lo que reciben:** los componentes de un sistema de agentes ya resueltos.
Percepción, memoria episódica, ejecución auditada, verificación. En MCP.

**El beneficio concreto:** no tienen que reconstruir la capa de confianza. Es el
componente que todos implementan y nadie hace bien.

### 5.4 Sistemas de IA y agentes

Infraestructura local de memoria y contexto vía MCP. Sovereignty: los datos no
salen de la organización.

---

## 6. Los procesos donde Negent Mind se enfoca

**Cuatro procesos, elegidos por hipótesis de ROI a medir en piloto, no por intuición.**

El procesamiento de documentos es el punto de partida hipotético con ROI
**a validar entre industrias** *[fuente primaria pendiente, MindStudio retirado por no verificarse]*.

| # | Proceso | Qué hace hoy una persona | Qué hace Negent Mind | Holones | ROI documentado |
|---|---|---|---|---|---|
| 1 | **Documentos** (facturas, contratos, órdenes) | Los transcribe a mano. El archivo no se consulta | Los convierte en datos con procedencia y los hace consultables | **Iris → Cardinal** | **Hipótesis a medir en piloto** |
| 2 | **Reportes y cifras** | Horas cada semana armando el mismo informe | Se genera, se compara con el período anterior y se marcan anomalías | **Cardinal + Meta** | **4–8 h/semana por analista** recuperadas |
| 3 | **Búsqueda y respuesta** | Alguien busca en 15 sistemas y contesta de memoria | Respuesta con fuente, fecha y nivel de confianza | **Cardinal + Meta** | Investigación: **4 h → 45 min** |
| 4 | **Tareas repetitivas** | Manual, sin registro, y nadie sabe si falló | Automatizado con registro, reversión y alerta | **Execute** | Herramientas internas miden el antes y el después |

**Los cuatro tienen una característica común: son de volumen alto, estructura
definida, entrada y salida textual, y toleran error humano en la revisión.**

### Los procesos donde NO nos metemos

| Proceso | Por qué no |
|---|---|
| Decisiones autónomas de alto riesgo | La industria lo sigue marcando como-no-listo. Requiere supervisión humana en decisiones clave |
| Atención al cliente de extremo a extremo | Falla impredecible en casos límite; daña satisfacción |
| Contratación y RRHH automatizados | Problema documentado de sesgo, con escrutinio regulatorio |
| Creatividad y estrategia | Produce output "adecuado pero no diferenciado" |
| Integrar sistemas sin preparar los datos | **Este es el error #1 documentado**: datos desordenados producen output poco confiable sin importar qué tan sofisticado sea el modelo |

Esa última fila es exactamente la tesis de Negent Mind. **El mercado intenta
conectar herramientas con datos sin preparar. Negent Mind prepara el dato primero.**

---

## 7. Cuándo y cómo se crea cada herramienta

**Criterio: un holón se crea cuando hay un cliente y un diagnóstico que lo pide.**

| Orden | Herramienta | Cuándo | Cómo |
|---|---|---|---|
| 0 | **VantaDB** | Ya existe | v0.7.0 en producción. Publicar en registries |
| 1 | **Cardinal** | Mes 4 – 6 | Capa sobre VantaDB. Primeiro cliente que lo pida |
| 2 | **Iris** | Mes 6 – 9 | OCR primero, luego extracción |
| 3 | **Meta** | Mes 7 – 10 | Puede venderse solo. Es el diferenciador |
| 4 | **Execute** | Mes 10 – 12 | Requiere confianza previa |
| 5 | **Sage** | Después | Requiere contexto confiable |
| 6 | **Plan** | Después | Complementario |
| — | **Orchestra** | Cuando haya 2 holones vivos | Runtime, no producto |
| — | **Reverb / Reason** | Con cliente y caso de uso | Aplazados |

**No hay fechas de release. Hay dependencias.** El orden sale del diagnóstico,
no de un calendario.

---

## 8. Comparación con el mercado

| | Negent Mind | Stack de agentes | OpenAI / Anthropic | Consultoras de IA |
|---|---|---|---|---|
| **Qué vende** | Componentes confiables | Orquestación | El modelo | Horas |
| **Confiabilidad** | **Es el producto** | Depende del usuario | Implícita | Generalmente no se toca |
| **Dependencia de nube** | **Ninguna, local** | Variable | Total | Variable |
| **Soberanía de datos** | **Total** | Parcial | No | Depende |
| **Auditoría de decisiones** | **Nativa, obligatoria** | Opcional | Logs del proveedor | No |
| **Precio** | Fijo por componente | Suscripción por uso | Por token | Por hora |
| **A quién le duele hoy** | — | — | Conflicto de dependencia | Equipos sin contexto |

**El hueco:** los modelos los da el proveedor. La orquestación la da el framework.
**La confianza y la trazabilidad las tiene que construir cada empresa sola.** Eso
es caro, es difícil, y casi nadie lo ofrece como producto.

---

## 9. Datos que respaldan la tesis

| Dato | Fuente | Implicación |
|---|---|---|
| **46% de los desarrolladores desconfían del output de la IA; solo 33% confían** | Stack Overflow Developer Survey 2025 | La desconfianza ya es el estado normal. Meta es un producto, no un lujo |
| A 5% de tasa de fallo, un agente de 20 acciones es inutilizable. El autónomo necesita <1% | Análisis de arquitectura de producción | La confiabilidad es una restricción de ingeniería medible, y es vendible |
| **60–70% del tiempo de los knowledge workers** podría verse afectado por IA | McKinsey 2024 *[cita secundaria pendiente de primario]* | El mercado es enorme |
| Solo el **5%** de las empresas ha integrado IA a procesos | KPMG, *Visión Empresarial Venezuela 2026* (68 ejecutivos, 12 sectores) | El mercado objetivo está casi intacto |
| **24%** no tiene tecnología en su gestión fiscal | KPMG 2026 | Gasto forzado, no discrecional. El mejor primer cliente |
| **46%** reporta fallas en servicios públicos (+13%, el mayor alza) | KPMG 2026 | Local-first no es idealismo, es la única arquitectura posible |
| **18%** reporta impacto alto de licencias OFAC | KPMG 2026 | La soberanía es reducción de riesgo, no un lujo |
| El procesamiento documental es el ROI a validar entre industrias | Hipótesis NegentMind a medir en piloto *[MindStudio retirado: primario no verificado]* | Foco en Iris → Cardinal |
| Episodic memory es una **capacidad que falta** en los frameworks de producción | Redis, 2026 | Confirma Cardinal como primer holón |

---

## 10. Lo que Negent Mind no es

| No es | Razón |
|---|---|
| Un framework de agentes | No orquestamos agentes. Damos las piezas que les faltan |
| Un proveedor de modelos | No entrenamos ni servimos modelos |
| Una SaaS en la nube | La soberanía es un requisito, no una preferencia |
| Consultoría por horas | Se cobra por componente entregado, no por tiempo |
| Una promesa de automatización total | La supervisión humana en decisiones clave no es opcional |

---

## 11. Lo único que falta para empezar

| # | Qué | Por qué bloquea |
|---|---|---|
| 1 | Los 4 instrumentos del diagnóstico | **Son el producto.** Sin ellos no hay venta |
| 2 | Investigar `syntropyai.app` | Ya existe otra empresa con el mismo nombre y sector |
| 3 | Cerrar entidad legal | Sin factura no hay B2B |
| 4 | Un primer diagnóstico real | Es lo que valida todo lo demás |

Los puntos 1 y 4 son trabajo directo. El 2 es investigación. El 3 es una
decisión.

**Todo lo demás es prematuro hasta que haya un cliente que pague.**
