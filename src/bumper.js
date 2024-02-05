module.exports = bumper

const recBump = require(`conventional-recommended-bump`)
const semverTags = require('git-semver-tags')
const semver = require('semver')
const shell = require('shelljs')

shell.config.silent = true

const bumpTypes = ['major', 'minor', 'patch']

/**
 * @param opts i.e. {source: git, path: './', bump: 'auto', label: '-dev', preset: 'angular'}
 * @returns { original: '2.1.4', bump: 'major', next: '3.0.0', dev: '3.0.0-dev' }
 */

async function bumper(opts) {
    // options verification
    if (opts.source === 'git') {
        // if source is 'git', verify specified path exists
        if (!shell.test('-d', opts.path)) {
            throw new Error(`${opts.path} is unreachable`)
        }
        // if source is 'git', verify the source is a git working tree
        if (!(shell.exec(`cd ${opts.path} && git rev-parse --is-inside-work-tree`).stdout)) {
            throw new Error(`${opts.path} is not a git repository`)
        }
    } else {
        // 'auto' discovery of tags requires a git repository. if source is not 'git', a bump type must be specified
        if (!bumpTypes.includes(opts.bump)) {
            throw new Error(`for ${opts.source}, please use ${bumpTypes} bump type instead of ${opts.bump}`)
        }
    }

    let next = '1.0.0' // default when no original
    let bump = 'none' // default when not bump is performed

    let original =  opts.source === 'git' // if source is 'git' fetch latest semver tag from git
        ? (await semverTags({cwd: opts.path, skipUnstable: true}))[0] || 'none' // default when no tags
        : opts?.source

    if ('none' !== original) {
        let cleanOrig = semver.clean(original) // for robustness, we work with the clean version internally
        if (!semver.valid(cleanOrig)) {
            throw new Error(`${original} is not a valid semver`)
        }

        bump = bumpTypes.includes(opts.bump) // if not known manual bump type, use auto type based on commits
            ? opts.bump
            : (await recBump({preset: opts.preset, cwd: opts.path})).releaseType

        next = original.startsWith('v') // patch for versions that starts with v
            ? `v${semver.inc(cleanOrig, bump)}`
            : semver.inc(cleanOrig, bump)
    }

    let dev = `${next}${opts.label}` // concatenate development iteration label
    return {original, bump, next, dev}
}
