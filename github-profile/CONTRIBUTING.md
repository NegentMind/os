[Español](./CONTRIBUTING_ES.md) | English

# Contributing to Negent Mind

Thanks for your interest in contributing. This policy applies to every repository in the
NegentMind organization that does not define its own `CONTRIBUTING.md`.

## Ways to contribute

- **Report bugs**: open an issue in the relevant repository using the bug report form.
  Include what you did, what you expected and what happened, plus versions and environment.
- **Propose features**: open a feature request describing the problem first, then the
  proposed solution.
- **Report benchmarks**: use the benchmark form — methodology, dataset, hardware and
  reproducible results.
- **Contribute code or docs**: fork the repository, create a branch
  (`git checkout -b feat/short-description`), commit, and open a pull request.
- **Help others**: answer questions in issues and discussions.

Security vulnerabilities are never reported in public issues — see
[SECURITY.md](./SECURITY.md).

## Quality policy

Pull requests are reviewed on evidence, not intent:

- **Tests**: new behavior comes with tests, and the existing tests pass.
- **Benchmark**: if the change touches performance, include a reproducible benchmark
  (methodology, dataset, hardware, before/after). Performance claims without one are not
  accepted.
- **Explanation**: the author explains what changed and why, and can answer review
  questions about it.

Outcomes:

- Incomplete pull requests receive requested changes.
- Insecure code is blocked until it is fixed.
- Spam, harassment or sabotage lead to restriction or a ban (see the
  [Code of Conduct](./CODE_OF_CONDUCT.md)).

## Standards

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/), in English.
- **Pull requests**: small and focused — three PRs of 100 lines are easier to review than
  one of 300.
- **Tooling**: each repository documents its own build, test and lint commands; follow
  them. Do not assume tooling that a repository does not document.
- **Language**: code, commits and technical docs in English. Public documents use
  `NAME.md` (English, primary) and `NAME_ES.md` (Spanish).

## Working style

Async-first: discussion happens in issues and pull requests, in writing. Calls happen only
when there is a concrete reason. Roles: the founder is the principal maintainer; trusted
maintainers may be added over time; everyone else contributes through pull requests.

## Licensing of contributions

- Contributions are licensed under the [Apache License 2.0](./LICENSE), the same license as
  the project (Apache-2.0, Section 5).
- **Non-trivial external contributions**: you may be asked to sign an Individual
  Contributor License Agreement based on the Apache ICLA. This requirement is activated
  with the first external pull request; you will be told in the PR if it applies.
- **Trivial documentation fixes** (typos, broken links, wording): a
  [DCO](https://developercertificate.org/) sign-off is enough — commit with `git commit -s`.

> This is based on standard templates and is not legal advice.

## Recognition

Contributors are listed in [CONTRIBUTORS.md](./CONTRIBUTORS.md), and significant
contributions are credited in the release notes of repositories that keep them.

## Contact

Questions and ideas: [GitHub Discussions](https://github.com/NegentMind/.github/discussions). Bugs: GitHub Issues in the relevant repository. See
[SUPPORT.md](./SUPPORT.md).
