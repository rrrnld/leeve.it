var passport = require('passport')
var GoogleStrategy = require('passport-google-openidconnect').Strategy

var User = require('../models/user')

passport.use(new GoogleStrategy({
  clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
  clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://localhost:8000/auth/google/callback',
  userInfoURL: 'https://www.googleapis.com/plus/v1/people/me'
}, function googleAuthCallBack (ispAddress, identifier, profile, accessToken, refreshToken, done) {
  console.log('Google Auth Response:')
  console.dir(arguments)

  User
    .findOneAndUpdate({
      // we save the internal google ID in order to easily find the user again later
      google: identifier
    }, {
      $set: {
        google: identifier,
        email: profile._json.emails[0].value
      }
    }, {
      upsert: true
    }, done)
}))
