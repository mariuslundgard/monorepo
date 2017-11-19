'use strict'

const findConfig = require('find-config')
const getContext = require('../lib/getContext')
const glob = require('../lib/glob')
const path = require('path')
const Promise = require('bluebird')
const runYarnCommandInDir = require('../lib/runYarnCommandInDir')

module.exports = function publish (args, flags, opts, cb) {
  const pkgPath = findConfig('package.json', {cwd: opts.cwd})

  if (!pkgPath) return cb(new Error('Could not find package.json'))

  try {
    const pkg = require(pkgPath)
    const ctx = getContext(opts.cwd)

    Promise.all(
      ctx.config.packages.map(relativePackagesPattern => {
        const packagesPattern = path.resolve(ctx.rootPath, relativePackagesPattern)

        return glob(packagesPattern)
      })
    )
      .then(filesArr => {
        const files = filesArr.reduce((arr, f) => arr.concat(f), [])
        const yarnFlags = {
          access: flags.access || 'restricted',
          'new-version': pkg.version
        }
        const yarnOpts = {
          quiet: flags.quiet
        }

        return Promise.all(
          files.map(dirPath => {
            return runYarnCommandInDir(dirPath, 'publish', yarnFlags, yarnOpts)
          })
        )
      })
      .then(() => {
        cb(null)
      })
      .catch(cb)
  } catch (err) {
    cb(err)
  }
}
