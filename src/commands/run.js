'use strict'

const Promise = require('bluebird')
const path = require('path')
const adapters = require('../lib/adapters')
const getContext = require('../lib/getContext')
const glob = require('../lib/glob')

module.exports = function run (args, flags, opts, cb) {
  const script = args.shift()

  if (!script) {
    cb(new Error('Missing script'))
    return
  }

  try {
    const ctx = getContext(opts.cwd)
    const adapter = adapters.resolve(flags.adapter || ctx.config.adapter || 'npm')

    Promise.all(
      ctx.config.packages.map(relativePackagesPattern => {
        const packagesPattern = path.resolve(ctx.rootPath, relativePackagesPattern)

        return glob(packagesPattern)
      })
    )
      .then(filesArr => {
        const files = filesArr.reduce((arr, f) => arr.concat(f), [])

        return Promise.all(
          files.map(dirPath => {
            return adapter.run(script, dirPath, {quiet: flags.quiet})
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
