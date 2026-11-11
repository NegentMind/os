# -*- coding: utf-8 -*-
"""
Convierte los README de holones al patron del repo .github:
  README.md     -> English (principal)
  README_ES.md  -> Espanol (opcion)

Ademas corrige un bug de copy-paste en la senal de validacion de Orchestra,
Reverb y Reason: un texto mecanico estaba seguido de una frase que dice
"esta es la pregunta que se le hace a un cliente potencial".
"""
import io
import os
import re

from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent / "negentmind" / "holons"

CLIENT_ASK_RE = re.compile(
    r"\n\nEsta es la pregunta que se le hace a un cliente potencial para saber si"
    r"\s+necesita este\s+holon\. Si la respuesta es \u00abno hay problema\u00bb, no hay venta\."
    r"\s+Y eso es correcto\."
)

BOILER = ("This holon exists because that chaos gets diagnosed in real organizations. If a\n"
          "diagnosis does not find it, it does not get built.")

SURFACES = """## Surfaces

| Surface | For whom | Form |
|---|---|---|
| Developer | Whoever builds on it | API, SDK, MCP server, CLI |
| Agent | An AI system | Invocable MCP tools |
| Human | Non-technical person | Interface, upload, correction |
| Enterprise | Has to answer to someone | Governance panel, audit, SLA, isolation |

Hard rule: if a capability only exists inside a human interface, it is consultancy disguised as
software. Everything done for the client has to exist as an API."""

CRITERION = """## Build criterion

> A holon **is not built because it is on a roadmap**. It is built when a diagnosis in a real
> organization finds the chaos this holon resolves.

See the [NegentMind ROADMAP](https://github.com/NegentMind/.github/blob/main/ROADMAP.md) for the
full order and the reactivation conditions.

## License

Apache 2.0 - see [LICENSE](./LICENSE)."""

