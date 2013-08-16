var path = require('path')
  , flatiron = require('flatiron')
  , plates = require('plates')
  , resourceful = require('resourceful')
  , restful = require('restful')
  , views = require('./app/plugins/plates.js')
  , controllers = require('./app/plugins/controllers.js')
  , app = module.exports = flatiron.app
  , env = process.env.NODE_ENV || 'development'

// Configuration file
app.config.file({ file: path.join(__dirname, 'config.json') })

// Load HTTP plugin
app.use(flatiron.plugins.http, {
  headers: {
    'x-powered-by': 'flatiron-' + flatiron.version
  }
})

// Use resourceful plugin, automatically loads resources
app.use(flatiron.plugins.resourceful, { root: __dirname })

// Use plates plugin to support layouts and views
app.use(views, { root: __dirname })

// Use controllers plugin to set up routes
app.use(controllers, { root: __dirname })

// Use RESTful Director
app.use(restful, app.config.get('restful') || {})

// Start application
app.start(app.config.get('port') || 4000, function (err) {
  if (err) {
    app.log.err(err)
    console.trace()
	process.exit(1)
  }
  var addr = app.server.address()
  app.log.info('Server started on http://' + addr.address + ':' + addr.port + ' in ' + env)
})
