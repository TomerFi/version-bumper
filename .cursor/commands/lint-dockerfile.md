---
name: lint-dockerfile
description: Lint Dockerfile with hadolint
---

Run hadolint on Dockerfile:

```bash
CONTAINER_CMD=$(command -v podman 2>/dev/null || echo docker)
cat Dockerfile | $CONTAINER_CMD run --rm -i ghcr.io/hadolint/hadolint hadolint -
```

Or if you have hadolint installed locally:

```bash
hadolint Dockerfile
```

Fix issues automatically where possible, then re-run to verify.
