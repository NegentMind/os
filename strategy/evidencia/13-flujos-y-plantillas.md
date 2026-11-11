# Flujos de negocio, orden de construcción y plantillas

> 29 de septiembre de 2026. Complementa a los documentos 10 (validación de holones),
> 11 (herramientas) y 12 (auditoría de skills).
>
> Regla que gobierna todo: **nada se construye hasta que un diagnóstico lo pide.**

---

## 1. El flujo de negocio completo

```
   ┌─────────────────────────────────────────────────────────┐
   │  1. SEÑAL          Documento público, referido, Polar 1000 │
   └────────────────────────────┬────────────────────────────┘
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │  2. PRIMER CONTACTO  Email o mensaje. No vende:         │
   │     cualifica. 1 pregunta, 1 botón de salida.          │
   └────────────────────────────┬────────────────────────────┘
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │  3. DIAGNÓSTICO (Piloto USD 100 → USD 400 – 1.500)                      │
   │     8 fases → un único entregable: EL MAPA DE CAOS      │
   │     Con o sin hallazgo, se cobra.                        │
   └────────────────────────────┬────────────────────────────┘
                    ┌───────────┴───────────┐
              chaos encontrado        sin caos
                    ▼                       ▼
   ┌────────────────────────┐   ┌──────────────────────────┐
   │ 4a. PROPUESTA          │   │ 4b. INFORME DE "NO HAY    │
   │     USD 1.000 – 4.000 │   │     PROBLEMA AQUÍ"       │
   │     por holón          │   │     USD 0. Se cobra igual │
   └───────────┬────────────┘   │     la reputación.        │
               │                └──────────────────────────┘
               ▼
   ┌─────────────────────────────────────────────────────────┐
   │  5. IMPLEMENTACIÓN  Solo los holones que el diagnóstico  │
   │     Enabled. El resto no se construye todavía.          │
   └────────────────────────────┬────────────────────────────┘
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │  6. SUSCRIPCIÓN  USD 200 – 500/mes                     │
   │     Solo tiene sentido cuando hay confianza (Meta).     │
   └─────────────────────────────────────────────────────────┘
```

### Los tres puntos donde este flujo se rompe

| Punto | Por qué se rompe | Qué lo evita |
|---|---|---|
| **3 → 4b** | Nadie cree un diagnóstico que dice "no hay problema". Hay que cobrar igual y devolver algo útil | Entregar el mapa de caos igual. El "no hay problema" **es** un hallazgo: es el más difícil de obtener |
| **4a → 5** | La propuesta promete más de lo que Cardinal entrega | Solo proponer holones con criterio de activación cumplido |
| **5 → 6** | Suscribir sin confianza es cobrar por un pasivo | La suscripción exige Meta construida. No antes |

---

## 2. Orden de construcción

### Lo que la evidencia impone

De los datos del documento 10:

| Regla | Origen |
|---|---|
| **Un solo agente con herramientas es el valor por defecto** | Azure, literal |
| La orquestación multiagente es para fronteras de seguridad reales | Azure |
| Datos sin dueño listo = 60% de abandono | Gartner |
| Sin métrica acordada = 12% de éxito vs 54% con ella | Institute of AI PM |
| Proveedor: 67% vs interno: 33% | Institute of AI PM |

### La secuencia

```
FASE 0  INSTRUMENTOS          Ya casi listo
       Los 4 instrumentos de diagnóstico.
       Esto no es un holón: es lo que activa todos.
       └── Costo: días. Sin esto no se diagnostica nada.

FASE 1  Cardinal              El primer holón
       Porque Iris, Meta y Sage dependen de contexto confiable.
       Y porque es la memoria organizacional, que es lo que
       el cliente tiene hoy en una carpeta de archivos.
       └── Venta: "la respuesta took 3 días y nadie sabe de dónde salió"

FASE 2  Iris                  Solo si algún diagnóstico encuentra caos de percepción
       Depende de Cardinal. Suena segundo pero es condicional.

FASE 3  Meta                  El diferenciador
       Depende de Cardinal. Se vende solo aunque no haya nada más.
       └── "nadie puede probar que la IA dijo la verdad"

FASE 4  Execute               Con confianza previa
       Es el nivel por defecto de Azure: un agente con herramientas auditadas.
       Ampliado a adaptación humana (ver documento 10, §4.4).

FASE 5  Sage                  Aprende de correcciones, de máquina y de personas

FASE 6  Plan                  El patrón magentic. No es diferenciador.

─────────────  Orchestra  ─────────────
Runtime. Cuando existan 2 holones vivos. Antes es especulación.
─────────────  Reverb / Reason  ─────────
Aplazados con condición de reactivación escrita.
```

### El error a no cometer

Construir Meta primero porque es el que se vende. Meta **necesita** Cardinal para
calibrar confianza: sin contexto con posición y tiempo no hay contra qué medir.

Vender antes de construir es el error que el diagnóstico existe para evitar.

---

## 3. Qué se construye primero, en concretísimo

Si solo se puede hacer una cosa esta semana:

> **Escribir el guion de entrevista del diagnóstico y salir a hablar con 5 empresas.**

No código. El código sin diagnóstico es exactamente el 88% que nunca llega a producción.

