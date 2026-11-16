---
name: mapa-de-caos
description: >
  Escribir el Mapa de Caos, el entregable facturable del diagnostico de NegentMind.
  Usar cuando haya que volcar el hallazgo de una entrevista a un documento que el
  cliente pueda leer, discutir y archivar. Un mapa por caos encontrado.
---

> **Estado: experimento congelado.** Instrumento de la hipótesis B2B de diagnóstico (Registro de Decisiones, Notion). No usar ni publicar hasta que esa hipótesis se reactive.

# Mapa de Caos

El entregable del diagnóstico. **Un documento por caos encontrado.** Si no se
encuentra ninguno, el entregable es el informe de "no hay problema aquí", que se
cobra igual.

## Por qué se estructura así

El cliente no compró un análisis. Compró una lista de problemas con orden y
costo. Un documento largo que mezcla hallazgos, especulaciones y recomendaciones
se lee una vez y se archiva.

## Plantilla

```markdown
# Mapa de Caos — <organización> — <fecha>

Diagnóstico ejecutado por <quién>. Duración: <X> horas en <Y> sesiones.
Este documento describe <N> caos encontrados. Ninguno se corrige con este
documento: son hallazgos, no soluciones.

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
<Lo que la organización usa hoy para saber si esto está mejorando. Si no usa
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
