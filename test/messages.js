/* globals describe, it */
'use strict'

var expect = require('chai').expect
var request = require('request')

describe('Messages API', function () {
  it('should list no messages when there are none', function (done) {
    request.get('/messages', function (err, body) {
      if (err) {
        done(err)
        return
      }

      expect(body).to.be.an('array')
      expect(body).to.have.length(0)
      done()
    })
  })

  it('should expect a sender, a receiver and an encrypted body when leaving messages')

  it('should list all messages for a specific person')
})
