'use strict'

var debug = require('debug')('conversations')
var async = require('async')

var routes = require('express').Router()
var requireLogin = require('../helpers/require-login')

var Conversation = require('../models/conversation')

routes.post('/', requireLogin, function (req, res, next) {
  var message = new Conversation({
    to: req.user._id,
    content: req.body.content,
    location: req.body.location
  }).save(function (err) {
    if (err) {
      debug('Error saving message')
      debug('Error:   ', err)
      debug('Message: ', message)

      return next(err)
    }

    debug('New message saved')
    res.end()
  })
})

routes.get('/me', requireLogin, function (req, res, next) {
  var limit = Math.max(Math.min(req.query.limit || 10, 20), 1)

  Conversation
    .find({
      to: req.user._id
    })
    .limit(limit)
    .exec()
    .then(function (conversations) {
      res.json(conversations)
      next()
    }, function (err) {
      next(err)
    })
})

routes.get('/:id', requireLogin, function (req, res, next) {
  if (req.params.id === 'me') return next()

  var amount = Math.max(Math.min(req.query.limit || 10, 20), 1)
  var messages = []
  var endOfChain = false
  var currentId = req.params.id

  // fetches messages in a conversation one by one until we have reached
  // the end of the chain or the maximum amount

  async.whilst(
    function keepFetching () { return messages.length < amount || endOfChain },
    function fetchMessage (callback) {
      Conversation
        .findOne({
          _id: currentId,
          $or: [
            { from: req.user._id },
            { to: req.user._id }
          ]
        })
        .exec()
        .then(function (message) {
          if (message.answerTo) {
            currentId = message.answerTo
          } else {
            endOfChain = true
          }

          messages.push(message)
          callback()
        }, function (err) {
          callback(err)
        })
    },
    function doneFetching (err) {
      if (err) {
        debug('There was an error fetching the conversation starting at ' + req.params.id, err)
        return next(err)
      }

      res.json(messages)
      return next()
    }
  )
})

module.exports = routes
