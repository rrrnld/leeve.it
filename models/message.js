'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var isPGPencrypted = require('../helpers/is-pgp-encrypted')

var messageSchema = new Schema({

  to: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  // signed and PGP-encrypted message
  content: {
    type: String,
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
messageSchema.index({ location: '2dsphere' })

// custom validation: Make sure the message is encrypted
messageSchema.pre('save', function validateMessage (next) {
  var errorMessage = 'Content must be encrypted as described in the OpenPGP standard'

  if (!isPGPencrypted(this.content)) {
    this.invalidate('content', errorMessage)
    return next(new Error(errorMessage))
  }

  next()
})

module.exports = mongoose.model('Message', messageSchema)
