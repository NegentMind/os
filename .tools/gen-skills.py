# -*- coding: utf-8 -*-
"""Genera las cinco skills que la auditoria encontro faltantes.

Se escriben en C:\\Users\\Eros\\.agents\\skills\\ junto a las 149 existentes.
No se instalan de Internet: se escriben porque el diagnostico las necesita y no
existe ninguna que sirva.
"""
import io
import os

BASE = r"C:\Users\Eros\.agents\skills"

SKILLS = {}

# ---------------------------------------------------------------- 1
SKILLS["mapa-de-caos"] = ("Map/plantilla del Mapa de Caos, el entregable facturable del "
"diagnostico de NegentMind. Usar cuando haya que escribir el hallazgo de una "
"entrevista de diagnostico o preparar la entrega al cliente.",
r'''---
name: mapa-de-caos
description: >
  Escribir el Mapa de Caos, el entregable facturable del diagnostico de NegentMind.
  Usar cuando haya que volcar el hallazgo de una entrevista a un documento que el
  cliente pueda leer, discutir y archivar. Un mapa por caos encontrado.
---

# Mapa de Caos

El entregable del diagnóstico. **Un documento por caos encontrado.** Si no se
encuentra ninguno, el entregable es el informe de "no hay problema aquí", que se
cobra igual.

## Por qué se estructura así

El cliente no compró un análisis. Comprató una lista de problemas con orden y
costo. Un documento largo que mezcla hallazgos,ALS speculations y recomendaciones
se lee una vez y se archiva.

## Plantilla

```markdown
# Mapa de Caos — <organización> — <fecha>

Diagnóstico ejecutado por <quién>. Duración: <X> horas en <Y> sesiones.
Este documento describe <N> caos encontrados. Ninguno se corrige con este
documento: son hallazgos, no solutions.

---

## Caos <N>: <nombre del caos>

**Severidad**: <alta|media|baja>
**Costo estimado**: <USD/año> — supuesto: <explícito y escrito>
**Confianza en la estimación**: <alta|media|baja> y por qué

### Qué se observó
<Hechos observables. Sin interpretación. Sin "creemos que">

### Por qué importa
<Qué pasa si no se hace nada. Consecuencia concreta y cuantificada si es posible>

### De dónde sale el número
<Cálculo explícito. Si es una estimación, se dice que lo es.>

### Cómo se mide hoy
<Lo que la organización usa hoy para saber si esto está improving. Si no usa
nada, esa ausencia ES el hallazgo.>

### Qué holón lo resolvería
<Nombre del holón> — o "ninguno de los actuales" si el hallazgo no encaja
honestamente en la arquitectura.

### Qué NO propongo
<Lo que no hay que hacer. Explícito. Esto es lo que hace creíble el resto.>

### Qué se necesita para empezar
<La primera acción concreta. Con dueño y con fecha.>
```

---

## Reglas duras

1. **Hechos antes que interpretación.** Si es una opinión, va marcada como tal.
2. **Todo número lleva su supuesto.** Sin supuesto, el número es decoración.
3. **"Ningún holón lo resuelve" es una respuesta válida.** Es más honesta que
   forzar el hallazgo dentro de la arquitectura.
4. **La sección "Qué NO propongo" es obligatoria.** Si todo se recomienda, no se
   está diagnosticando: se está vendiendo.
5. **Si el diagnóstico no encuentra caos, no se inventa.** Se devuelve el informe
   negativo, que es un resultado real y se cobra igual.

## Antes de entregar

- [ ] Cada caos tiene al menos un hecho observable, no una impresión
- [ ] Cada número tiene su supuesto escrito
- [ ] Al menos un "qué NO propongo"
- [ ] El cliente puede leerlo sin NegentMind al lado y entenderlo
- [ ] Dice explícitamente que esto no corrige nada, solo señala
''')

