/* globals describe, it */
'use strict'

var expect = require('chai').expect
var request = require('request')

describe('Messages API', function () {
  it('should list no messages when there are none', function (done) {
    request.get('http://localhost:8001/messages', function (err, res, body) {
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

  it('should decline messages without a sender', function () {
    var message = {
      "message":
    }
  })

  it('should only accept numeric senders and answer with an explanation if something goes wrong')
  it('should decline messages without a receiver')
  it('should only accept numeric receivers and answer with an explanation if something goes wrong')
  it.skip('should only accept PGP-encrypted messages with an explanatory text if something goes wrong', function () {

  })
})
