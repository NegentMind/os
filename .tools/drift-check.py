# -*- coding: utf-8 -*-
"""Drift-check: NEGENT-MIND.md vs HOLONS. Falla si divergen. Fuente única: NEGENT-MIND.md."""
import re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
SYNT = ROOT / "strategy" / "NEGENT-MIND.md"
TOOLS = ROOT / ".tools" / "i18n-holons.py"
t = SYNT.read_text(encoding="utf-8")
s = TOOLS.read_text(encoding="utf-8")
errs = []
for slug in ["cardinal","iris","meta","execute","sage","plan","orchestra","reverb","reason"]:
    if slug not in s.lower():
        errs.append(f"missing slug in HOLONS: {slug}")
if "v0.7.0" not in t:
    errs.append("NEGENT-MIND.md debe decir v0.7.0 (I-1)")
if "cuatro mecanismos" not in t.lower():
    errs.append("NEGENT-MIND.md debe decir cuatro mecanismos (decisión 4 líneas)")
if errs:
    print("DRIFT FAIL:")
    for e in errs: print(" -", e)
    sys.exit(1)
print("drift-check OK: NEGENT-MIND.md y HOLONS alineados en versión y modelo")
