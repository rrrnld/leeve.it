var passport = require('passport')
var GoogleStrategy = require('passport-google-openidconnect').Strategy

var User = require('../models/user')

passport.use(new GoogleStrategy({
  clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
  clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  callbackUrl: 'https://127.0.0.1:' + process.env.PORT + '/auth/google/callback',
  userInfoURL: 'https://www.googleapis.com/plus/v1/people/me'
}, function googleAuthCallBack (iss, sub, profile, accessToken, refreshToken, done) {
  User.findOrCreate({
    googleId: profile.id
  }, function (err, user) {
    return done(err, user)
  })
  console.dir(arguments)
}))
