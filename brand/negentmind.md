# NegentMind — Checklist del perfil de la organización

Documento vivo: todo lo decidido, lo pendiente y los pasos para completar el perfil de GitHub de la org `negentmind` (display **Negent Mind AI**), separada del proyecto VantaDB.

## 1. Estado actual (verificado)

- Org renombrada: `Vantadb` → `negentmind` (display "Negent Mind AI", 1 repo `.github`; descripción actual: tagline "Order out of chaos for the age of agents.", blog vacío)
- Miembros: `ness-e` (admin, público) + `DevpNess` (invitado admin, **pendiente aceptar**)
- Seguridad: base permissions `none`; secret scanning + push protection + Dependabot en `.github`; 2FA **sin exigir** (paso manual en UI)
- Perfil publicado en Negent Mind (README v2 EN+ES, hero GIF dual, tabla de holones; commits `565e020`, `cdd7c49`, `a201cb7`, `d5523b7`). Pendiente humano: subir avatar + ojo final dark/light
- **Tesis 2026-09-28 (ver `NegentMind/strategy`)**: el caos es **operativo**, no intelectual; el orden es **verificable**, no solo capaz. Perfil, manifiesto, roadmap y los 9 README de holón actualizados con esa tesis. La marca visual (paleta, wordmark, avatar, banner) **no cambia**.

## 1b. Decisiones de tesis (2026-09-28)

- **Metáfora afinada**: "del caos al orden" pasa a "del caos operativo al orden verificable". El caos del que se habla es el de la organización, no el del LLM
- **Criterio de construcción de holones**: un holón no se construye por estar en un roadmap, sino cuando un diagnóstico en una organización real encuentra el caos que resuelve
- **Los 5 caos**: Contexto (Cardinal) · Percepción (Iris) · Ejecución (Execute) · Aprendizaje (Sage) · Confianza (Meta)
- **Orden nuevo**: Cardinal → Iris → **Meta (sube de 9º a 3º)** → Execute → **Sage (baja de 2º a 5º)** → Plan. Motivo: aprender sobre contexto no confiable amplifica el error; Meta es el diferenciador porque nadie vende confiabilidad
- **Perfil público**: la tabla de holones ya no dice "Próximamente" ×9. Ahora distingue En construcción / Definido / Aplazado, y declara que solo uno está en producción
- **Documentos affected**: `MANIFESTO{,_ES}.md`, `ROADMAP{,_ES}.md`, `profile/README{,_ES}.md`, los 9 `negentmind-*/README.md`, `local/docs/estrategia/` (nuevo)
- **Bugs corregidos**: 6 enlaces internos rotos en `README.md`, `MANIFESTO`, `ROADMAP`, `profile/README*` (la convención real es `X.md`=EN y `X_ES.md`=ES; la tabla invertía la convención y apuntaba a `*_EN.md` inexistentes)
- **Bloqueo nuevo detectado**: existe `syntropyai.app` ("Syntropy — AI Agent Governance Platform"). Mismo nombre, mismo sector. Pendiente investigación antes de usar Negent Mind para la audiencia de developers y agentes

## 2. Plataforma de marca (decisiones bloqueadas)

