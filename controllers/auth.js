'use strict'

var routes = require('express').Router()
var passport = require('passport')

var completeSignin = require('../helpers/completeSignin')

routes.get('/providers', function (req, res) {
  res.json({
    google: '/auth/google'
  })
})

routes.get('/google', passport.authenticate('google-openidconnect', { scope: ['email'] }))
routes.get('/google/callback', passport.authenticate('google-openidconnect', { scope: ['email'] }), completeSignin, function (req, res, next) {
  // authentication successful
  next()
})

module.exports = routes
