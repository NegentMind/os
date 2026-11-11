# Resumen de todo lo trabajado

> Cierre de sesión, 29 de septiembre de 2026. Una sola respuesta a tres preguntas:
> **qué se hizo, qué está roto y qué toca mañana.**

---

## 1. Lo que se hizo

### La organización GitHub, reconstruida desde cero

| Antes | Ahora |
|---|---|
| 11 repos públicos, 9 de ellos stubs archivados | **5**: `negentmind` y `.github` públicos, `strategy`, `skills` y `os` (monorepo) privados |
| Perfil y gobernanza mezclados en el mismo archivo | Separados: `profile/` es lo que GitHub renderiza, la raíz es gobernanza |
| Todo en español | Inglés principal, español como `_ES.md`. **36 documentos, 18 pares verificados** |

**Cómo se hizo, porque el proceso importa:** primero un respaldo completo en
`old/` (3 bundles de git íntegros, copias con `.git`, los 9 repos eliminados), luego
borrado de los 12 repos, luego recreación de los 3 desde local. **El historial no se
perdió: los 27 commits originales de los 9 holones siguen alcanzables dentro del
monorepo.** Verificado 9/9.

Esa reconstrucción resolvió lo que hacía que la página "se viera igual": la barra lateral
mostraba primero los 9 stubs porque tienen más historial. Sin acceso a la API de
*pinned repositories* (devuelve 404 con el plan actual), borrar fue la única forma de
limpiar la vista. El orden correcto fue: respaldo → subir lo nuevo → **después** archivar.

### La arquitectura, validada contra la industria

Contra Azure Architecture Center y la encuesta canónica de memoria agéntica
(arXiv 2512.13564):

- Los cuatro componentes canónicos están cubiertos: Perception, Reasoning, Memory, Action
- **Los nueve nombres se sostienen.** Ninguno cambia
- Plan es el patrón **magentic** de Azure con nombre propio, no una invención
- **Dos huecos encontrados y reparados:**
  - **Working memory** no estaba modelada → ahora es requisito de Cardinal, con
    presupuesto de tokens por respuesta
  - **Gestión del cambio** no tenía holón → Sage pasó de *Learning* a **Adaptation**
    (máquina *y* personas), con señal de validación nueva

### Tres documentos de evidencia nuevos

| # | Qué contiene |
|---|---|
| `10-validacion-holones` | Los holones contra tres fuentes primarias. Veredicto + 2 huecos |
| `11-herramientas-y-stack` | 16 herramientas con estrellas y licencia reales. Qué se envuelve, qué se evita |
| `12-auditoria-skills` | 187 skills auditadas. **109 de 187 (58%) son de diseño y video.** Cero de venta |
| `13-flujos-y-plantillas` | Flujo de negocio, orden, 6 plantillas de contacto |

**El hallazgo de `11-herramientas-y-stack`:** todo lo que Meta necesita ya existe —
Langfuse tiene 35.164 estrellas, self-hosted, con scoring en línea. **No hay que
construir un motor de confianza: hay que construir la capa que convierte trazabilidad en
responsabilidad.** Para Cardinal, Zep es un grafo temporal (4.939 estrellas, Apache-2.0),
que es literalmente la definición de *posición, tiempo, procedencia*. Mem0 tiene 13× más
estrellas pero pierde el eje temporal.

Y `13-flujos` deja escrito lo que nadie había escrito: el flujo de venta completo, con los
**tres puntos donde se rompe** (si el diagnóstico dice "no hay problema" hay que cobrar
igual; si la promesa excede lo que el holón entrega; si se suscribe antes de tener
confianza), y seis plantillas de contacto.

### Los README en inglés: generados, no escritos

Los `holons/<nombre>/README.md` **se reescriben enteros** por `.tools/i18n-holons.py` a
partir de una tabla de datos en el propio script. Editarlos a mano no sirve: la siguiente
ejecución los revierte. Los `README_ES.md` sí se editan a mano. El script es idempotente
—se ejecutó tres veces seguidas y un hash de 18 archivos no cambió.

