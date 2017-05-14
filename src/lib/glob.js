'use strict'

const Promise = require('bluebird')
const glob = require('glob')

module.exports = Promise.promisify(glob)
