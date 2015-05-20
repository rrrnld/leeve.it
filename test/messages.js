/* globals describe, it */
'use strict'

var expect = require('chai').expect
var request = require('request')

describe('Messages API', function () {
  it('should list no messages when there are none', function (done) {
    request.get('http://localhost:8000/messages', function (err, res, body) {
      if (err) {
        done(err)
        return
      }

      body = JSON.parse(body)

      expect(res.statusCode).to.equal(200)
      expect(body).to.be.an('array')
      expect(body).to.have.length(0)
      done()
    })
  })

  it('should expect a sender, a receiver and an encrypted body when leaving messages')

  it('should list all messages for a specific person')
})