- **Concepto**: syntropy, del caos al orden (no al revés: eso es entropía). **Misión**: soluciones para ecosistemas de LLMs y agentes de IA — no un LLM, sino la infraestructura alrededor (coherente, estable); sin ella, el LLM es caos. VantaDB aporta la memoria como primer holón; los datos no son el objetivo de Negent Mind
- **Marco oficial**: holón (Koestler, 1967). Negent Mind crea holones: VantaDB es un todo en su área y parte del todo mayor; cada módulo, igual. Ref: [holón](https://en.wikipedia.org/wiki/Holon_(philosophy)), [texto 1969](http://panarchy.org/koestler/holon.1969.html)
- **Marca**: ruptura total. VantaDB conserva esfera, naranja `#FF5500` y tipografías; Negent Mind no reutiliza ningún asset suyo
- **Símbolo**: wordmark hoy, símbolo en fase 2
- **Paleta**: fondo `#F0EEE6`, tinta `#141413`, grises `#B0AEA5`/`#E8E6DC`, acento primario Sage deep `#4A6B53` (solo acciones clave/punto). Alts: Sage claro `#8AA184` (sobre ink), Mineral `#6A9BCC`, Slate `#3B5B73`, Ochre `#C29B47` (detalle premium). Blanco puro eliminado como fondo. Terracota `#D97757` vetado (Anthropic). Naranja VantaDB intacto y separado. Proporción 60/30/10
- **Voz**: técnica en specs/docs/READMEs; editorial en About/blog/manifiestos
- **Sistema tipográfico**: wordmark Space Grotesk 700 caps · titulares Instrument Serif caja título · operativo Poppins 500/600 · técnico IBM Plex Mono · body editorial Newsreader. Todo OFL en Google Fonts
- **Escala medida en anthropic.com**: display sans 700/64 · feature serif 500/72 · sección/card sans 600/24/16 · body serif 400/24/18 · UI sans 16-20 · micro mono 12 · sin letterspacing salvo kickers
- **Wordmark**: `NEGENT MIND` en mayúsculas (nos separa del "Anthropic" en minúsculas)
- **Lockup FINAL (V-A)**: caps tracking 0.14em, O como círculo perfecto con punto Sage deep `#4A6B53` dentro. D1/D2/D3/V-B/V-C/V-D y fusión con punto arriba, descartados. Minúscula cruda rechazada (clon directo)
- **Avatar FINAL**: monograma "S" Space Grotesk 700 — versión ink (fondo `#141413`, S paper) + versión paper (fondo `#F0EEE6`, S ink). Cinta entrelazada y M1-M10 descartados
- **Reglas**: flat 100% monocromo, hairlines 1px, cero sombras/degradados/neón, padding amplio; fondo `#F0EEE6`; caps solo wordmark/kickers
- **Alcance**: sistema completo, aplicado primero solo al perfil GitHub de la org

## 3. Seleccionar (decisiones abiertas)

- [x] Tipografías, lockup V-A final, avatar S ink/paper, paleta final y escala medida (decididos y en el Brand Sheet V3)
- [x] Exports generados en `Negent Mind/brand/exports/`: avatar 500px ink/paper, hero dual 1920×640, GIFs single-play dual 960×240 (60f/4s, alfa), mark SVG exacto + wordmark SVG texto
- [ ] Subir avatar a la org (UI: Org Settings → Profile picture, usar `avatar-ink.png`; sin API para foto de org, solo manual)
- [x] Tagline paraguas EN: "Order out of chaos for the age of agents." + ES espejo: "Orden desde el caos para la era de los agentes." (revisado 2026-09-06: el anterior hablaba de datos, ámbito de VantaDB, no de Negent Mind; aplicado en `docs/profile-README-EN.md` / `-ES.md`)
- [x] Links sociales: omitidos por ahora (sin X/Discord de Negent Mind; no reutilizar los de VantaDB)
- [x] Dominio: diferido (perfil sale sin web; verificar `syntropyos.com` cuando toque)
- [x] Idiomas del perfil: EN primero con espejo ES
- [x] Hero del perfil: GIFs dual-theme single-play con `<picture>` por `prefers-color-scheme`
- [x] Narrativa congelada tras auditoría externa (2026-09-06): rewrite corporativo rechazado, sin nombres de holones futuros, sin claims enterprise; el perfil queda mínimo hasta tracción
- [ ] **Colisión de marca**: investigar `syntropyai.app` (Syntropy — AI Agent Governance Platform). Mismo nombre, mismo sector. Decidir si Negent Mind se comercializa bajo otro nombre de producto, conservando NegentMind como organización
- [ ] **Dominio**: verificar disponibilidad de `syntropyos.com` y variantes. La auditoría 2026-09-28 lo eleva de "diferido" a bloqueante, por la colisión de arriba
- [ ] **Relación Negent Mind ↔ VantaDB**: definir explícitamente si hay transferencia de repo, marca o distribución conjunta. Hoy el `AGENTS.md` prohíbe modificar VantaDB desde Negent Mind, lo que bloquea la venta conjunta

## 4. Crear

- [x] Avatar final: PNG 500px ink/paper exportados (`brand/exports/`); falta subirlo (org Settings, UI)
- [x] Wordmark SVG (texto, dual) + mark SVG geométrico exacto + hero PNG dual desde el lockup V-A
- [x] Banner GIF dual-theme single-play (`org-syntropy.gif` / `org-syntropy-light.gif`, 960×240, letras suben una vez + lockup V-A fijo, proyecto Remotion propio en `media/remotion/`, frames verificados por ffprobe; v3 con O asentada: commit `a201cb7`; v4 con huecos R-O-P simétricos: commit `d5523b7`)
- [x] README del perfil v2 publicado en `negentmind/.github` (copy en `cdd7c49`: sin H1, tagline centrado, misión/visión/filosofía, explainer de holones, fila de links, tabla con objetivo/técnica/enlace; banner v3 O asentada `a201cb7`, v4 huecos R-O-P simétricos `d5523b7`)

## 5. Modificar (todo manual en GitHub UI)

- [x] Descripción de la org → "Order out of chaos for the age of agents." + blog vacío (vía `gh api`, 2026-09-06)
- [x] Quitado del perfil el branding VantaDB (GIFs naranja, tabla de 12 módulos) en `565e020`; links al repo `ness-e/Vantadb` retenidos a propósito (fila Holones, Core engine, Discussions) hasta el transfer (§7)
- [x] Blog del perfil vacío hasta registrar dominio (no apunta a `vantadb.vercel.app`)
- [x] Actualizar este checklist a medida que se cierre cada punto

## 6. No tocar

- Identidad del proyecto VantaDB (mark, naranja, READMEs de `ness-e/Vantadb`, GIFs): intacta
- Seguridad ya aplicada; no aflojar base permissions ni scanning

## 7. Cuando se transfiera el core (futuro, fuera de este checklist)

- Aceptar invite `DevpNess` + exigir 2FA antes del transfer
- Transferir repo, renombrar links `ness-e/…`, fijar repos (pins), rulesets/PRs, secret scanning en el core
- [x] VantaDB como primer holón del perfil con su link (hecho desde el perfil v1; tras el transfer solo se actualizan los links `ness-e/…` → `negentmind/…`)

## 8. Verificación final

- [ ] Perfil legible en dark y light a ojo humano (capturas archivadas en `brand/specimens/org-profile-*.png`)
- [x] Todos los links del perfil devuelven 200 (4/4 raw: README, ES, 2 GIFs)
- [x] Capturas dark + light archivadas como prueba
- [x] `git status` limpio en el clon `.github` tras el push (`d5523b7`)

## 9. Casa de la marca (`Negent Mind/`, fuera de GitHub)

- `brand/brand-sheet.html` V3 (B0 concepto, B1b construcción, voz, B9 archivos) + `brand/exports/` (fuentes `src-*.html`; finales: PNG, SVG, GIFs) + `brand/specimens/` (evidencia y capturas)
- `docs/brand-platform.md` (misión, voz, reglas) + `docs/profile-README-EN.md` / `-ES.md` (espejos del perfil publicado)
- `media/remotion` propio (tokens, `NegentMindBanner` dual-theme, receta GIF con alfa; `typecheck` en verde)
- `.opencode/skills/` (74 skills de diseño/frontend/video/visual) + `README.md` y `AGENTS.md` del proyecto
- Regla: el perfil GitHub está congelado; todo cambio futuro de marca nace aquí y se exporta

## 10. Rebrand v1 Negent Mind (2026-11-11, ruptura total)

- **Decisión**: ruptura total con la identidad anterior (paper/ink/Sage, Space Grotesk/Instrument Serif, anillo-O, monograma S). Nueva identidad dark-first: Void #08090C, Bone #EDEAE3, Pulse #8B7CFF/#5B4FE0; Chakra Petch 700 + Inter + JetBrains Mono; monograma NM en pastilla; punto Pulse como cierre.
- **Assets nuevos**: `brand/exports/` (mark/wordmark/avatar/hero dark+light PNG + SVG fuente), `profile/org-negentmind{,-light}.gif` (retícula + lockup + punto, 60f/4s, alfa). GIFs viejos (`org-syntropy*`, `org-negentropy*`) eliminados del perfil.
- **Contacto**: `negent@negentmind.com` · dominio `negentmind.com` (pendiente compra y registro en ambos).
- **Repos**: org `NegentMind` (renombrada en GitHub); repo `negentropy` → `negentmind`; remotos locales actualizados (`negentmind/`, `.github/`, `strategy/`, `skills/`). Carpeta local `negentropy/` → `negentmind/`, `skills-privado/` → `skills/`.
- **Supersede**: §2–§4 v3/v4 (O asentada, huecos R-O-P, avatar S, Sage) quedan como historia; la ley vigente es `docs/brand-platform.md` v1 + `remotion/src/tokens.ts`.
- [ ] Subir `avatar-dark.png` a la org (UI: Org Settings → Profile picture, manual).
- [ ] Verificación final §8 con la nueva identidad (capturas dark/light, 4 raw a 200).
