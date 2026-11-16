import type { Dict } from "./en";
import { ORG_URL, VANTADB_REPO, displayUrl } from "@/lib/site";

/* Diccionario español — espejo estructural de en.ts. */
export const es: Dict = {
  meta: {
    title: "Negent Mind — Orden desde el caos",
    description:
      "Investigación aplicada en IA e ingeniería de producto: infraestructura para una IA agéntica persistente, controlable, eficiente y confiable.",
  },
  nav: {
    homeAria: "Negent Mind, inicio",
    navAria: "Secciones",
    langAria: "Idioma",
    links: [
      { href: "#org", label: "Laboratorio" },
      { href: "#modules", label: "Módulos" },
      { href: "#status", label: "Estado" },
      { href: "#engine", label: "Motor" },
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
    subTags: "INFRA DE CAPACIDADES OPEN-SOURCE · VANTADB · APACHE-2.0 · LOCAL-FIRST",
    subLink: "ver el motor ↓",
    canvasAria: "Campo de shader de seda líquida",
  },
  ticker: {
    items: [
      "INFRAESTRUCTURA DE CAPACIDADES",
      "MAPA DE CAPACIDADES · 1 ACTIVO",
      "MOTOR DE MEMORIA EMBEBIDO",
      "SPECS ANTES QUE CÓDIGO",
      "APACHE-2.0 · LOCAL-FIRST",
    ],
  },
  org: {
    label: "[ 01 / LA ORGANIZACIÓN ]",
    title: "Los agentes brillan en la inferencia",
    qual: "y son amnésicos por defecto.",
    sub: "Negent Mind es un laboratorio independiente de investigación aplicada en IA e ingeniería de producto que construye infraestructura para agentes IA — memoria, percepción, verificación, ejecución. Un motor ya está publicado; el resto del mapa es especificación escrita, etiquetada como visión.",
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
    title: "Un motor publicado. Un mapa de capacidades más allá.",
    qual: "visión, etiquetada como visión.",
    sub: "La arquitectura es por capas: un motor de memoria en el núcleo y un mapa de capacidades a largo plazo a su alrededor — escrito como RFCs internos, no vendido como productos. Hoy solo VantaDB es código publicado.",
    items: [
      {
        num: "S/01",
        cat: "SUBSTRATO DE MEMORIA",
        kind: "memory",
        title: "VantaDB",
        body: "Motor Rust embebido — recuperación híbrida HNSW + BM25 con aislamiento MVCC, durabilidad WAL y snapshots. La capa de almacenamiento sobre la que se construye cada módulo.",
        status: "ACTIVO",
        hudLeft: "MOTOR · v0.9.0",
        live: true,
      },
      {
        num: "S/02",
        cat: "RFC-01",
        kind: "orchestration",
        title: "Cardinal",
        body: "Contexto y memoria de trabajo. Estado episódico bitemporal — qué sabía un agente y cuándo se volvió cierto — con trazado de procedencia y presupuesto de tokens.",
        status: "VISIÓN",
        hudLeft: "CAPA DE CONTEXTO",
        live: false,
      },
      {
        num: "S/03",
        cat: "RFC-02",
        kind: "evaluations",
        title: "Meta",
        body: "Verificación y metacognición. Trazas de ejecución deterministas y logs de atestación firmados para que las acciones de un agente puedan auditarse, no solo registrarse.",
        status: "VISIÓN",
        hudLeft: "CAPA DE AUDITORÍA",
        live: false,
      },
      {
        num: "S/04",
        cat: "RFC-03",
        kind: "observability",
        title: "Iris",
        body: "Percepción e ingesta. Pipelines local-first que convierten documentos multimodales no estructurados en nodos indexados por vectores y verificables.",
        status: "VISIÓN",
        hudLeft: "PERCEPCIÓN",
        live: false,
      },
      {
        num: "S/05",
        cat: "RFC-04",
        kind: "runtime",
        title: "Execute",
        body: "Ejecución determinista de herramientas. Límites de acción en sandbox con políticas de reintento explícitas — sin bucles de reintento probabilísticos.",
        status: "VISIÓN",
        hudLeft: "EJECUCIÓN",
        live: false,
      },
      {
        num: "S/06",
        cat: "RFC-04",
        kind: "security",
        title: "Sage",
        body: "Feedback de corrección. Señales persistentes de humano-en-el-bucle para que los agentes dejen de repetir errores ya corregidos.",
        status: "VISIÓN",
        hudLeft: "ADAPTACIÓN",
        live: false,
      },
    ],
  },
  roadmap: {
    label: "[ 04 / ESTADO DE LOS PROYECTOS ]",
    title: "Un motor activo. Uno en incubación.",
    qual: "el resto es visión, no promesa.",
    sub: "Estado, no calendario. Activo significa código publicado; Incubación significa en desarrollo y aún no publicado; Visión significa una especificación escrita en el mapa a largo plazo. Aquí no se prometen fechas.",
    railLabel: "PIPELINE",
    progressLabel: "SCROLL",
    items: [
      {
        num: "R/00",
        phase: "ACTIVO",
        phaseTone: "shipped",
        name: "VantaDB",
        role: "CAPA DE ALMACENAMIENTO",
        body: "El único código publicado del laboratorio hoy: un motor Rust embebido — recuperación híbrida HNSW + BM25 fusionada por RRF, aislamiento MVCC, durabilidad WAL. v0.9.0, Apache-2.0.",
      },
      {
        num: "R/01",
        phase: "INCUBACIÓN",
        phaseTone: "build",
        name: "Scopegrain",
        role: "AÚN NO PUBLICADO",
        body: "En incubación — aún no publicado. Los detalles se publicarán con su primera versión.",
      },
      {
        num: "R/02",
        phase: "VISIÓN",
        phaseTone: "rfc",
        name: "Cardinal",
        role: "CAPA DE CONTEXTO",
        body: "Contexto y memoria de trabajo. Estado episódico bitemporal — qué sabía un agente y cuándo se volvió cierto — con trazado de procedencia y presupuesto de tokens. Escrito como RFC-01.",
      },
      {
        num: "R/03",
        phase: "VISIÓN",
        phaseTone: "rfc",
        name: "Meta",
        role: "CAPA DE AUDITORÍA",
        body: "Verificación y metacognición. Trazas de ejecución deterministas y logs de atestación firmados, para que las acciones de un agente puedan auditarse — no solo registrarse. Escrito como RFC-02.",
      },
      {
        num: "R/04",
        phase: "VISIÓN",
        phaseTone: "rfc",
        name: "Iris",
        role: "CAPA DE PERCEPCIÓN",
        body: "Percepción e ingesta. Pipelines local-first que convierten documentos multimodales no estructurados en nodos indexados por vectores y verificables. Escrito como RFC-03.",
      },
      {
        num: "R/05",
        phase: "VISIÓN",
        phaseTone: "rfc",
        name: "Execute",
        role: "CAPA DE EJECUCIÓN",
        body: "Ejecución determinista de herramientas. Límites de acción en sandbox con políticas de reintento explícitas — sin bucles de reintento probabilísticos. Escrito como RFC-04.",
      },
      {
        num: "R/06",
        phase: "VISIÓN",
        phaseTone: "rfc",
        name: "Sage",
        role: "CAPA DE ADAPTACIÓN",
        body: "Feedback de corrección. Señales persistentes de humano-en-el-bucle para que los agentes dejen de repetir errores ya corregidos. Especificado dentro de RFC-04.",
      },
    ],
  },
  work: {
    label: "[ 05 / EL TRABAJO ]",
    title: "Cómo se construye aquí.",
    qual: "primero la spec, después el código.",
    sub: "El método es el mensaje: especificaciones escritas, evidencia antes que afirmaciones, etiquetas de estado honestas. Cada proyecto lleva una de tres: Activo, Incubación o Visión.",
    method: {
      title: "El pipeline de especificación",
      steps: [
        {
          name: "Escribir la spec",
          detail:
            "Cada capacidad empieza como un RFC formal — problema, especificación, dependencias — escrito antes de que exista una línea de código.",
        },
        {
          name: "Revisión pública",
          detail:
            "El código publicado se revisa a la vista: issues, objeciones y benchmarks orientan qué se construye después.",
        },
        {
          name: "Después la versión",
          detail:
            "Nada se presenta como producto hasta que se publica como código verificable. Lo que está en incubación se etiqueta así hasta su publicación.",
        },
      ],
    },
    founder: {
      title: "Un fundador, trabajando a la vista.",
      body: "Negent Mind es un laboratorio independiente dirigido por su fundador — aún no es una entidad empresarial constituida. Sin capital de riesgo, sin página de equipo que inflar — el motor entregado y este mapa de capacidades son toda la extensión del trabajo público, declarada a escala honesta.",
    },
    contact: {
      title: "Una línea directa.",
      body: "Preguntas sobre la arquitectura, VantaDB o cómo contribuir — un solo buzón, leído por la persona que escribió el código.",
      pending: "(disponible cuando negentmind.com esté activo)",
      fallback: "Mientras tanto, escríbenos en GitHub",
    },
    metrics: [
      { label: "Motor activo", value: "1", unit: "", tone: "pulse" },
      { label: "En incubación", value: "1", unit: "", tone: "bone" },
      { label: "Especificaciones escritas", value: "4", unit: "RFC-01–04 · internas", tone: "fog" },
      { label: "Licencia", value: "Apache-2.0", unit: "", tone: "fog" },
    ],
  },
  engine: {
    label: "[ 06 / MOTOR INSIGNIA ]",
    title: "VantaDB.",
    qual: "memoria que permanece cuando la sesión termina.",
    sub: "El primer módulo entregado — un motor de memoria persistente embebido para agentes. Recuperación híbrida, estado transaccional, cero servidores. Desplázate por el pipeline.",
    h3: "Cinco líneas. Memoria persistente.",
    body: "El SDK de Python refleja el núcleo Rust. Escribe un payload con su embedding, consúltalo por significado y por término, recupéralo cuando se abra la siguiente sesión.",
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
    mechIndex: "07 / MECANISMO",
    mechTitle: "Entra ruido. Sale señal.",
    mechLede:
      "Este campo es ruido fractal en vivo. Desplázate y converge a orden; mueve el puntero y el orden lo sigue. Lo que ves es el producto: salida estocástica, resuelta determinísticamente.",
    mechChrome: "CAMPO EN VIVO — EL SCROLL BARRE EL ORDEN",
    fig1: "Fig. 01 — Campo de ruido fractal, barrido por scroll · entropía en vivo",
    proofIndex: "07 / PRUEBA",
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
    label: "08 / EL LÍMITE",
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
          "Cada entrada del mapa es código publicado, trabajo en incubación o una especificación escrita — cada una con su etiqueta de estado, nunca una promesa renderizada.",
      },
    ],
    footnote: "La alternativa hoy es un archivo markdown o el servidor de otro.",
  },
  landscape: {
    label: "[ 09 / EL PANORAMA ]",
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
    label: "[ 10 / CÓDIGO ABIERTO ]",
    title: "Construido en público.",
    qual: "súmate.",
    sub: "Negent Mind es un laboratorio independiente de investigación aplicada en IA. El motor es Apache-2.0: léelo, haz fork, embébelo en tu agente — y ayuda a decidir qué se construye después.",
    ctaRepo: displayUrl(VANTADB_REPO).replace("github.com/", ""),
    ctaOrg: "NegentMind org",
    cards: [
      {
        plan: "El substrato",
        amount: "Apache-2.0",
        per: "v0.9.0 — activo",
        desc: "VantaDB. Una dependencia, embebida en tu proceso, legible de punta a punta.",
        inc: "QUÉ HAY EN LA CAJA",
        rows: [
          ["motor", "búsqueda híbrida HNSW + BM25, fusionada por RRF"],
          ["aislamiento", "snapshots MVCC — las lecturas nunca bloquean escrituras"],
          ["durabilidad", "WAL con CRC32C + auto-reparación al abrir"],
          ["memoria", "expiración TTL, contextos acotados, cero red"],
        ],
        cta: displayUrl(VANTADB_REPO),
        href: VANTADB_REPO,
      },
      {
        plan: "La organización",
        amount: "Abierto",
        per: "specs antes que código",
        desc: "Negent Mind escribe sus especificaciones de capacidades como RFCs internos; un resumen público vivirá en el Handbook. El código publicado, el trabajo en incubación y la visión se etiquetan como tales.",
        inc: "CÓMO SUMARSE",
        rows: [
          ["lee", "el mapa de capacidades y sus etiquetas de estado"],
          ["construye", "good first issues en el repo del motor"],
          ["define", "issues y benchmarks orientan qué se construye"],
          ["sigue", "dirección y estado en el Public Handbook"],
        ],
        cta: displayUrl(ORG_URL),
        href: ORG_URL,
      },
    ],
  },
  faq: {
    label: "[ 11 / LA CONSULTA ]",
    title: "Preguntado, respondido.",
    items: [
      {
        q: "¿Qué es exactamente Negent Mind?",
        a: "Un laboratorio independiente de investigación aplicada en IA e ingeniería de producto que construye infraestructura para una IA agéntica persistente, controlable, eficiente y confiable. VantaDB, el motor de memoria embebido, es su primer proyecto publicado. Scopegrain está en incubación y aún no se ha publicado. Todo lo demás en esta página es un mapa de capacidades a largo plazo — especificaciones escritas, no productos.",
      },
      {
        q: "¿Cómo se toman las decisiones?",
        a: "Las capacidades se escriben como especificaciones internas; el código publicado se revisa en público, con tests y evidencia. La hoja de ruta detallada es privada. La dirección, los principios y el estado de los proyectos viven en el Public Handbook (se publica en diciembre de 2026).",
      },
      {
        q: "¿VantaDB está lista para producción?",
        a: "Está en v0.9.0 y en desarrollo activo. El núcleo del motor — almacenamiento, recuperación híbrida, transacciones MVCC — está implementado. Trátala como cualquier base de datos embebida joven: fija la versión, corre tu propia carga de trabajo y reporta lo que se rompa.",
      },
      {
        q: "¿Por qué embebida en vez de un servicio?",
        a: "La memoria de un agente son datos, no infraestructura. Embebida significa sin superficie de operaciones, sin salto de red, nada saliendo de la máquina, y funciona offline. La misma razón por la que SQLite gana donde un servidor de base de datos sería exceso.",
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
    handbook: "Handbook",
    handbookPending: "Handbook — se publica en diciembre de 2026",
    legal: "© {year} Negent Mind · Apache-2.0",
    pending: "Privacidad y Términos pendientes de publicación.",
  },
};