HOLONS = [
dict(
    slug="cardinal", name="Cardinal", fn="Orientation",
    status="In build", pos="1 of 6",
    chaos_label="**Context**",
    chaos="the organization does not know what it knows, when it learned it, or who it learned it from.",
    theory=("Every fact carries three attributes that make it verifiable: **position** (where it "
            "lives), **time** (when it was true) and **provenance** (who asserted it). Without all "
            "three, information can be read but not trusted. Cardinal turns data into queryable "
            "context."),
    produces=("Governed index of organizational knowledge with spatio-temporal metadata. It answers "
              "*when we knew this* and *where it came from*. It is the substrate the other holons "
              "read and write on top of."),
    signal=("> How long does the organization take to answer the leadership with a source and a date?"),
    extra=["### Three functions of memory, and which one this is", "",
           "The canonical taxonomy of agent memory splits it three ways, and Cardinal covers "
           "two of them:", "",
           "| Function | What it holds | Cardinal |",
           "|---|---|---|",
           "| Factual | Knowledge | **Formation** and **Retrieval** |",
           "| Experiential | Insights and skills | Not here — that is Sage |",
           "| Working | What goes into the active context | **See below** |",
           "",
           "### Working memory is part of this holon", "",
           "Working memory is not another database. It is the decision of what enters the "
           "context window on each call, and it is where most production systems quietly "
           "break: context grows with every agent transition until quality degrades or the "
           "token bill does.", "",
           "So working memory belongs to Cardinal as a retrieval constraint: every answer "
           "carries a token budget, and what does not earn its place inside that budget is "
           "left out. Retrieval under budget, not retrieval of everything. This is a "
           "requirement on Cardinal, not a separate component.", ""],
    deps="None. It comes first.",
    price="USD 1,000 - 4,000 entry (mid-market USD 8,000 - 15,000 later)",
),
dict(
    slug="iris", name="Iris", fn="Vision",
    status="In build", pos="2 of 6",
    chaos_label="**Perception**",
    chaos="invoices, contracts, forms and catalogues are images nobody can query.",
    theory=("You cannot reason about what you cannot see. When the documentary substrate is mostly "
            "paper or image with no data layer, perception is the first real blocker. Perception "
            "precedes reasoning."),
    produces=("OCR and document understanding that produce structured records with provenance. Those "
              "records feed Cardinal directly."),
    signal="> What percentage of the organization's documents can be queried today?",
    extra=["### Internal build order", "",
           "1. OCR for invoices and purchase orders (high volume, ROI in hours)",
           "2. Structured extraction of key fields",
           "3. Diagrams and floor plans",
           "4. User interfaces", ""],
    deps="Depends on VantaDB substrate; no holon dependency.",
    price="USD 1,000 - 4,000 entry (mid-market USD 10,000 - 18,000 later)",
),
dict(
    slug="meta", name="Meta", fn="Metacognition",
    status="In build", pos="3 of 6",
    chaos_label="**Trust**",
    chaos="nobody can verify that the AI told the truth.",
    theory=("A system that does not express uncertainty cannot be paid for. A wrong automated answer "
            "carries direct financial and legal consequence. Meta turns *the AI said* into *there is "
            "evidence it said it, and with what confidence*."),
    produces=("Per-response confidence calibration. Decision log with source, model version, input and "
              "output. Escalation to a human when confidence drops below the threshold. An explanation "
              "of why the system said what it said."),
    signal="> When the system returns an answer, can somebody demonstrate where it came from?",
    extra=["### Why it moved up in priority", "",
           "This holon is the differentiator. The competition sells **capability** (models, chatbots, "
           "RAG). Nobody sells **verifiability**.", ""],
    deps="Cardinal. Without trustworthy context there is nothing to calibrate.",
    price="USD 1,000 - 4,000 entry (mid-market USD 12,000 - 25,000 later)",
),
dict(
    slug="execute", name="Execute", fn="Execution",
    status="Defined", pos="4 of 6",
    chaos_label="**Execution**",
    chaos="the automation breaks and nobody knows why, and nobody repairs it.",
    theory=("Automation without observability is a liability, not an asset. A system that fails "
            "silently is worse than a system that does not exist."),
    produces=("Execution layer for actions and tools. Full log of every action: who, when, with what "
              "input and output. Reproduction and rollback. Failure alerts with cause."),
    signal="> How long does it take to find out an automation broke, and how long to repair it?",
    extra=["### Relationship to MCP", "",
           "Tool execution in the agent world is MCP. Execute does not compete with MCP: it consumes "
           "it and adds the audit layer MCP does not bring.", ""],
    deps="Meta. It arrives once there is trust.",
    price="USD 1,000 - 4,000 entry (mid-market USD 15,000 - 25,000 later)",
),
dict(
    slug="sage", name="Sage", fn="Adaptation",
    status="Defined", pos="5 of 6",
    chaos_label="**Adaptation**",
    chaos=("nobody adapts. The system repeats what it was already corrected on, and the "
           "people repeat what they were already shown."),
    theory=("Adaptation is **per organization**, not global. A model tuned for one company is "
            "useless for another. And the half that gets ignored: the people do not adapt "
            "either. Systems reach production or they do not, and the deciding factor is "
            "usually whether someone changed how they work, not whether the model got "
            "smarter."),
    produces=("Capture of corrections as first-party training data, plus the human half: "
              "who adopted what, who overrode it, who escalated, and why. Local adaptation "
              "per domain and per customer, for the machine and for the workflow. Isolation: "
              "one customer's learning does not contaminate another's."),
    signal=("> Who used this last week, and what did they do with the answer? If the answer "
            "is nobody, the bottleneck is adoption and not accuracy."),
    extra=["### Why adaptation includes people", "",
           "Enterprise AI fails more often on adoption than on accuracy. The measured causes "
           "are organizational: no agreed definition of success, no change management, and no "
           "named production owner. Three of the five things the projects that reach "
           "production do before writing code are organizational, and none of the three is "
           "about model quality.", "",
           "So this holon carries both halves on purpose. The machine half is ordinary "
           "fine-tuning territory. The human half — measuring behaviour, not accuracy, and "
           "feeding corrections back into the workflow — is what the industry skips, and it is "
           "where the money is.", "",
           "### Why it comes fifth, on purpose", "",
           "Learning on untrusted context **amplifies** the error instead of correcting it. "
           "Both halves need Cardinal and Iris working first: you cannot adapt on a "
           "foundation nobody can trace.", ""],
    deps="Cardinal, Iris and Meta.",
    price="To be defined by scope",
),
dict(
    slug="plan", name="Plan", fn="Planning",
    status="Defined", pos="6 of 6",
    chaos_label="**Decomposition**",
    chaos="nobody breaks the work down, and everybody does everything.",
    theory=("Decomposing a task into executable, verifiable steps is what turns an intention into a "
            "verifiable plan. Without Plan, Execute operates without order and Meta has nothing to "
            "compare against."),
    produces=("Decomposition of a goal into steps with acceptance criteria. Dependencies, ordering and "
              "verification. A record of what was done and why."),
    signal="> Can you write the next 5 steps and demonstrate that each one is executable?",
    extra=["### Why it is not a priority", "",
           "It is not a differentiator: every agent framework already does it. Negent Mind uses it "
           "instead of competing with it. It gets built once Execute and Meta are operational.", "",
           "Build order is Meta → Execute → Plan: Plan never precedes its verifiers, so there is "
           "no circularity.", ""],
    deps="Execute and Meta.",
    price="To be defined by scope",
),
dict(
    slug="orchestra", name="Orchestra", fn="Coordination",
    status="Defined (support)", pos="Does not apply",
    chaos_label="**Runtime**",
    chaos="without it, the holons do not know how to cooperate.",
    theory=("It is not a cognitive holon. It has no scope of its own: it coordinates. That is why the "
            "classification separates it from the cognitive ones, and that decision still holds."),
    produces="Context propagation, common policy, system health, and the lifecycle of the holons.",
    signal=("> Mechanical criterion: it gets built when two or more holons are alive. Before that it "
            "is speculation."),
    extra=[],
    deps="Two or more live holons.",
    price="Not sold separately. It is infrastructure for the other holons.",
    mechanical=True,
),
dict(
    slug="reverb", name="Reverb", fn="Audio",
    status="Deferred", pos="Out of initial scope",
    chaos_label="**Communication**",
    chaos="voice and sound as unstructured data.",
    theory=("Voice is a real and valuable capability. It is not the bottleneck of the target customer, "
            "so it is not the right entry point."),
    produces="Transcription and audio classification.",
    signal=("> What % of perception failures originate from audio? If audio dominates the "
            "perception chaos, this reactivates."),
    extra=["### Reactivation condition", "",
           "It reactivates when a diagnosis finds perception chaos dominated by audio, or when a "
           "customer arrives with a clear use case.", "",
           "**Why it is deferred:** a Venezuelan SME with un-automated tax filing does not lose money "
           "over not transcribing calls. This is a decision about focus, not about value.", ""],
    deps="None. Deferred.",
    price="Not defined",
    mechanical=True,
),
dict(
    slug="reason", name="Reason", fn="Reasoning",
    status="Deferred", pos="Out of initial scope",
    chaos_label="**Inference**",
    chaos="conclusions that go beyond what the data supports.",
    theory=("Neuro-symbolic reasoning is a level jump. Cardinal and Meta already cover most of the "
            "real value for the customer today."),
    produces="Neuro-symbolic inference and symbolic anchoring.",
    signal=("> What rate of conclusions exceed the evidence in Meta's log? If the bottleneck is "
            "inference rather than trust, this reactivates."),
    extra=["### Reactivation condition", "",
           "It reactivates when Meta needs symbolic anchoring and the bottleneck is no longer trust "
           "but inference.", "",
           "**Why it is deferred:** building it earlier does not serve the problem the customer has "
           "today.", ""],
    deps="None. Deferred.",
    price="Not defined",
    mechanical=True,
),
]


