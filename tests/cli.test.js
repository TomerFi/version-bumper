import { expect } from 'chai'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import shell from 'shelljs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
shell.config.silent = true
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
    const workspace = shell.tempdir()
    const output = await runCli(['--repopath', workspace, '-s', '1.0.0', '-b', 'patch'])
    const result = JSON.parse(output)
    expect(result.bump).to.equal('patch')
  })

  test('invalid semver exits with error', async () => {
    let error
    try {
      await runCli(['-s', 'abc', '-b', 'minor'])
    } catch (e) {
      error = e
    }
    expect(error).to.exist
    expect(error.message).to.include('not a valid semver')
  })

  test('auto bump with string source errors', async () => {
    let error
    try {
      await runCli(['-s', '1.2.3', '-b', 'auto'])
    } catch (e) {
      error = e
    }
    expect(error).to.exist
    expect(error.message).to.include('please use major,minor,patch bump type')
  })
})
