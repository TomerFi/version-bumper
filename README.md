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
  <li><strong>--changelog</strong> was removed.</li>
  <li><strong>--outputtype</strong> was removed.</li>
  <li><strong>--preset</strong> was removed.</li>
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
</li><br/>

<li>Output to a file is <strong>no longer supported</strong>, use pipes if needed.</li><br/>

<li>Changelog file creation is <strong>no longer supported</strong>.</li>

</ul>

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
$ npx version-bumper

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
$ npx version-bumper -s 2.1.4 -b patch

$ docker run --rm tomerfi/version-bumper:latest -s 2.1.4 -b patch

{"current":"2.1.4","bump":"patch","next":"2.1.5","dev":"2.1.6-dev"}
```

```shell
$ npx version-bumper -s 2.1.4 -b minor

$ docker run --rm tomerfi/version-bumper:latest -s 2.1.4 -b minor

{"current":"2.1.4","bump":"minor","next":"2.2.0","dev":"2.2.1-dev"}
```

```shell
$ npx version-bumper -s 2.1.4 -b major

$ docker run --rm tomerfi/version-bumper:latest -s 2.1.4 -b major

{"current":"2.1.4","bump":"major","next":"3.0.0","dev":"3.0.1-dev"}
```

### Node.js Package

```js
const bumper = require('version-bumper')

// prints { current: '2.1.4', bump: 'minor', next: '2.2.0', dev: '2.2.1-dev' }
bumper({source: "2.1.4", bump: 'minor'}).then(bump => console.log(bump))
```

## Contributors [![all-contributors-badge]][all-contributors]

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/MisterTimn"><img src="https://avatars.githubusercontent.com/u/4209558?v=4?s=100" width="100px;" alt="Jasper Vaneessen"/><br /><sub><b>Jasper Vaneessen</b></sub></a><br /><a href="https://github.com/TomerFi/version-bumper/commits?author=MisterTimn" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/AlexNDRmac"><img src="https://avatars.githubusercontent.com/u/29776808?v=4?s=100" width="100px;" alt="Oleksandr Andriiako"/><br /><sub><b>Oleksandr Andriiako</b></sub></a><br /><a href="#infra-AlexNDRmac" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Contributing guidelines are [here][contributing_md].

<!-- Real Links -->
[docker-image]: https://hub.docker.com/r/tomerfi/version-bumper
[npm-package]: https://www.npmjs.com/package/version-bumper
[conventional-commits]: https://conventionalcommits.org
[semver-spec]: https://semver.org/
[contributing_md]: https://github.com/TomerFi/version-bumper/blob/dev/CONTRIBUTING.md
[version-bumper-action]: https://github.com/marketplace/actions/version-bumper-action
[all-contributors]: https://allcontributors.org/
<!-- Badges Links -->
[all-contributors-badge]: https://img.shields.io/github/all-contributors/tomerfi/version-bumper?style=plastic&label=%20&color=b7b1e3
[docker-version-badge]: https://img.shields.io/docker/v/tomerfi/version-bumper?style=social&logo=docker&label=%20
[npm-version-badge]: https://img.shields.io/npm/v/version-bumper?style=social&logo=npm&label=%20
