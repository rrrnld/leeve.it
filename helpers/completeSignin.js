/**
 * Redirects to a specified url if the sign in process has not been completed,
 * meaining that one or more of the alias or the identifier to discover the
 * public key is missing
 * @return undefined
 */
function completeSigninProcess (req, res, next) {
  if (!req.user.keyIdentifier || !req.user.alias) {
    res.status(403)
    return res.json({
      error: 'Please complete the sign in process by submitting an alias and a key identifier.'
    })
  }

  next(null)
}

module.exports = completeSigninProcess
