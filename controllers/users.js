'use strict'

var routes = require('express').Router()

// var completeSignin = require('../helpers/completeSignin')
// var authenticate = require('../helpers/authenticate')
var User = require('../models/user')

routes.get('/me', function (req, res, next) {
  // if we have an error, let's see if it comes from the completeSignIn middleware
  return res.json({
    user: req.user
  })
})

routes.post('/me', function (req, res, next) {
  User.findOneAndUpdate({
    _id: req.user._id
  }, {
    $set: {
      alias: req.params.alias,
      keyIdentifier: req.params.keyIdentifier
    }
  }, next)
})

module.exports = routes
