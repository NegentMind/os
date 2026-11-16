---
name: ocr-documentos
description: >
  Convertir facturas, contratos, formularios y catalogos en PDF o imagen en registros
  estructurados con procedencia. Es el prework del holon Iris. Usar cuando una
  organizacion tiene documentos que nadie puede consultar.
---

> **Estado: experimento congelado.** Instrumento de la hipótesis B2B de diagnóstico (Registro de Decisiones, Notion). No usar ni publicar hasta que esa hipótesis se reactive.

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
| "Los números del mes no cuadran con soporte" | Percepción + Contexto |

## Lo que este trabajo produce además del registro

1. **El mapa de caos** de la organización, con el tiempo real que se pierde
2. **El dataset de correcciones** que Sage necesita
3. **La medición del línea base**: sin ella no hay forma de demostrar mejora
