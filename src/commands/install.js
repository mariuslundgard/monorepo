'use strict'

const getContext = require('../lib/getContext')
const glob = require('../lib/glob')
const path = require('path')
const Promise = require('bluebird')
const runYarnCommandInDir = require('../lib/runYarnCommandInDir')

module.exports = function install (args, flags, opts, cb) {
  try {
    const ctx = getContext(opts.cwd)

    Promise.all(
      ctx.config.packages.map(relativePackagesPattern => {
        const packagesPattern = path.resolve(
          ctx.rootPath,
          relativePackagesPattern
        )
        return glob(packagesPattern)
      })
    )
      .then(filesArr => {
        const files = filesArr.reduce((arr, f) => arr.concat(f), [])
        return Promise.all(
          files.map(dirPath => {
            return runYarnCommandInDir(dirPath, 'install', {quiet: flags.quiet})
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
