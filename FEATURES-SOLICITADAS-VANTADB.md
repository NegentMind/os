# Funciones ausentes en VantaDB — catálogo para verificar

> **ANEXO HISTORICO - snapshot 2026-10-01 (pre-v0.9.0).** Los 42 items estan sin verificar; el backlog real vive en GitHub Issues de VantaDB (migracion pendiente, tarea en Notion). No anadir items nuevos aqui: este documento queda como referencia del analisis, no como backlog vivo.

> Análisis profundo del árbol `C:\Users\Eros\VantaDB Proyect\VantaDB` (lectura) + releases publicadas.
> Solo funciones/capacidades que HOY no existen o no están completas. Cada una: explicación, ejemplo de uso esperado, dónde verificar y línea de resultado.
> Leyenda de estado: **Pendiente** (falta verificar en release) · **Ausente-plan** (reconocida en backlog/roadmap) · **Ausente-sin-plan** (no está en su roadmap).
> Última actualización: 2026-10-01.

## Resumen

| # | Función | Estado | Fuente en VantaDB |
|---|---|---|---|
| A1 | Bitemporalidad valid-time + confianza por registro (en release estable) | Pendiente | SCH-02/03/07, ADR-0046 |
| A2 | Historial transaccional cross-key (AS OF de transacción) | Ausente-plan | IQL.md (nota v1.0) |
| A3 | Propiedades + validez temporal en aristas | Ausente-plan | SCH-09 |
| A4 | Decay/olvido de aristas | Ausente-sin-plan | FUT-17 |
| A5 | Validación de esquema opcional por namespace | Ausente-sin-plan | FUT-18 |
| A6 | Políticas de retención/compliance por namespace | Ausente-plan | PRO-04 |
| A7 | Repetición espaciada / curva de olvido (Ebbinghaus) | Ausente-plan | FUT-10 → MGR-11 |
| B1 | `graphrag_search` en bindings (Python/TS/Node/WASM) | Ausente | GRAPH_RAG.md: solo Rust |
| B2 | Detección de comunidades Leiden/Louvain | Ausente-plan (P28) | FUT-03 |
| B3 | Agregaciones en IQL (COUNT/SUM/GROUP BY) | Ausente-sin-plan | IQL.md sin sintaxis |
| B4 | Paginación explícita en IQL (LIMIT/OFFSET) | Ausente-sin-plan | IQL.md sin sintaxis |
| B5 | Caché de resultados de búsqueda LRU+TTL | Ausente-sin-plan | FUT-19 |
| B6 | Corrección de consultas "did you mean" | Ausente-sin-plan | FUT-22 (hoy solo autocomplete) |
| B7 | Reranking cross-encoder en bindings core | Ausente-parcial | tutoriales: solo integración litellm |
| B8 | Embeddings Matryoshka (truncado de dimensión) | Ausente-sin-plan | FUT-02 |
| B9 | Índices > RAM (DiskANN disk-backed, ScaNN persistido) | Ausente-plan | FUT-14 |
| B10 | Semilla configurable de IVF | Ausente-sin-plan | FUT-24 |
| C1 | Suscripción a cambios en vivo (CDC/subscribe) | Ausente-plan | FUT-16 |
| C2 | Federation P2P edge-to-edge | Ausente-sin-plan | FUT-21 |
| C3 | Portabilidad/interop de memoria firmada (W3C/IETF) | Ausente-plan | MEMG-15 |
| C4 | Replicación multi-copy / DR nativa | Ausente-plan | PRO-02 (wal-shipping opt-in) |
| D1 | Cifrado en reposo en server mode | Ausente-plan | HTTP_API.md:701 (SRV-10) |
| D2 | Request timeout en el server HTTP | Ausente-sin-plan | review vantadb-server:122 |
| D3 | OIDC discovery (hoy solo JWT HS256) | Ausente-plan | ADR-0039 |
| D4 | RBAC por acción + modelo trusted/tainted | Ausente-plan | MGR-04 |
| D5 | Multi-tenancy con aislamiento por organización | Ausente-plan (Pro) | PRO-01 |
| D6 | Admin server + dashboard enterprise | Ausente-plan (Pro) | PRO-05 |
| D7 | Audit trail compliance completo | Ausente-plan (Pro) | PRO-06 (audit JSONL opt-in existe) |
| D8 | Billing/quota en server mode | Ausente-plan | DEC-02 |
| D9 | Notifications JSON-RPC en MCP (-32700) | Pendiente (bug) | review cross-módulos F-3 |
| E1 | Attestation de escrituras (proof of write) | Ausente | CERTIFIED_DELETE.md (solo delete) |
| E2 | Verificación de certificados desde MCP/bindings | Ausente | CERTIFIED_DELETE.md (solo CLI) |
| F1 | Batch multi-clave atómico en bindings | Pendiente | PYTHON_SDK put_batch / MCP memory_put_batch |
| F2 | Throughput de ingesta batch medido/garantizado | Pendiente | benches/ |
| F3 | Detección de contradicción en ingesta L1 | Ausente-plan | MEMG-01 |
| F4 | Ingesta de documentos no-Markdown (PDF/DOCX/HTML) | Ausente | wiki/sources.rs:82 (solo .md) |
| F5 | Indexación incremental con watcher (repo-map) | Ausente-plan | MGR-22 / FIND-120 |
| F6 | Multimodal (imagen/audio como registros) | Ausente-sin-plan | FUT-15 |
| G1 | Go SDK (C-ABI + cgo) | Ausente-plan | FUT-08 |
| G2 | Paridad de superficies entre SDKs | Pendiente | análisis: versions/vacuum solo node |
| G3 | WASM/OPFS multi-pestaña sin corrupción | Ausente | WASM_STORAGE_REVIEW.md:81 |
| G4 | `vanta-memory` (L0-L3, scenes, persona, wiki, dreams) en bindings | Ausente-plan | VANTA_MEMORY.md (core-only) |

