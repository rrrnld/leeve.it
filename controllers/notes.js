'use strict'

var routes = require('express').Router()
var Message = require('../models/message')
var requireLogin = require('../helpers/require-login')

routes.get('/me', requireLogin, function (req, res, next) {
  Message
    .find({
      type: 'note',
      to: req.user._id
    })
    .exec()
    .then(function (notes) {
      res.json(notes)
      next()
    }, function (err) {
      next(err)
    })
})

routes.post('/', requireLogin, function (req, res, next) {
  var message = new Message({
    type: 'note',
    to: req.user._id,
    content: req.body.content,
    location: req.body.location
  }).save(function (err) {
    if (err) {
      console.error('Error saving note')
      console.error('Error: ', err)
      console.error('Note:  ', message)
      return next(err)
    }

    console.log('Saved note!')
    res.end()
  })
})

module.exports = routes
