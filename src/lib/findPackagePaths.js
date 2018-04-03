'use strict'

const Promise = require('bluebird')
const path = require('path')
const glob = require('./glob')

async function findPackagePaths (ctx) {
  const filesArr = await Promise.all(
    ctx.config.packages.map(relativePackagesPattern => {
      const packagesPattern = path.resolve(
        ctx.rootPath,
        relativePackagesPattern
      )

      return glob(packagesPattern)
    })
  )

  return filesArr.reduce((arr, f) => arr.concat(f), [])
}

module.exports = findPackagePaths
