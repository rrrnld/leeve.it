'use strict'

var routes = require('express').Router()

var completeSignin = require('../helpers/completeSignin')
var authenticate = require('../helpers/authenticate')

routes.get('/me', authenticate, completeSignin, function (err, req, res, next) {
  // if we have an error, let's see if it comes from the completeSignIn middleware
  if (err) {
    if (err.message === completeSignin.messages.noKeyIdentifier || err.message === completeSignin.messages.noAlias) {
      res.status(500)
      res.json({
        status: 500,
        error: err.message
      })
    }

    return next(err)
  }

  // no errors, everything successful, return the newest messages
  res.redirect('/messages/received')
})

module.exports = routes
