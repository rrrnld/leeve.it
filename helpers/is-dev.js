'use strict'

var config = require('../config')

/**
 * @return {Boolean}  True if we're inside a development environment. If no
 *                    NODE_ENV is set "development" is assumed.
 */
module.exports = function isDev () {
  var env = config.NODE_ENV || 'development'
  env = env.toLowerCase()

  return env === 'test' || env === 'development'
}