---

## A. Datos y esquema

### A1. Bitemporalidad valid-time + confianza por registro (en release estable)
**Explicación:** ventana de validez (`valid_at_ms`/`invalid_at_ms`) y confianza (`confidence`, `confidence_class`) por registro, consultables con `AS OF`. Permite responder "¿qué era cierto el día X?" y filtrar por confianza mínima.
**Ejemplo:**
```python
db.put("erp/facturas", "fac-001", "Total 1.200 USD", valid_at=1_760_000_000_000, confidence=0.92)
db.memory.invalidate("erp/facturas", "fac-001", invalid_at=1_765_000_000_000)
rows = db.query('SELECT * FROM erp/facturas AS OF 1759276800000')
rows = db.search("facturado", min_confidence=0.8, exclude_superseded=True)
```
**Verificar:** ADR-0046; `docs/api/IQL.md` (`AS OF`); `python -c "import vantadb; print(vantadb.Client('./t').capabilities())"`; release PyPI 0.8.0.
**Resultado:** ____

### A2. Historial transaccional cross-key (AS OF de transacción)
**Explicación:** hoy `AS OF` es *valid-time* (cuándo era cierto). El *transaction-time* (qué se escribió y cuándo, cross-key) solo existe por clave (`get_version`/`versions`) con retención limitada. Falta un `AS OF` transaccional que abarque todo el keyspace.
**Ejemplo:**
```python
# Esperado: estado completo del keyspace tal como se veía al escribir el lote N
snapshot = db.query('SELECT * FROM * AS OF TX 1759276800000')
```
**Verificar:** `docs/api/IQL.md` (nota: "Transaction-time travel… not available as a cross-key AS OF in this release").
**Resultado:** ____

### A3. Propiedades + validez temporal en aristas
**Explicación:** una arista hoy tiene `target/label_id/weight/reverse/created_at_ms`; no admite propiedades arbitrarias ni ventana de validez, así que una relación no puede "dejar de ser cierta" ni llevar metadatos.
**Ejemplo:**
```python
db.add_edge("org/equipo", "ana", "reporta_a", "luis",
            properties={"desde": "2024-01", "fuente": "RRHH"},
            valid_at=1_700_000_000_000)
db.query('MATCH org/equipo SIGUE 1..1 "reporta_a" AS OF 1759276800000')
```
**Verificar:** `docs/dev/Backlog.md` SCH-09; `src/node/edge.rs`.
**Resultado:** ____

### A4. Decay/olvido de aristas
**Explicación:** el decaimiento existe para nodos (BayesianDecay), no para aristas: los grafos acumulan relaciones obsoletas sin puntuar ni expirar.
**Ejemplo:**
```python
top = db.graph_neighbors("ana", decayed=True, min_strength=0.3)  # solo relaciones vigentes
```
**Verificar:** `docs/dev/backlog-futuro.md` FUT-17.
**Resultado:** ____

