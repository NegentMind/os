[English](./CONTRIBUTING.md) | Español

# Contribuir a Negent Mind

Gracias por tu interés en contribuir. Esta política aplica a cada repositorio de la
organización NegentMind que no defina su propio `CONTRIBUTING.md`.

## Formas de contribuir

- **Reportar bugs**: abre un issue en el repositorio correspondiente con el formulario de
  bug. Incluye qué hiciste, qué esperabas y qué ocurrió, además de versiones y entorno.
- **Proponer funcionalidades**: abre una solicitud describiendo primero el problema y
  después la solución propuesta.
- **Reportar benchmarks**: usa el formulario de benchmark — metodología, dataset, hardware
  y resultados reproducibles.
- **Contribuir código o documentación**: haz un fork del repositorio, crea una rama
  (`git checkout -b feat/descripcion-corta`), haz commit y abre un pull request.
- **Ayudar a otros**: responde preguntas en issues y discussions.

Las vulnerabilidades de seguridad nunca se reportan en issues públicos — ver
[SECURITY_ES.md](./SECURITY_ES.md).

## Política de calidad

Los pull requests se revisan por evidencia, no por intención:

- **Tests**: el comportamiento nuevo viene con tests, y los tests existentes pasan.
- **Benchmark**: si el cambio toca rendimiento, incluye un benchmark reproducible
  (metodología, dataset, hardware, antes/después). No se aceptan afirmaciones de
  rendimiento sin él.
- **Explicación**: el autor explica qué cambió y por qué, y puede responder las preguntas
  de la revisión.

Resultados:

- Los pull requests incompletos reciben solicitud de correcciones.
- El código inseguro se bloquea hasta que se corrija.
- El spam, el acoso o el sabotaje llevan a restricción o expulsión (ver el
  [Código de Conducta](./CODE_OF_CONDUCT_ES.md)).

## Estándares

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/), en inglés.
- **Pull requests**: pequeños y enfocados — tres PRs de 100 líneas se revisan mejor que
  uno de 300.
- **Herramientas**: cada repositorio documenta sus propios comandos de build, test y lint;
  síguelos. No asumas herramientas que un repositorio no documente.
- **Idioma**: código, commits y documentación técnica en inglés. Los documentos públicos
  usan `NAME.md` (inglés, principal) y `NAME_ES.md` (español).

## Forma de trabajo

Async-first: la discusión ocurre por escrito en issues y pull requests. Las llamadas se
hacen solo cuando hay una razón concreta. Roles: el fundador es el maintainer principal;
con el tiempo pueden sumarse maintainers de confianza; el resto contribuye mediante pull
requests.

## Licencia de las contribuciones

- Las contribuciones se licencian bajo la [Apache License 2.0](./LICENSE), la misma
  licencia del proyecto (Apache-2.0, sección 5).
- **Contribuciones externas no triviales**: se te puede pedir firmar un Acuerdo de Licencia
  de Contribuidor Individual basado en el Apache ICLA. Este requisito se activa con el
  primer pull request externo; se te indicará en el PR si aplica.
- **Correcciones triviales de documentación** (erratas, enlaces rotos, redacción): basta
  con el sign-off del [DCO](https://developercertificate.org/) — haz commit con
  `git commit -s`.

> Esto se basa en plantillas estándar y no constituye asesoría legal.

## Reconocimiento

Los contribuidores aparecen en [CONTRIBUTORS_ES.md](./CONTRIBUTORS_ES.md), y las
contribuciones significativas se reconocen en las notas de versión de los repositorios que
las mantienen.

## Contacto

GitHub Issues (o Discussions, donde estén habilitadas) en el repositorio correspondiente.
Ver [SUPPORT_ES.md](./SUPPORT_ES.md).
