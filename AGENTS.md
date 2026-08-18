# version-bumper

Node.js CLI tool (`@tomerfi/version-bumper`) that determines semantic version bumps based on conventional commits.

## AI Policy

This project has an [AI policy](AI_POLICY.md). Always read it and ensure all suggestions, code, and contributions comply. If any behavior seems to conflict with the policy, warn the user and ask for guidance.

## Architecture

- `src/bumper.js` — core bump logic
- `src/cli.js` — CLI entrypoint (bin)
- `src/index.js` — module entrypoint

## Key Behaviors

- Preserve `v` prefix if present (`v1.2.3` → `v1.2.4`)
- Dev label must start with hyphen (`-dev`, `-alpha1`)

## Working Environment

- This is a **Node.js** project. Use **`package.json`** for all dependencies and scripts.
- This project uses [**husky**][husky] for Git hooks with [**lint-staged**][lint-staged] for file-specific checks.
- The pre-commit hook blocks commits to `master`, verifies lock file consistency, checks assistant files are in sync via [aicfg](https://github.com/TomerFi/aicfg), and runs lint-staged on staged files.

## Linting

```bash
npm run lint                              # lint (read-only, includes eslint, ec)
npm run eslint                            # eslint src
npm run eslint:fix                        # eslint --fix src
npm run ec                                # editorconfig-checker
```

## Testing

- **Framework**: Mocha with TDD UI (`suite`/`test`, not `describe`/`it`)
- **Assertions**: Chai with chai-as-promised
- **Coverage**: c8 with lcov + html reporters, CodeCov integration
- Run tests: `npm test`
- Run with coverage: `npm run test:coverage`
- Tests use `--check-leaks --fail-zero --recursive`

## Docker Image

```bash
# Build
CONTAINER_CMD=$(command -v podman 2>/dev/null || echo docker)
$CONTAINER_CMD build --tag tomerfi/version-bumper:dev .

# Run
$CONTAINER_CMD run --rm tomerfi/version-bumper:dev -h
$CONTAINER_CMD run --privileged --rm -v $PWD:/repo:ro tomerfi/version-bumper:dev
```

Lint the Dockerfile:

```bash
$CONTAINER_CMD run --rm -i ghcr.io/hadolint/hadolint hadolint - < Dockerfile
```

## Git Workflow

- NEVER push directly to `master` — always create a feature branch and PR
- Conventional commits for PR titles (`feat:`, `fix:`, `docs:`, `chore:`)

## CI/CD

- GitHub Actions for CI/CD
- Coverage uploaded to CodeCov

[husky]: https://typicode.github.io/husky/
[lint-staged]: https://github.com/okonet/lint-staged
