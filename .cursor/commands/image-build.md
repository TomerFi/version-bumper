---
name: image-build
description: Build and test the container image with podman/docker
---

Build the image:

```bash
CONTAINER_CMD=$(command -v podman 2>/dev/null || echo docker)
$CONTAINER_CMD build --tag tomerfi/version-bumper:dev .
```

Test the built image:

```bash
CONTAINER_CMD=$(command -v podman 2>/dev/null || echo docker)
$CONTAINER_CMD run --rm tomerfi/version-bumper:dev -h
```

Test with a repository:

```bash
CONTAINER_CMD=$(command -v podman 2>/dev/null || echo docker)
$CONTAINER_CMD run --privileged --rm -v $PWD:/repo:ro tomerfi/version-bumper:dev
```
