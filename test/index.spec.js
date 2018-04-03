'use strict'

const fs = require('fs')
const path = require('path')
const rimraf = require('bluebird').promisify(require('rimraf'))
const monorepo = require('../src')

describe('monorepo', () => {
  const cwd = path.resolve(__dirname, 'fixtures/project')

  async function clean () {
    await rimraf(path.resolve(cwd, 'packages/*/node_modules'))
    await rimraf(path.resolve(cwd, 'packages/*/package-lock.json'))
    await rimraf(path.resolve(cwd, 'packages/*/yarn.lock'))
  }

  beforeAll(clean)
  afterAll(clean)

  it('should install sub-package’s dependencies', async () => {
    await monorepo.install({ cwd, quiet: true })

    const stats = fs.lstatSync(path.resolve(cwd, 'packages/b/node_modules'))
    expect(stats.isDirectory()).toBeTruthy()

    const files = fs.readdirSync(path.resolve(cwd, 'packages/b/node_modules'))
    expect(files).toContain('a')
  })

  it('should run scripts in sub-packages', () => {
    const opts = {
      cwd: path.resolve(__dirname, 'fixtures/project'),
      quiet: true
    }

    return monorepo.test(opts)
  })

  it('should fail to run scripts in sub-packages', done => {
    const opts = {
      cwd: path.resolve(__dirname, 'fixtures/project'),
      quiet: true
    }

    monorepo.run('fail', opts).catch(err => {
      expect(err.message).toEqual('Script failure')
      expect(err.scope).toEqual('b')
      expect(err.code).toEqual(1)
      done()
    })
  })
})
