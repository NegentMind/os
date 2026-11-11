# .tools — scripts Negent Mind

## `i18n-holons.py`
Genera `negentmind/holons/*/README.md` EN desde tabla `HOLONS`. Idempotente en re-run.
- `ROOT = Path(__file__).parent.parent / negentmind/holons` portable, override `--root`.
- Nunca editar EN a mano: se revierte. ES a mano en `README_ES.md`.
- Fix aplicado: Iris deps `Depends on VantaDB substrate`, Sage deps `+Meta`.
- Uso: `python .tools/i18n-holons.py`

## `gen-skills.py`
One-shot que generó 5 skills venta en `~/.agents/skills` (fuera del workspace).
Fuente con typos conocidos (`Comprató`, cirílico, `losSupport`). No re-ejecutar sin fix.
Copia versionada ahora en `skills/` (repo privado `NegentMind/skills`).
Para regenerar: corregir origen primero, luego `--out`.

## `drift-check.py`
Compara `strategy/NEGENT-MIND.md` (precios, orden) vs `HOLONS` tabla. Falla si divergen.
Uso: `python .tools/drift-check.py`. Declarado: `NEGENT-MIND.md` es fuente única.
