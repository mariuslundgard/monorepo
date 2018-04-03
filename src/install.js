'use strict'

const path = require('path')
const adapters = require('./adapters')
const findPackagePaths = require('./lib/findPackagePaths')
const getContext = require('./lib/getContext')
const resolveLocalPackages = require('./lib/resolveLocalPackages')
const readFile = require('bluebird').promisify(require('fs').readFile)
const writeFile = require('bluebird').promisify(require('fs').writeFile)

module.exports = async function install (opts) {
  const ctx = getContext(opts.cwd)
  const adapter = adapters.resolve(opts.adapter || ctx.config.adapter || 'npm')
  const pkgPaths = await findPackagePaths(ctx)

  const meta = await Promise.all(
    pkgPaths.map(pkgPath =>
      readFile(path.resolve(pkgPath, 'package.json')).then(buffer => ({
        buffer,
        path: pkgPath,
        config: JSON.parse(buffer.toString())
      }))
    )
  )

  return Promise.all(
    pkgPaths.map((pkgPath, idx) => {
      const pkgMeta = meta[idx]
      const pkgJsonPath = path.resolve(pkgMeta.path, 'package.json')
      const pkg = pkgMeta.config
      const tmpPkg = resolveLocalPackages(pkg, meta)

      return writeFile(pkgJsonPath, JSON.stringify(tmpPkg))
        .then(() =>
          adapter.cmd('install', {
            cwd: pkgPath,
            quiet: opts.quiet
          })
        )
        .then(() => writeFile(pkgJsonPath, meta[idx].buffer))
    })
  )
}
