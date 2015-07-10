var User = require('../models/user')

/**
 * Fetches a user from the database if we have an established session and
 * attaches it to the Request object for easier access.
 * @param  {Request}    req
 * @param  {Response}   res
 * @param  {Function}   next
 */
module.exports = function fetchUserFromSession (req, res, next) {
  if (!req.session) return next()

  User.findById(req.session.userId, function (err, user) {
    if (err) return next(err)

    req.user = user
    return next()
  })
}
