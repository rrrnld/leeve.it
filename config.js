'use strict'

// load config as defined in .env file
require('dotenv').load()

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

// make some additional adjustments when running tests
if (process.env.NODE_ENV.toLowerCase() === 'test') {
  process.env.SERVER_PORT = process.env.TEST_PORT
}