### A5. Validación de esquema opcional por namespace
**Explicación:** no hay validación estricta de tipos/campos por namespace; un dato mal formado se guarda en silencio.
**Ejemplo:**
```python
db.set_schema("erp/facturas", {"total": "float", "rif": "string", "fecha": "int"})
db.put("erp/facturas", "fac-9", {"total": "mil doscientos"})  # → SchemaError
```
**Verificar:** `docs/dev/backlog-futuro.md` FUT-18.
**Resultado:** ____

### A6. Políticas de retención/compliance por namespace
**Explicación:** la retención de versiones es un límite global por clave; no existen políticas por namespace (guardar X días, borrar al vencer contrato), requeridas para compliance.
**Ejemplo:**
```python
db.set_retention("clientes/acme", {"versions_days": 365, "hard_delete": True})
```
**Verificar:** `docs/dev/Backlog-negocio.md` PRO-04; ADR-0046 (retención 32/key).
**Resultado:** ____

### A7. Repetición espaciada / curva de olvido
**Explicación:** no hay olvido modelado con curva de Ebbinghaus (frecuencia de acceso, importancia, confirmaciones) ni refresco programado de memorias; solo scoring de eviction.
**Ejemplo:**
```python
db.memory.review("preferencias", now=...)  # refuerza/degrada según curva de olvido
```
**Verificar:** `docs/dev/backlog-futuro.md` FUT-10; MGR-11.
**Resultado:** ____

---

## B. Búsqueda, grafo y rendimiento

### B1. `graphrag_search` en bindings
**Explicación:** el pipeline GraphRAG (semilla → expansión → recuperación → contexto) está implementado solo en Rust; Python/TS/Node/WASM no lo exponen.
**Ejemplo:**
```python
res = db.graphrag_search("documents", query="¿quién aprobó el contrato?", seed_k=10, expansion_hops=2)
print(res.context_text)
```
**Verificar:** `docs/api/GRAPH_RAG.md`; `rg "graphrag" vantadb-python vantadb-ts vantadb-node vantadb-wasm`.
**Resultado:** ____

### B2. Detección de comunidades Leiden/Louvain
**Explicación:** existen PageRank y degree centrality; no hay detección de comunidades, necesaria para resumir por clúster.
**Ejemplo:**
```python
clusters = db.graph_communities(namespace="docs", algorithm="leiden")
for c in clusters: print(c.members, c.summary)
```
**Verificar:** FUT-03 (promovido a P28); `docs/dev/graphrag/README.md:301`.
**Resultado:** ____

### B3. Agregaciones en IQL (COUNT/SUM/GROUP BY)
**Explicación:** IQL tiene `FROM/SELECT/JOIN`, pero no agregaciones: contar o sumar exige traer filas y agregar fuera.
**Ejemplo:**
```sql
SELECT rif, SUM(total) FROM erp/facturas WHERE anio = 2026 GROUP BY rif
```
**Verificar:** `docs/api/IQL.md` (sin sintaxis de GROUP BY/agregados).
**Resultado:** ____

### B4. Paginación explícita en IQL (LIMIT/OFFSET)
**Explicación:** las APIs `list/search` sí tienen cursor, pero el lenguaje IQL no expone LIMIT/OFFSET.
**Ejemplo:**
```sql
SELECT * FROM erp/facturas RANK BY fecha DESC LIMIT 50 OFFSET 100
```
**Verificar:** `docs/api/IQL.md`.
**Resultado:** ____

### B5. Caché de resultados de búsqueda LRU+TTL
**Explicación:** existe caché interno de almacenamiento, no de resultados de búsqueda repetidas.
**Ejemplo:**
```python
db.search("resumen mensual", cache={"ttl_ms": 60_000})  # segunda llamada servida de caché
```
**Verificar:** FUT-19.
**Resultado:** ____

### B6. Corrección de consultas "did you mean"
**Explicación:** hay autocomplete por prefijo; no hay sugerencia/corrección para consultas de texto libre mal escritas.
**Ejemplo:**
```python
res = db.search("factura elecrtronica")
print(res.did_you_mean)   # "factura electrónica"
```
**Verificar:** FUT-22.
**Resultado:** ____

