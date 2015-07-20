'use strict'

var debug = require('debug')('auth')

var jwt = require('green-jwt')
var routes = require('express').Router()
// var passport = require('passport')
// var completeSignin = require('../helpers/completeSignin')

var config = require('../config')
var User = require('../models/user')

var errors = {
  badProtocol: 'Please send the request over a TLS connection',
  noToken: 'Missing paramteter `idtoken`',
  invalidClientID: 'Token has been obtained by an invalid client',
  invalidIss: 'The iss must either be accounts.google.com or https://accounts.google.com',
  tokenExpired: 'The expiration date has already been passed'
}

// this accepts an id json web token provided by the google auth client lib.
// information on how to verify can be found on the following page:
// https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
routes.post('/google/verify', function verifyGoogleAuth (req, res, next) {
  // first do basic validation, is it the right protocol?
  if (req.protocol !== 'https') {
    console.error('Error: ', errors.badProtocol)

    return res
      .status(400)
      .json({ message: errors.badProtocol })
  }

  // has a token been sent?
  if (!req.body.idtoken) {
    console.error('Error: ', errors.noToken)

    return res
      .status(400)
      .json({ message: errors.noToken })
  }

  var idToken = jwt.decode(req.body.idtoken)
  console.log('idToken: ', idToken)
  var claim = idToken.claim

  // Now as advised on the google page

  // TODO: Verify that the ID token is a JWT that is properly signed with an appropriate Google public key.

  if (config.AUTH_GOOGLE_CLIENT_IDS.indexOf(claim.aud) === -1) {
    res.status(400)
    res.json({
      message: errors.invalidClientID
    })
    console.error('Error: ', errors.invalidClientID)
    return next()
  }

  if (['accounts.google.com', 'https://accounts.google.com'].indexOf(claim.iss) === -1) {
    res.status(400)
    res.json({
      message: errors.invalidIss
    })
    console.error('Error: ', errors.invalidIss)
    return next()
  }

  // claim.exp is a string but it gets automatically casted by javascript
  if (claim.exp * 1000 < Date.now()) {
    res.status(400)
    res.json({
      message: errors.tokenExpired
    })
    console.error('Error: ', errors.tokenExpired, 'Expiration: ' + claim.exp + ', now: ' + Date.now())
    return next()
  }

  // authentication successful
  var idProvider = 'google-openid-connect'
  User.findOne({
    'idToken.sub': claim.sub,
    'idProvider': idProvider
  }, function (err, user) {
    if (err) return next(err)

    if (user) {
      // if we found a user, just update the identity token and initialize the
      // session

      debug('User logged in again')
      user.idToken = claim
      user.save(function (err) {
        debug('Updated ID token')
        if (err) {
          console.error(err.name, err.message)
          return next(err)
        }

        req.session.userId = user._id
        debug('Session set', req.session)
        res.end()
      })
    } else {
      // if not, create the new User and fill in defaults from the ID token
      user = new User({
        idToken: claim,
        idProvider: idProvider,

        keyIdentifier: claim.email,
        alias: claim.name,
        picture: claim.picture
      }).save(function (err) {
        if (err) {
          console.error(err.name, err.message)
          return next(err)
        }

        debug('Created user')
        req.session.userId = user._id
        res.end()
      })
    }
  })
})

module.exports = routes
