'use strict'

require('./config')

var passport = require('passport')
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

// pre-config for identity management
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

var jsFiles = function (fileName) {
  // include only js files
  return fileName.substr(-3) === '.js'
}

var onlyVisible = function (fileName) {
  // exclude files starting with _ as a convenient way to quickly hide them
  return fileName[0] !== '_'
}

connection.on('open', function () {
  var fs = require('fs')

  // load all auth strategies
  app.use(passport.initialize())
  app.use(passport.session())

  fs.readdirSync(__dirname + '/auth')
    .filter(jsFiles)
    .filter(onlyVisible)
    .forEach(function (fileName) { require(__dirname + '/auth/' + fileName) })

  // load all controllers and mount them as API endpoints
  fs.readdirSync(__dirname + '/controllers')
    .filter(jsFiles)
    .filter(onlyVisible)
    .forEach(function (fileName) {
      var controller = require(__dirname + '/controllers/' + fileName)
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
    var https = require('https')

    try {
      var privateKey = fs.readFileSync(__dirname + '/sslcert/server.key')
      var certificate = fs.readFileSync(__dirname + '/sslcert/server.crt')
    } catch (e) {
      console.error('Please provide a private key and a certificate as key.pem and cert.pem inside the sslcert folder.')
      process.exit(1)
    }

    https.createServer({ key: privateKey, cert: certificate }, app)
      .listen(process.env.SERVER_PORT, function () {
        console.log('Server started and listening on ' + process.env.SERVER_PORT)
      })
  }
})

module.exports = app
