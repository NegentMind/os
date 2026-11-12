import type { Dict } from "./en";

/* Diccionario español — espejo estructural de en.ts. */
export const es: Dict = {
  meta: {
    title: "Negent Mind — Orden desde el caos",
    description:
      "Infraestructura open source de capacidades para agentes IA. VantaDB: motor de memoria embebido — recuperación híbrida (HNSW + BM25 + RRF), aislamiento MVCC, local-first. Apache-2.0.",
  },
  nav: {
    homeAria: "Negent Mind, inicio",
    navAria: "Secciones",
    langAria: "Idioma",
    links: [
      { href: "#system", label: "Sistema" },
      { href: "#modules", label: "Módulos" },
      { href: "#engine", label: "Motor" },
      { href: "#proof", label: "Prueba" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: "GitHub",
  },
  hero: {
    loader: "Cargando…",
    addr: "Código abierto, en todas partes",
    managerLine1: "Lee el código —",
    managerLine2: "VantaDB en GitHub",
    managerCta: "Ver repo",
    slogan: "Orden desde el caos para la era de los agentes IA.",
    metrics: [
      { num: "Rust", lbl: "Lenguaje del núcleo" },
      { num: "2", lbl: "Motores de recuperación — HNSW + BM25" },
      { num: "2.0", lbl: "Licencia Apache" },
    ],
    subTags: "VANTADB · APACHE-2.0 · RUST · LOCAL-FIRST",
    subLink: "ver el motor ↓",
    canvasAria: "Campo de shader de seda líquida",
  },
  ticker: {
    items: [
      "MOTOR DE MEMORIA EMBEBIDO",
      "BM25 + HNSW → RRF",
      "AISLAMIENTO MVCC POR SNAPSHOT",
      "WAL + CRC32C · FJALL LSM",
      "APACHE-2.0 · LOCAL-FIRST",
    ],
  },
  org: {
    label: "[ 01 / LA ORGANIZACIÓN ]",
    title: "Los agentes brillan en la inferencia",
    qual: "y son amnésicos por defecto.",
    sub: "Negent Mind es una organización open source independiente que construye infraestructura de capacidades para agentes IA — memoria, percepción, verificación, ejecución. Un substrato ya está en construcción; el resto son especificaciones con etiquetas honestas.",
    problems: [
      {
        name: "La memoria en Markdown se pudre",
        detail:
          "Un archivo de memoria es algo que editas a mano. Deriva, se duplica y nadie lo poda. El agente lee la podredumbre como si fuera un hecho.",
      },
      {
        name: "La memoria alojada exfiltra",
        detail:
          "Un SaaS de memoria significa que el contexto de tu agente vive en el medidor de otro. Latencia, lock-in y tus datos saliendo de la máquina.",
      },
      {
        name: "El estado del proceso muere",
        detail:
          "Los stores en proceso desaparecen al salir. Cada nueva sesión empieza de cero y reaprende las mismas lecciones.",
      },
    ],
  },
  immersive: {
    label: "[ 02 / EL PRINCIPIO ]",
    phases: [
      "FASE 01 — ENSAMBLE",
      "FASE 02 — EXPANSIÓN",
      "FASE 03 — MORFO",
      "FASE 04 — REORDEN",
    ],
    tags: [
      { k: "CAPACIDAD", v: "MEMORIA" },
      { k: "PRINCIPIO", v: "NEGENTROPÍA" },
      { k: "MÉTODO", v: "HÍBRIDO" },
      { k: "LICENCIA", v: "APACHE-2.0" },
    ],
    title: "Orden desde el caos.",
    sub1: "Capacidades que los agentes no tienen.",
    sub2: "Construido a la vista.",
    canvasAria:
      "Una gran escultura de partículas de semitono. Al hacer scroll se ensambla, se expande, se transforma en un nudo y finalmente reorganiza las partículas en una retícula cúbica limpia. Arrastra para rotar.",
  },
  modules: {
    label: "[ 03 / LOS MÓDULOS ]",
    title: "Un substrato. Seis sistemas con nombre.",
    qual: "especificaciones, no vaporware.",
    sub: "La arquitectura es por capas: un substrato de memoria en el núcleo y módulos de capacidad definidos como RFCs públicos antes de que exista un solo repositorio. Solo uno es código hoy.",
    items: [
      {
        num: "S/01",
        cat: "SUBSTRATO DE MEMORIA",
        kind: "memory",
        title: "VantaDB",
        body: "Motor Rust embebido — recuperación híbrida HNSW + BM25 con aislamiento MVCC, durabilidad WAL y snapshots. La capa de almacenamiento sobre la que se construye cada módulo.",
        status: "EN CONSTRUCCIÓN",
        hudLeft: "MOTOR · v0.9.0",
        live: true,
      },
      {
        num: "S/02",
        cat: "RFC-01",
        kind: "orchestration",
        title: "Cardinal",
        body: "Contexto y memoria de trabajo. Estado episódico bitemporal — qué sabía un agente y cuándo se volvió cierto — con trazado de procedencia y presupuesto de tokens.",
        status: "RFC",
        hudLeft: "CAPA DE CONTEXTO",
        live: false,
      },
      {
        num: "S/03",
        cat: "RFC-02",
        kind: "evaluations",
        title: "Meta",
        body: "Verificación y metacognición. Trazas de ejecución deterministas y logs de atestación firmados para que las acciones de un agente puedan auditarse, no solo registrarse.",
        status: "RFC",
        hudLeft: "CAPA DE AUDITORÍA",
        live: false,
      },
      {
        num: "S/04",
        cat: "RFC-03",
        kind: "observability",
        title: "Iris",
        body: "Percepción e ingesta. Pipelines local-first que convierten documentos multimodales no estructurados en nodos indexados por vectores y verificables.",
        status: "RFC",
        hudLeft: "PERCEPCIÓN",
        live: false,
      },
      {
        num: "S/05",
        cat: "RFC-04",
        kind: "runtime",
        title: "Execute",
        body: "Ejecución determinista de herramientas. Límites de acción en sandbox con políticas de reintento explícitas — sin bucles de reintento probabilísticos.",
        status: "RFC",
        hudLeft: "EJECUCIÓN",
        live: false,
      },
      {
        num: "S/06",
        cat: "RFC-04",
        kind: "security",
        title: "Sage",
        body: "Feedback de corrección. Señales persistentes de humano-en-el-bucle para que los agentes dejen de repetir errores ya corregidos.",
        status: "RFC",
        hudLeft: "ADAPTACIÓN",
        live: false,
      },
    ],
  },
  engine: {
    label: "[ 04 / MOTOR INSIGNIA ]",
    title: "VantaDB.",
    qual: "memoria que permanece cuando la sesión termina.",
    sub: "El primer módulo entregado — un motor de memoria persistente embebido para agentes. Recuperación híbrida, estado transaccional, cero servidores. Desplázate por el pipeline.",
    h3: "Cinco líneas. Memoria persistente.",
    body: "El SDK de Python refleja el núcleo Rust. Escribe un payload con su embedding, consúltalo por significado y por término, recupéralo cuando se abra la siguiente sesión.",
    counters: [
      { label: "Servidores que levantar", value: "0", unit: "" },
      { label: "Procesos donde se embebe", value: "1", unit: "" },
      { label: "Versión del motor", value: "v0.9.0", unit: "", tone: "fog" },
      { label: "Licencia", value: "Apache-2.0", unit: "", tone: "pulse" },
    ],
    cta: "Lee el código",
    replayAria: "Repetir sesión de terminal",
    board: {
      hint: "DESPLÁZATE O ELIGE UNA ETAPA",
      stagesAria: "Etapas",
      stageLabel: "ETAPA",
      statusLabel: "ESTADO",
      graphHead: "GRAFO DE CONSULTA",
      formHead: "FORMA",
      regions: ["LECTURA", "ESCRITURA", "COMMIT"],
      stages: [
        {
          name: "Conectar",
          status: "CONECTANDO",
          metricTitle: "MOTOR",
          metricUnit: "PROCESO",
          rowLabels: ["núcleo embebido", "backend fjall", "wal activo", "local-first"],
        },
        {
          name: "Indexar",
          status: "INDEXANDO",
          metricTitle: "ÍNDICE",
          metricUnit: "MOTORES",
          rowLabels: ["hnsw", "bm25", "filtros", "wal"],
        },
        {
          name: "Consultar",
          status: "FUSIONANDO",
          metricTitle: "PUNTAJE",
          metricUnit: "K=60",
          rowLabels: [],
        },
        {
          name: "Confirmar",
          status: "CONFIRMADO",
          metricTitle: "AISLAMIENTO",
          metricUnit: "SNAPSHOTS",
          rowLabels: [],
        },
      ],
    },
  },
  proof: {
    mechIndex: "05 / MECANISMO",
    mechTitle: "Entra ruido. Sale señal.",
    mechLede:
      "Este campo es ruido fractal en vivo. Desplázate y converge a orden; mueve el puntero y el orden lo sigue. Lo que ves es el producto: salida estocástica, resuelta determinísticamente.",
    mechChrome: "CAMPO EN VIVO — EL SCROLL BARRE EL ORDEN",
    fig1: "Fig. 01 — Campo de ruido fractal, barrido por scroll · entropía en vivo",
    proofIndex: "05 / PRUEBA",
    proofTitle: "Medido, no afirmado.",
    proofLede:
      "Sin testimonios, sin clientes inventados, sin benchmarks prestados. Estos números se calculan aquí, ahora, desde el campo de arriba.",
    counters: [
      { label: "Entropía del campo (Shannon, en vivo)", unit: "bits", tone: "pulse" },
      { label: "Glifos resueltos a orden", unit: "%", tone: "bone" },
      { label: "Bucle de render", unit: "fps", tone: "fog" },
      { label: "Loop de banner determinista", unit: "30fps", tone: "fog" },
    ],
    bannerLoopValue: "120f",
    fig2: "Fig. 02 — Traza de entropía, últimas {n} muestras · escala 0–8 bits",
    traceAria: "Trazo en vivo de la entropía de Shannon medida en el campo",
  },
  boundary: {
    label: "06 / EL LÍMITE",
    title: "Posicionado por lo que no es.",
    items: [
      {
        name: "No es un framework de agentes",
        detail:
          "Negent Mind no orquesta razonamiento ni bucles de prompts. Construye el substrato del que el razonamiento lee y al que escribe.",
      },
      {
        name: "No es un servicio alojado",
        detail:
          "Sin cuenta, sin API key, sin medidor corriendo sobre el contexto de tu agente. El binario es el producto.",
      },
      {
        name: "No es vaporware",
        detail:
          "Cada módulo del mapa es código entregado o una especificación escrita con etiqueta de estado — nunca una promesa renderizada.",
      },
    ],
    footnote: "La alternativa hoy es un archivo markdown o el servidor de otro.",
  },
  landscape: {
    label: "[ 07 / EL PANORAMA ]",
    title: "Mismo trabajo, distintas arquitecturas.",
    qual: "arquitectura, no calidad.",
    sub: "No son tanto competidores como formas distintas para la misma necesidad — dónde se sitúa el motor de VantaDB entre ellas.",
    heads: ["Enfoque", "Embebido", "Local-first", "Transaccional", "Híbrido"],
    rows: [
      { name: "Archivos de memoria (CLAUDE.md, AGENTS.md)", embedded: true, local: true, txn: false, hybrid: false },
      { name: "APIs de memoria alojada (Mem0, Zep)", embedded: false, local: false, txn: false, hybrid: "partial" },
      { name: "Servidores de agentes (Letta)", embedded: false, local: false, txn: "partial", hybrid: "partial" },
      { name: "VantaDB", embedded: true, local: true, txn: true, hybrid: true },
    ],
    legend: "● sí · ◐ parcial · — no · comparación de arquitectura, no un benchmark",
  },
  oss: {
    label: "[ 08 / CÓDIGO ABIERTO ]",
    title: "Construido en público.",
    qual: "súmate.",
    sub: "Negent Mind es una organización open source independiente. El motor es Apache-2.0: léelo, haz fork, embébelo en tu agente — y ayuda a decidir qué se construye después.",
    ctaRepo: "ness-e/Vantadb",
    ctaOrg: "NegentMind org",
    ctaSpecs: "Lee las specs",
    cards: [
      {
        plan: "El substrato",
        amount: "Apache-2.0",
        per: "v0.9.0 — en construcción",
        desc: "VantaDB. Una dependencia, embebida en tu proceso, legible de punta a punta.",
        inc: "QUÉ HAY EN LA CAJA",
        rows: [
          ["motor", "búsqueda híbrida HNSW + BM25, fusionada por RRF"],
          ["aislamiento", "snapshots MVCC — las lecturas nunca bloquean escrituras"],
          ["durabilidad", "WAL con CRC32C + auto-reparación al abrir"],
          ["memoria", "expiración TTL, contextos acotados, cero red"],
        ],
        cta: "github.com/ness-e/Vantadb",
        href: "https://github.com/ness-e/Vantadb",
      },
      {
        plan: "La organización",
        amount: "Abierto",
        per: "specs antes que código",
        desc: "Negent Mind publica especificaciones de capacidades como RFCs antes de que exista cualquier repositorio. Sin proyectos fantasma.",
        inc: "CÓMO SUMARSE",
        rows: [
          ["lee", "la especificación y el pipeline de RFCs"],
          ["construye", "good first issues en el repo del motor"],
          ["define", "las revisiones de RFC deciden qué se construye"],
          ["gobierna", "roadmap público, solo roadmap público"],
        ],
        cta: "github.com/NegentMind",
        href: "https://github.com/NegentMind",
      },
    ],
  },
  faq: {
    label: "[ 09 / LA CONSULTA ]",
    title: "Preguntado, respondido.",
    items: [
      {
        q: "¿VantaDB está lista para producción?",
        a: "Está en v0.9.0 y en construcción. El núcleo del motor — almacenamiento, recuperación híbrida, transacciones MVCC — está implementado. Trátala como cualquier base de datos embebida joven: fija la versión, corre tu propia carga de trabajo y reporta lo que se rompa.",
      },
      {
        q: "¿Por qué embebida en vez de un servicio?",
        a: "La memoria de un agente son datos, no infraestructura. Embebida significa sin superficie de operaciones, sin salto de red, nada saliendo de la máquina, y funciona offline. La misma razón por la que SQLite gana donde un servidor de base de datos sería exceso.",
      },
      {
        q: "¿Qué son los sistemas con nombre?",
        a: "Los módulos de capacidad del roadmap — Cardinal, Meta, Iris, Execute, Sage. Cada uno existe hoy solo como RFC de especificación; VantaDB es el único módulo entregado. Las etiquetas de estado son honestas, no marketing.",
      },
      {
        q: "¿Cómo se convierte un RFC en código?",
        a: "El pipeline de especificación: un módulo se escribe primero como RFC formal, se revisa en público, y solo obtiene un repositorio cuando el RFC se aprueba. Sin repos fantasma.",
      },
      {
        q: "¿Cuánto cuesta?",
        a: "Nada. Apache-2.0, úsala donde quieras. Hoy no existe ninguna nube gestionada; si alguna vez existe, el motor sigue siendo abierto.",
      },
    ],
  },
  footer: {
    navAria: "Mapa del sitio",
    links: [
      { href: "#engine", label: "Motor" },
      { href: "#modules", label: "Módulos" },
      { href: "#proof", label: "Prueba" },
      { href: "#faq", label: "FAQ" },
    ],
    legal: "© {year} Negent Mind · Apache-2.0",
    pending: "Privacidad y Términos pendientes de publicación.",
  },
};
