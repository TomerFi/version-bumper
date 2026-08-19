import { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { execSync } from 'node:child_process'
import chai from 'chai'

chai.use(chaiAsPromised)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const cliPath = join(__dirname, '..', 'src', 'cli.js')

function runCli(args) {
  return new Promise((resolve, reject) => {
    execFile('node', [cliPath, ...args], (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(stderr))
      }
      resolve(stdout.trim())
    })
  })
}

function setupTempGitRepo(tempDir) {
  fs.writeFileSync(join(tempDir, 'file.txt'), '')
  execSync('git init', { cwd: tempDir, stdio: 'pipe' })
  execSync('git config user.email "test@test.com"', { cwd: tempDir, stdio: 'pipe' })
  execSync('git config user.name "Test"', { cwd: tempDir, stdio: 'pipe' })
  execSync('git add .', { cwd: tempDir, stdio: 'pipe' })
  execSync('git commit -m "init"', { cwd: tempDir, stdio: 'pipe' })
  execSync('git tag -a v1.0.0 -m "v1.0.0"', { cwd: tempDir, stdio: 'pipe' })
}

suite('CLI entrypoint', () => {
  test('prints help with --help', async () => {
    const output = await runCli(['--help'])
    expect(output).to.include('Usage')
    expect(output).to.include('version-bumper [options]')
    expect(output).to.include('Options')
  })

  test('prints help with -h', async () => {
    const output = await runCli(['-h'])
    expect(output).to.include('Usage')
  })

  test('manual bump with -s and -b', async () => {
    const output = await runCli(['-s', '1.2.3', '-b', 'patch'])
    const result = JSON.parse(output)
    expect(result).to.deep.equal({
      current: '1.2.3',
      bump: 'patch',
      next: '1.2.4',
      dev: '1.2.5-dev'
    })
  })

  test('manual bump with long flags', async () => {
    const output = await runCli(['--source', '2.0.0', '--bump', 'minor'])
    const result = JSON.parse(output)
    expect(result).to.deep.equal({
      current: '2.0.0',
      bump: 'minor',
      next: '2.1.0',
      dev: '2.1.1-dev'
    })
  })

  test('backward compat: --bumpoverride alias', async () => {
    const output = await runCli(['-s', '1.0.0', '--bumpoverride', 'major'])
    const result = JSON.parse(output)
    expect(result.bump).to.equal('major')
  })

  test('backward compat: --repopath alias', async () => {
    const tempDir = fs.mkdtempSync(join(os.tmpdir(), 'version-bumper-test-'))
    try {
      setupTempGitRepo(tempDir)
      const output = await runCli(['--source', 'git', '--repopath', tempDir])
      const result = JSON.parse(output)
      expect(result.current).to.equal('v1.0.0')
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  test('invalid semver exits with error', async () => {
    await expect(runCli(['-s', 'abc', '-b', 'minor'])).to.be.rejectedWith('not a valid semver')
  })

  test('auto bump with string source errors', async () => {
    await expect(runCli(['-s', '1.2.3', '-b', 'auto'])).to.be.rejectedWith(
      'please use major,minor,patch bump type'
    )
  })
})
