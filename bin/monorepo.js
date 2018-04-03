#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const { argv } = require('yargs')
const monorepo = require('../')

const args = argv._

const command = args.shift()

const opts = Object.keys(argv)
  .filter(key => key !== '_')
  .filter(key => key.indexOf('$') !== 0)
  .reduce(
    (f, key) => {
      f[key] = argv[key]
      return f
    },
    { cwd: process.cwd() }
  )

switch (command) {
  case 'install':
    monorepo.install(opts).catch(handleErr)
    break

  case 'publish':
    monorepo.publish(opts).catch(handleErr)
    break

  case 'run':
    monorepo.run(args.shift(), opts).catch(handleErr)
    break

  case 'test':
    monorepo.test(opts).catch(handleErr)
    break

  default:
    if (command) {
      handleErr(new Error(`unknown command: ${command}`))
    }
    printUsage()
    break
}

function handleErr (err) {
  console.error(`${chalk.red('error')} ${err.message}`)
  process.exit(err.code || 1)
}

function printUsage () {
  // eslint-disable-next-line no-console
  console.log(`
  monorepo [command] [options]

  Options:
  --access <public|restricted>
  --adapter <npm|yarn>
  --quiet

  Commands:

  - install
  - publish
  - run
  - test
`)
}
