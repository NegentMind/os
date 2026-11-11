# Negent Mind — Especificaciones y Arquitectura

<div align="right"><a href="./README.md">English</a> | Español</div>

> **Modelos arquitectónicos y estándares de ingeniería para agentes de IA verificables.**

Este repositorio alberga la capa de especificaciones técnicas de [Negent Mind](https://github.com/NegentMind).

---

### Componentes Principales

* 📖 **[SPECIFICATION_ES.md](./SPECIFICATION_ES.md)**: Modelo de arquitectura por capas (Memoria, Contexto, Verificación, Orquestación).
* ⚡ **Sustrato en Producción**: [VantaDB](https://github.com/ness-e/Vantadb) (`v0.7.0`) — Motor embebido de memoria en Rust con recuperación HNSW + BM25.

---

### Cartera de Especificaciones (RFCs)

| RFC | Módulo | Enfoque |
|---|---|---|
| **RFC-01** | **Cardinal** | Memoria episódica bitemporal, anclaje de contexto y presupuesto de tokens. |
| **RFC-02** | **Meta** | Atestación criptográfica de ejecución, auditoría y control de alucinaciones. |
| **RFC-03** | **Iris** | Ingesta multimodal transformando documentos no estructurados en grafos verificables. |
| **RFC-04** | **Execute & Sage** | Sandboxes deterministas de ejecución de herramientas y bucles de corrección. |

---

### Licencia

Distribuido bajo la [Licencia Apache 2.0](./LICENSE).
