var passport = require('passport')
var GoogleStrategy = require('passport-google-openidconnect').Strategy

var User = require('../models/user')

passport.use(new GoogleStrategy({
  clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
  clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://localhost:8000/auth/google/callback',
  userInfoURL: 'https://www.googleapis.com/plus/v1/people/me'
}, function googleAuthCallBack (iss, sub, profile, accessToken, refreshToken, done) {
  console.log('Google Auth Response:')
  console.dir(arguments)

  User.findOrCreate({
    googleId: profile.id
  }, function (err, user) {
    return done(err, user)
  })
}))
