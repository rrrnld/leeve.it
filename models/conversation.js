'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var isPGPencrypted = require('../helpers/is-pgp-encrypted')

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

// custom validation: Make sure there are always two messages and that they are
// both encrypted
conversationSchema.pre('save', function (next) {
  var errors = {
    wrongMessageAmount: 'Content must contain two messages',
    notEncrypted: 'Content must contain messages encrypted as described in the OpenPGP standard'
  }

  if (this.content.length !== 2) {
    this.invalidate('content', errors.wrongMessageAmount)
    return next(new Error(errors.wrongMessageAmount))
  }

  for (var i = 0, l = this.content.length; i < l; i++) {
    if (!isPGPencrypted(this.content[i])) {
      this.invalidate('content', errors.notEncrypted)
      return next(new Error(errors.notEncrypted))
    }
  }

  next()
})

module.exports = mongoose.model('Conversation', conversationSchema)
