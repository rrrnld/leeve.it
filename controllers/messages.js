'use strict'

var debug = require('debug')('messages')

var routes = require('express').Router()
var requireLogin = require('../helpers/require-login')

// var authenticate = require('../helpers/authenticate')
var Message = require('../models/message')

routes.post('/', requireLogin, function (req, res, next) {
  var message = new Message({
    to: req.user._id,
    content: req.body.content,
    location: req.body.location
  }).save(function (err) {
    if (err) {
      debug('Error saving message')
      debug('Error:   ', err)
      debug('Message: ', message)

      return next(err)
    }

    debug('New message saved')
    res.end()
  })
})

routes.get('/me', requireLogin, function (req, res, next) {
  // limit to between 1 and 20 messages, default to 10
  var limit = Math.max(Math.min(req.query.limit || 10, 20), 1)

  Message
    .find({
      to: req.user._id
    })
    .limit(limit)
    .exec()
    .then(function (messages) {
      res.json(messages)
      next()
    }, function (err) {
      next(err)
    })
})

routes.get('/:id', requireLogin, function (req, res, next) {
  Message
    .findOne({
      _id: req.params.id,
      to: req.user._id
    })
    .exec()
    .then(function (message) {
      res.json(message)
      next()
    }, function (err) {
      next(err)
    })
})

module.exports = routes
