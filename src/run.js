'use strict'

const adapters = require('./adapters')
const findPackagePaths = require('./lib/findPackagePaths')
const getContext = require('./lib/getContext')

module.exports = async function run (script, opts) {
  const ctx = getContext(opts.cwd)
  const adapter = adapters.resolve(opts.adapter || ctx.config.adapter || 'npm')

  if (!script) {
    throw new Error('Missing script')
  }

  const packagePaths = await findPackagePaths(ctx)

  return Promise.all(
    packagePaths.map(packagePath =>
      adapter.run(script, { cwd: packagePath, quiet: opts.quiet })
    )
  )
}
