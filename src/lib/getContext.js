'use strict'

const findConfig = require('find-config')
const path = require('path')

module.exports = function getContext (cwd) {
  const configPath = findConfig('monorepo.json', { cwd })

  if (configPath) {
    const config = findConfig.require('monorepo.json', { cwd })
    const rootPath = path.dirname(configPath)

    return { configPath, config, rootPath }
  } else {
    throw new Error('Could not find a config file (monorepo.json)')
  }
}
