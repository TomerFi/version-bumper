const chai = require('chai')

const bumperSut = require('../src/bumper.js')
expect = chai.expect
chai.use(require('chai-as-promised'))

suite('Test manual bumps', () => {
    [{
        opts: {source: '1.2.3', bump: 'major', label: '-dev'},
        output: { original: '1.2.3', bump: 'major', next: '2.0.0', dev: '2.0.0-dev' }
    },{
        opts: {source: '1.2.3', bump: 'minor', label: '-alpha1'},
        output: { original: '1.2.3', bump: 'minor', next: '1.3.0', dev: '1.3.0-alpha1' }
    },{
        opts: {source: 'v1.2.3', bump: 'patch', label: '-beta1'},
        output: { original: 'v1.2.3', bump: 'patch', next: 'v1.2.4', dev: 'v1.2.4-beta1' }
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
    }].forEach(t => {
        test(`testing with ${JSON.stringify(t.opts)}
        expecting error message "${t.error}"`, async () => {
            return expect(bumperSut(t.opts)).to.eventually.be.rejectedWith(t.error)
        })
    })

})
