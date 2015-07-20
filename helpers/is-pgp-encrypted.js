/**
 * This module is used in the message and conversation models to ensure that
 * messages sent to the server are encrypted using the PGP standard.
 *
 * @param  {String} message
 * @return {Boolean}        [description]
 */
module.exports = function isPGPencrypted (message) {
  var start = '-----BEGIN PGP MESSAGE-----'
  var end = '-----END PGP MESSAGE-----'

  return message.substr(0, start.length) === start
    && message.substr(message.length - end.length) === end
}
