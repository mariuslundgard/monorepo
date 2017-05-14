'use strict'

const assert = require('assert')
const {before, describe, it} = require('mocha')
const fs = require('fs')
const monorepo = require('../src')
const path = require('path')
const rimraf = require('rimraf')

describe('monorepo', () => {
  before((done) => {
    rimraf(path.resolve(__dirname, 'fixtures/project/**/*/node_modules'), () => {
      rimraf(path.resolve(__dirname, 'fixtures/project/*/yarn.lock'), () => {
        const flags = {quiet: true}
        const opts = {cwd: path.resolve(__dirname, 'fixtures/project')}

        monorepo(['install'], flags, opts, (err) => {
          assert.equal(err, null)
          done()
        })
      })
    })
  })

  it('should install sub-package’s dependencies', () => {
    const stats = fs.lstatSync(path.resolve(__dirname, 'fixtures/project/packages/b/node_modules/a'))
    assert(stats.isDirectory())
  })

  it('should run scripts in sub-packages', (done) => {
    const flags = {quiet: true}
    const opts = {cwd: path.resolve(__dirname, 'fixtures/project')}

    monorepo(['run', 'test'], flags, opts, (err) => {
      assert.equal(err, null)
      done()
    })
  })

  it('should fail to run scripts in sub-packages', (done) => {
    const flags = {quiet: true}
    const opts = {cwd: path.resolve(__dirname, 'fixtures/project')}

    monorepo(['run', 'fail'], flags, opts, (err) => {
      assert.equal(err.message, 'Script failure')
      assert.equal(err.scope, 'b')
      assert.equal(err.code, 1)
      done()
    })
  })
})
