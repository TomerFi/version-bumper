# Version Bumper</br>[![docker-version]][0] [![docker-pulls]][0]

[![license-badge]][1] [![gh-build-status]][2]

Containerized scripts for determining the next semantic version for</br>
a git repository based on existing tags and [conventional commits][3].

## Run

```shell
docker run -v $PWD:/usr/share/repo tomerfi/version-bumper:latest
```

## GitHub action

If you're working git GitHub Actions,</br>
you can use [this action][8] and automate your release workflow.

## Example outcome

If the latest [semantic][4] tag, in a git repository is, for instance, `2.1.6`.</br>
The following table illustrates the outcome based on the required bump,</br>
identified by [conventional][3] commit messages:

| Required bump | Outcome         |
| ------------- | --------------- |
| major         | 3.0.0 3.0.1.dev |
| minor         | 2.2.0 2.2.1.dev |
| patch         | 2.1.7 2.1.8.dev |

> Tip: split the outcome using the space char to separate</br>the next version from the next development iteration.

## Options

Add the following flags for granular control:

| Flag         | Function                                         | Default               |
| ------------ | ------------------------------------------------ | --------------------- |
| --changelog  | also create a changelog-x.y.z.md file.           | `false`               |
| --label      | set the label for the development iteration.     | `.dev`                |
| --preset     | set the preset for the changelog file.           | `conventionalcommits` |
| --outputtype | the output type of the outcome, `stdout`/`file`. | `stdout`              |
| --repopath   | the git repository path.                         | `/usr/share/repo`     |

> Note: the `--outputtype file` option will produce a file in your repository named `version-bumper-output`.

Installed presets:

- [angular][9]
- [atom][10]
- [codemirror][11]
- [conventionalcommits][12]
- [ember][13]
- [eslint][14]
- [express][15]
- [jquery][16]
- [jshint][17]

### Example fully configured run

```shell
docker run -v $PWD:/usr/share/repo tomerfi/version-bumper:latest \
--changelog true --label .dev --preset conventionalcommits --outputtype stdout
```

> Tip: other than `conventionalcommits`, possible prest values can be found [here][5].

## Contributing

The contributing guidelines are [here][6]

## Code of Conduct

The code of conduct is [here][7]

<!-- editorconfig-checker-disable -->
<!-- Real Links -->
[0]: https://hub.docker.com/r/tomerfi/version-bumper
[1]: https://github.com/TomerFi/version-bumper
[2]: https://github.com/TomerFi/version-bumper/actions/workflows/stage.yml
[3]: https://conventionalcommits.org
[4]: https://semver.org/
[5]: https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-cli/cli.js
[6]: https://github.com/TomerFi/version-bumper/blob/dev/.github/CONTRIBUTING.md
[7]: https://github.com/TomerFi/version-bumper/blob/dev/.github/CODE_OF_CONDUCT.md
[8]: https://github.com/marketplace/actions/version-bumper-action
[9]: https://www.npmjs.com/package/conventional-changelog-angular
[10]: https://www.npmjs.com/package/conventional-changelog-atom
[11]: https://www.npmjs.com/package/conventional-changelog-codemirror
[12]: https://www.npmjs.com/package/conventional-changelog-conventionalcommits
[13]: https://www.npmjs.com/package/conventional-changelog-ember
[14]: https://www.npmjs.com/package/conventional-changelog-eslint
[15]: https://www.npmjs.com/package/conventional-changelog-express
[16]: https://www.npmjs.com/package/conventional-changelog-jquery
[17]: https://www.npmjs.com/package/conventional-changelog-jshint
<!-- Badges Links -->
[docker-pulls]: https://img.shields.io/docker/pulls/tomerfi/version-bumper.svg?logo=docker&label=pulls
[docker-version]: https://img.shields.io/docker/v/tomerfi/version-bumper?color=%230A6799&logo=docker
[gh-build-status]: https://github.com/TomerFi/version-bumper/actions/workflows/stage.yml/badge.svg
[license-badge]: https://img.shields.io/github/license/tomerfi/version-bumper
<!-- editorconfig-checker-enable -->
