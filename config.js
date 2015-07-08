'use strict'

var fs = require('fs')

// load config as defined in .env file
var config = require('dotenv').parse(fs.readFileSync('.env'))

// there can be multipe registered clients, so make it an array
config.AUTH_GOOGLE_CLIENT_ID = config.AUTH_GOOGLE_CLIENT_ID.split(',')

config.NODE_ENV = config.NODE_ENV || 'production'

// make some additional adjustments when running tests
if (config.NODE_ENV.toLowerCase() === 'test') {
  config.SERVER_PORT = config.TEST_PORT
}

module.exports = config