# ---------------------------------------------------------------- 2
SKILLS["diagnostico-entrevista"] = ("Guion de la entrevista de diagnostico de NegentMind: las "
"seis preguntas que encuentran caos, como seguirlas y cuando parar. Usar antes de "
"cualquier llamada de venta a un prospecto que pueda convertirse en diagnostico "
"cobrable.",
r'''---
name: diagnostico-entrevista
description: >
  Guion de la entrevista de diagnostico de NegentMind. Las seis preguntas que
  encuentran caos, como seguirlas, cuando parar y que NO preguntar. Usar antes de
  cualquier llamada donde el objetivo es calificar y no vender.
---

# Entrevista de diagnóstico

## Antes de la llamada

**No es una demo.** Es una sesión de diagnóstico que se cobra. Si se entra a vender,
se pierde: el prospecto evalúa la demo y nunca se alcanza el hallazgo.

Tres cosas se dicen al principio, en este orden:

1. "Esto no es una demo. Va a salir un documento con lo que encontré, salga bueno o malo."
2. "Cuesta [precio]. Se paga aunque el hallazgo sea que aquí no hay nada que hacer."
3. "Lo que yo diga sobre su operación se lo va a ver alguien más. Guardo el mapa de caos,
   no sus datos."

**La segunda es la que filtra.** El cliente que solo quiere externalizar se va aquí. El
cliente que quiere saber si tiene un problema se queda. Vale perder la llamada.

## Las seis preguntas

Cada una tiene la respuesta honesta que la delata.

| # | Caos | Pregunta | Respuesta que revela el problema |
|---|---|---|---|
| 1 | Contexto | "¿Cuándo supimos esto?" | "Siempre lo dijimos" / "no hay registro" |
| 2 | Percepción | "Muéstrame un documento tuyo de hace dos años" | Tarda, no existe, o está en papel |
| 3 | Confianza | "¿La última vez que el sistema se equivocó, cómo se enteró alguien?" | "Nos dimos cuenta por un cliente" |
| 4 | Ejecución | "¿Cuánto tardan en enterarse de que una automatización se rompió?" | "No nos enteramos" / "tardamos semanas" |
| 5 | Adaptación | "¿Quién usó esto la semana pasada, y qué hizo con la respuesta?" | "Nadie" |
| 6 | Descomposición | "¿Puedes escribir los próximos 5 pasos y demostrar que cada uno es ejecutable?" | No puede, o los pasos no son ejecutables |

### La quinta es la que la industria no pregunta

Si nadie usó el sistema la semana pasada, el problema no es precisión. Es adopción. Y
eso lo cubre un holón distinto del que el cliente cree que necesita. **Esta pregunta
encuentra el hallazgo más valioso y el más ignorado.**

## Cómo seguir cada respuesta

Regla: **preguntar "y eso, ¿cuándo pasó?"** hasta llegar a un hecho con fecha.

- "Es un problema de confianza" → "¿Cuándo fue la última vez que pasó?"
- "El sistema no aprende" → "¿Y qué hicieron después de esa corrección?"
- "Perdemos mucho tiempo" → "¿Cuánto tiempo, y quién lo mide?"

Nunca aceptar una adjectives como respuesta. "Mucho", "mucho", "bastante" no son
respuestas. Pedir el número, o anotar que no lo tiene.

## Lo que NO se pregunta

| No preguntar | Por qué |
|---|---|
| "¿Usan IA?" | Responden sí a todo y no dice nada |
| "¿Qué plataformas usan?" | Es una lista, no un problema |
| "¿Quién es su jefe de tecnología?" | Suena a venta y cierra la sesión |
| Cualquier pregunta sobre presupuesto | Antes del hallazgo es prematuro y pechegante |

## Cuándo parar

La sesión dura entre 45 y 75 minutos. Se para antes cuando:

- Aparecieron **dos o más caos** con fecha y supuesto. Es suficiente para un mapa.
- El cliente empieza a responder en abstracto. Señal de que hay que ordenar, no que
  falte información.
- Han pasado 75 minutos. Un diagnóstico que se agota pierde valor.

**Nunca se alarga para terminar "de una vez".** Dos mapas bien hechos valen más que
uno con tres appendices.

## Cierre

Se cierra leyendo el mapa en voz alta, no dejándolo para después:

> "Esto es lo que encontré. **[Caos principal]**: [una frase]. El costo de no hacerlo es
> [número]. Lo que propongo es [holón + precio]. Y lo que **no** propongo es [holón]: no
> lo vas a necesitar y no te lo voy a vender."
>
> "La decisión es tuya y no hay apuro. Si el número no cierra, te lo devuelvo con el mapa
> igual."

La penúltima frase es el argumento de venta. Todos venden lo que pueden.

## Después

- Se escribe el [mapa-de-caos](./mapa-de-caos.md) por cada caos encontrado.
- Si no se encontró ninguno: informe negativo, se cobra igual, y se pide referencia.
- Se anota qué holón se pidió. **Esa columna es el orden de construcción real.**
''')

