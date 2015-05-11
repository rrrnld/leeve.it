'use strict'

require('./config')

var express = require('express')
var app = express()

// start the server when running the script directly
if (!module.parent) {
  app.listen(process.env.SERVER_PORT, function () {
    console.log('Server started and listening on ' + process.env.SERVER_PORT)
  })
}

module.exports = app
