/**
 * This module is used in the message and conversation models to ensure that
 * messages sent to the server are encrypted using the PGP standard.
 *
 * @param  {String}   message
 * @return {Boolean}
 */
module.exports = function isPGPencrypted (message) {
  var start = '-----BEGIN PGP MESSAGE-----\r\n'
  var end = '-----END PGP MESSAGE-----\r\n'

  var body = message
    .substr(0, message.length - end.length)
    .split('\r\n\r\n')[1]

  var base64Charset = /^[A-Za-z0-9+\/=\r\n]+$/

  return message.substr(0, start.length) === start
    && message.substr(message.length - end.length) === end
    && base64Charset.test(body)
}
