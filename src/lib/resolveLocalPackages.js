'use strict'

function resolveLocalPackages (pkg, meta) {
  const resolvedPkg = {
    ...pkg,
    dependencies: pkg.dependencies ? { ...pkg.dependencies } : {},
    devDependencies: pkg.devDependencies ? { ...pkg.devDependencies } : {}
  }

  Object.keys(pkg.dependencies || {}).forEach(depName => {
    const match = meta.find(m => {
      return m.config.name === depName
    })

    if (match) {
      resolvedPkg.dependencies[depName] = `file:${match.path}`
    }
  })

  Object.keys(pkg.devDependencies || {}).forEach(depName => {
    const match = meta.find(m => {
      return m.config.name === depName
    })

    if (match) {
      resolvedPkg.devDependencies[depName] = `file:${match.path}`
    }
  })

  return resolvedPkg
}

module.exports = resolveLocalPackages
