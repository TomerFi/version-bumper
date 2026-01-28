---
name: hadolint
description: Lint Dockerfile with hadolint
---

Run hadolint on Dockerfile:

```bash
podman run --rm -i ghcr.io/hadolint/hadolint < Dockerfile
```

Or if you have hadolint installed locally:

```bash
hadolint Dockerfile
```

Fix issues automatically where possible, then re-run to verify.
