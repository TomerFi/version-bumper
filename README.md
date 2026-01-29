# Version Bumper<br/>[![docker-version-badge]][docker-image] [![npm-version-badge]][npm-package]

A Node.js executable package determining [semantic version][semver-spec] bumps based on the
[conventional commits spec][conventional-commits].

> See also [version-bumper-action][version-bumper-action] _GitHub_ action.

<details>
<summary>Upgrading from version 2 to 3? Click here.</summary>

<h3>Version 3 introduced breaking changes</h3>
<ul>

<li>
The output was changed from a space-delimited text to a <em>JSON</em> object:<br/>
<ul>
<li><strong>old</strong> <code>2.1.5 2.1.6-dev</code><br/></li>
<li><strong>new</strong><code>{"current":"2.1.4","bump":"patch","next":"2.1.5","dev":"2.1.6-dev"}</code></li>
</ul>
</li>
<br/>

<li>
Changes in the option flags:
  <ul>
  <li><strong>--changelog</strong> was removed. Creating a changelog file is no longer supported.</li>
  <li><strong>--outputtype</strong> was removed. Output to file is no longer supported.</li>
  <li><strong>--preset</strong> was removed. Selecting a preset is no longer supported.</li>
  <li><strong>--repopath</strong> was changed to <strong>--repo</strong> (<em>repopath</em> will eventually be removed).</li>
  <li><strong>--bumpoverride</strong> was changed to <strong>--bump</strong> (<em>bumpoverride</em> will eventually be removed).
  </li>
  </ul>
For more info, run the tool with the <em>-h</em> flag (<em>--help</em>).
</li>
<br/>

<li>Changes in the container image mount target:
<ul>
<li>from <strong>/usr/share/repo</strong></li>
<li>to <strong>/repo</strong></li>
</ul>
</li>
</ul>

```shell
# old v2 run command
docker run --rm -v $PWD:/usr/share/repo tomerfi/version-bumper:latest --repopath /path/to/git --bumpoverride major
# new v3 run command
docker run --rm -v $PWD:/repo tomerfi/version-bumper:latest --repo /path/to/git --bump major
```

</details>

## Usage

The _version-bumper_ tool is executed using `npx` or consumed as a _standard package_.<br/>
We also push a container image encapsulating the executable package to [docker hub][docker-image].

### Automatic Bumps

The following examples assume:
  - The current working directory is a _git_ repository.
  - The latest semver tag is _2.1.4_.
  - Commit messages are based on the [conventional commits spec][conventional-commits].

```shell
$ npx @tomerfi/version-bumper@latest

$ docker run --rm -v $PWD:/repo tomerfi/version-bumper:latest
```

<details>
<summary><em>podman</em> users? Click here.</summary>

```shell
$ podman run --privileged --rm -v $PWD:/repo:ro docker.io/tomerfi/version-bumper:latest
```

</details>


For commits with a _fix_ type, the output of the above commands will be:

```json
{"current":"2.1.4","bump":"patch","next":"2.1.5","dev":"2.1.6-dev"}
```

For commits with a _feat_ type, the output of the above commands will be:

```json
{"current":"2.1.4","bump":"minor","next":"2.2.0","dev":"2.2.1-dev"}
```

For commits containing the text _BREAKING CHANGE_ in their body, the output of the above commands will be:

```json
{"current":"2.1.4","bump":"major","next":"3.0.0","dev":"3.0.1-dev"}
```

### Manual Bumps

Occasionally, we may want to use this only for bumps; no _git_ repository is required.

```shell
$ npx @tomerfi/version-bumper@latest -s 2.1.4 -b patch

$ docker run --rm tomerfi/version-bumper:latest -s 2.1.4 -b patch

{"current":"2.1.4","bump":"patch","next":"2.1.5","dev":"2.1.6-dev"}
```

```shell
$ npx @tomerfi/version-bumper@latest -s 2.1.4 -b minor

$ docker run --rm tomerfi/version-bumper:latest -s 2.1.4 -b minor

{"current":"2.1.4","bump":"minor","next":"2.2.0","dev":"2.2.1-dev"}
```

```shell
$ npx @tomerfi/version-bumper@latest -s 2.1.4 -b major

$ docker run --rm tomerfi/version-bumper:latest -s 2.1.4 -b major

{"current":"2.1.4","bump":"major","next":"3.0.0","dev":"3.0.1-dev"}
```

### ES Module

```js
import { bumper } from '@tomerfi/version-bumper'

// prints { current: '2.1.4', bump: 'patch', next: '2.1.5', dev: '2.1.5-dev' }
bumper({source: "2.1.4", bump: 'patch'}).then(bump => console.log(bump))

// prints { current: '2.1.4', bump: 'minor', next: '2.2.0', dev: '2.2.1-dev' }
bumper({source: "2.1.4", bump: 'minor'}).then(bump => console.log(bump))

// prints { current: '2.1.4', bump: 'major', next: '3.0.0', dev: '3.0.1-alpha1' }
bumper({source: "2.1.4", bump: 'minor', label: '-alpha1'}).then(bump => console.log(bump))
```

<!-- Real Links -->
[docker-image]: https://hub.docker.com/r/tomerfi/version-bumper
[npm-package]: https://www.npmjs.com/package/@tomerfi/version-bumper
[conventional-commits]: https://conventionalcommits.org
[semver-spec]: https://semver.org/
[contributing_md]: https://github.com/TomerFi/version-bumper/blob/dev/CONTRIBUTING.md
[version-bumper-action]: https://github.com/marketplace/actions/version-bumper-action
<!-- Badges Links -->
[docker-version-badge]: https://img.shields.io/docker/v/tomerfi/version-bumper?style=social&logo=docker&label=%20
[npm-version-badge]: https://img.shields.io/npm/v/@tomerfi/version-bumper?style=social&logo=npm&label=%20
# Test
