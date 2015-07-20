'use strict'

var debug = require('debug')('users')

var routes = require('express').Router()
var requireLogin = require('../helpers/require-login')

var User = require('../models/user')

routes.get('/me', requireLogin, function (req, res, next) {
  debug('Session:', req.session)
  return res.json(req.user)
})

routes.put('/me', requireLogin, function (req, res, next) {
  var user = req.user

  user.alias = req.params.alias
  user.keyIdentifier = req.params.keyIdentifier
  user.save(next)
})

routes.get('/:id', requireLogin, function (req, res, next) {
  if (req.params.id === 'me') return next()

  User
    .findById(req.params.id)
    .select('_id alias picture keyIdentifier')
    .exec()
    .then(function (user) {
      res.json(user)
      next()
    }, function (err) {
      debug('Error fetching user with id ' + req.params.id, err)
      next(err)
    })
})

module.exports = routes