### B7. Reranking cross-encoder en bindings core
**Explicación:** el reranking de precisión existe vía paquete de integración (litellm, Rust); el core de bindings no expone un reranker directo. MMR sí existe en embedded SDK.
**Ejemplo:**
```python
rows = db.search("cláusula de penalización", rerank={"model": "bge-reranker-v2", "top_n": 10})
```
**Verificar:** tutorial lancedb:352-356; `04-hybrid-search-basics.md:191`; `integrations/`.
**Resultado:** ____

### B8. Embeddings Matryoshka (truncado de dimensión)
**Explicación:** no hay truncamiento dinámico de dimensionalidad (1536→256) para hardware limitado; obliga a re-embeddear.
**Ejemplo:**
```python
db.search("consulta", vector_truncate=256)  # recorta el embedding sin recomputar
```
**Verificar:** FUT-02.
**Resultado:** ____

### B9. Índices > RAM
**Explicación:** DiskANN corre en RAM ("purely in-memory"), ScaNN sin serialización; datasets mayores que memoria no tienen índice disco persistente.
**Ejemplo:**
```python
db.create_index("embeddings", kind="diskann", path="./idx")  # sobrevive reinicio y excede RAM
```
**Verificar:** FUT-14; `src/index/diskann.rs`, `src/index/scann.rs`.
**Resultado:** ____

### B10. Semilla configurable de IVF
**Explicación:** el build de IVF usa semilla fija (42): reproducible pero no configurable para benchmarks/experimentos.
**Ejemplo:**
```python
db.rebuild_index("embeddings", ivf_seed=1337)
```
**Verificar:** FUT-24; `src/index/ivf.rs:102`.
**Resultado:** ____

---

## C. Tiempo real y sincronización

### C1. Suscripción a cambios en vivo (CDC/subscribe)
**Explicación:** no hay forma de recibir cambios en vivo cross-proceso; se consulta por polling. El WAL ya es el log, falta exponerlo (cursor/SSE).
**Ejemplo:**
```python
for ev in db.subscribe("tareas/ledger", from_cursor="wal:91827"):
    print(ev.op, ev.key)   # INSERT | UPDATE | DELETE
```
**Verificar:** FUT-16; `rg "subscribe" vantadb-python vantadb-ts vantadb-wasm` (solo WASM/IDB).
**Resultado:** ____

### C2. Federation P2P edge-to-edge
**Explicación:** sin sincronización eventual entre instancias/agentes desconectados.
**Ejemplo:**
```python
db.federation_peers()          # → [{peer: "edge-2", lag_ms: 230}]
db.federation_sync("edge-2")
```
**Verificar:** FUT-21.
**Resultado:** ____

### C3. Portabilidad/interop de memoria firmada
**Explicación:** el export existe (JSONL/binario) pero no en formatos de frontera (AGENTS.md/MCP/IETF/W3C) ni con firma/checksum verificable para intercambio entre herramientas.
**Ejemplo:**
```python
db.export_namespace("docs", format="aaif", sign_key=key, out="docs.aaif")
db.import_file("docs.aaif", verify_signature=True)
```
**Verificar:** MEMG-15; W3C CG AI Agent Memory Interop.
**Resultado:** ____

### C4. Replicación multi-copy / DR nativa
**Explicación:** `wal-shipping` existe como feature opt-in (candidata Pro); no hay replicación multi-copia ni failover integrados.
**Ejemplo:**
```python
db.replica_add("replica-2")   # failover automático si el primario cae
```
**Verificar:** PRO-02; `FEATURES.md` (`wal-shipping`).
**Resultado:** ____

---

## D. Seguridad y servidor

### D1. Cifrado en reposo en server mode
**Explicación:** el core tiene cifrado AES-256-GCM opt-in; el server documenta "No encryption at rest" (SRV-10 en roadmap).
**Ejemplo:**
```yaml
server:
  encryption_at_rest: { enabled: true, key_env: VANTA_SERVER_KEY }
```
**Verificar:** `docs/api/HTTP_API.md:701`; FEATURES.md (`encryption` opt-in).
**Resultado:** ____

### D2. Request timeout en el server HTTP
**Explicación:** no hay `TimeoutLayer`; un handler lento (p. ej. PageRank sobre DB grande) retiene la conexión indefinidamente.
**Ejemplo:**
```yaml
server: { request_timeout_ms: 30_000 }
```
**Verificar:** `docs/dev/reviews/modulos/vantadb-server.md:122`.
**Resultado:** ____

