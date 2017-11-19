'use strict'

const adapters = {
  npm: require('./npm'),
  yarn: require('./yarn')
}

module.exports = adapters

module.exports.resolve = key => {
  if (adapters[key]) {
    return adapters[key]
  }

  throw new Error(`Unknown adapter: ${key} (expected \`npm\` or \`yarn\`)`)
}
