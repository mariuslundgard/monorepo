'use strict'

const Promise = require('bluebird')
const chalk = require('chalk')
const nodeSpawn = require('child_process').spawn

module.exports = function spawn (scope, script, args, opts) {
  return new Promise((resolve, reject) => {
    const p = nodeSpawn(script, args, { cwd: opts.cwd })

    let outputWritten = false

    p.stdout.on('data', data => {
      if (!opts.quiet) {
        let prefix = ''
        if (!outputWritten) {
          prefix = chalk.green(scope) + ' '
          outputWritten = true
        }
        process.stdout.write(
          prefix +
            data.toString().replace(/\n/g, '\n' + chalk.green(scope) + ' ')
        )
      }
    })

    p.stderr.on('data', data => {
      if (!opts.quiet) {
        let prefix = ''
        if (!outputWritten) {
          prefix = chalk.red(scope) + ' '
          outputWritten = true
        }
        process.stderr.write(
          prefix + data.toString().replace(/\n/g, '\n' + chalk.red(scope) + ' ')
        )
      }
    })

    p.on('exit', code => {
      if (code === 0) {
        process.stdout.write('OK' + '\n')
        resolve()
      } else {
        process.stderr.write('code ' + code + '\n')
        const err = new Error(`Script failure`)
        err.code = code
        err.scope = scope
        reject(err)
      }
    })
  })
}
