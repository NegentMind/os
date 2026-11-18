import type { FooterCopy, HeroCopy, NavCopy } from "@/lib/marketing-types";

export const en = {
  nav: {
    home: "Home",
    projects: "Projects",
    about: "The lab",
    contribute: "Contribute",
    github: "GitHub",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    language: "Change language",
    skipToContent: "Skip to content",
  } satisfies NavCopy,
  footer: {
    statement: "Infrastructure around the model. Built in the open.",
    independence: "An independent lab. Not yet incorporated.",
    sections: "Sections",
    projects: "Projects",
    resources: "Resources",
    discussions: "Discussions",
    handbook: "Handbook",
    handbookPending: "In preparation",
    conduct: "Code of conduct",
    security: "Security policy",
    trademark: "Trademark policy",
    contactPending: "Email not yet available. Find us on GitHub.",
    builtOpen: "built in the open",
  } satisfies FooterCopy,
  hero: {
    title: "What a model doesn't ship with:",
    titleWords: ["MEMORY", "SIGHT", "VOICE", "HANDS"],
    description:
      "Open-source infrastructure for AI agents. Persistent memory today; perception, reasoning and verifiable action as our long-term direction.",
    primaryAction: "Explore projects",
    secondaryAction: "Contribute",
    note: "Independent lab. Open source. Evidence before promises.",
    pauseMotion: "Pause animation",
    resumeMotion: "Resume animation",
    reducedMotion: "Reduced motion enabled",
  } satisfies HeroCopy,
  meta: {
    home: {
      title: "NEGENT MIND — Infrastructure around the model",
      description:
        "An independent lab building open-source infrastructure for AI agents. Explore VantaDB, our persistent-memory flagship, and the work behind it.",
    },
    projects: {
      title: "Projects — NEGENT MIND",
      description:
        "VantaDB is active. Scopegrain is in incubation. Explore the projects and understand the boundary between working software and our longer-term vision.",
    },
    vantadb: {
      title: "VantaDB — Embedded memory for AI agents | NEGENT MIND",
      description:
        "Persistent memory and hybrid retrieval for AI agents. A Rust core with Python and TypeScript bindings, local-first operation and an Apache-2.0 core.",
    },
    about: {
      title: "The lab — NEGENT MIND",
      description:
        "Why NEGENT MIND exists, how we work, and where we are headed. An independent lab building composable capabilities around AI models.",
    },
    contribute: {
      title: "Contribute — NEGENT MIND",
      description:
        "Help improve documentation, report a reproducible bug or contribute a scoped change. Start with the contribution guide or ask in GitHub Discussions.",
    },
  },
  common: {
    active: "Active",
    incubation: "In incubation",
    vision: "Vision",
    flagship: "Current flagship",
    source: "Source code",
    readDocs: "Read the README",
    exploreVantadb: "Explore VantaDB",
    allProjects: "All projects",
    principles: "How we work",
    discussions: "Ask in Discussions",
    contributionGuide: "Read the contribution guide",
    conceptual: "Conceptual diagram, not a product interface.",
    gallery: "Component gallery",
  },
  home: {
    statement: {
      title: "The model is a beginning, not the whole system.",
      body: "An agent needs somewhere to keep what matters, a way to use context again, and boundaries for what it can do. NEGENT MIND builds infrastructure around models so those capabilities do not have to be rebuilt for every project.",
      aside: "For independent developers and engineers building agents. Start with the software that exists; read the rest as a direction, not a feature list.",
      system: {
        controls: "Explore the conceptual system",
        orbAction: "Pin or release the accent color",
        boundary: "A model at the center, capabilities around it. This is a conceptual system, not a list of modules NEGENT MIND currently ships.",
        items: [
          { label: "Model", body: "The model is the center of this diagram, not the whole application. The surrounding system determines which context and tools it can use." },
          { label: "Memory", body: "Keeping and retrieving context can give an application continuity beyond one interaction. Persistent memory is our concrete starting point with VantaDB." },
          { label: "Perception", body: "A system may need to turn incoming information into usable context. Here, perception is a conceptual responsibility, not an available NEGENT MIND module." },
          { label: "Action", body: "A system may connect a model to tools within boundaries set by the application. This diagram does not announce an execution product." },
          { label: "Verification", body: "Checking an outcome is a responsibility beyond generating a response. This is a design direction, not a guarantee that a model's answers are verified." },
        ],
      },
    },
    work: {
      title: "Memory that persists. Ideas taking shape.",
      vantadbName: "VantaDB",
      scopegrainName: "Scopegrain",
      description: "One active flagship. One prototype in incubation. Different stages, stated plainly.",
      vantadbSummary: "Persistent memory, embedded in your agent.",
      vantadbBody: "VantaDB brings storage and hybrid retrieval into the application. Keep context beyond a single session without requiring a cloud service.",
      vantadbFacts: ["Rust core", "Python + TypeScript", "Apache-2.0 core"],
      scopegrainSummary: "A separate prototype, still taking shape.",
      scopegrainBody: "Scopegrain is public work in progress. It remains in incubation, without a product launch announcement.",
      memoryControls: "Explore the memory stages",
      scopeStudy: {
        action: "Explore the sketch",
        bounded: "A bounded view of a separate prototype. No product functionality is demonstrated here.",
        exploded: "The framing planes are separated to examine the composition. This is a visual study, not a preview of announced features.",
      },
    },
    capabilities: {
      title: "One working capability. A wider system to build.",
      description: "Our thesis is about the capabilities surrounding a model. These are not a suite of nine released products.",
      currentTitle: "Carry context forward",
      currentBody: "Persistent memory is our concrete starting point. VantaDB stores context and makes it retrievable so an application can reuse it in a later session.",
      futureTitle: "Connect more of the loop",
      futureBody: "Perception and voice, reasoning, action and verification form the longer-term direction. Their place on this map does not mean they are available software.",
      currentLabel: "Today · VantaDB",
      futureLabel: "Long-term vision",
      diagram: ["Context", "Persistent memory", "A later session"],
      mapLink: "See the vision and its boundaries",
    },
    holons: {
      title: "A piece in its own right. Part of something larger.",
      definition: "A holon has a function of its own while also belonging to a larger system.",
      usage: "At NEGENT MIND, this idea organizes capabilities that could work together while keeping clear responsibilities.",
      boundary: "This is a long-term design map, not nine available products. Cardinal is not another name for VantaDB.",
      controls: "Explore the nine holons",
      items: [
        { name: "Cardinal", role: "Context and working memory", body: "The direction of Cardinal would be to organize context and working memory within a larger system. It is a design vision, not another name for VantaDB." },
        { name: "Iris", role: "Perception and ingestion", body: "The direction of Iris would be to address perception and ingestion as a distinct responsibility. No available ingestion pipeline is announced here." },
        { name: "Meta", role: "Verification and metacognition", body: "The direction of Meta would be to address verification and metacognition within a larger system. Its place on the map is not a claim of working verification software." },
        { name: "Execute", role: "Tool execution", body: "The direction of Execute would be to address tool execution as a bounded responsibility. This is not an available execution service." },
        { name: "Sage", role: "Correction and feedback", body: "The direction of Sage would be to address correction and feedback. It does not imply that an autonomous correction system is available." },
        { name: "Plan", role: "Capability vision", body: "Part of the long-term map; not announced here as available software." },
        { name: "Orchestra", role: "Capability vision", body: "Part of the long-term map; not announced here as available software." },
        { name: "Reverb", role: "Capability vision", body: "Part of the long-term map; not announced here as available software." },
        { name: "Reason", role: "Capability vision", body: "Part of the long-term map; not announced here as available software." },
      ],
    },
    method: {
      title: "From source code to a concrete conversation.",
      description: "Open the repository, examine what it does, and bring a case we can reproduce.",
      evidence: {
        controls: "Choose a way to examine the work",
        code: "Source code",
        context: "Written context",
        conversation: "Conversation",
        conversationBody: "GitHub Discussions is a place to bring a question with context. A link to the relevant work and a reproducible case make that conversation more concrete.",
      },
      items: [
        {
          title: "Start with an artifact",
          body: "VantaDB's source and README are the starting point for understanding its implementation, installation and limitations.",
        },
        {
          title: "Read the written context",
          body: "The README is the starting point for installation, documented usage and current limitations. Read it alongside the implementation; it does not replace inspecting the code.",
        },
      ],
      sourceAction: "Inspect VantaDB on GitHub",
      methodAction: "Read our working principles",
    },
    invitation: {
      title: "Bring a useful question.",
      body: "You do not need a large pull request to contribute. A confusing paragraph, a reproducible failure or a well-scoped change is a meaningful place to begin.",
      action: "Find your way in",
    },
    faqTitle: "What is here, and what is not.",
    faq: [
      {
        question: "Does NEGENT MIND build models?",
        answer: "No. We build infrastructure and capabilities around models. VantaDB, our current flagship, focuses on persistent memory and hybrid retrieval for AI agents.",
      },
      {
        question: "Are all nine holons available?",
        answer: "No. The holons are a long-term capability vision, not nine released products. VantaDB is active; Scopegrain is a separate prototype in incubation.",
      },
      {
        question: "Does VantaDB require a cloud service?",
        answer: "No. VantaDB is embedded and local-first. Its repository contains the real installation instructions, documented bindings and current limitations.",
      },
    ],
  },
  projects: {
    title: "Software, with its status attached.",
    description: "NEGENT MIND builds independent, composable projects around AI models. Here is what is active, what is still a prototype, and what remains a direction.",
    vantadb: {
      summary: "Embedded persistent memory and hybrid retrieval for AI agents.",
      body: "The current flagship. A local-first Rust engine with documented Python and TypeScript bindings. Applications can persist context and retrieve it across sessions without requiring a cloud service.",
      detail: "Apache-2.0 core. Source and installation instructions live in the repository.",
    },
    scopegrain: {
      summary: "A prototype in incubation, not a released product.",
      body: "Scopegrain is separate from VantaDB. Its public work-in-progress status is not a launch announcement or a promise of product readiness.",
      detail: "No launch date or release offer is being announced here.",
    },
    boundary: {
      title: "A capability map is not a product catalogue.",
      body: "The nine holons describe a long-term vision. They are not nine packages you can install. Cardinal is part of that vision; it is not another name for VantaDB.",
      action: "Understand the lab's direction",
    },
  },
  vantadb: {
    title: "Context should outlive the session.",
    description: "VantaDB is embedded persistent memory and hybrid retrieval for AI agents. It is the current flagship of NEGENT MIND, not the whole of the lab.",
    intro: "Keep memory in the application, rather than making a cloud service a prerequisite. A Rust core handles storage and retrieval, with Python and TypeScript bindings documented in the repository.",
    diagram: {
      title: "Persist. Retrieve. Reuse.",
      description: "A conceptual view of how an application can carry context across sessions. This is a mechanism diagram, not a live demo.",
      steps: [
        {
          title: "Persist",
          body: "The application saves context worth keeping beyond the current session.",
          detail: "From a session into persistent storage.",
        },
        {
          title: "Retrieve",
          body: "Hybrid retrieval finds stored context relevant to the application's next request.",
          detail: "From stored context into a useful selection.",
        },
        {
          title: "Reuse",
          body: "The application supplies that context to a later interaction with the model.",
          detail: "Across sessions, under application control.",
        },
      ],
      note: "The application decides what to store and what to pass to the model. Persistent storage is not a claim that an agent autonomously learns or verifies its answers.",
    },
    fit: {
      title: "A building block, not a hosted dependency.",
      items: [
        {
          title: "An agent returning to a task",
          body: "Keep relevant context available after a session ends, rather than relying only on the current conversation.",
        },
        {
          title: "Retrieval inside an application",
          body: "Use embedded memory as one component in your own agent workflow. The model and orchestration remain your choice.",
        },
        {
          title: "Local-first development",
          body: "Work without making a cloud deployment a requirement for persistent memory.",
        },
      ],
    },
    facts: {
      title: "What is concrete.",
      rows: [
        { term: "Core", detail: "Rust" },
        { term: "Bindings", detail: "Python and TypeScript, documented in the repository" },
        { term: "Retrieval", detail: "Hybrid retrieval" },
        { term: "Operation", detail: "Embedded and local-first; no cloud service required" },
        { term: "Core license", detail: "Apache-2.0" },
      ],
      boundary: "The repository is the source of truth for supported behavior and current limitations. This overview does not promise compatibility with every model, framework or workload.",
    },
    start: {
      title: "Start with the source.",
      body: "Use the real README for installation and usage. We link to the maintained instructions instead of reproducing an API snippet that can drift.",
      docsAction: "Installation and documentation",
      codeAction: "Browse the repository",
      question: "Have a question about the project?",
    },
  },
  about: {
    title: "Build what belongs around the model.",
    description: "NEGENT MIND is an independent lab working on infrastructure and capabilities for AI agents. We start with persistent memory and keep a broader, explicitly long-term vision.",
    mission: {
      title: "Models are not complete agents.",
      body: "Memory, perception, reasoning, action and verification require infrastructure as well as models. Our work is to build useful pieces of that surrounding system, as independent projects that can stand on their own.",
      boundary: "We are not a model provider. Nor are we announcing an integrated platform in which every capability already exists.",
    },
    principles: {
      title: "A few constraints worth keeping.",
      items: [
        { title: "Local-first", body: "Do not make a remote service a prerequisite when a capability can live with the application." },
        { title: "Evidence before marketing", body: "Prefer inspectable code, written limitations and reproducible reports to unsupported claims." },
        { title: "Independent, composable pieces", body: "A project should have a clear purpose without requiring the rest of a future ecosystem." },
        { title: "Transparent open-core", body: "Make licensing boundaries explicit. VantaDB's core is Apache-2.0; a project name is not a substitute for its license." },
        { title: "Written collaboration", body: "Keep decisions and technical context understandable to someone who was not in the conversation." },
      ],
    },
    vision: {
      title: "A map of intent. Not shipped software.",
      description: "Cardinal, Iris, Meta, Execute, Sage, Plan, Orchestra, Reverb and Reason are the nine holons in our capability vision. These names describe a direction, not nine active products.",
      note: "The active project is VantaDB. Cardinal is not VantaDB, and this map does not assign current products to future holons.",
    },
    founder: {
      title: "Small enough to name the maintainer.",
      name: "Eros",
      role: "Founder and maintainer",
      body: "NEGENT MIND is currently an independent lab, not yet incorporated. Eros maintains the work; contributions and technical conversations happen through GitHub.",
      action: "Eros on GitHub",
    },
    invitation: {
      title: "The direction is broad. The next change should not be.",
      body: "Choose a concrete part of the work, explain the problem and help make it clearer or more useful.",
      action: "Contribute to the work",
    },
  },
  contribute: {
    title: "Useful work starts small.",
    description: "A clearer explanation, a reproducible failure, a scoped code change. Pick one concrete thing and leave enough context for someone else to follow it.",
    pathsTitle: "Three ways to help.",
    paths: [
      {
        title: "Improve the documentation",
        body: "Find the paragraph that stopped you. Explain what you expected to understand and propose a more precise example or explanation.",
        evidence: "Include the page, the confusing passage and the correction.",
      },
      {
        title: "Report a reproducible bug",
        body: "Reduce the failure to the smallest useful case. Describe what happened and what you expected instead.",
        evidence: "Include the environment, version and steps needed to reproduce it.",
      },
      {
        title: "Contribute scoped code",
        body: "Start from a clear issue or discuss the change first. Keep the pull request focused, explain the trade-offs and include relevant tests.",
        evidence: "Show why the change works, not just that the code was generated.",
      },
    ],
    expectations: {
      title: "Understand what you submit.",
      body: "Quality comes from explanation, tests and evidence. If you use AI to help write a contribution, you are still responsible for understanding the result, reviewing it and being able to explain its behavior.",
      note: "Read the contribution guide before opening a pull request. A small, well-explained change is easier to review than an unrelated bundle of fixes.",
    },
    conversation: {
      title: "A question is a valid starting point.",
      body: "Use GitHub Discussions for questions and an initial conversation about a possible contribution. Check the support guide when deciding where a request belongs.",
      support: "Read the support guide",
    },
    safety: {
      title: "Keep collaboration safe.",
      conductTitle: "People",
      conductBody: "Our code of conduct sets expectations for participation. Read it before joining the conversation.",
      conductAction: "Code of conduct",
      securityTitle: "Security",
      securityBody: "Read the security policy before disclosing a possible vulnerability publicly. Follow the reporting instructions in that policy.",
      securityAction: "Security policy",
    },
    faqTitle: "Before you open a pull request.",
    faq: [
      {
        question: "Do I need to contribute code?",
        answer: "No. Documentation corrections and reproducible bug reports are valuable contributions. Choose a concrete issue and provide enough context for someone else to act on it.",
      },
      {
        question: "Can I submit AI-assisted work?",
        answer: "You must understand, review and take responsibility for everything you submit. Include the tests and explanation required by the contribution guide; generated code is not evidence that a change is correct.",
      },
      {
        question: "Can I build one of the nine holons?",
        answer: "The holons are a long-term vision, not nine active repositories or a ready-made issue list. Start with the existing projects and discuss a scoped proposal before committing to a large implementation.",
      },
    ],
  },
  gallery: {
    title: "The Orbital component room.",
    description: "Development only. Real components, shared tokens and interactive states. This route is excluded from the public sitemap.",
    brand: "Wordmark and monogram",
    type: "Type and reading hierarchy",
    typeSample: "Infrastructure around the model.",
    bodySample: "Outfit carries the headings. DM Sans carries the explanation. Monospace is reserved for actual technical identifiers.",
    neutrals: "Carbon and silver",
    spectrum: "Expressive spectrum",
    surfaces: "Surfaces",
    surface: "Surface",
    raised: "Raised",
    spectrumSurface: "Spectrum",
    actions: "Actions and interaction states",
    actionsNote: "Hover and keyboard-focus these real links. Disabled is shown as a non-interactive control, never a dead link.",
    primary: "Primary",
    secondary: "Secondary",
    text: "Text link",
    disabled: "Unavailable",
    status: "Project states",
    cards: "Project compositions",
    faq: "Disclosure",
    motion: "Motion preferences",
    motionActive: "Animation is allowed.",
    motionPaused: "Animation is paused.",
    motionReduced: "The operating system requests reduced motion.",
    motionUnknown: "Animation stays off until preferences are known.",
    artwork: "Open the artwork renderer",
  },
};

/** Strings remain widened: translated copy must match structure, not EN literals. */
export type SiteCopy = typeof en;
