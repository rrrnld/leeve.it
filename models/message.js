'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// TODO: Default values and validation

var messageSchema = new Schema({
  from: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  to: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },

  // signed and PGP-encrypted message
  message: {
    type: String,
    required: true
  },

  // latitude and longitude
  location: [],

  createdAt: {
    type: Date,
    default: Date.now
  }
})
messageSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Message', messageSchema)
