'use strict'

const getContext = require('../lib/getContext')
const glob = require('../lib/glob')
const path = require('path')
const Promise = require('bluebird')
const runNpmScriptInDir = require('../lib/runNpmScriptInDir')

module.exports = function run (args, flags, opts, cb) {
  const script = args.shift()

  if (!script) {
    cb(new Error('Missing script'))
    return
  }

  try {
    const ctx = getContext(opts.cwd)

    Promise.all(ctx.config.packages.map((relativePackagesPattern) => {
      const packagesPattern = path.resolve(ctx.rootPath, relativePackagesPattern)
      return glob(packagesPattern)
    })).then((filesArr) => {
      const files = filesArr.reduce((arr, f) => arr.concat(f), [])
      return Promise.all(files.map((dirPath) => {
        return runNpmScriptInDir(script, dirPath, {quiet: flags.quiet})
      }))
    }).then(() => {
      cb(null)
    }).catch(cb)
  } catch (err) {
    cb(err)
  }
}
