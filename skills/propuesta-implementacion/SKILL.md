---
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

## Los precios entrada (Eros, 0 clientes — hipótesis a validar)

| Holón | Rango entrada | Rango mid-market luego |
|---|---|---|
| Cardinal | USD 1.000 – 4.000 | USD 8.000 – 15.000 |
| Iris | USD 1.000 – 4.000 | USD 10.000 – 18.000 |
| Meta | USD 1.000 – 4.000 | USD 12.000 – 25.000 |
| Execute | USD 1.000 – 4.000 | USD 15.000 – 25.000 |

Piloto: USD 100 adelantado (5 días, descontable del diagnóstico).
Diagnóstico: USD 400 – 1.500.
Suscripción (solo con Meta construida): USD 200 – 500/mes.

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
