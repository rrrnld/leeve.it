'use strict'

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

// this route provides information about the supported identity providers
routes.get('/providers', function (req, res) {
  res.json([ 'google-openid-connect' ])
})

// this accepts an id json web token provided by the google auth client lib.
// information on how to verify can be found on the following page:
// https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
routes.post('/google/verify', function verifyGoogleAuth (req, res, next) {
  // first do basic validation, is it the right protocol?
  if (req.protocol !== 'https') {
    res.status(400)
    res.json({
      message: errors.badProtocol
    })
    console.log('Error: ', errors.badProtocol)
    return next()
  }

  // has a token been sent?
  if (!req.body.idtoken) {
    res.status(400)
    res.json({
      message: errors.noToken
    })
    console.log('Error: ', errors.noToken)
    return next()
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
    console.log('Error: ', errors.invalidClientID)
    return next()
  }

  if (['accounts.google.com', 'https://accounts.google.com'].indexOf(claim.iss) === -1) {
    res.status(400)
    res.json({
      message: errors.invalidIss
    })
    console.log('Error: ', errors.invalidIss)
    return next()
  }

  // claim.exp is a string but it gets automatically casted by javascript
  if (claim.exp * 1000 < Date.now()) {
    res.status(400)
    res.json({
      message: errors.tokenExpired
    })
    console.log('Error: ', errors.tokenExpired, 'Expiration: ' + claim.exp + ', now: ' + Date.now())
    return next()
  }

  // authentication successful
  claim._type = 'google'
  User.findOne({ 'idToken.email': claim.email }, function (err, user) {
    if (err) return next(err)

    // if we found a user, just update the identity token and initialize the
    // session
    if (user) {
      console.log('User logged in again', JSON.stringify(user))
      user.idToken = claim
      user.save(function (err) {
        if (err) {
          console.error(err.name, err.message)
          return next(err)
        }

        req.session.userId = user._id
        next()
      })
      return
    }

    // if not, create the new User
    user = new User({
      idToken: claim,

      keyIdentifier: claim.email,
      alias: claim.name,
      picture: claim.picture
    }).save(function (err) {
      if (err) {
        console.error(err.name, err.message)
        return next(err)
      }

      console.log('Created user', JSON.stringify(user))
      req.session.userId = user._id
      next()
    })
  })
})

module.exports = routes
