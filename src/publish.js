'use strict'

const findConfig = require('find-config')
const adapters = require('./adapters')
const findPackagePaths = require('./lib/findPackagePaths')
const getContext = require('./lib/getContext')

module.exports = async function publish (opts) {
  const ctx = getContext(opts.cwd)

  const pkgPath = findConfig('package.json', { cwd: opts.cwd })
  if (!pkgPath) {
    throw new Error('Could not find package.json')
  }

  const pkg = require(pkgPath)
  const adapter = adapters.resolve(opts.adapter || ctx.config.adapter || 'npm')
  const packagePaths = await findPackagePaths(ctx)

  return Promise.all(
    packagePaths.map(packagePath =>
      adapter.cmd('publish', {
        cwd: packagePath,
        flags: {
          access: opts.access || 'restricted',
          'new-version': pkg.version
        },
        quiet: opts.quiet
      })
    )
  )
}
