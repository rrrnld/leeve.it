'use strict'

var debug = require('debug')('users')
var routes = require('express').Router()

var requireLogin = require('../helpers/require-login')

routes.get('/me', requireLogin, function (req, res, next) {
  debug('Session:', req.session)
  return res.json(req.user)
})

routes.post('/me', requireLogin, function (req, res, next) {
  var user = req.user

  user.alias = req.params.alias
  user.keyIdentifier = req.params.keyIdentifier
  user.save(next)
})

module.exports = routes
