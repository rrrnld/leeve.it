var fetchUser = require('./fetch-user.js')

/**
 * Utitlity middleware that fetches the current user from a database and fails if
 * there is none.
 * @param  {Request}    req
 * @param  {Response}   res
 * @param  {Function}   next
 */
module.exports = function requireLogin (req, res, next) {
  fetchUser(req, res, function () {
    if (!req.user) {
      res.status(401)
      res.json({
        message: 'Not logged in'
      })
      return next()
    }
  })
}
