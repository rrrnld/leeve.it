'use strict'

var mongoose = require('mongoose')

// TODO: Default values and validation

var messageSchema = new mongoose.Schema({
  from: Number,      // a hash of the sender's e-mail address
  to: Number,        // a hash of the recipient's e-mail address
  message: String,   // signed and PGP-encrypted message
  location: [],      // latitude and longitude
  createdAt: Date,
  publishedAt: Date
})
messageSchema.index({ location: '2d' })

module.exports = mongoose.model('Message', messageSchema)
