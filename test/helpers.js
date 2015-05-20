/* globals describe, it */
'use strict'

var expect = require('chai').expect

var isDev = require('../helpers/isDev')

describe('Helpers', function () {
  describe('isDev', function () {
    it('should return true if no NODE_ENV is set', function () {
      // env is always a string, so setting it to undefined does not work
      process.env.NODE_ENV = ''
      expect(isDev()).to.be.true
    })

    it('should return true if NODE_ENV is set to either test or development', function () {
      process.env.NODE_ENV = 'test'
      expect(isDev()).to.be.true

      process.env.NODE_ENV = 'development'
      expect(isDev()).to.be.true
    })

    it('should return false if NODE_ENV is set to something else', function () {
      process.env.NODE_ENV = 'production'
      expect(isDev()).to.be.false

      process.env.NODE_ENV = 'asdasd'
      expect(isDev()).to.be.false
    })

    it('should be case insensitive', function () {
      process.env.NODE_ENV = 'TEST'
      expect(isDev()).to.be.true

      process.env.NODE_ENV = 'DEVELOPMENT'
      expect(isDev()).to.be.true

      process.env.NODE_ENV = 'PRODUCTION'
      expect(isDev()).to.be.false

      process.env.NODE_ENV = 'ASDASD'
      expect(isDev()).to.be.false
    })
  })
})
