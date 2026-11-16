# Negent Mind — Specifications & Architecture

<div align="right"><a href="./README_ES.md">Español</a> | English</div>

> **Architectural blueprints and engineering standards for verifiable AI agents.**

This folder holds the internal (private) technical specifications of [Negent Mind](https://github.com/NegentMind).

> **Status: research / vision.** The modules below are a long-term capability map, not released products. The only shipped project is VantaDB (`v0.9.0`).

---

### Core Components

* **[SPECIFICATION.md](./SPECIFICATION.md)**: Layered architecture model (Memory, Context, Verification, Orchestration).
* **Shipped engine**: [VantaDB](https://github.com/ness-e/Vantadb) (`v0.9.0`) — Embedded Rust memory engine with HNSW + BM25 retrieval.

---

### Specifications Pipeline

| RFC | Module | Focus |
|---|---|---|
| **RFC-01** | **Cardinal** | Bitemporal working memory, context grounding, and token budgeting. |
| **RFC-02** | **Meta** | Execution attestation, immutable audit logs, and hallucination checks. |
| **RFC-03** | **Iris** | Multimodal ingestion converting unstructured documents into verifiable graphs. |
| **RFC-04** | **Execute & Sage** | Deterministic tool execution sandboxes and persistent correction feedback. |

---

### License

Distributed under the [Apache 2.0 License](./LICENSE).
