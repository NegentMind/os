# NegentMind — Especificación de Infraestructura para Agentes

> **Modelo de Referencia Arquitectónica para Sustratos Verificables de Agentes.**

Este documento unifica el marco arquitectónico de NegentMind. En lugar de fragmentar capacidades en paquetes desconectados o repositorios vacíos, NegentMind define la infraestructura agéntica como un sistema modular por capas construido sobre almacenamiento transaccional determinista.

---

## 1. Fundamentos Arquitectónicos

Los agentes autónomos requieren mucho más que orquestación de prompts: demandan **soberanía de estado, contexto verificable y límites deterministas de ejecución**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CAPA DE ORQUESTACIÓN                            │
│  - Coordinación multi-agente, ciclo de vida, máquinas de estados       │
├────────────────────────────────────────────────────────────────────────┤
│                    CAPA DE VERIFICACIÓN Y AUDITORÍA                    │
│  - Control metacognitivo, atestación de ejecución, registro inmutable  │
├────────────────────────────────────────────────────────────────────────┤
│                     CAPA DE CONTEXTO Y MEMORIA EPISÓDICA               │
│  - Grafos de conocimiento bitemporales, memoria de trabajo, tokens     │
├────────────────────────────────────────────────────────────────────────┤
│                 SUSTRATO CENTRAL DE MEMORIA (VantaDB)                  │
│  - Motor embebido en Rust, búsqueda híbrida HNSW + BM25, ACID          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Sustrato Central: VantaDB

El cimiento activo en producción de toda la arquitectura es **VantaDB** (`v0.7.0`), un motor embebido de persistencia y recuperación híbrida implementado en Rust.

* **Embebido y en Proceso:** Corre dentro del ciclo de vida de la aplicación; elimina la latencia de red.
* **Recuperación Híbrida:** HNSW (*Hierarchical Navigable Small World*) para embeddings densos + BM25 para coincidencia léxica.
* **Garantías ACID:** Aislamiento transaccional estricto, registro previo en WAL y snapshots puntuales.
* **Aceleración por Hardware:** Instrucciones SIMD nativas para cálculo de producto punto y cuantización con bajo consumo de memoria.

---

## 3. Hoja de Ruta de Especificaciones (Módulos RFC)

Las capacidades futuras evolucionan como solicitudes de cambio formales (RFCs) antes de crear código o repositorios:

### RFC-01: Cardinal (Contexto y Memoria de Trabajo)
* **Problema:** Los agentes sufren de deriva de contexto, desperdicio de tokens e incapacidad para determinar qué era cierto en una fecha específica.
* **Especificación:** Memoria episódica bitemporal que gestiona validez temporal (*valid-time*) y tiempo de transacción (*transaction-time*), auditando el origen y vigencia del conocimiento.
* **Dependencias:** Sustentado en los índices temporales y MVCC de VantaDB.

### RFC-02: Meta (Verificación y Metacognición)
* **Problema:** Falta de pruebas verificables de que las acciones del agente, llamadas a herramientas y evidencias recuperadas sean auténticas y libres de alucinaciones.
* **Especificación:** Trazas de ejecución deterministas, firmas de atestación criptográfica y ganchos de auditoría para revisiones externas.

### RFC-03: Iris (Percepción e Ingesta de Documentos)
* **Problema:** Incapacidad de indexar entradas multimodales no estructuradas (facturas escaneadas, diagramas, tablas) en estructuras consultables fiables.
* **Especificación:** Pipelines locales de extracción que transforman formatos complejos en grafos y nodos vectoriales indexados en VantaDB.

### RFC-04: Execute y Sage (Auto-reparación y Adaptación Continua)
* **Problema:** Bucles frágiles de ejecución de herramientas que fallan ante errores transitorios y modelos que repiten errores previamente corregidos.
* **Especificación:** Políticas deterministas de reintento, aislamiento en sandboxes y persistencia de correcciones humanas (*feedback loops*).

---

## 4. Estándares de Ingeniería

1. **Cero Repositorios Fantasma:** Los repositorios solo se crean cuando un RFC de implementación está formalmente aprobado y probado con benchmarks.
2. **Estado Determinista:** La inferencia estadística probabilística debe quedar siempre aislada detrás de esquemas rígidos y almacenamiento transaccional.
3. **Formatos Abiertos:** Las APIs dan prioridad a formatos universales de serialización (Arrow, Parquet, JSON-RPC/MCP) para prevenir bloqueos propietarios.
