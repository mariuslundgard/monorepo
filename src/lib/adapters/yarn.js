'use strict'

const Promise = require('bluebird')
const findConfig = require('find-config')
const spawn = require('../spawn')

const SUPPORTED_COMMANDS = ['install', 'publish']

exports.cmd = function cmd (dirPath, command, flags, opts) {
  if (SUPPORTED_COMMANDS.indexOf(command) === -1) {
    return Promise.reject(new Error(`Unsupported yarn command: ${command}`))
  }

  const pkgPath = findConfig('package.json', {cwd: dirPath})

  if (!pkgPath) return Promise.resolve() // not a package

  const pkg = findConfig.require('package.json', {cwd: dirPath})

  const params = Object.keys(flags).reduce((arr, key) => {
    arr.push(`--${key}`, flags[key])
    return arr
  }, [])

  return spawn(pkg.name, 'yarn', [command].concat(params), {
    cwd: dirPath,
    quiet: opts.quiet
  })
}

exports.run = function run (script, dirPath, opts) {
  const pkgPath = findConfig('package.json', {cwd: dirPath})

  if (!pkgPath) return Promise.resolve() // not a package

  const pkg = findConfig.require('package.json', {cwd: dirPath})

  if (!pkg.scripts || !pkg.scripts[script]) return Promise.resolve() // not a script

  return spawn(pkg.name, 'yarn', ['run', script], {
    cwd: dirPath,
    quiet: opts.quiet
  })
}

exports.test = function test (dirPath, opts) {
  const pkgPath = findConfig('package.json', {cwd: dirPath})

  if (!pkgPath) return Promise.resolve() // not a package

  const pkg = findConfig.require('package.json', {cwd: dirPath})

  if (!pkg.scripts || !pkg.scripts.test) return Promise.resolve() // not a script

  return spawn(pkg.name, 'yarn', ['test'], {
    cwd: dirPath,
    quiet: opts.quiet
  })
}
