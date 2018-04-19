'use strict'

const Promise = require('bluebird')
const findConfig = require('find-config')
const path = require('path')
const adapters = require('../lib/adapters')
const getContext = require('../lib/getContext')
const glob = require('../lib/glob')

module.exports = function publish (args, flags, opts, cb) {
  const pkgPath = findConfig('package.json', { cwd: opts.cwd })

  if (!pkgPath) return cb(new Error('Could not find package.json'))

  try {
    const pkg = require(pkgPath)
    const ctx = getContext(opts.cwd)
    const adapter = adapters.resolve(
      flags.adapter || ctx.config.adapter || 'npm'
    )

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
        const adapterFlags = {
          access: flags.access || 'restricted'
        }
        if(adapter.is('yarn')) {
          adapterFlags['new-version'] =  pkg.version;
        }
        const adapterOpts = {
          quiet: flags.quiet,
          resolveErrors: true
        }

        return Promise.all(
          files.map(dirPath => {
            return adapter.cmd(dirPath, 'publish', adapterFlags, adapterOpts)
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