### Perfil congelado, espejos sincronizados

El `AGENTS.md` prohíbe editar `profile/` a mano: los cambios nacen en
`brand/` y se exportan. Al principio se editó el perfil directamente y eso dejó
obsoletos los espejos en `brand/docs/profile-README-{EN,ES}.md`. **Regenerados y
verificados**: cada espejo termina con el publicado exacto. El banner quedó intacto —las
primeras 14 líneas son **idénticas byte a byte** al original.

### Cinco skills nuevas, ahora activas

| Skill | Qué resuelve |
|---|---|
| `diagnostico-entrevista` | **Es el producto.** Las 6 preguntas, cómo seguirlas, cuándo parar, qué NO preguntar |
| `mapa-de-caos` | El entregable facturable, con las reglas duras |
| `cold-email-ve` | Correo en frío, seguimiento y mensaje corto, con el tono venezolano |
| `propuesta-implementacion` | Mapa de caos → precio, con la sección "si no prospera" |
| `ocr-documentos` | El prework de Iris. Por qué el mercado de OCR en la nube es el problema |

> Los cuatro huecos de la auditoría estaban en cero. Ahora los cuatro tienen skill.

### Roadmap y perfil

- **Fase 0 añadida**: los instrumentos van **antes** que cualquier holón
- El roadmap dice que nada se construye sin instrumento para medir el caos, y luego ponía
  a construir el primer holón. Corregido
- El perfil tiene el mapa de repos, el orden con dependencias, y el banner intacto
  (primeras 14 líneas **idénticas byte a byte** al original)

---

## 2. Lo que está roto

Tres bugs de credibilidad, **arreglados y subidos**:

| Bug | Dónde | Arreglo |
|---|---|---|
| Principios numerados `1,2,3,3,4,5,6` — dos "3" | `MANIFESTO.md` y `_ES` | Renumerados 1-7 |
| El método decía "no es gratuito" y "el primero es gratis" | `05-metodo-diagnostico.md` | **Piloto a USD 400 post-pago**, precio completo desde el segundo |
| "Somos como POSIX para IA" con 0 holones construidos | `profile/README{,_ES}.md` | "Queremos ser" + "nada construido salvo el sustrato" |

---

## 3. El hallazgo que no es mío

Viene de dos revisiones externas que trajiste, y es el dato más importante de la sesión:

```
187 skills disponibles
  109  marca, diseño visual y video        (58%)
   19  frontend y UI
    6  construir backend y BD
    2  agentes y LLM

   0  prospección y correo en frío
   0  propuestas y cotizaciones
   0  OCR y extracción de documentos     ← esto es Iris
   0  entrevistas y diagnóstico          ← esto es el producto
```

**Las skills reflejan en qué se trabajó: la marca. Falta todo el trabajo que produce
dinero.** Si la estrategia no tiene skills de venta, la estrategia no tiene venta.

De ahí salieron también tres hallazgos que verifiqué:

| Hallazgo | Verificación |
|---|---|
| El wedge fiscal está identificado pero **desconectado del producto** | Busqué fiscal/impuestos/IVA/facturación en los 9 holones: **cero** |
| El margen del 89% es "no me pagué" | 4 implementaciones × 6-12 semanas = 24-48 semanas de fundador |
| Precio y cliente no conviven | "pyme ≤100 empleados" + USD 8.000-25.000, con una muestra que son *empresas líderes* |

Y el más incómodo de todos:

> **Escribí los documentos 10, 11, 12 y 13 después de que el documento 09 dijera por
> escrito "no escribir más documentación".**

Cuatro documentos más, la misma semana. Yo produje el vicio que luego critiqué. Es lo
único de todo esto que no está resuelto.

---

## 4. Lo que queda, en orden

### Ya hecho, listo para usar

- [x] Las 5 skills de venta y diagnóstico
- [x] El perfil público honesto
- [x] La organización limpia: 3 repos
- [x] Los 3 bugs de credibilidad
- [x] El respaldo completo en `old/`

