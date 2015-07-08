'use strict'

var routes = require('express').Router()
// var passport = require('passport')
// var completeSignin = require('../helpers/completeSignin')

var errors = {
  noToken: 'No id_token supplied'
}

// this route provides information about the supported identity providers
routes.get('/providers', function (req, res) {
  res.json({
    google: '/auth/google'
  })
})

// this accepts an id json web token provided by the google auth client lib.
// information on how to verify can be found on the following page:
// https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
routes.post('/google/verify', function verifyGoogleAuth (req, res) {
  if (!req.body.id_token) {
    res.status(400)
  }

  // authentication successful
  res.redirect('/users/me')
})

module.exports = routes
