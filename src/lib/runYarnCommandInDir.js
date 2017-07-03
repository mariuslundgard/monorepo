'use strict'

const Promise = require('bluebird')

const findConfig = require('find-config')
const spawn = require('./spawn')

const SUPPORTED_COMMANDS = ['install', 'publish']

module.exports = function runYarnCommandInDir (dirPath, command, opts) {
  const pkgPath = findConfig('package.json', {cwd: dirPath})

  if (SUPPORTED_COMMANDS.indexOf(command) === -1) {
    return Promise.reject(new Error(`Unsupported yarn command: ${command}`))
  }

  if (!pkgPath) return Promise.resolve() // not a package

  const pkg = findConfig.require('package.json', {cwd: dirPath})

  return spawn(pkg.name, 'yarn', [command], {
    cwd: dirPath,
    quiet: opts.quiet
  })
}
