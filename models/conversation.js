'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var conversationSchema = new Schema({

  to: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  // This is used to build up the communication chain; if it is null, we're
  // at the start of a conversation
  answerTo: {
    type: Schema.ObjectId,
    ref: 'Conversation'
  },

  // signed and PGP-encrypted message
  // TODO: Validate encryption
  content: {
    type: [String],
    required: true
  },

  // latitude and longitude
  location: {
    type: [Number],
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})
conversationSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Conversation', conversationSchema)
