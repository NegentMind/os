# 01 — Visión y tesis

## La metáfora original y por qué era insuficiente

Negent Mind nació con: **"Del caos al orden para la era de los agentes de IA."**

Es una buena frase. Es correcta en dirección. Pero es **infalsificable**, y una
tesis infalsificable no se puede evaluar, no se puede competir y no se puede
vender.

Tres fallos concretos:

| Fallo | Consecuencia |
|---|---|
| No dice **qué** caos | Cualquiera puede reclamarlo. No hay posicionamiento |
| No dice **a qué** orden | El cliente no puede saber si le sirve |
| No es **medible** | No hay forma de cobrar por cerrar una brecha |

El manifiesto ya avisaba: *"Infrastructure is more valuable than applications"*
— pero sin un cliente definido, esa tesis es una declaración de intenciones, no
un negocio.

---

## La redefinición

### El caos no es la ignorancia. El caos es operativo.

Este es el cambio de fondo, y es lo que separa a Negent Mind de las seis
consultorías de IA que ya operan en Venezuela.

La hipótesis de mercado (documentada en `02-evidencia-mercado.md`) es que el
**95% de las empresas-liderazgo aun no han integrado IA, pero el cuello de
botella no es saber qué es una IA.** Es que no pueden sostener un sistema de IA
porque el entorno operativo se los cae encima:

- Se corta la luz (46% reporta fallas en servicios públicos, **+13%: el mayor
  alza del año**)
- Se va la persona que lo configuró (35% reporta problemas de retención)
- El documento fuente es un PDF escaneado de 2019
- Nadie sabe de dónde salió el dato
- El precio del producto cambió tres veces este trimestre

Un LLM no falló porque la empresa no supiera de IA. Falló porque **el sistema
no sobrevivió a la realidad operativa.**

> **El orden no es "saber IA". El orden es que el sistema siga siendo
> confiable cuando todo lo demás falla.**

---

## La tesis de Negent Mind

> Mientras el mercado vende **inteligencia**, Negent Mind vende **la capacidad de
> confiar en ella**.

Toda la arquitectura — los holones, VantaDB, el método — existe para sostener
esa única promesa. Si un componente no la refuerza, no se construye.

### Por qué esto es defendible

1. **La competencia vende capacidad; nadie vende confiabilidad.** Verificado
   en `03-panorama-competitivo.md`.
2. **El contexto es un problema estructural, no tecnológico.** Ninguna librería
   resuelve "esta empresa no sabe qué sabe, ni cuándo".
3. **La sovereignidad es un requisito, no una preferencia.** Con 18% de las
   empresas reportando impacto alto de licencias OFAC y solo 8 centros de datos
   en el país, un sistema cloud-first no es una alternativa: es un riesgo legal
   y técnico. Un sustrato local-first sí es la respuesta.
4. **El método es replicable y se vende antes que el software.** El Diagnóstico
   es un producto con precio fijo, y produce el mapa que determina cuál holón
   se vende después. Datos reales, no hipótesis inventadas.

---

## Los 6 caos

Cada caos es una **categoría de hallazgo del diagnóstico** y, a la vez, la
**definición funcional de un holón**. Esto resuelve el problema de los 9 repos
vacíos: un holón deja de ser una promesa de roadmap y se convierte en algo que
se diagnostica.

| # | El caos | Se manifiesta como | Holón | Prioridad |
|---|---|---|---|---|
| 1 | **Caos de contexto** | La empresa no sabe qué sabe, ni cuándo, ni de quién | **Cardinal** | 🔴 Alta |
| 2 | **Caos de percepción** | Facturas, contratos y formularios son imágenes que nadie puede consultar | **Iris** | 🔴 Alta |
| 3 | **Caos de ejecución** | La automatización se rompe y nadie sabe por qué ni la repara | **Execute** | 🟡 Media |
| 4 | **Caos de adaptación** | El sistema repite lo ya corregido y las personas no cambian cómo trabajan | **Sage** | 🟡 Media |
| 5 | **Caos de confianza** | Nadie puede verificar si la IA dijo la verdad | **Meta** | 🔴 Alta |
| 6 | **Caos de descomposición** | Nadie descompone el trabajo, y todos hacen todo | **Plan** | 🟡 Media |

**Holón de soporte:** **Orchestra** — no es cognitivo, es el runtime que hace
que los demás cooperen.
**Sustrato:** **VantaDB** — el único holón construido (memoria, v0.7.0).

### El orden que se vende

> De la **incertidumbre operativa** a la **trazabilidad verificable**.

No "más IA". **Menos duda.**

---

## La coherencia con lo ya construido

Esta redefinición no invalida el trabajo previo. Lo reencuadra:

| Ya existe | reencuadre |
|---|---|
| VantaDB (memoria ACID, local-first) | Es el **sustrato soberano**. Deja de ser un proyecto paralelo y pasa a ser el argumento de venta: sin él, no hay nada local-first |
| Sistema de gates, ADRs, `verify-log` | Es el **método**. Se demuestra en el Diagnóstico: "esto es lo que hacemos internamente" |
| 9 holones sin código | Ahora son **9 hipótesis de diagnóstico**. Una validada es un producto vendible |
| Sistema de marca congelado | Sigue siendo válido. La identidad no cambia, **el contenido sí** |

---

## Lo que Negent Mind NO es

Mantener la lista del manifiesto. Es la frontera que evita expandir el foco:

- **No es un framework de agentes.** No orquestamos agentes de otros; les damos
  orden.
- **No es un LLM.** No entrenamos ni servimos modelos.
- **No es una SaaS cloud.** El modelo es local-first por necesidad de mercado,
  no por dogmatismo — por eso el diagnóstico se vende igual si la empresa
  termina cloud.
- **No es consultoría genérica.** Cada diagnóstico tiene un entregable
  reproducible y un precio fijo.

---

## La frase que lo resume

> **Negent Mind convierte el caos operativo de una empresa en un sistema en el que
> se puede confiar.**

Si una frase no cabe en el pitch, no cabe en el negocio. Esta cabe.
