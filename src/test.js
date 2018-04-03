'use strict'

const adapters = require('./adapters')
const findPackagePaths = require('./lib/findPackagePaths')
const getContext = require('./lib/getContext')

module.exports = async function run (opts) {
  const ctx = getContext(opts.cwd)
  const adapter = adapters.resolve(opts.adapter || ctx.config.adapter || 'npm')
  const packagePaths = await findPackagePaths(ctx)

  return Promise.all(
    packagePaths.map(packagePath =>
      adapter.cmd('test', { cwd: packagePath, quiet: opts.quiet })
    )
  )
}
