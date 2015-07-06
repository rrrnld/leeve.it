'use strict'

var routes = require('express').Router()

var authenticate = require('../helpers/authenticate')
var Message = require('../models/message')

routes.get('/received', authenticate, function (req, res, next) {
  Message
    .find({
      to: req.user._id
    })
    .exec()
    .then(function (messages) {
      res.json(messages)
      next()
    }, function (err) {
      next(err)
    })
})

routes.get('/sent', authenticate, function (req, res, next) {
  Message
    .find({
      from: req.user._id
    })
    .exec()
    .then(function (messages) {
      res.json(messages)
      next()
    }, function (err) {
      next(err)
    })
})

module.exports = routes
