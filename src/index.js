'use strict'

const commands = require('./commands')

function printUsage () {
  console.log(`
  monorepo [command] [options]

  Commands:

  - install
  - run
`)
}

module.exports = function monorepo (args, flags, opts, cb) {
  const command = args.shift()

  if (!command) {
    printUsage()
    cb(null)
  } else if (commands[command]) {
    commands[command](args, flags, opts, (err) => {
      if (err) {
        cb(err)
      } else {
        cb(null)
      }
    })
  } else {
    cb(new Error(`Unknown command: ${command}`))
  }
}
