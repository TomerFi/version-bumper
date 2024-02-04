module.exports = bumper

const recBump = require(`conventional-recommended-bump`)
const semverTags = require('git-semver-tags')
const semver = require('semver')
const shell = require('shelljs')

shell.config.silent = true

const bumpTypes = ['major', 'minor', 'patch']

/**
 * @param opts i.e. {source: git, path: './', bump: 'auto', label: '-dev', preset: 'conventionalcommits'}
 * @returns { original: '2.1.4', bump: 'major', next: '3.0.0', dev: '3.0.0-dev' }
 */

async function bumper(opts) {
    if (!shell.test('-d', opts.path)) {
        throw new Error(`${opts.path} is unreachable`)
    }

    if (!(shell.cd(opts.path).exec(`git rev-parse --is-inside-work-tree`).stdout)) {
        throw new Error(`${opts.path} is not a git repository`)
    }

    let next = '1.0.0' // default when original non semver
    let bump = 'none' // default when not bump is performed
    let original = opts.source === 'git' ? (await semverTags())[0] : opts?.source

    if (semver.valid(original)) {
        if (opts.source !== 'git' && !bumpTypes.includes(opts.bump)) {
            throw new Error(`for ${opts.source}, please use ${bumpTypes} bump type instead of ${opts.bump}`)
        }
        bump = bumpTypes.includes(opts.bump) ? opts.bump :
            (await recBump({preset: opts.preset})).releaseType
        next = semver.inc(original, bump)
    }

    let dev = `${next}${opts.label}`
    return {original, bump, next, dev}
}
