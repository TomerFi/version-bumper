module.exports = bumper

const recBump = require(`conventional-recommended-bump`)
const semverTags = require('git-semver-tags')
const semver = require('semver')
const fs = require('node:fs')
const { execSync } = require('child_process');

const bumpTypes = ['major', 'minor', 'patch']

/**
 * The bumper function will either figure out the next semver version based on conventional commits in a git repository,
 * or bump a target semver based on the options passed. The option fields are documented in index.js.
 *
 * @param {{source: string, path: string, bump: string, label: string}} opts options to configure bumper
 * @returns {Promise<{current: string, bump: string, next: string, dev: string}>}
 */
async function bumper(opts) {
  // options verification
  if (opts.source === 'git') {
    // if source is 'git', verify specified path exists
    if (!fs.existsSync(opts.path)) {
      throw new Error(`${opts.path} is unreachable`)
    }
    // if source is 'git', verify the source is a git working tree
    try {
      execSync('git rev-parse --is-inside-work-tree', {cwd: `${opts.path}`, stdio: 'pipe'})
    } catch (err) {
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
    ? (await semverTags({cwd: opts.path, skipUnstable: true}))[0] || 'none' // none is default when no tags
    : opts?.source

  if ('none' !== current) {
    let cleanCurrent = semver.clean(current) // for robustness, we work with the clean version internally
    if (!semver.valid(cleanCurrent)) {
      throw new Error(`${current} is not a valid semver`)
    }

    bump = bumpTypes.includes(opts.bump) // if not known manual bump type, use auto type based on commits
      ? opts.bump
      : await getRecommended(opts.path)

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

async function getRecommended (path) {
  let rec = await recBump({whatBump: whatBump ,cwd: path}, createParserOpts())
  return rec.releaseType
}

/**
 * The functions 'createParserOpts', 'whatBump', and 'addBangNotes' were copied (almost) as-is from the
 * conventional-changelog-conventionalcommits package (ISC LICENSE):
 * https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-conventionalcommits
 *
 * And here's why:
 * We have a JS-type GitHub Action using this package, and we use ESBUILD to pack it:
 * https://github.com/TomerFi/version-bumper-action
 *
 * Initially, we used the exported `createPreset` function for creating the conventionalcommits preset:
 * https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-conventionalcommits/index.js
 * This has a side effect of creating the WriterOptions:
 * https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-conventionalcommits/writerOpts.js
 * The WriterOptions are trying to resolve HBS TEMPLATES, NOT PACKED BY ESBUILD.
 *
 * The considered options, at the time of writing this, were (we opt for #1):
 *
 * 1. Copy the 'createParserOpts', 'whatBump', and 'addBangNotes' from the conventionalcommits package because we
 *    technically only need the ParserOptions and the PresetOptions. The WriterOptions and the ChangelogOptions are used
 *    for creating change log files.
 *
 * 2. Rewrite the GitHub Action as a Docker-type action. The first incarnation of the action. We opt
 *    For a JS-type action for cutting back loading times in workflow runs.
 *
 * 3. Skip packing the GitHub Action with Esbuild and push the 'node_modules' to the repo. Which felt like a
 *    maintenance headache.
 */

const breakingHeaderPattern = /^(\w*)(?:\((.*)\))?!: (.*)$/

function createParserOpts () {
  return {
    headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
    breakingHeaderPattern,
    headerCorrespondence: [
      'type',
      'scope',
      'subject'
    ],
    noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
    revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash'],
    issuePrefixes: ['#']
  }
}

function whatBump (commits) {
  let level = 2
  let breakings = 0
  let features = 0

  commits.forEach(commit => {
    // adds additional breaking change notes
    // for the special case, test(system)!: hello world, where there is
    // a '!' but no 'BREAKING CHANGE' in body:
    commit.notes = addBangNotes(commit)
    if (commit.notes.length > 0) {
      breakings += commit.notes.length
      level = 0
    } else if (commit.type === 'feat' || commit.type === 'feature') {
      features += 1
      if (level === 2) {
        level = 1
      }
    }
  })

  return {
    level,
    reason: breakings === 1
      ? `There is ${breakings} BREAKING CHANGE and ${features} features`
      : `There are ${breakings} BREAKING CHANGES and ${features} features`
  }
}

function addBangNotes (commit) {
  const match = commit.header.match(breakingHeaderPattern)
  if (match && commit.notes.length === 0) {
    const noteText = match[3] // the description of the change.

    return [
      {
        title: 'BREAKING CHANGE',
        text: noteText
      }
    ]
  }

  return commit.notes
}
