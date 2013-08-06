var crypto = require('crypto')

module.exports = {
  hasher: function (opts, callback) {
    var that = this
    if (!opts.plaintext) {
      return crypto.randomBytes(6, function (err, buf) {
        if (err) callback(err)
        opts.plaintext = buf.toString('base64')
        return that.hasher(opts, callback)
      })
    }
    if (!opts.salt) {
      return crypto.randomBytes(64, function (err, buf) {
        if (err) return callback(err)
        opts.salt = buf
        return that.hasher(opts, callback)
      })
    }
    opts.hash = 'sha1'
    opts.iterations = opts.iterations || 10000
    return crypto.pbkdf2(opts.plaintext, opts.salt, opts.iterations, 64, function (err, key) {
      if (err) return callback(err)
      opts.key = new Buffer(key)
      return callback(null, opts)
    })
  }
}
