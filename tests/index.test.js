import { expect } from 'chai'
import { bumper } from '../src/index.js'

suite('Index module exports bumper', () => {
  test('merges provided opts with defaults', async () => {
    const result = await bumper({ source: '1.0.0', bump: 'major' })
    expect(result).to.deep.equal({
      current: '1.0.0',
      bump: 'major',
      next: '2.0.0',
      dev: '2.0.1-dev'
    })
  })

  test('preserves v prefix through defaults merge', async () => {
    const result = await bumper({ source: 'v1.0.0', bump: 'patch' })
    expect(result.current).to.equal('v1.0.0')
    expect(result.next).to.equal('v1.0.1')
  })

  test('accepts label override through defaults merge', async () => {
    const result = await bumper({ source: '1.0.0', bump: 'minor', label: '-alpha' })
    expect(result.dev).to.equal('1.1.1-alpha')
  })
})