# ---------------------------------------------------------------- 3
SKILLS["cold-email-ve"] = ("Correo en frio y mensaje de primer contacto para Venezuela, con "
"el tono que funciona con un pyme local y no suena a Sequence. Usar para primer "
"contacto con prospecto no frio, seguimiento, y mensaje de WhatsApp.",
r'''---
name: cold-email-ve
description: >
  Correo en frio y primer contacto para el mercado venezolano. El script de apertura,
  el seguimiento y el mensaje corto. Usar para contactar prospecto que no conoce
  NegentMind.
---

# Primer contacto

## Principio

**El primer correo no vende: califica.** Hace una pregunta que se responde en diez
segundos y que casi nadie tiene respondida con precisión. Si la responden, ya sabes a
quién escribes.

Nunca: adjuntos, calendario, links a producto, "me presento con mi equipo".

---

## Correo en frío

**Asunto:** ¿cuánto tarda en responder con la fuente?

```
Hola [nombre],

Te hago una pregunta concreta: cuando la dirección te hace una pregunta sobre un
dato, ¿cuánto tardas en responder, y puedes decir de dónde salió?

Lo pregunto porque es el punto donde se caen casi todos los sistemas de IA que ya
tienen empresas como la tuya — no por el modelo, sino porque nadie puede demostrar
de dónde salió la respuesta.

Si quieres te mando cómo se mide. Si no, también sirve.

[Nombre]
NegentMind — Orden desde el caos.
```

**Seis líneas. Sin adjuntos. Sin botón.**

Por qué funciona: la pregunta se responde en una línea si se sabe, y en veinte
minutos si no se sabe. Y esa diferencia de tiempo es exactamente el diagnóstico.

**Tono**:no продактом, no técnico. "Cuando la dirección te hace una pregunta" es
lenguaje de dueño de negocio, no de ingeniero.

---

## Seguimiento — día 3, sin respuesta

```
[nombre], una sola vez y no insisto.

La pregunta era cuánto tarda la organización en responder con fuente y fecha. Si es
"no hay sistema para eso", eso mismo es el hallazgo.

Si prefieres que no te escriba más, dímelo y no hay problema.
```

**Una vez. Nunca dos.** El segundo follow-up destruye más valor del que produce.

---

## Mensaje corto (WhatsApp, in-app, pasillo)

```
Hola [nombre], soy [yo] de NegentMind. Escribo corto: casi todas las empresas con IA
ya montada no llegan a producción, y el motivo casi nunca es el modelo. Es que nadie
puede probar de dónde salió la respuesta.

¿Tiene 15 minutos esta semana para una llamada de diagnóstico? Si no, le escribo a
alguien que sí lo tenga.
```

Cierra con **"si no, le escribo a alguien que sí lo tenga"**. Da igual: la mayoría no
tienen a nadie, y los que sí, te presentan.

---

## Qué se responde

| Responde | Qué hacer |
|---|---|
| "Sí, rápido" | Agendar. Es el momento más barato de convertirlos |
| "No, no tenemos sistema" | **Eso es el hallazgo.** Replicar: "¿Cuánto tiempo lleva así?" |
| "Mándame info" | **No mandes info.** Volver con la pregunta |
| Nada | Un solo seguimiento. Luego parar |

La fila que importa es la segunda. Un cliente que admite no tener sistema **está
comprando el diagnóstico** y no lo sabe todavía.

---

## Lo que no se escribe nunca

- "Solución(CONFIANCIAL)"
- "Soluciones(CONFIANCIAL)"

Reemplazar por **"automatización verificable"** o **"infraestructura para agentes"**.
"Confiabilidad" es una de las cinco palabras más usadas del sector y no dice nada.
''')

# ---------------------------------------------------------------- 4
SKILLS["propuesta-implementacion"] = ("Convertir un mapa de caos en propuesta con precio, "
"alcance y condiciones. Usar cuando ya existe un mapa-de-caos y hay que cotizar.",
r'''---
name: propuesta-implementacion
description: >
  Convertir un Mapa de Caos en una propuesta con precio, alcance, exclusiones y
  condiciones. Usar cuando el diagnóstico ya se entregó y hay que cotizar la
  implementación de uno o más holones.
---

# Propuesta de implementación

## Regla que hace que esto funcione

> **Una propuesta que propone todo no se firma.**

El poder de NegentMind está en decir qué no vende. Un cliente que recibe una lista de
nueve holones entiende que ninguno es prioritario.

## Estructura

```markdown
# Propuesta — <organización> — <fecha>
Referencia: Mapa de Caos del <fecha>

## Qué encontramos
Dos líneas. El problema en la voz del cliente, no en la nuestra.

## Qué proponemos
<UN holón>. Con su caos, qué cambia, cómo se mide.

## Qué no proponemos
<Los holones que el mapa NO pidió. Con el motivo. Explícito.>

## Alcance
Incluye: <entregables concretos, contables>
No incluye: <lo que el cliente podría suponer que incluye>

## Precio
<USD>
Condiciones: <pago, plazos, qué pasa si no funciona>

## Criterio de aceptación
Cómo se sabe que terminó. Un número, no una sensación.

## Si no prospera
Qué pasa si no funciona. Escrito ANTES de empezar.
```

## Los precios

| Holón | Rango |
|---|---|
| Cardinal | USD 8.000 – 15.000 |
| Iris | USD 10.000 – 18.000 |
| Meta | USD 12.000 – 25.000 |
| Execute | USD 15.000 – 25.000 |

Diagnóstico: USD 1.500 – 3.000.
Suscripción (solo con Meta construida): USD 300 – 1.200/mes.

## Cómo se escribe el criterio de aceptación

Mal: "El sistema tendrá una precisión superior al 90%."

Bien: "La dirección recibe una respuesta con fuente y fecha en menos de 10 minutos, en
el 80% de las preguntas que hoy tarda más de un día."

La diferencia es que el primero mide el modelo y el segundo mide **el trabajo del
cliente**. Y el segundo es el que el cliente puede verificar en una tarde.

## La sección "Si no prospera"

Se escribe antes de empezar, no cuando falla:

> "Si en 8 semanas no se cumple el criterio de aceptación, el trabajo se detiene y se
> devuelve el 50% restante. El mapa de caos se entrega igual."

Esas dos frases hacen más por cerrar que cualquier descuento. Bajan el riesgo percibido
y **no cuestan nada** si el trabajo se hace bien.

## Antes de enviar

- [ ] Propone **un** holón, no cinco
- [ ] Dice explícitamente qué no propone
- [ ] El criterio de aceptación lo puede medir el cliente sin nosotros
- [ ] Tiene sección "si no prospera"
- [ ] El alcance excluye lo que alguien va a suponer que incluye
''')