### D3. OIDC discovery
**Explicación:** la autenticación enterprise es JWT HS256 offline; OIDC discovery quedó diferido, así que no hay login con proveedor de identidad.
**Ejemplo:**
```yaml
server: { auth: { oidc: { issuer: "https://login.empresa.com/.well-known/openid-configuration" } } }
```
**Verificar:** ADR-0039.
**Resultado:** ____

### D4. RBAC por acción + trusted/tainted
**Explicación:** existe RBAC por namespace y rol básico; falta control fino por acción y clases de confianza por documento.
**Ejemplo:**
```yaml
policy: { "erp/*": ["read"], "docs/tainted/*": ["read:redacted"] }
```
**Verificar:** MGR-04.
**Resultado:** ____

### D5. Multi-tenancy con aislamiento por organización
**Explicación:** feature Pro sugerida: aislamiento duro por organización (cifrado y cuotas por tenant), más allá de namespaces.
**Ejemplo:**
```yaml
tenants: { acme: { quota_mb: 500, encryption_key: env:ACME_KEY } }
```
**Verificar:** PRO-01.
**Resultado:** ____

### D6. Admin server + dashboard enterprise
**Explicación:** feature Pro: consola de administración (usuarios, cuotas, salud, auditoría) para despliegues enterprise.
**Ejemplo:** panel web en `https://vanta.local/admin` con usuarios, namespaces y consumo.
**Verificar:** PRO-05.
**Resultado:** ____

### D7. Audit trail compliance completo
**Explicación:** `src/audit.rs` (JSONL opt-in) existe en core; falta el paquete de compliance (retención, export firmado, informes) que sí modela PRO-06.
**Ejemplo:**
```python
db.audit_export(from="2026-01-01", to="2026-10-01", signed=True, format="cef")
```
**Verificar:** PRO-06; `src/audit.rs`.
**Resultado:** ____

### D8. Billing/quota en server mode
**Explicación:** no hay contador de coste/crédito por consumo (icebox; decisión ÷1000 vs ÷10000 pendiente).
**Ejemplo:**
```python
db.usage_summary(tenant="acme")  # → {"ops": 12000, "credits": 12.0}
```
**Verificar:** DEC-02.
**Resultado:** ____

### D9. Notifications JSON-RPC en MCP
**Explicación:** el server MCP rechaza mensajes sin `id` (`notifications/initialized`) con -32700; puede romper clientes MCP estrictos.
**Ejemplo:**
```
→ {"jsonrpc":"2.0","method":"notifications/initialized"}
← (nada; hoy: error -32700)
```
**Verificar:** `docs/dev/reviews/modulos/cross-modulos.md:189` (F-3); probar el handshake.
**Resultado:** ____

---

## E. Verificabilidad

### E1. Attestation de escrituras (proof of write)
**Explicación:** el certificado de integridad con referencia a la cadena WAL existe para borrados; no para escrituras.
**Ejemplo:**
```python
cert = db.put_certified("audit/decisiones", "dec-042", "Aprobado", metadata={"modelo": "riesgo-v3"})
assert db.verify_certificate(cert)
```
**Verificar:** `docs/api/CERTIFIED_DELETE.md` (solo delete).
**Resultado:** ____

### E2. Verificación de certificados desde MCP/bindings
**Explicación:** la verificación existe en CLI (`vanta-cli certificate verify`) y Rust; falta superficie MCP/SDK para automatizarla.
**Ejemplo:**
```jsonc
{ "name": "certificate_verify", "arguments": { "namespace": "audit/decisiones", "key": "dec-042" } }
```
**Verificar:** `rg "certificate" vantadb-mcp/src vantadb-python`.
**Resultado:** ____

---

## F. Escritura e ingesta

### F1. Batch multi-clave atómico en bindings
**Explicación:** `put_batch` (Python) y `memory_put_batch` (MCP) existen como all-or-nothing; falta confirmar atomicidad cross-key real y su comportamiento ante fallo a mitad (contrato documentado y probado).
**Ejemplo:**
```python
db.put_batch([("t/ledger", "p1", "..."), ("t/ledger", "p2", "...")])  # fallo en p2 ⇒ 0 escritos
```
**Verificar:** `docs/api/PYTHON_SDK.md`; `MCP.md:285`; prueba: fallar el ítem k y contar.
**Resultado:** ____

