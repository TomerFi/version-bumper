import { Bumper } from 'conventional-recommended-bump'
import { getSemverTags } from 'git-semver-tags'
import * as semver from 'semver'
import * as fs from 'node:fs'
import { execSync } from 'child_process'

// required for esbuild in gh action
import _ from 'conventional-changelog-conventionalcommits' // eslint-disable-line no-unused-vars

const bumpTypes = ['major', 'minor', 'patch']

/**
 * The bumper function will either figure out the next semver version based on conventional commits in a git repository,
 * or bump a target semver based on the options passed. The option fields are documented in index.js.
 *
 * @param {{source: string, path: string, bump: string, label: string}} opts options to configure bumper
 * @returns {Promise<{current: string, bump: string, next: string, dev: string}>}
 */
export async function bumper(opts) {
  // options verification
  if (opts.source === 'git') {
    // if source is 'git', verify specified path exists
    if (!fs.existsSync(opts.path)) {
      throw new Error(`${opts.path} is unreachable`)
    }
    // if source is 'git', verify the source is a git working tree
    try {
      execSync('git rev-parse --is-inside-work-tree', {cwd: `${opts.path}`, stdio: 'pipe'})
    } catch (err) { /* eslint-disable-line no-unused-vars */
      throw new Error(`${opts.path} is not a git repository`)
    }
  } else {
    // 'auto' discovery of tags requires a git repository. if source is not 'git', a bump type must be specified
    if (!bumpTypes.includes(opts.bump)) {
      throw new Error(`for ${opts.source}, please use ${bumpTypes} bump type instead of ${opts.bump}`)
    }
  }
  // verify the development iteration label won't break semver
  if (!/-[0-9A-Za-z-]/.test(opts.label)) {
    throw new Error(`development iteration label ${opts.label} breaks semver`)
  }

  let next = '1.0.0' // default when no current
  let bump = 'none' // default when no bump is performed

  let current =  opts.source === 'git' // if source is 'git' fetch latest semver tag from git
    ? (await getSemverTags({cwd: opts.path, skipUnstable: true}))[0] || 'none' // none is default when no tags
    : opts?.source

  if ('none' !== current) {
    let cleanCurrent = semver.clean(current) // for robustness, we work with the clean version internally
    if (!semver.valid(cleanCurrent)) {
      throw new Error(`${current} is not a valid semver`)
    }

    // the conventionalcommits is included in the module dependencies
    let bmpr = new Bumper(opts.path).loadPreset('conventionalcommits')
    bump = bumpTypes.includes(opts.bump) // if not known manual bump type, use auto type based on commits
      ? opts.bump
      : (await bmpr.bump()).releaseType

    next = current.startsWith('v') // patch for versions that starts with v
      ? `v${semver.inc(cleanCurrent, bump)}`
      : semver.inc(cleanCurrent, bump)
  }

  // concatenate development iteration label
  let dev = current.startsWith('v') // patch for versions that starts with v
    ? `v${semver.inc(next, 'patch')}${opts.label}`
    : `${semver.inc(next, 'patch')}${opts.label}`

  return {current, bump, next, dev}
}