def build_en(h):
    L = [
        "# Negent Mind %s" % h["name"],
        "",
        "> **%s** - Holon of [NegentMind](https://github.com/NegentMind)" % h["fn"],
        "",
        '<div align="right"><a href="./README_ES.md">Espa\u00f1ol</a> | English</div>',
        "",
        "**Status: %s** - Position in the chain: **%s**" % (h["status"], h["pos"]),
        "",
        "---",
        "",
        "## The chaos it resolves",
        "",
        "%s: %s" % (h["chaos_label"], h["chaos"]),
        "",
        BOILER,
        "",
        "## Theory",
        "",
        h["theory"],
        "",
        "## What it produces",
        "",
        h["produces"],
        "",
        "## Validation signal",
        "",
        h["signal"],
    ]
    if h.get("mechanical"):
        L += ["", "This is a mechanical criterion, not a question. There is no customer to ask until "
                   "the precondition is met."]
    if h["extra"]:
        L += [""] + h["extra"]
    L += [
        "",
        "## Dependencies",
        "",
        h["deps"],
        "",
        SURFACES,
        "",
        "## Reference price",
        "",
        h["price"],
        "",
        CRITERION,
    ]
    return "\n".join(L)


def main():
    for h in HOLONS:
        d = os.path.join(ROOT, h["slug"])
        src = os.path.join(d, "README.md")
        es_path = os.path.join(d, "README_ES.md")

        # El espanol se conserva como README_ES.md, con selector de idioma.
        # Idempotente: si README_ES.md ya existe, se usa ese como fuente, para
        # que re-ejecutar el script no destruya la version en espanol.
        if os.path.exists(es_path):
            # Re-ejecucion: el espanol ya fue migrado. No se toca.
            io.open(src, "w", encoding="utf-8", newline="\n").write(build_en(h))
            print("ok  holons/%-10s (re-run) README.md(EN), ES intacto" % h["slug"])
            continue
        es = io.open(src, encoding="utf-8").read()
        es = CLIENT_ASK_RE.sub("", es)

        # Los tres holones con senal mecanica no tienen cliente al que preguntar.
        if h.get("mechanical"):
            es = es.replace(
                "> Criterio mecánico:",
                "Esto es un criterio mecánico, no una pregunta. No hay cliente al que preguntarle "
                "hasta que se cumpla la precondición.\n\n> Criterio mecánico:", 1)
            es = es.replace(
                "> Se reactiva cuando",
                "Esto es un criterio mecánico, no una pregunta. No hay cliente al que preguntarle "
                "hasta que se cumpla la precondición.\n\n> Se reactiva cuando", 1)
        lines = es.split("\n")
        assert lines[0] == "# Negent Mind %s" % h["name"], lines[0]
        assert lines[1] == "", repr(lines[1])
        assert lines[2].startswith("> **"), lines[2]
        es = "\n".join([
            lines[0],
            "",
            '<div align="right"><a href="./README.md">English</a> | Espa\u00f1ol</div>',
            lines[2],
        ] + lines[3:]).rstrip() + "\n"
        io.open(es_path, "w", encoding="utf-8", newline="\n").write(es)

        io.open(src, "w", encoding="utf-8", newline="\n").write(build_en(h))
        print("ok  holons/%-10s README.md(EN) + README_ES.md(ES)" % h["slug"])


if __name__ == "__main__":
    main()