# ---------------------------------------------------------------- 5
SKILLS["ocr-documentos"] = ("Extraccion de datos estructurados de facturas, contratos y "
"formatos en PDF e imagen — el prework de Iris. Usar cuando haya que convertir "
"documentos heterogenos en registros consultables con procedencia.",
r'''---
name: ocr-documentos
description: >
  Convertir facturas, contratos, formularios y catalogos en PDF o imagen en registros
  estructurados con procedencia. Es el prework del holon Iris. Usar cuando una
  organizacion tiene documentos que nadie puede consultar.
---

# OCR y extracción de documentos

> **Este es el prework de Iris.** Si sale bien, es el primer producto que existe.

## Por qué aquí y no en un SaaS

El mercado de OCR en la nube es exactamente el problema de soberanía que NegentMind
vende para resolver: los documentos del cliente salen de la empresa, se procesan en
otro país, y quedan en un log que nadie audita. **Un pyme venezolana no compra eso.**

## Orden de trabajo

No se empieza por el OCR más preciso. Se empieza por el volumen más alto:

| Orden | Qué | Por qué |
|---|---|---|
| 1 | Facturas y órdenes de compra | Volumen alto, ROI en horas, campos conocidos |
| 2 | Extracción de campos clave | Depende del 1 |
| 3 | Diagramas y planos | Volumen bajo, complejidad alta |
| 4 | Formatos libres | Nunca se resuelve del todo |

**Empezar por el 3 es el error clásico.** El diagrama técnico es el caso más difícil
y el de menor retorno.

## Lo que se extrae, y qué más

Un registro de documento sin esto no sirve para nada:

| Campo | Por qué |
|---|---|
| **Posición** | Dónde vive el original |
| **Tiempo** | Cuándo se emitió, y cuándo lo vimos |
| **Procedencia** | Quién lo afirma: ¿la IA o una persona? |

Sin los tres, se puede leer pero no se puede confiar. Y si no se puede confiar, no hay
Cardinal debajo.

## Regla de la revisión humana

**El OCR no se publica solo.** Todo registro pasa por un humano antes de contarse como
verdad. El umbral de confianza se calibra con las correcciones de esa persona.

Eso no es un defecto del proceso. **Es el dataset de Sage.** La mitad humana del
aprendizaje se alimenta exactamente de ahí.

## Casos que este holón resuelve

| Señal | Caos |
|---|---|
| "¿Qué porcentaje de tus documentos se puede consultar hoy?" | Percepción |
| "Enséñame un documento tuyo de hace dos años" | Percepción |
| "Los números del mes no cuadran con losSupport" | Percepción + Contexto |

## Lo que este trabajo produce además del registro

1. **El mapa de caos** de la organización, con el tiempo real que se pierde
2. **El dataset de correcciones** que Sage necesita
3. **La medición del línea base**: sin ella no hay forma de demostrar mejora
''')


def main():
    for name, (desc, body) in SKILLS.items():
        d = os.path.join(BASE, name)
        os.makedirs(d, exist_ok=True)
        p = os.path.join(d, "SKILL.md")
        io.open(p, "w", encoding="utf-8", newline="\n").write(body)
        print("  %-28s %6d bytes" % (name, len(body)))
    print("\n  total nuevas: %d" % len(SKILLS))


if __name__ == "__main__":
    main()
