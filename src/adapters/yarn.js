'use strict'

const findConfig = require('find-config')
const spawn = require('../lib/spawn')

const SUPPORTED_COMMANDS = ['install', 'publish', 'test']

exports.cmd = async function cmd (command, opts) {
  if (SUPPORTED_COMMANDS.indexOf(command) === -1) {
    throw new Error(`Unsupported yarn command: ${command}`)
  }

  const pkgPath = findConfig('package.json', { cwd: opts.cwd })

  if (!pkgPath) return // not a package

  const pkg = findConfig.require('package.json', { cwd: opts.cwd })

  const params = Object.keys(opts.flags || {}).reduce((arr, key) => {
    arr.push(`--${key}`, opts.flags[key])
    return arr
  }, [])

  return spawn(pkg.name, 'yarn', [command].concat(params), {
    cwd: opts.cwd,
    quiet: opts.quiet
  })
}

exports.run = async function run (script, opts) {
  const pkgPath = findConfig('package.json', { cwd: opts.cwd })

  if (!pkgPath) return // not a package

  const pkg = findConfig.require('package.json', { cwd: opts.cwd })

  if (!pkg.scripts || !pkg.scripts[script]) return // not a script

  return spawn(pkg.name, 'yarn', ['run', script], {
    cwd: opts.cwd,
    quiet: opts.quiet
  })
}
