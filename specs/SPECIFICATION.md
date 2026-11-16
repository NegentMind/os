# NegentMind — Agent Infrastructure Specification

> **Status: research/vision.** The holons described here are a long-term capability map, not released products. Only VantaDB is shipped (v0.9.0).

> **Architectural Reference Model for Verifiable Agent Substrates.**

This document unifies the architectural framework of NegentMind. Rather than treating capabilities as disconnected packages or empty repositories, NegentMind defines agent infrastructure as a layered modular system built on top of deterministic, persistent storage.

---

## 1. Architectural Foundations

Autonomous agents require more than prompt orchestration: they require **state sovereignty, verifiable context, and deterministic execution boundaries**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ORCHESTRATION LAYER                           │
│  - Multi-agent coordination, lifecycle management, state transitions   │
├────────────────────────────────────────────────────────────────────────┤
│                      VERIFICATION & AUDIT LAYER                        │
│  - Metacognitive checks, execution attestation, cryptographic logging   │
├────────────────────────────────────────────────────────────────────────┤
│                       CONTEXT & EPISODIC LAYER                         │
│  - Bitemporal knowledge graphs, working memory, token budgeting        │
├────────────────────────────────────────────────────────────────────────┤
│                    CORE MEMORY SUBSTRATE (VantaDB)                     │
│  - Embedded Rust engine, HNSW + BM25 hybrid search, ACID persistence   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Substrate: VantaDB

The active foundation of the entire architecture is **VantaDB** (`v0.9.0`), an embedded persistent storage and hybrid vector retrieval engine implemented in Rust.

* **Embedded & In-Process:** Runs within the application lifecycle; zero network overhead.
* **Hybrid Retrieval:** HNSW (Hierarchical Navigable Small World) for dense embeddings + BM25 for lexical matching.
* **ACID Guarantees:** Strict transactional boundaries, write-ahead logging (WAL), and point-in-time snapshotting.
* **Hardware Acceleration:** Native SIMD dot-product computation and quantization for minimal memory footprint.

---

## 3. Specifications Pipeline (RFC Modules)

Future capabilities evolve as formal Requests for Comments (RFCs) before any codebase is provisioned:

### RFC-01: Cardinal (Context & Working Memory)
* **Problem:** Agents suffer from context drift, token waste, and inability to resolve what was true at a specific timestamp.
* **Specification:** A bitemporal episodic memory layer managing valid-time and transaction-time states, tracking knowledge provenance and temporal validity.
* **Dependencies:** Backed by VantaDB's MVCC and temporal indexing.

### RFC-02: Meta (Verification & Metacognition)
* **Problem:** Lack of verifiable proof that an agent's actions, tool calls, and retrieved evidence are authentic and free from hallucinated state.
* **Specification:** Deterministic execution traces, signed attestation logs, and verification hooks for external audits.

### RFC-03: Iris (Perception & Document Ingestion)
* **Problem:** Inability to index unstructured multimodal inputs (scanned invoices, schemas, tabular documents) into searchable structures.
* **Specification:** Local-first extraction pipelines converting complex document formats into vector-indexed, verifiable nodes.

### RFC-04: Execute & Sage (Self-Healing & Continuous Adaptation)
* **Problem:** Fragile tool execution loops that fail on transient errors, coupled with models that repeat corrected mistakes.
* **Specification:** Deterministic retry policies, sandbox execution boundaries, and human-in-the-loop correction feedback loops stored persistently.

---

## 4. Engineering Standards

1. **No Phantom Repositories:** Codebases are only instantiated once an implementation RFC is approved and benchmarked.
2. **Deterministic State:** Probabilistic inference must always be quarantined behind deterministic schemas and verifiable transactions.
3. **Open Standards:** APIs prioritize open serialization formats (Arrow, Parquet, JSON-RPC/MCP) to prevent vendor lock-in.
