'use strict'

const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const monorepo = require('../src')

describe('monorepo', () => {
  beforeAll(done => {
    rimraf(
      path.resolve(__dirname, 'fixtures/project/**/*/node_modules'),
      () => {
        rimraf(
          path.resolve(
            __dirname,
            'fixtures/project/packages/*/package-lock.json'
          ),
          () => {
            rimraf(
              path.resolve(__dirname, 'fixtures/project/packages/*/yarn.lock'),
              () => {
                const flags = { quiet: false }
                const opts = {
                  cwd: path.resolve(__dirname, 'fixtures/project')
                }

                monorepo(['install'], flags, opts, err => {
                  expect(err).toBeNull()
                  done()
                })
              }
            )
          }
        )
      }
    )
  })

  it('should install sub-package’s dependencies', () => {
    const stats = fs.lstatSync(
      path.resolve(__dirname, 'fixtures/project/packages/b/node_modules')
    )
    const files = fs.readdirSync(
      path.resolve(__dirname, 'fixtures/project/packages/b/node_modules')
    )

    expect(stats.isDirectory()).toBeTruthy()
    expect(files).toContain('a')
  })

  it('should run scripts in sub-packages', done => {
    const flags = { quiet: true }
    const opts = { cwd: path.resolve(__dirname, 'fixtures/project') }

    monorepo(['run', 'test'], flags, opts, err => {
      expect(err).toBeNull()
      done()
    })
  })

  it('should fail to run scripts in sub-packages', done => {
    const flags = { quiet: true }
    const opts = { cwd: path.resolve(__dirname, 'fixtures/project') }

    monorepo(['run', 'fail'], flags, opts, err => {
      expect(err.message).toEqual('Script failure')
      expect(err.scope).toEqual('b')
      expect(err.code).toEqual(1)
      done()
    })
  })
})
