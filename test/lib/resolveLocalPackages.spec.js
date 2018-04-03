'use strict'

const resolveLocalPackages = require('../../src/lib/resolveLocalPackages')

describe('lib/resolveLocalPackages', () => {
  it('should resolve local packages', () => {
    const meta = [
      {
        path: '/root/packages/a',
        config: {
          name: 'a'
        }
      },
      {
        path: '/root/packages/b',
        config: {
          name: 'b',
          dependencies: {
            a: '1.0.0'
          }
        }
      }
    ]

    const pkg = meta[1].config
    const newPkg = resolveLocalPackages(pkg, meta)

    expect(newPkg).toEqual({
      name: 'b',
      dependencies: {
        a: 'file:/root/packages/a'
      },
      devDependencies: {}
    })
  })
})
