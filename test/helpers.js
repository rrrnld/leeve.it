/* globals describe, it */
'use strict'

var expect = require('chai').expect

var isDev = require('../helpers/isDev')
var config = require('../config')

describe('Helpers', function () {
  describe('isDev', function () {
    it('should return true if no NODE_ENV is set', function () {
      // env is always a string, so setting it to undefined does not work
      config.NODE_ENV = ''
      expect(isDev()).to.be.true
    })

    it('should return true if NODE_ENV is set to either test or development', function () {
      config.NODE_ENV = 'test'
      expect(isDev()).to.be.true

      config.NODE_ENV = 'development'
      expect(isDev()).to.be.true
    })

    it('should return false if NODE_ENV is set to something else', function () {
      config.NODE_ENV = 'production'
      expect(isDev()).to.be.false

      config.NODE_ENV = 'asdasd'
      expect(isDev()).to.be.false
    })

    it('should be case insensitive', function () {
      config.NODE_ENV = 'TEST'
      expect(isDev()).to.be.true

      config.NODE_ENV = 'DEVELOPMENT'
      expect(isDev()).to.be.true

      config.NODE_ENV = 'PRODUCTION'
      expect(isDev()).to.be.false

      config.NODE_ENV = 'ASDASD'
      expect(isDev()).to.be.false
    })
  })
})
