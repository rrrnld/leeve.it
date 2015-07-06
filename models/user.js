'use strict'

var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  google: String,   // Google profile ID
  facebook: String, // Facebook propfile ID

  // this is received from the identity provider and used as an indicator on
  // which key identifier to get
  email: String,

  // This is the identifier by which a public key on the keyserver can be found;
  // It is to be used as a a hint by clients
  keyIdentifier: String,

  alias: String     // Alias provided by the user at registration
}, {
  // strict means that values that are not defined in the schema will still be
  // saved in the database
  strict: false
})

// TODO: Validate that at least some ID is there mkay?

module.exports = mongoose.model('User', userSchema)