### F2. Throughput de ingesta batch medido
**Explicación:** no hay cifra garantizada/documentada de records/s; el techo se mide con benchmarks propios (hay `benches/`).
**Ejemplo:**
```python
t0=time.time(); db.put_batch(records_500); print(500/(time.time()-t0))
```
**Verificar:** `benches/`; correr batch de 500-1.000 con vectores.
**Resultado:** ____

### F3. Detección de contradicción en ingesta L1
**Explicación:** la detección existe en consolidación (dreams), no al ingerir un hecho que contradice uno vigente.
**Ejemplo:**
```python
res = db.memory.ingest("preferencias", {"bebida": "té"})
print(res.contradiction)  # {"detected": True, "supersedes": "..."}
```
**Verificar:** MEMG-01; `rg "contradict" vanta-memory/src`.
**Resultado:** ____

### F4. Ingesta de documentos no-Markdown
**Explicación:** el ingest de wiki acepta solo `.md`; no hay PDF/DOCX/HTML nativo (habría que convertirlos antes).
**Ejemplo:**
```python
db.wiki_ingest("manual.pdf")   # → chunks + escenas, sin conversión externa
```
**Verificar:** `src/wiki/sources.rs:82`; FUT-15 (multimodal fuera de alcance).
**Resultado:** ____

### F5. Indexación incremental con watcher
**Explicación:** no hay repo-map vivo ni watcher que re-indexe solo lo cambiado; es línea de research declarada.
**Ejemplo:**
```python
db.code_index("./", watch=True)   # indexa y mantiene al día tras cada cambio
```
**Verificar:** MGR-22 / FIND-120; `docs/user/AI_IDES.md:90`.
**Resultado:** ____

### F6. Multimodal (imagen/audio)
**Explicación:** no hay ingesta nativa de imágenes/audio como registros consultables; fuera de alcance v1.0 con triggers.
**Ejemplo:**
```python
db.put_media("actas/2026", "reunion-9", file="acta.jpg")  # OCR/transcripción integrados
```
**Verificar:** FUT-15.
**Resultado:** ____

---

## G. SDKs y ecosistema

### G1. Go SDK
**Explicación:** no existe binding Go (ni capa C-ABI pública previa); decisión owner pendiente.
**Ejemplo:**
```go
db, _ := vantadb.Open("./data")
db.Put("agent/main", "m1", "hola", nil)
```
**Verificar:** FUT-08.
**Resultado:** ____

### G2. Paridad de superficies entre SDKs
**Explicación:** funciones repartidas asimétricamente: `versions`/`vacuum` solo Node, export/IQL/pagerank solo algunos; tres convenciones de node-id.
**Ejemplo (deseado):** misma API en Python/TS/Node/WASM para `versions`, `vacuum`, `export`, `pagerank`.
**Verificar:** informe análisis completo (Asimetrías); docs por binding.
**Resultado:** ____

### G3. WASM/OPFS multi-pestaña
**Explicación:** dos pestañas escribiendo la misma DB OPFS se corrompen en silencio; solo IndexedDB tiene BroadcastChannel.
**Ejemplo:** abrir dos tabs WASM sobre la misma DB → segundo tab detecta lock y avisa, sin corromper.
**Verificar:** `WASM_STORAGE_REVIEW.md:81-84`.
**Resultado:** ____

### G4. `vanta-memory` expuesto en bindings
**Explicación:** el crate de memoria (captura L0, extracción L1, escenas L2, persona L3, recall, context engine, wiki, dreams) es interno (`publish=false`), 0 símbolos en bindings.
**Ejemplo:**
```python
db.memory.scenes("sesion-4")        # L2
db.dreams.promote_dream_run(id)     # consolidación asistida
```
**Verificar:** `docs/api/VANTA_MEMORY.md` (Scope & stability).
**Resultado:** ____

---

## Cómo usar esta lista

1. Verificar cada fila contra el árbol y la release instalable; anotar en `Resultado`.
2. Estado final por fila: `Existe (versión X)` / `Parcial (detalle)` / `No existe`.
3. Lo que quede en `No existe` y se necesite, va como solicitud (issue/PR al repo, sin fork).
