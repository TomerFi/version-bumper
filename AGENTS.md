# version-bumper

Node.js CLI tool (`@tomerfi/version-bumper`) that determines semantic version bumps based on conventional commits.

## Tech Stack
- Node.js (>= 18), ES modules (`"type": "module"`)
- `semver` for version calculations, `minimist` for CLI args
- `conventional-recommended-bump` + `git-semver-tags` for commit analysis

## Architecture
- `src/bumper.js` — core bump logic
- `src/cli.js` — CLI entrypoint (bin)
- `src/index.js` — module entrypoint

## Key Behaviors
- Preserve `v` prefix if present (`v1.2.3` → `v1.2.4`)
- Dev label must start with hyphen (`-dev`, `-alpha1`)

## Coding Conventions

- ES modules only — `import`/`export`, never `require`/`module.exports`
- Async/await for all async operations
- `minimist` for CLI argument parsing
- `semver` package for version calculations
- ESLint for linting (`eslint.config.mjs`), run with `npm run lint`

## Testing

- **Framework**: Mocha with TDD UI (`suite`/`test`, not `describe`/`it`)
- **Assertions**: Chai with chai-as-promised
- **Coverage**: c8 with lcov + html reporters, CodeCov integration
- Run tests: `npm test`
- Run with coverage: `npm run test:coverage`
- Tests use `--check-leaks --fail-zero --recursive`

## Container Rules

- Use `podman`, not `docker`
- Lint Dockerfile with hadolint (use `lint-dockerfile` command)
- Image base: `node:20-slim` with git installed
- Entrypoint: `node /home/node/bumper/src/cli.js`

## CI/CD

- GitHub Actions for CI/CD
- Workflows: `ci.yml` (main), `test_package.yml`, `test_image.yml`, `release.yml`
- Test matrix: Node 20 + latest, Ubuntu + macOS
- Coverage uploaded to CodeCov
- Use reusable workflows (`workflow_call`) where possible

## Git Workflow

- NEVER push directly to `master` — always create a feature branch and PR
- Conventional commits for PR titles (`feat:`, `fix:`, `docs:`, `chore:`)
- Always squash merge PRs
- GPG sign all commits
