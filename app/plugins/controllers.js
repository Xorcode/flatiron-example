var path = require('path'),
    fs = require('fs'),
    flatiron = require('flatiron'),
    common = flatiron.common,
    existsSync = fs.existsSync || path.existsSync

exports.name = 'controllers'

exports.attach = function (options) {
  var app = this
  options = options || {}

  //
  // Accept string `options`.
  //
  if (typeof options === 'string')
    options = { root: options }

  app.controllers = app.controllers || {}

  //
  // Load the controllers directory based on a few intelligent defaults:
  //
  // * `options.dir`: Explicit path to controllers directory
  // * `options.root`: Relative root to the controllers directory ('/app/controllers')
  // * `app.root`: Relative root to the controllers directory ('/app/controllers')
  //
  if (options.dir || options.root || app.root) {
    app._controllerDir = options.dir
      || path.join(options.root || app.root, 'app', 'controllers')

    try {
      existsSync(app._controllerDir)
    }
    catch (err) {
      console.error('invalid controller path: ' + app._controllerDir)
      return
    }

    var files = common.tryReaddirSync(app._controllerDir)

    if (files.length === 0)
      console.warn('no controllers found at: ' + app._controllerDir)

    files.forEach(function (file) {
      file = file.replace('.js', '')
      delete app.controllers[common.capitalize(file)]
      app.controllers[common.capitalize(file)] = require(
        path.resolve(app._controllerDir, file)
      )
      app.controllers[common.capitalize(file)].init()
    })
  }
}

exports.init = function (done) {
  var app = this
    , options

  //
  // Attempt to merge defaults passed to `app.use(flatiron.plugins.controllers)`
  // with any additional configuration that may have been loaded.
  //
  options = common.mixin(
      {}
    , app.options['controllers']
    , app.config.get('controllers') || {}
  )

  app.config.set('controllers', options)

  done()
}
