var passport = require('passport')

/**
 * This wraps up all identity providers and the necessary scopes so we have it in
 * one place and do not need to change it everywhere later on. This can be used
 * everywhere where just *any* authentication is needed.
 * @return {Function} middleware
 */
module.exports = passport.authenticate([
  // all accepted authentication providers can be placed into this array
  'google-openidconnect'
], { scope: 'email' })
