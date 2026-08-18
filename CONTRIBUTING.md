# Contributing to *version-bumper*

Thank you for contributing. This guide covers the essentials.

## AI Policy

This project has a clear AI policy — read [AI_POLICY.md](AI_POLICY.md) and follow it. You're responsible for everything you submit.

## Setup

```bash
git clone <repo-url>
cd version-bumper
npm install
```

See [AGENTS.md](AGENTS.md) for linting, testing, and Docker commands.

## Local Checks

This project uses [husky][husky] with [lint-staged][lint-staged]. The pre-commit hook enforces:

- **Branch protection** — blocks commits directly to `master`
- **Lock file consistency** — verifies `package-lock.json` matches `package.json`
- **Assistant files** — uses [aicfg](https://github.com/TomerFi/aicfg) to sync project instructions (`.agents`, `AGENTS.md`) across editors; run `npm run link-ai-files` to link for Claude Code
- **File-specific checks** — eslint, editorconfig-checker run only on changed files via [lint-staged][lint-staged]

```bash
# Auto-installed by `npm install`
# Runs automatically on every commit (unless on master, which is blocked)
```

To run checks manually against all files:

```bash
npm run lint
npm run ec
```

To run lint-staged manually:

```bash
npx lint-staged
```

## Commit Style

- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- One logical change per commit

## PR Process

1. Branch from `master` with a conventional name: `feat/add-source`, `fix/git-bump`
2. Commit with a descriptive message
3. Run all checks before submitting: `npm run lint && npm run link-ai-files -- --ci && npm test`
4. Open PR with a clear description of what changed and why
5. Address feedback

## Project Walkthrough

*version-bumper* determines semantic version bumps from conventional commits. It supports two modes:

- **Git mode** (default): reads tags from a git repository and computes the bump based on commit history
- **Manual mode**: accepts a semver string and bumps it directly

```bash
# Auto-bump from git
node src/cli.js

# Manual bump
node src/cli.js 1.2.3 -b patch

# Options
node src/cli.js -h
```

### Core Module

The bump logic lives in [src/bumper.js](src/bumper.js):

- Accepts a source (semver string or `'git'`) and a bump type (`'major'` | `'minor'` | `'patch'` | `'auto'`)
- When source is `'git'`, it uses `conventional-recommended-bump` to analyze commits
- Handles edge cases: no tags (defaults to `1.0.0`), invalid semver, breaking changes

### CLI

The CLI entrypoint is [src/cli.js](src/cli.js):

- Uses `minimist` for argument parsing
- Supports deprecated aliases (`repopath` → `repo`, `bumpoverride` → `bump`) for backward compatibility
- Exits with the new version as stdout, or an error message as stderr

### Module Entrypoint

[src/index.js](src/index.js) is the ES module entrypoint that exposes the bumper function for programmatic use.

## Testing

The test suite covers:

- Manual bumps (major/minor/patch with various labels)
- Auto bumps from git (fix → patch, feat → minor, BREAKING CHANGE → major)
- Error cases (invalid semver, unreachable path, non-git folder, bad labels)
- Edge case: no existing tags

```bash
npm test
npm run test:coverage
```

## Docker Image

The project ships a container image for use as a GitHub Action or standalone tool. The image uses `node:slim` as the base, runs as a non-root `node` user, and expects the repository at `/repo`.

[husky]: https://typicode.github.io/husky/
[lint-staged]: https://github.com/okonet/lint-staged
