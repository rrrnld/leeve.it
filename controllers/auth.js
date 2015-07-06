'use strict'

var routes = require('express').Router()
var passport = require('passport')

routes.get('/signin', function (req, res) {
  // TODO: Render the signin page with all of the available authentication
  // providers; maybe it should also just be a JSON array or something?
})

routes.get('/google', passport.authenticate('google-openidconnect', { scope: ['email'] }))
routes.get('/google/callback', passport.authenticate('google-openidconnect', { scope: ['email'] }), function (req, res) {
  // authentication successful
  res.redirect('/users/me')
})

module.exports = routes