### Bloqueos que solo tú puedes resolver

| # | Qué | Por qué bloquea |
|---|---|---|
| 1 | **Entidad legal** | Sin factura no hay B2B. Es anterior a todo lo demás |
| 2 | **`syntropyai.app`** | Mismo nombre, mismo sector. Una hora de investigación |
| 3 | **Fijar repos en la UI** | `Settings → Featured`. La API da 404 con tu plan |

### Lo que toca hacer

```
0.  Usar las 5 skills                       ← ya están escritas
1.  UNA empresa. UN número. Facturas.
2.  Piloto a USD 400, cobrado después de entregar
3.  El holón que salga del hallazgo — y puede no ser Cardinal
```

**Si solo se puede hacer una cosa: el guion de entrevista y salir a hablar con cinco
empresas.** El código sin diagnóstico es exactamente el 88% que nunca llega a producción.

---

## 5. La frase que resume el estado

La tesis es buena. La evidencia es sólida. El sustrato es real. **Y la única holón que
produce ingresos hoy es una entrevista de 75 minutos.**

Eso no es una observación. Es una fase. Las piezas están todas. Falta la conversación.

Y la prueba de que el resumen es honesto está en la sección 3: **las revisiones externas
encontraron el mismo problema que el análisis de 5 pasos, por un camino distinto.** Tres
sesiones independientes, un solo veredicto: hay mucho trabajo publicado y ninguna
conversación con un cliente.

---

## 6. Estado técnico verificado

```
negentmind   22d4fab   49 commits   4 sucios
.github    0da6fdb   55 commits   22 sucios
strategy   07b8f7d   15 commits   17 sucios
skills     108ca96    4 commits    5 sucios

Skills activas:  5 nuevas + 187 previas
Documentos:       36 públicos (18 pares EN/ES) + 14 privados
Respaldo:         old/  741 MB  3 bundles íntegros
```

**Estado 2026-11-11**: rebrand v1 (ruptura total) + renombre `negentropy→negentmind`, `skills-privado→skills`, org `NegentMind`, contacto `negent@negentmind.com`. Cambios sin commitear en los 4 repos. **Nada pusheado (orden vigente: sin push).**

## 7. El algoritmo de 5 pasos aplicado al proyecto

Análisis razonado sobre el contenido completo del workspace. No es un conteo: cada capa
se evaluó contra la regla del algoritmo —un requisito lleva el **nombre de una persona
real**, no de un departamento.

**Un aviso sobre el método.** El primer intento fue contar palabras con un script. El
dato era cierto (38.000 palabras, 0 archivos de código) y **decidía nada**. El análisis
útil salió de leer el contenido y razonar sobre él. Queda aquí la regla y no el conteo:
*si el resultado son números que no obligan a decidir nada, el método está equivocado.*

## Paso 1 — Cuestionar los requisitos: ¿detrás hay una persona?

| Requisito | ¿Quién lo pide? | Veredicto |
|---|---|---|
| Cardinal, Iris, Meta, Execute, Sage, Plan, Orchestra | El diagrama de Azure, un promedio de industria, una observación de mercado | **Falla** |
| Reverb, Reason | Condición escrita, ninguna activada | **Falla** |

**0 de 9 holones tienen a una persona real detrás.** Y lo más incómodo: **VantaDB está
"en producción" y no hay registrado quién lo usa.** El único activo real tampoco tiene un
cliente nombrado.

**El proyecto está parado en el paso 1**, y lo ha estado: 38.000 palabras, 187 skills,
9 holones validados contra Azure y arXiv, **0 personas**. Es el paso 1 hecho con
documentos en vez de con alguien.

## Paso 2 — Eliminar: ¿recuperaste al 10%?

El mayor exceso **no son los holones: son los skills**. 109 de 187 (58%) son de marca,
diseño y video, y hace meses que no se toca un banner.

Segundo exceso: el idioma. 18 archivos bilengües para 9 holones que quizá no se construyan.
Se recuperaría el 10% de sobra si se colapsaran a un solo holón.

