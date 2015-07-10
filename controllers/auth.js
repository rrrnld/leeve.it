'use strict'

var jwt = require('green-jwt')
var routes = require('express').Router()
// var passport = require('passport')
// var completeSignin = require('../helpers/completeSignin')

var config = require('../config')

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

var googleKeys = [
  {
   'kty': 'RSA',
   'alg': 'RS256',
   'use': 'sig',
   'kid': 'e53139984bd36d2c230552441608cc0b5179487a',
   'n': 'w5F_3au2fyRLapW4K1g0zT6hjF-co8hjHJWniH3aBOKP45xuSRYXnPrpBHkXM6jFkVHs2pCFAOg6o0tl65iRCcf3hOAI6VOIXjMCJqxNap0-j_lJ6Bc6TBKgX3XD96iEI92iaxn_UIVZ_SpPrbPVyRmH0P7B6oDkwFpApviJRtQzv1F6uyh9W_sNnEZrCZDcs5lL5Xa_44-EkhVNz8yGZmAz9d04htNU7xElmXKs8fRdospyv380WeaWFoNJpc-3ojgRus26jvPy8Oc-d4M5yqs9mI72-1G0zbGVFI_PfxZRL8YdFAIZLg44zGzL2M7pFmagJ7Aj46LUb3p_n9V1NQ',
   'e': 'AQAB'
  },
  {
   'kty': 'RSA',
   'alg': 'RS256',
   'use': 'sig',
   'kid': 'bc8a31927af20860418f6b2231bbfd7ebcc04665',
   'n': 'ucGr4fFCJYGVUwHYWAtBNclebyhMjALOTUmmAXdMrCIOgT8TxBEn5oXCrszWX7RoC37nFqc1GlMorfII19qMwHdC_iskju3Rh-AuHr29zkDpYIuh4lRW0xJ0Xyo2Iw4PlV9qgqPJLfkmE5V-sr5RxZNe0T1jyYaOGIJ5nF3WbDkgYW4GNHXhv-5tOwWLThJRtH_n6wtYqsBwqAdVX-EVbkyZvYeOzbiNiop7bDM5Td6ER1oCBC4NZjvjdmnOh8-_x6vB449jL5IRAOIIv8NW9dLtQd2DescZOw46HZjWO-zwyhjQeYY87R93yM9yivJdfrjQxydgEs8Ckh03NDATmQ',
   'e': 'AQAB'
  }
]

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
  res.send('Authentication successful')
  next()
})

module.exports = routes
