/*
 * User resource
 * 
 * Create password example:
 * 
 * app.resources.User.create({
 *     username: 'tester'
 *   , email: 'contact@foodl.es'
 *   , active: true
 * }, function (err, user) {
 *   if (err || !user)
 *     return app.log.err(err)
 *   user.encryptPassword('1234test', function (err, user) {
 *     if (err || !user)
 *       return app.log.error(err)
 *     user.save()
 *   })
 * })
 */
var resourceful = require('resourceful')
  , crypto = require('crypto')
  , utils = require('../utils')

module.exports = resourceful.define('user', function () {
  this.restful = true
  this.remote = true

  this.string('username')
  this.string('email', { format: 'email', required: false })
  this.string('salt')
  this.string('key')
  this.bool('active', { required: false, default: true })

  this.timestamps()

  var encryptPassword = function (secret, callback) {
    var that = this
    utils.hasher({
      plaintext: secret
    }, function (err, result) {
      if (err) return callback(err)
      that.salt = result.salt.toString('hex')
      that.key = result.key.toString('hex')
      callback(null, that)
    })
  }
  this.method('encryptPassword', encryptPassword)

  var verifyPassword = function (secret, callback) {
    var that = this
      , salt = new Buffer(that.salt, 'hex')
    utils.hasher({
        plaintext: secret
      , salt: salt
    }, function (err, result) {
      if (err) return callback(err)
      if (that.key === result.key.toString('hex'))
        return callback(null, true)
      return callback(null, false)
    })
  }
  this.method('verifyPassword', verifyPassword)
})
