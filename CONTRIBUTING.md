# Contributing to *version-bumper*

:clap: First off, thank you for taking the time to contribute. :clap:

- Fork the repository
- Create a new branch on your fork
- Commit your work
- Create a pull request against the `master` branch

## Project walk through

This project's main entrypoint is the
[entrypoint.sh shell script](https://github.com/TomerFi/version-bumper/blob/master/entrypoint.sh)
it uses common *nodejs* tools installed globally with a
[Dockerfile](https://github.com/TomerFi/version-bumper/blob/master/Dockerfile).

## Build Commands

> `Makefile` is dogfooding, meaning it uses the entrypoint script for determining the next version.

```shell
make
```

The `single` (default) target will build and load a single image based on the underlying OS,
tagging it as the next version and `latest`.

```shell
make enable-multi-arch
```

Will start a [qemu-user-static container](https://github.com/multiarch/qemu-user-static) for enabling image building for
various architectures.

```shell
make multi
```

The `multi` target will build multi-platforms images in-cache and not load them (a warning
will issue at build time).

```shell
make lint
```

The `lint` target will lint the project using [GitHub's super-linter](https://github.com/github/super-linter).

## Early-access

An early-access image manifest deployed to
[ghcr.io](https://github.com/TomerFi/version-bumper/pkgs/container/version-bumper)
for every push to the default branch, *master*:

```shell
docker run --rm -v $PWD:/usr/share/repo \
ghcr.io/tomerfi/version-bumper:early-access
```
