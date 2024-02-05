#!/usr/bin/env node

const opts = require('minimist')(process.argv.slice(2), {
  string: ['source', 'repo', 'bump', 'label', 'preset'],
  boolean: ['version', 'help'],
  alias: {
    's': 'source',
    'r': 'repo',
    'b': 'bump',
    'l': 'label',
    'p': 'preset',
    'v': 'version',
    'h': 'help',
    // backward compatibility
    'bumpoverride': 'bump',
    'repopath': 'repo',
  },
  default: {
    'source': 'git',
    'bump': 'auto',
    'label': '-dev',
    'preset': 'angular',
  },
});

function help() {
  console.log(`
  Usage
    version-bumper [options]
    version-bumper [options] [path]

    Note, when running from a container image, the 'version-bumper' command is implicit.

  Example
    version-bumper --source git --repo path/to/git/repo --bump auto --label '-dev' --preset angular
    version-bumper --source 1.2.3 --bump major
    version-bumper path/to/git/repo

    Output Example
      { original: '2.1.4', bump: 'patch', next: '2.1.5', dev: '2.1.5-dev' }

  Options
     -s, --source       Source for the bump, any semver string or 'git' to fetch from tags. Defaults to 'git'.
     -r, --repo         When source is 'git', path of the git repository. Defaults to './'. Overrides first argument.
     -b, --bump         Target bump, 'major' | 'minor' | 'patch' | 'auto'. Defaults to 'auto' which can only be used with a 'git' source.
     -l, --label        Development iteration build label. Defaults to '-dev'.
     -p, --preset       Conventional preset to use. Defaults to 'angular'.
     -v, --version      Print the tool version.
     -h, --help         Show this help message.
  `)
}

function version() {
  let pkgJsn = require('../package.json');
  console.log(`${pkgJsn.name} ${pkgJsn.version}`);
}

if (opts.help) {
  help();
} else if (opts.version) {
  version();
} else {
  // backward compatibility || preferred || default
  let path = opts.repo || opts._[0] || './'
  require('./bumper.js')({path: path,  ...opts})
    .then(o => console.log(JSON.stringify(o)))
}



