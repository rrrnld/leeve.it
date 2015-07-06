'use strict'

var Message = require('../models/message')
var routes = require('express').Router()
var passport = require('passport')

routes.get('/me', passport.authenticate([
  // all accepted authentication providers can be placed into this array
  'google-openidconnect'
]), function (req, res, next) {
  Message
    .find()
    .exec()
    .then(function (messages) {
      res.json(messages)
      next()
    }, function (err) {
      next(err)
    })
})

module.exports = routes
