import type { SiteCopy } from "@/lib/content/en";

export const es: SiteCopy = {
  nav: {
    home: "Inicio",
    projects: "Proyectos",
    about: "El laboratorio",
    contribute: "Contribuir",
    github: "GitHub",
    openMenu: "Abrir navegación",
    closeMenu: "Cerrar navegación",
    language: "Cambiar idioma",
    skipToContent: "Saltar al contenido",
  },
  footer: {
    statement: "Infraestructura alrededor del modelo. Construida en abierto.",
    independence: "Un laboratorio independiente. Aún no constituido como empresa.",
    sections: "Secciones",
    projects: "Proyectos",
    resources: "Recursos",
    discussions: "Discusiones",
    handbook: "Handbook",
    handbookPending: "En preparación",
    conduct: "Código de conducta",
    security: "Política de seguridad",
    trademark: "Política de marcas",
    contactPending: "Correo aún no disponible. Encuéntranos en GitHub.",
    builtOpen: "hecho en abierto",
  },
  hero: {
    title: "Software alrededor del modelo:",
    titleWords: ["MEMORIA", "OJOS", "VOZ", "MANOS"],
    description:
      "Laboratorio de ingeniería open source. Construimos la capa que falta alrededor de los modelos de IA.",
    primaryAction: "Explorar proyectos",
    secondaryAction: "Contribuir",
    note: "Primer producto: VantaDB — memoria persistente, el SQLite para agentes de IA. Código público; evidencia antes que promesas.",
    pauseMotion: "Pausar animación",
    resumeMotion: "Reanudar animación",
    reducedMotion: "Movimiento reducido activado",
  },
  meta: {
    home: {
      title: "NEGENT MIND — Infraestructura alrededor del modelo",
      description:
        "Un laboratorio independiente de infraestructura open source para agentes de IA. Conoce VantaDB, nuestro proyecto principal de memoria persistente.",
    },
    projects: {
      title: "Proyectos — NEGENT MIND",
      description:
        "VantaDB está activo. Scopegrain está en incubación. Conoce los proyectos y la diferencia entre software disponible y nuestra visión de largo plazo.",
    },
    vantadb: {
      title: "VantaDB — Memoria embebida para agentes de IA | NEGENT MIND",
      description:
        "Memoria persistente y recuperación híbrida para agentes de IA. Núcleo Rust, bindings Python y TypeScript, operación local-first y núcleo Apache-2.0.",
    },
    about: {
      title: "El laboratorio — NEGENT MIND",
      description:
        "Por qué existe NEGENT MIND, cómo trabajamos y hacia dónde vamos. Un laboratorio independiente que construye capacidades componibles alrededor de modelos de IA.",
    },
    contribute: {
      title: "Contribuir — NEGENT MIND",
      description:
        "Mejora la documentación, comunica un fallo reproducible o aporta un cambio acotado. Consulta la guía de contribución o pregunta en GitHub Discussions.",
    },
  },
  common: {
    active: "Activo",
    incubation: "En incubación",
    vision: "Visión",
    flagship: "Proyecto principal actual",
    source: "Código fuente",
    readDocs: "Leer el README",
    exploreVantadb: "Conocer VantaDB",
    allProjects: "Todos los proyectos",
    principles: "Cómo trabajamos",
    discussions: "Preguntar en Discussions",
    contributionGuide: "Leer la guía de contribución",
    conceptual: "Diagrama conceptual, no una interfaz de producto.",
    gallery: "Galería de componentes",
  },
  home: {
    statement: {
      title: "El modelo es un comienzo, no el sistema completo.",
      body: "Un agente necesita dónde guardar lo importante, cómo recuperar contexto y límites para lo que puede hacer. NEGENT MIND construye infraestructura alrededor de modelos para no rehacer esas capacidades en cada proyecto.",
      aside: "Para desarrolladores independientes e ingenieros de agentes. Empieza por el software que existe; lee el resto como una dirección, no como una lista de funciones.",
      system: {
        controls: "Explorar el sistema conceptual",
        orbAction: "Fijar o liberar el color de acento",
        boundary: "Un modelo en el centro, capacidades a su alrededor. Es un sistema conceptual, no una lista de módulos que NEGENT MIND ofrece hoy.",
        items: [
          { label: "Modelo", body: "El modelo es el centro de este diagrama, no toda la aplicación. El sistema que lo rodea determina qué contexto y herramientas puede usar." },
          { label: "Memoria", body: "Conservar y recuperar contexto puede dar continuidad a una aplicación más allá de una interacción. La memoria persistente es nuestro punto de partida concreto con VantaDB." },
          { label: "Percepción", body: "Un sistema puede necesitar convertir información entrante en contexto utilizable. Aquí, la percepción es una responsabilidad conceptual, no un módulo disponible de NEGENT MIND." },
          { label: "Acción", body: "Un sistema puede conectar un modelo con herramientas dentro de los límites que fija la aplicación. Este diagrama no anuncia un producto de ejecución." },
          { label: "Verificación", body: "Contrastar un resultado es una responsabilidad distinta de generar una respuesta. Es una dirección de diseño, no una garantía de que las respuestas de un modelo estén verificadas." },
        ],
      },
    },
    work: {
      title: "La memoria del agente, guardada en un solo archivo.",
      description:
        "VantaDB es el primer producto del laboratorio: un motor embebido que gobierna el ciclo de vida de la memoria de agentes —conservar, recuperar, priorizar, actualizar, invalidar y auditar—.",
      vanta: {
        name: "VantaDB",
        tagline: "SQLite for AI Agents",
        problem:
          "La ventana de contexto es una mesa de trabajo que se vacía al cerrar la sesión, no un sistema de memoria: el contexto se pierde en el medio, cada token cuesta y nada gobierna lo que el agente conserva.",
        body: "VantaDB mantiene la memoria del agente dentro de la aplicación: un solo archivo .vanta, sin demonio y sin nube obligatoria. Tres capas estratifican lo que conviene conservar —un registro episódico append-only, un grafo semántico de hechos atómicos y un núcleo procedural protegido— mientras una consolidación asíncrona promueve lo que sobrevive.",
        art: {
          layers: ["Episódica", "Semántica", "Procedural"],
          core: ".vanta",
        },
      },
      /* Consumido entre páginas: projects renderiza estas etiquetas tal cual. */
      vantadbFacts: ["Núcleo Rust", "Python + TypeScript", "Núcleo Apache-2.0"],
      scopegrainName: "Scopegrain",
      scopegrainSummary: "Un prototipo independiente, aún tomando forma.",
      scopegrainBody: "Scopegrain es trabajo público en curso. Sigue en incubación, sin un anuncio de lanzamiento como producto.",
    },
    holons: {
      title: "Una pieza por sí misma. Parte de algo mayor.",
      definition: "Un holón tiene una función propia y, al mismo tiempo, forma parte de un sistema mayor.",
      usage: "En NEGENT MIND usamos esta idea para ordenar capacidades que podrían colaborar sin perder una responsabilidad clara.",
      boundary: "Es un mapa de diseño a largo plazo, no nueve productos disponibles. Cardinal no es otro nombre de VantaDB.",
      controls: "Explorar los nueve holones y VantaDB",
      whole: "el conjunto",
      /* La pieza construida del mapa — ocupa el último asiento en el
         explorador, no es un holón: membrana sólida entre permeables. */
      vanta: {
        name: "VantaDB",
        tagline: "SQLite for AI Agents",
        body: "Memoria persistente embebida para agentes de IA — la única pieza de este mapa que ya existe como software.",
      },
      items: [
        { name: "Cardinal", role: "Contexto y memoria de trabajo", body: "La dirección de Cardinal sería organizar contexto y memoria de trabajo dentro de un sistema mayor. Es una visión de diseño, no otro nombre de VantaDB." },
        { name: "Iris", role: "Percepción e ingesta", body: "La dirección de Iris sería abordar percepción e ingesta como una responsabilidad propia. Aquí no se anuncia un pipeline de ingesta disponible." },
        { name: "Meta", role: "Verificación y metacognición", body: "La dirección de Meta sería abordar verificación y metacognición dentro de un sistema mayor. Su lugar en el mapa no afirma que exista software de verificación operativo." },
        { name: "Execute", role: "Ejecución de herramientas", body: "La dirección de Execute sería abordar la ejecución de herramientas como una responsabilidad acotada. No es un servicio de ejecución disponible." },
        { name: "Sage", role: "Corrección y feedback", body: "La dirección de Sage sería abordar corrección y feedback. No implica que exista un sistema autónomo de corrección disponible." },
        { name: "Plan", role: "Capacidad en visión", body: "Parte del mapa a largo plazo; no se anuncia aquí como software disponible." },
        { name: "Orchestra", role: "Capacidad en visión", body: "Parte del mapa a largo plazo; no se anuncia aquí como software disponible." },
        { name: "Reverb", role: "Capacidad en visión", body: "Parte del mapa a largo plazo; no se anuncia aquí como software disponible." },
        { name: "Reason", role: "Capacidad en visión", body: "Parte del mapa a largo plazo; no se anuncia aquí como software disponible." },
      ],
    },
    method: {
      title: "Del código a una conversación concreta.",
      description: "Abre el repositorio, contrasta lo que hace y trae un caso que podamos reproducir.",
      evidence: {
        controls: "Elegir cómo examinar el trabajo",
        code: "Código",
        context: "Contexto escrito",
        conversation: "Conversación",
        conversationTitle: "Traer un caso concreto",
        conversationBody: "GitHub Discussions es un lugar para plantear una pregunta con contexto. Un enlace al trabajo relevante y un caso reproducible hacen más concreta esa conversación.",
      },
      items: [
        {
          title: "Empezar por un artefacto",
          body: "El código y el README de VantaDB son el punto de partida para entender su implementación, instalación y limitaciones.",
        },
        {
          title: "Leer el contexto escrito",
          body: "El README es el punto de partida para la instalación, el uso documentado y las limitaciones actuales. Léelo junto a la implementación; no sustituye inspeccionar el código.",
        },
      ],
      sourceAction: "Inspeccionar VantaDB en GitHub",
      methodAction: "Leer nuestros principios de trabajo",
    },
    principles: {
      title: "Principios antes que promesas.",
      description: "Criterios de trabajo, no eslóganes. Cada uno se puede comprobar en el repositorio.",
      items: [
        {
          term: "Evidencia antes que marketing",
          detail: "El código y el README son la fuente. Lo que aún no existe se etiqueta como visión, nunca como producto.",
          mark: "evidence",
          check: "se comprueba en el código y el README",
        },
        {
          term: "Local-first",
          detail: "La capacidad vive junto a la aplicación: un archivo local, sin demonio y sin un servicio en la nube obligatorio.",
          mark: "local",
          check: "se comprueba en la instalación documentada",
        },
        {
          term: "Open core",
          detail: "El núcleo es abierto y auditable —VantaDB se publica bajo Apache-2.0— y la gobernanza del proyecto es pública.",
          mark: "open",
          check: "se comprueba en la licencia Apache-2.0",
        },
      ],
    },
    invitation: {
      title: "Trae una pregunta útil.",
      body: "No necesitas una gran pull request para contribuir. Un párrafo confuso, un fallo reproducible o un cambio bien acotado son buenos puntos de partida.",
      action: "Encuentra cómo participar",
    },
    faqTitle: "Antes de abrir el repositorio.",
    faq: [
      {
        question: "¿Cómo empiezo con VantaDB?",
        answer: "Clona el repositorio y sigue el README: contiene la instalación, los bindings de Python y TypeScript y las limitaciones actuales. El README es la fuente mantenida; preferimos enlazarlo a reproducir un fragmento de API que puede quedar desactualizado.",
      },
      {
        question: "¿Bajo qué licencia está el código?",
        answer: "El núcleo de VantaDB se publica bajo Apache-2.0. La licencia de cada repositorio manda; un nombre de proyecto no sustituye a su licencia.",
      },
      {
        question: "¿Puedo contribuir sin escribir código?",
        answer: "Sí. Un fallo reproducible, una corrección de documentación o una pregunta con contexto en GitHub Discussions son contribuciones válidas. La página Contribuir detalla las tres vías y qué contexto incluir.",
      },
      {
        question: "¿Qué relación tiene VantaDB con los holones?",
        answer: "VantaDB es la primera capacidad del mapa que existe como software: memoria persistente como proyecto independiente. El resto de los holones sigue siendo una visión de diseño a largo plazo, no productos anunciados.",
      },
    ],
  },
  projects: {
    title: "Software, con su estado a la vista.",
    description: "NEGENT MIND construye proyectos independientes y componibles alrededor de modelos de IA. Esto es lo activo, lo que aún es un prototipo y lo que sigue siendo una dirección.",
    vantadb: {
      summary: "Memoria persistente embebida y recuperación híbrida para agentes de IA.",
      body: "El proyecto principal actual. Un motor Rust local-first con bindings documentados de Python y TypeScript. Las aplicaciones pueden guardar y recuperar contexto entre sesiones sin exigir un servicio en la nube.",
      detail: "Núcleo Apache-2.0. El código y las instrucciones de instalación están en el repositorio.",
    },
    scopegrain: {
      summary: "Un prototipo en incubación, no un producto lanzado.",
      body: "Scopegrain es independiente de VantaDB. Su estado de trabajo público en curso no es un anuncio de lanzamiento ni una promesa de madurez como producto.",
      detail: "Aquí no se anuncia una fecha de lanzamiento ni una oferta de producto.",
    },
    boundary: {
      title: "Un mapa de capacidades no es un catálogo de productos.",
      body: "Los nueve holones describen una visión de largo plazo. No son nueve paquetes que puedes instalar. Cardinal forma parte de esa visión; no es otro nombre para VantaDB.",
      action: "Entender la dirección del laboratorio",
    },
    closing: {
      title: "Empieza por el software que existe.",
      body: "VantaDB está activo y documentado; Scopegrain es trabajo público en curso. Los repositorios son la fuente honesta.",
    },
  },
  vantadb: {
    title: "El contexto debería durar más que la sesión.",
    description: "VantaDB es memoria persistente embebida y recuperación híbrida para agentes de IA. Es el proyecto principal actual de NEGENT MIND, no la totalidad del laboratorio.",
    intro: "Mantén la memoria en la aplicación, sin que un servicio en la nube sea un requisito. Un núcleo Rust se ocupa del almacenamiento y la recuperación, con bindings de Python y TypeScript documentados en el repositorio.",
    diagram: {
      title: "Persistir. Recuperar. Reutilizar.",
      description: "Una vista conceptual de cómo una aplicación puede dar continuidad al contexto entre sesiones. Es un diagrama del mecanismo, no una demo en vivo.",
      steps: [
        {
          title: "Persistir",
          body: "La aplicación guarda el contexto que conviene conservar más allá de la sesión actual.",
          detail: "De una sesión al almacenamiento persistente.",
        },
        {
          title: "Recuperar",
          body: "La recuperación híbrida busca contexto almacenado relevante para la siguiente petición de la aplicación.",
          detail: "Del contexto almacenado a una selección útil.",
        },
        {
          title: "Reutilizar",
          body: "La aplicación aporta ese contexto a una interacción posterior con el modelo.",
          detail: "Entre sesiones, bajo control de la aplicación.",
        },
      ],
      note: "La aplicación decide qué guardar y qué enviar al modelo. El almacenamiento persistente no implica que un agente aprenda de forma autónoma o verifique sus respuestas.",
    },
    fit: {
      title: "Una pieza de infraestructura, no una dependencia alojada.",
      items: [
        {
          title: "Un agente que retoma una tarea",
          body: "Mantén contexto relevante disponible al terminar una sesión, en vez de depender solo de la conversación actual.",
        },
        {
          title: "Recuperación dentro de una aplicación",
          body: "Usa la memoria embebida como parte de tu flujo de agentes. El modelo y la orquestación siguen siendo tu elección.",
        },
        {
          title: "Desarrollo local-first",
          body: "Trabaja sin convertir un despliegue en la nube en requisito para tener memoria persistente.",
        },
      ],
    },
    facts: {
      title: "Lo concreto.",
      rows: [
        { term: "Núcleo", detail: "Rust" },
        { term: "Bindings", detail: "Python y TypeScript, documentados en el repositorio" },
        { term: "Recuperación", detail: "Híbrida" },
        { term: "Operación", detail: "Embebida y local-first; sin servicio en la nube obligatorio" },
        { term: "Licencia del núcleo", detail: "Apache-2.0" },
      ],
      boundary: "El repositorio es la fuente de verdad sobre el comportamiento admitido y las limitaciones actuales. Esta descripción no promete compatibilidad con cualquier modelo, framework o carga de trabajo.",
    },
    start: {
      title: "Empieza por el código.",
      body: "Consulta el README real para la instalación y el uso. Enlazamos las instrucciones mantenidas en vez de reproducir un fragmento de API que puede quedar desactualizado.",
      docsAction: "Instalación y documentación",
      codeAction: "Explorar el repositorio",
      question: "¿Tienes una pregunta sobre el proyecto?",
    },
  },
  about: {
    title: "Construir lo que rodea al modelo.",
    description: "NEGENT MIND es un laboratorio independiente de infraestructura y capacidades para agentes de IA. Empezamos por la memoria persistente y mantenemos una visión más amplia, expresamente de largo plazo.",
    mission: {
      title: "Un modelo no es un agente completo.",
      body: "Memoria, percepción, razonamiento, acción y verificación requieren infraestructura además de modelos. Trabajamos en piezas útiles de ese sistema, como proyectos independientes que puedan sostenerse por sí mismos.",
      boundary: "No somos un proveedor de modelos. Tampoco anunciamos una plataforma integrada en la que ya exista cada capacidad.",
    },
    principles: {
      title: "Unos límites que merece la pena mantener.",
      items: [
        { title: "Local-first", body: "No hacer de un servicio remoto un requisito cuando la capacidad puede vivir junto a la aplicación." },
        { title: "Evidencia antes que marketing", body: "Priorizar código inspeccionable, limitaciones escritas e informes reproducibles frente a afirmaciones sin respaldo." },
        { title: "Piezas independientes y componibles", body: "Un proyecto debe tener un propósito claro sin exigir el resto de un ecosistema futuro." },
        { title: "Open-core transparente", body: "Explicitar los límites de licencia. El núcleo de VantaDB es Apache-2.0; un nombre de proyecto no sustituye a su licencia." },
        { title: "Colaboración escrita", body: "Conservar decisiones y contexto técnico de forma comprensible para quien no estuvo en la conversación." },
      ],
    },
    vision: {
      title: "Un mapa de intención. No software publicado.",
      description: "Cardinal, Iris, Meta, Execute, Sage, Plan, Orchestra, Reverb y Reason son los nueve holones de nuestra visión de capacidades. Sus nombres describen una dirección, no nueve productos activos.",
      note: "El proyecto activo es VantaDB. Cardinal no es VantaDB y este mapa no asigna productos actuales a holones futuros.",
    },
    founder: {
      title: "Un laboratorio con un mantenedor al que puedes nombrar.",
      name: "Eros",
      role: "Fundador y mantenedor",
      body: "NEGENT MIND es actualmente un laboratorio independiente, aún no constituido como empresa. Eros mantiene el trabajo; las contribuciones y las conversaciones técnicas pasan por GitHub.",
      action: "Eros en GitHub",
    },
    invitation: {
      title: "La dirección es amplia. El próximo cambio no debería serlo.",
      body: "Elige una parte concreta del trabajo, explica el problema y ayuda a hacerla más clara o más útil.",
      action: "Contribuir al trabajo",
    },
  },
  contribute: {
    title: "El trabajo útil empieza en pequeño.",
    description: "Una explicación más clara, un fallo reproducible, un cambio de código acotado. Elige algo concreto y deja contexto suficiente para que otra persona pueda seguirlo.",
    pathsTitle: "Tres formas de ayudar.",
    paths: [
      {
        title: "Mejorar la documentación",
        body: "Encuentra el párrafo que te frenó. Explica qué esperabas entender y propón un ejemplo o una explicación más precisa.",
        evidence: "Incluye la página, el pasaje confuso y la corrección.",
      },
      {
        title: "Comunicar un fallo reproducible",
        body: "Reduce el fallo al caso útil más pequeño. Describe qué ocurrió y qué esperabas que ocurriera.",
        evidence: "Incluye el entorno, la versión y los pasos para reproducirlo.",
      },
      {
        title: "Aportar código acotado",
        body: "Parte de una incidencia clara o conversa antes sobre el cambio. Centra la pull request, explica las decisiones e incluye las pruebas pertinentes.",
        evidence: "Muestra por qué funciona el cambio, no solo que se generó el código.",
      },
    ],
    expectations: {
      title: "Entiende lo que envías.",
      body: "La calidad se demuestra con explicación, pruebas y evidencia. Si usas IA para preparar una contribución, sigues siendo responsable de entender el resultado, revisarlo y poder explicar su comportamiento.",
      note: "Lee la guía antes de abrir una pull request. Un cambio pequeño y bien explicado es más fácil de revisar que un conjunto de arreglos sin relación.",
    },
    conversation: {
      title: "Una pregunta también es un punto de partida.",
      body: "Usa GitHub Discussions para preguntas y una primera conversación sobre una posible contribución. Consulta la guía de soporte para decidir dónde corresponde cada petición.",
      support: "Leer la guía de soporte",
    },
    safety: {
      title: "Cuidar la colaboración.",
      conductTitle: "Personas",
      conductBody: "El código de conducta define las expectativas de participación. Léelo antes de unirte a la conversación.",
      conductAction: "Código de conducta",
      securityTitle: "Seguridad",
      securityBody: "Lee la política de seguridad antes de divulgar públicamente una posible vulnerabilidad. Sigue las instrucciones de comunicación de esa política.",
      securityAction: "Política de seguridad",
    },
    faqTitle: "Antes de abrir una pull request.",
    faq: [
      {
        question: "¿Tengo que aportar código?",
        answer: "No. Las correcciones de documentación y los informes de fallos reproducibles son contribuciones valiosas. Elige un problema concreto y aporta contexto suficiente para que otra persona pueda actuar.",
      },
      {
        question: "¿Puedo enviar trabajo asistido por IA?",
        answer: "Debes entender, revisar y responsabilizarte de todo lo que envíes. Incluye las pruebas y la explicación que pide la guía de contribución; el código generado no demuestra que un cambio sea correcto.",
      },
      {
        question: "¿Puedo construir uno de los nueve holones?",
        answer: "Los holones son una visión de largo plazo, no nueve repositorios activos ni una lista de tareas preparada. Empieza por los proyectos existentes y conversa sobre una propuesta acotada antes de abordar una implementación grande.",
      },
    ],
    closing: {
      title: "Trae el próximo cambio concreto.",
      body: "La guía de contribución explica el flujo; Discussions es donde una pregunta se convierte en plan.",
    },
  },
  gallery: {
    title: "La sala de componentes Orbital.",
    description: "Solo desarrollo. Componentes reales, tokens compartidos y estados interactivos. Esta ruta queda fuera del sitemap público.",
    brand: "Wordmark y monograma",
    type: "Tipografía y jerarquía de lectura",
    typeSample: "Infraestructura alrededor del modelo.",
    bodySample: "Outfit lleva los títulos. DM Sans lleva las explicaciones. La monoespaciada se reserva para identificadores técnicos reales.",
    neutrals: "Carbón y plata",
    spectrum: "Espectro expresivo",
    surfaces: "Superficies",
    surface: "Superficie",
    raised: "Elevada",
    spectrumSurface: "Espectro",
    actions: "Acciones y estados de interacción",
    actionsNote: "Prueba el hover y el foco de teclado en estos enlaces reales. El estado deshabilitado es un control no interactivo, nunca un enlace muerto.",
    primary: "Principal",
    secondary: "Secundario",
    text: "Enlace de texto",
    disabled: "No disponible",
    status: "Estados de proyecto",
    cards: "Composiciones de proyectos",
    faq: "Desplegable",
    motion: "Preferencias de movimiento",
    motionActive: "La animación está permitida.",
    motionPaused: "La animación está pausada.",
    motionReduced: "El sistema operativo solicita movimiento reducido.",
    motionUnknown: "La animación permanece apagada hasta conocer las preferencias.",
    artwork: "Abrir el renderizador de arte",
    liveScene: "Escena en vivo",
    branding: "Assets de marca",
    brandingNote:
      "Archivos canónicos servidos desde /brand más el set de iconos de la app. Las dimensiones son el tamaño intrínseco de cada asset; los GIFs se copian desde github-profile/profile solo para inspección.",
    inventory: "Inventario de componentes",
    inventoryNote:
      "Auditoría viva de la biblioteca interna. «En uso» lista las rutas o componentes montados que importan cada pieza; «biblioteca» marca stock sin consumidor vivo.",
    inUse: "En uso",
    libraryOnly: "Biblioteca",
    usedInLabel: "Montado por",
    catLayout: "Estructura",
    catChrome: "Chrome y movimiento",
    catContent: "Contenido",
    catScenes: "Escenas y canvas",
    catLegacy: "Legado v1",
    catUi: "Primitivas shadcn",
    pieces: "piezas",
  },
};
