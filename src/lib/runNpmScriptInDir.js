'use strict'

const Promise = require('bluebird')

const findConfig = require('find-config')
const spawn = require('./spawn')

module.exports = function runNpmScriptInDir (script, dirPath, opts) {
  const pkgPath = findConfig('package.json', {cwd: dirPath})

  if (!pkgPath) return Promise.resolve() // not a package

  const pkg = findConfig.require('package.json', {cwd: dirPath})

  if (!pkg.scripts || !pkg.scripts[script]) return Promise.resolve() // not a script

  return spawn(pkg.name, 'npm', ['run', script], {cwd: dirPath, quiet: opts.quiet})
}
