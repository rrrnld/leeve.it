'use strict'

var mongoose = require('mongoose')

/**
 * Exampple OpenID identity token:
 * { iss: 'accounts.google.com',
 *   sub: '100005390681609364617',
 *   azp: '314677882298-auarn7hmbo4me71if8jm2n17qu090m2v.apps.googleusercontent.com',
 *   email: 'aesthaddicts@gmail.com',
 *   at_hash: 'BJnLygSaaufnYokagF3qCA',
 *   email_verified: true,
 *   aud: '314677882298-auarn7hmbo4me71if8jm2n17qu090m2v.apps.googleusercontent.com',
 *   iat: 1436541677,
 *   exp: 1436545277,
 *   name: 'Arne Schlüter',
 *   picture: 'https://lh5.googleusercontent.com/-O--zoj-YWXM/AAAAAAAAAAI/AAAAAAAAADY/edzx7wlRIyA/s96-c/photo.jpg',
 *   given_name: 'Arne',
 *   family_name: 'Schlüter',
 *   locale: 'de' }
 * @type {Object}
 */
var openidToken = {
  iss: { type: String, required: true },
  sub: { type: String, required: true },
  azp: { type: String, required: true },
  at_hash: String,
  email: { type: String, required: true },
  email_verified: Boolean,
  aud: { type: String, required: true },
  iat: { type: Number, required: true },
  exp: { type: Number, required: true },
  name: { type: String, required: true },
  picture: String
}

var userSchema = new mongoose.Schema({
  idToken: openidToken,

  idProvider: {
    type: String,
    enum: [ 'google-openid-connect' ],
    required: true
  },

  // this is received from the identity provider and used as an indicator on
  // which key identifier to get
  email: String,

  // This is the identifier by which a public key on the keyserver can be found;
  // It is to be used as a a hint by clients and defaults to the email
  keyIdentifier: String,

  // Alias provided by the user at registration, defaults to name
  alias: String,

  // A profile image to display, defaults to the one of the identity provider
  picture: String
}, {
  // strict means that values that are not defined in the schema will still be
  // saved in the database
  strict: false
})

module.exports = mongoose.model('User', userSchema)
