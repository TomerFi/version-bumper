---
description: version-bumper project rules
---

# version-bumper

Node.js CLI tool (`@tomerfi/version-bumper`) that determines semantic version bumps based on conventional commits.

## Architecture

- `src/bumper.js` — core bump logic
- `src/cli.js` — CLI entrypoint (bin)
- `src/index.js` — module entrypoint

## Key Behaviors

- Preserve `v` prefix if present (`v1.2.3` → `v1.2.4`)
- Dev label must start with hyphen (`-dev`, `-alpha1`)

## Coding Conventions

- Async/await for all async operations
- `minimist` for CLI argument parsing
- `semver` package for version calculations
- ESLint for linting (`eslint.config.mjs`), run with `npm run lint`

## Containers

- Lint Dockerfile with hadolint
- Entrypoint: `node /home/node/bumper/src/cli.js`

### Building the Image

```bash
CONTAINER_CMD=$(command -v podman 2>/dev/null || echo docker)
$CONTAINER_CMD build --tag tomerfi/version-bumper:dev .
```

### Testing the Image

```bash
# Basic test
$CONTAINER_CMD run --rm tomerfi/version-bumper:dev -h

# Test with a repository
$CONTAINER_CMD run --privileged --rm -v $PWD:/repo:ro tomerfi/version-bumper:dev
```

### Linting the Dockerfile

```bash
$CONTAINER_CMD run --rm -i ghcr.io/hadolint/hadolint hadolint - < Dockerfile
```

Or if hadolint is installed locally:

```bash
hadolint Dockerfile
```

## Testing

- **Framework**: Mocha with TDD UI (`suite`/`test`, not `describe`/`it`)
- **Assertions**: Chai with chai-as-promised
- **Coverage**: c8 with lcov + html reporters, CodeCov integration
- Run tests: `npm test`
- Run with coverage: `npm run test:coverage`
- Tests use `--check-leaks --fail-zero --recursive`

## Git Workflow

- NEVER push directly to `master` — always create a feature branch and PR
- Conventional commits for PR titles (`feat:`, `fix:`, `docs:`, `chore:`)

## CI/CD

- GitHub Actions for CI/CD
- Coverage uploaded to CodeCov

