'use strict'

var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  googleId: String,
  facebookId: String, // unused at the moment

  // This is the identifier by which a public key on the keyserver can be found;
  // It is to be used as a a hint by clients
  /*keyIdentifier: { type: String, required: true }
}, {
  // strict means that values that are not defined in the schema will still be
  // saved in the database
  strict: false*/
})

// TODO: Validate that at least some ID is there mkay?

module.exports = mongoose.Model('User', userSchema)