| Semana | Entregable |
|---|---|
| 1 | Los 4 instrumentos escritos + 5 conversaciones |
| 2 | Mapa de caos de las 5. Ver qué caos se repite |
| 3 | Un holón. Solo el que se repitió 3 veces |
| 4 | Propuesta y precio |

---

## 4. Plantillas

### 4.1 Primer contacto — email en frío

**Asunto:** ¿cuánto tarda en responder con la fuente?

> Hola [nombre],
>
> Te hago una pregunta concreta: cuando la dirección te hace una pregunta sobre un
> dato, ¿cuánto tardas en responder, y puedes decir de dónde salió?
>
> Lo pregunto porque es el punto donde se caen casi todos los sistemas de IA que ya
> tienen empresas como la tuya — no por el modelo, sino porque nadie puede demostrar de
> dónde salió la respuesta.
>
> Si quieres te mando cómo se mide. Si no, también sirve.
>
> [Firma]
> NegentMind — Order out of chaos.

**Por qué funciona:** no vende. Hace una pregunta que el lector puede responder en diez
segundos y que casi nadie tiene resposta precisa. Y si la tiene, ya sabe quién es.

**Longitud:** 6 líneas. Sin adjuntos. Sin calendario.

---

### 4.2 Seguimiento — día 3, si no hubo respuesta

> [nombre], una sola vez y no insisto.
>
> La pregunta era cuánto tarda la organización en responder con fuente y fecha. Si es
> "no hay sistema para eso", eso mismo es el hallazgo.
>
> Si prefieres que no te escriba más, dímelo y no hay problema.

---

### 4.3 Mensaje de WhatsApp / in-app

> Hola [nombre], soy [yo] de NegentMind. Escribo corto: estamos viendo que las
> empresas con IA ya montada no llega a producción, y el motivo casi nunca es el
> modelo. Es que nadie puede probar de dónde salió la respuesta.
>
> ¿Tiene 15 minutos esta semana para una llamada de diagnóstico? Si no, le escribo a
> alguien que sí lo tenga.

---

### 4.4 Apertura de la entrevista de diagnóstico

> Antes de empezar, tres cosas:
>
> 1. Esto no es una demo. Va a salir un documento con lo que encontré, whether salga
>    bueno o malo.
> 2. Cuesta [precio]. Se paga aunque el hallazgo sea "aquí no hay nada que hacer".
> 3. Lo que yo diga sobre su operación se lo va a ver alguien más. Guardo el mapa de
>    caos, no sus datos.
>
> ¿Seguimos?

**Por qué la punto 2 importa comercialmente:** cobrar los diagnósticos negativos es lo
que hace que los positivos sean creíbles. Y filtra al cliente que solo quiere Externalizar.

---

### 4.5 Preguntas que Encuentra el caos

Las preguntas que diagnostican los cinco caos. Cada una tiene una respuesta que la delata:

| Caos | Pregunta que lo revela |
|---|---|
| **Contexto** | "¿Cuándo supimos esto?" — si la respuesta es "siempre lo dijimos", no hay contexto |
| **Percepción** | "Muéstrame un documento tuyo de hace dos años" — si tarda o no existe, es papel |
| **Confianza** | "La última vez que el sistema se equivocó, ¿cómo se enteró alguien?" |
| **Ejecución** | "¿Cuánto tardan en enterarse de que una automatización se rompió?" |
| **Aprendizaje** | "¿Cuántas veces han tenido que re-enseñar lo mismo?" |
| **Adopción** | "¿Quién usó esto la semana pasada y qué hizo con la respuesta?" |

La última es la que la industria no pregunta y Negent Mind sí. **"La IA no falló: nadie la
usó."**

---

### 4.6 Cierre del diagnóstico

> Esto es lo que encontré. Está en el documento que te acabo de enviar.
>
> **[Caos principal]**: [descripción en una frase]
>
> **Costo de no hacerlo**: [estimación, con el supuesto escrito]
>
> **Lo que propongo**: [holón + precio]
>
> **Lo que NO propongo**: [holón que el diagnóstico no pidió]. No lo vas a necesitar y no
> te lo voy a vender.
>
> La decisión es tuya y no hay apuro. Si el número no cierra, te lo devuelvo con el
> mapa igual.

**La penúltima línea es el argumento de venta.** Todos venden lo que pueden. Decir qué no
vendes es lo que hace creíble lo que sí vendes.

---

## 5. Lo que falta y hay que escribir

| Falta | Para qué | Bloquea |
|---|---|---|
| Guion completo de entrevista | Las 6 preguntas están; faltan las de seguimiento | El diagnóstico |
| Mapa de caos (plantilla) | El entregable que se cobra | El cobro |
| Propuesta de implementación | Convertir hallazgo en precio | USD 8k+ |
| Contrato de diagnóstico | Los términos del cobro, sobre todo el "se paga igual" | Facturar |
| Onboarding post-firma | Qué pasa el día 1 | Retención |

**Ninguna de las cinco requiere código.** Y las cinco están antes que el primer holón en
el orden real.

---

## Fuentes

Los datos de mercado citados (88%, 95%, 67% vs 33%, 54% vs 12%, 60%) están en
[`10-validacion-holones.md`](./10-validacion-holones.md), con su fuente primaria.
Las preguntas de diagnóstico derivan de los tres problemas raíz del mismo documento.
