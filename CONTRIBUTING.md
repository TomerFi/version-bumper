# Contributing to *version-bumper*

:clap: First off, thank you for taking the time to contribute. :clap:

- Fork the repository
- Create a new branch on your fork
- Commit your work
- Create a pull request against the `master` branch

## Project walk through

This project's main entrypoint is the
[entrypoint.sh shell script](https://github.com/TomerFi/version-bumper/blob/master/entrypoint.sh),<br/>
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
make multi
```

The `multi` target will build multi-platforms images in-cache and not load them (a warning
will issue at build time).

```shell
make lint
```

The `lint` target will lint the project using [GitHub's super-linter](https://github.com/github/super-linter).

```shell
make enable-multiarch
```

Will run [qemu-user-static](https://github.com/multiarch/qemu-user-static) and enable image building for various
architectures.

> *enable-multiarch* is set as a prerequisite for *multi*, usually there's no need to invoke it manually.

## Early-access

An early-access image manifest deployed to
[ghcr.io](https://github.com/TomerFi/version-bumper/pkgs/container/version-bumper)
for every push to the default branch, *master*:

```shell
docker run --rm -v $PWD:/usr/share/repo \
ghcr.io/tomerfi/version-bumper:early-access
```

## Invoke the entrypoint directly

For development purposes, it's convenient to invoke the entrypoint directly, i.e. without spinning up a container.<br/>
Install the required *node* dependencies:

```shell
npm i -g \
  conventional-changelog-angular@5.0.13 \
  conventional-changelog-atom@2.0.8 \
  conventional-changelog-cli@2.1.1 \
  conventional-changelog-codemirror@2.0.8 \
  conventional-changelog-conventionalcommits@4.6.1 \
  conventional-changelog-ember@2.0.9 \
  conventional-changelog-eslint@3.0.9 \
  conventional-changelog-express@2.0.6 \
  conventional-changelog-jquery@3.0.11 \
  conventional-changelog-jshint@2.0.9 \
  conventional-recommended-bump@6.1.0 \
  git-semver-tags@4.1.1
```

You can invoke the entrypoint as a standard CLI program:

```shell
$ ./entrypoint.sh --help

Script for automating semantic version bumps based on conventional commits
--------------------------------------------------------------------------
Usage: -h/--help
Usage: [options]

Options:
--label, Optionally set a development build label
  defaults to '.dev'
--changelog, Optionally create a new changelog-X.md (X the next version)
  defaults to 'false'
--preset, Optionally set the preset for creating the change log
  defaults to 'conventionalcommits'
--outputtype, can be either 'stdout' or 'file', file name is 'version-bumper-output'
  defaults to 'stdout'
--repopath, the path of the git repository to work with
  defaults to './'
--bumpoverride, Optionally override the version bump, can be either 'major', 'minor', 'patch' or 'auto
  default to 'auto'

Full example:
--label .dev --changelog true --preset conventionalcommits

Output when the latest tag is 2.1.16 will be:
2.1.17 2.1.18.dev
```
