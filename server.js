'use strict'

require('./config')

var express = require('express')
var app = express()

var isDev = require('./helpers/isDev')

// connect to the database
var mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
var connection = mongoose.connection

connection.on('error', function () {
  console.error('Mongoose failed to connect', process.env.DATABASE_URL)
  connection.close()
})

// load all controllers and mount them as API endpoints
connection.on('open', function () {
  var fs = require('fs')
  fs.readdirSync(__dirname + '/controllers')
    .filter(function (fileName) {
      // include only js files
      return fileName.substr(-3) === '.js'
    })
    .filter(function (fileName) {
      // exclude files starting with _ as a convenient way to quickly unmount controllers
      return fileName[0] !== '_'
    })
    .forEach(function (fileName) {
      var controller = require('./controllers/' + fileName)
      var endPoint = '/' + fileName.substr(0, fileName.length - 3)

      console.log('Mounting controller at ' + endPoint)
      app.use(endPoint, controller)
    })

  var logger = require('morgan')
  app.use(logger('combined'))

  // debugging panel
  if (isDev()) {
    require('express-debug')(app)
  }

  // start the server when running the script directly
  if (!module.parent) {
    app.listen(process.env.SERVER_PORT, function () {
      console.log('Server started and listening on ' + process.env.SERVER_PORT)
    })
  }
})

module.exports = app
