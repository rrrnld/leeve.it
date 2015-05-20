'use strict'

var Message = require('../models/message')
var routes = require('express').Router()

routes.get('/', function (req, res, next) {
  Message
    .find()
    .exec()
    .then(function (messages) {
      res.send(messages)
      next()
    }, function (err) {
      next(err)
    })
})

module.exports = routes
