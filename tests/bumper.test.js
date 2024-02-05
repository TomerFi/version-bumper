const chai = require('chai')
const shell = require('shelljs')
const path = require('path')
const bumperSut = require('../src/bumper.js')

expect = chai.expect
chai.use(require('chai-as-promised'))

suite('Test manual bumps', () => {
  [{
    opts: {source: '1.2.3', bump: 'major', label: '-dev'},
    output: {original: '1.2.3', bump: 'major', next: '2.0.0', dev: '2.0.1-dev'}
  },{
    opts: {source: '1.2.3', bump: 'minor', label: '-alpha1'},
    output: {original: '1.2.3', bump: 'minor', next: '1.3.0', dev: '1.3.1-alpha1'}
  },{
    opts: {source: 'v1.2.3', bump: 'patch', label: '-beta1'},
    output: {original: 'v1.2.3', bump: 'patch', next: 'v1.2.4', dev: 'v1.2.5-beta1'}
  }].forEach(t => {
    test(`testing with ${JSON.stringify(t.opts)}
      expecting output ${JSON.stringify(t.output)}`, async () => {
      return expect(bumperSut(t.opts)).to.eventually.deep.equal(t.output)
    })
  });

  [{
    opts: {source: '1.2.3', bump: 'auto', label: '-dev'},
    error: 'for 1.2.3, please use major,minor,patch bump type instead of auto'
  },{
    opts: {source: '1a-2b', bump: 'minor', label: '-dev'},
    error: '1a-2b is not a valid semver'
  },{
    opts: {source: '1.2.3', bump: 'minor', label: 'missingHyphen'},
    error: 'development iteration label missingHyphen breaks semver'
  }].forEach(t => {
    test(`testing with ${JSON.stringify(t.opts)}
      expecting error message "${t.error}"`, async () => {
      return expect(bumperSut(t.opts)).to.eventually.be.rejectedWith(t.error)
    })
  })
})

suite('Test automatic bumps', () => {
  let workspace = ''

  suiteSetup(() => {
    workspace = path.join(shell.tempdir(), 'version-bumper-tests')
    shell.rm ('-rf', workspace)
  })

  test(`testing with an unreachable
      expecting "folder is unreachable" error message`, async () => {

    return expect(bumperSut({source: 'git', bump: 'auto', preset: 'angular', path: 'your-non-existing-folder'}))
      .to.eventually.be.rejectedWith('your-non-existing-folder is unreachable')
  })

  test(`testing with a non-git folder
      expecting "folder is not a git repository" error message`, async () => {

    let nonGit = path.join(workspace, 'non-git')
    shell.mkdir('-p', nonGit)

    return expect(bumperSut({source: 'git', bump: 'auto', preset: 'angular', path: nonGit}))
      .to.eventually.be.rejectedWith(`${nonGit} is not a git repository`)
  })

  test(`testing with a repository with no tags
      expecting default results with no bump`, async () => {

    let noTags = path.join(workspace, 'no-tags')
    createRepoContent(noTags)

    return expect(bumperSut({source: 'git', bump: 'auto', label: '-alpha1', preset: 'angular', path: noTags}))
      .to.eventually.deep.equal({original: 'none', bump: 'none', next: '1.0.0', dev: '1.0.1-alpha1'})
  })

  test(`testing with a repository with no new commits
      expecting default results with no bump`, async () => {

    let noCommits = path.join(workspace, 'no-commits')
    createRepoContent(noCommits, true)

    return expect(bumperSut({source: 'git', bump: 'auto', label: '-dev.0', preset: 'angular', path: noCommits}))
      .to.eventually.deep.equal({original: '1.2.3', bump: 'patch', next: '1.2.4', dev: '1.2.5-dev.0'})
  })

  test(`testing with a fix type commit
      expecting a patch bump`, async () => {

    let patchBump = path.join(workspace, 'patch-bump')
    createRepoContent(
      patchBump,
      true,
      'echo "fix_content" > fix_file.file',
      'git add fix_file.file',
      'git commit -m "fix: added fix_file.file"'
    )

    return expect(bumperSut({source: 'git', bump: 'auto', label: '-alpha1', preset: 'angular', path: patchBump}))
      .to.eventually.deep.equal({original: '1.2.3', bump: 'patch', next: '1.2.4', dev: '1.2.5-alpha1'})
  })

  test(`testing with a feat type commit
      expecting a minor bump`, async () => {

    let minorBump = path.join(workspace, 'minor-bump')
    createRepoContent(
      minorBump,
      true,
      'echo "feat_content" > feat_file.file',
      'git add feat_file.file',
      'git commit -m "feat: added feat_file.file"'
    )

    return expect(bumperSut({source: 'git', bump: 'auto', label: '-alpha1', preset: 'angular', path: minorBump}))
      .to.eventually.deep.equal({original: '1.2.3', bump: 'minor', next: '1.3.0', dev: '1.3.1-alpha1'})
  })

  test(`testing with a breaking change commit body
      expecting a major bump`, async () => {

    let minorBump = path.join(workspace, 'minor-bump')
    createRepoContent(
      minorBump,
      true,
      'echo "breaking_content" > breaking_file.file',
      'git add breaking_file.file',
      `git commit -m "refactor: added breaking_file.file

      BREAKING CHANGE: broke stuff
      "`
    )

    return expect(bumperSut({source: 'git', bump: 'auto', label: '-alpha1', preset: 'angular', path: minorBump}))
      .to.eventually.deep.equal({original: '1.2.3', bump: 'major', next: '2.0.0', dev: '2.0.1-alpha1'})
  })
})

function createRepoContent(target, tag = false, ...cmds) {
  shell.mkdir('-p', target)
  shell.pushd(target)
  shell.exec('git init')
  shell.rm('-rf', '.git/hooks/*')
  shell.exec('echo "dummy-file-content" > file.file')
  shell.exec('git add file.file')
  shell.exec('git commit -m "chore: added file.file"')
  if (tag) {
    shell.exec('git tag -m "1.2.3" 1.2.3')
  }
  cmds.forEach(cmd => shell.exec(cmd))
  shell.popd()
}
