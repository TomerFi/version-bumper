# Contributing to `version-bumper`</br>[![conventional-commits]][0]

:clap: First off, thank you for taking the time to contribute. :clap:

Contributing is pretty straight-forward:

- Fork the repository
- Commit your work
- Create a pull request against the `master` branch

## Get started with Makefile

```shell
make
```

The `single` (default) Makefile target will build and load a single image based on the underlying OS,
tagging it as `#version` and `latest`.

```shell
make multi
```

The `multi` Makefile target will build multi-platforms images in-cache and not load them (a warning
will issue at build time).

> The `Makefile` is dogfooding, meaning it uses the script for the image to get the next version."

## Early-access

An early-access image manifest deployes to
[ghcr.io](https://github.com/TomerFi/version-bumper/pkgs/container/version-bumper)
for every merge to the default branch, `master`:

```shell
docker run --rm -v $PWD:/usr/share/repo \
ghcr.io/tomerfi/version-bumper:early-access
```

## Lint sources

```shell
docker run --rm -e RUN_LOCAL=true -e IGNORE_GITIGNORED_FILES=true -e IGNORE_GENERATED_FILES=true \
-e VALIDATE_DOCKERFILE=true -e VALIDATE_EDITORCONFIG=true -e VALIDATE_GITHUB_ACTIONS=true \
-e VALIDATE_MARKDOWN=true -e VALIDATE_YAML=true -e VALIDATE_SHELL_SHFMT=true \
-v $PWD:/tmp/lint ghcr.io/github/super-linter:slim-v4
```

## Commit messages

Commit messages must:

- adhere the [Conventional Commits Specification][0]
- be signed-off based on the [Developer Certificate of Origin][1]

## Code of Conduct

Please check the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

<!-- Real Links -->
[0]: https://conventionalcommits.org
[1]: https://developercertificate.org
<!-- Badges Links -->
[conventional-commits]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
