var messages = {
  noUserSet: 'UserError: No User set',
  noKeyIdentifier: 'UserError: No key identifier given',
  noAlias: 'UserError: No alias set up'
}

/**
 * Redirects to a specified url if the sign in process has not been completed,
 * meaining that one or more of the alias or the identifier to discover the
 * public key is missing
 * @return undefined
 */
function completeSigninProcess (req, res, next) {
  if (!req.user) {
    return next(new Error())
  }

  if (!req.user.keyIdentifier) {
    return next(new Error())
  }

  if (!req.user.alias) {
    return next(new Error())
  }

  next(null)
}
completeSigninProcess.messages = messages

module.exports = completeSigninProcess
