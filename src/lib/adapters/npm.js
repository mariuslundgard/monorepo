'use strict'

const Promise = require('bluebird')
const findConfig = require('find-config')
const spawn = require('../spawn')

const SUPPORTED_COMMANDS = ['install', 'publish']

exports.is = function is (name) {
  return name === 'npm'
}

exports.cmd = function cmd (dirPath, command, flags, opts) {
  if (SUPPORTED_COMMANDS.indexOf(command) === -1) {
    return Promise.reject(new Error(`Unsupported npm command: ${command}`))
  }

  const pkgPath = findConfig('package.json', { cwd: dirPath })

  if (!pkgPath) return Promise.resolve() // not a package

  const pkg = findConfig.require('package.json', { cwd: dirPath })

  const params = Object.keys(flags).reduce((arr, key) => {
    arr.push(`--${key}`, flags[key])
    return arr
  }, [])

  const args = opts;
  args.cwd = dirPath
  return spawn(pkg.name, 'npm', [command].concat(params), args)
}

exports.run = function run (script, dirPath, opts) {
  const pkgPath = findConfig('package.json', { cwd: dirPath })

  if (!pkgPath) return Promise.resolve() // not a package

  const pkg = findConfig.require('package.json', { cwd: dirPath })

  if (!pkg.scripts || !pkg.scripts[script]) return Promise.resolve() // not a script

  const args = opts;
  args.cwd = dirPath
  return spawn(pkg.name, 'npm', ['run', script], args);
}

exports.test = function test (dirPath, opts) {
  const pkgPath = findConfig('package.json', { cwd: dirPath })

  if (!pkgPath) return Promise.resolve() // not a package

  const pkg = findConfig.require('package.json', { cwd: dirPath })

  if (!pkg.scripts || !pkg.scripts.test) return Promise.resolve() // not a script

  return spawn(pkg.name, 'npm', ['test'], {
    cwd: dirPath,
    quiet: opts.quiet
  })
}
