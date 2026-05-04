---
name: smoke-tester
description: Runs smoke tests on the container image. Use to verify the image builds and runs correctly.
---

## What I do
Build the version-bumper container image and verify it runs correctly by running smoke tests.

## When to use me
Use this when verifying the container image builds and runs correctly.

## Steps

1. Build the image:

```bash
CONTAINER_CMD=$(command -v podman 2>/dev/null || echo docker)
$CONTAINER_CMD build --tag tomerfi/version-bumper:dev .
```

2. Run smoke test:

```bash
$CONTAINER_CMD run --rm tomerfi/version-bumper:dev -h
```

3. Check the output matches:

```
  Usage
    version-bumper [options]
    version-bumper [options] [path]
```

## Troubleshooting

If the test fails:
- Check container logs for runtime errors
- Verify Node.js and dependencies installed correctly
- Ensure git is available in the image
- Check entrypoint configuration in Dockerfile