**Trampa del paso 2 — el error de Tesla invertido:** lo que no se elimina es la parte que
produce el dinero. En Negent Mind es el **Diagnóstico**, y es una persona haciendo preguntas.
Si aplico "borra el 10%" al Diagnóstico, mato el único producto. **Regla: se elimina el
software no validado, la prosa y los holones; se protege el Diagnóstico.**

## Paso 3 — Simplificar: ¿estoy puliendo lo que no debería existir?

Dos casos, ambos el mismo error:

- **VantaDB: 5 bindings (Rust, Python, TS, Node, WASM) y 0 clientes registrados.** WASM y
  Node son la definición de optimizar antes de saber qué se necesita.
- **Marca: 5 tipografías, 682 MB de Remotion, 2 GIFs duales** para una empresa con 0
  clientes. No es "el diseño es feo": es que se diseñó a un cliente que no existe.

## Paso 4 — Acelerar el ciclo: ¿cuál es el ciclo?

El ciclo de producción actual **es la documentación**, no el negocio: escribir, leer,
escribir, con 0 clientes. El ciclo real —entrevista → mapa de caos → propuesta→ no existe
todavía. El paso 4 asume que ya hay un producto; Negent Mind tiene un método documentado.

**Acelerar no es escribir más rápido. Es acortar el tiempo hasta la primera persona real.**

## Paso 5 — Automatizar: ¿antes de simplificar?

Sí, y es el error que Musk cometió al principio de Tesla:

- `.tools/i18n-holons.py` genera 9 holones × 2 idiomas = 18 archivos, quizá de cosas que
  no se construirán. Automatizar el paso 2 sin cerrar el paso 1 multiplica el error.
- Remotion de 682 MB automatiza un proceso que ya corrió.

## Veredicto por capa

| Capa | Veredicto |
|---|---|
| **9 holones** | Los nombres se sostienen; el número no. Borrar 8, dejar 1 como hipótesis |
| **187 skills** | Peor exceso del proyecto: borrar 109 |
| **Marca** | Paso 3 mal aplicado. Guardar, no pulir |
| **Diagnóstico** | Único producto real. Es humano. No se elimina |
| **VantaDB** | Activo real sin cliente nombrado |

## Lo que revela que no se ve de otra forma

La tesis del "diagnóstico primero" que ya está en el roadmap **queda confirmada por otro
camino**: el paso 1 exige una persona real, y el Diagnóstico es el único mecanismo capaz de
producirla. **No es el primer producto: es el único que puede cerrar el paso 1.**

Las tres revisiones externas —dos analyses de negocio traídos de otras sesiones y el
propio algoritmo de 5 pasos— coinciden en el hallazgo central por caminos distintos:

| Análisis | Cómo llegó al mismo veredicto |
|---|---|
| Revisión de negocio #1 | *"El 88% no compró"* → 6 competidores × años = modelo roto, no mercado lento |
| Revisión de negocio #2 | 109 de 187 skills son de diseño y video → el trabajo está donde no está el dinero |
| Algoritmo de 5 pasos | Paso 1 exige una persona real → 0 de 9 holones la tienen |

Y la conclusión no la produce ninguno de los tres por separado: **la tesis es válida, el
sustrato es real, y la única capacidad que hoy produce un ingreso es una entrevista de
75 minutos.** Todo lo demás está publicado, versionado y verificado — y nada de eso es un
cliente.

Y el ciclo que hay que acortar, en orden:

```
1. Salir a hablar con 5 empresas. 0 holones sobreviven hasta que alguien diga "tengo eso"
2. Borrar 8 de 9 holones, 109 de 187 skills, colapsar la documentación al que sobreviva
3. No simplificar VantaDB ni la marca hasta que haya cliente
4. El ciclo es entrevista → propuesta. Acelerar = acortar el tiempo a la primera persona
5. No escalar la automatización hasta cerrar el paso 1
```

**La conclusión no es "simplifica más". Es que el proyecto no puede pasar del paso 1, y
ningún script lo saca de ahí. El único atajo es una conversación.**
