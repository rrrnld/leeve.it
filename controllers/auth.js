'use strict'

var routes = require('express').Router()
var passport = require('passport')

routes.get('/signin', function (req, res) {
  // TODO: Render the signin page
})

routes.get('/google', passport.authenticate('google-openidconnect'))
routes.get('/google/callback', passport.authenticate('google-openidconnect'), function (req, res) {
  // authentication successful
  res.redirect('/')
})

module.exports = routes
