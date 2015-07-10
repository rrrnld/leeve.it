'use strict'

var config = require('./config')

var express = require('express')
var app = express()

// connect to the database
var mongoose = require('mongoose')
mongoose.connect(config.DATABASE_URL)
var connection = mongoose.connection

connection.on('error', function () {
  console.error('Mongoose failed to connect', config.DATABASE_URL)
  connection.close()
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

  // load middleware
  var logger = require('morgan')
  app.use(logger('combined'))

  var bodyParser = require('body-parser')

  // for parsing application/json:
  app.use(bodyParser.json())
  // // for parsing application/x-www-form-urlencoded:
  app.use(bodyParser.urlencoded({ extended: true }))

  if (app.get('env') === 'development') {
    console.log('In development mode')
    console.log('Setting Access-Control-Allow headers')

    app.use(function accessControlHeader (req, res, next) {
      if (res.headersSent) {
        console.error('Headers have already been sent, can not set access-control-allow-origin')
      } else {
        res.append('Access-Control-Allow-Origin', '*')
        res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      }

      next()
    })
  }

  // load all controllers and mount them as API endpoints
  fs.readdirSync(__dirname + '/controllers')
    .filter(jsFiles)
    .filter(onlyVisible)
    .forEach(function (fileName) {
      var controller = require(__dirname + '/controllers/' + fileName)
      var endPoint = fileName.substr(0, fileName.length - 3)
      var apiVersion = controller.apiVersion || 'v1'

      var uri = '/' + apiVersion + '/' + endPoint

      console.log('Mounting controller at ' + uri)
      app.use(uri, controller)
    })

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
      .listen(config.SERVER_PORT, function () {
        console.log('Server started and listening on ' + config.SERVER_PORT)
      })
  }
})

module.exports = app
