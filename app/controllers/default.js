var flatiron = require('flatiron')
  , app = flatiron.app

var indexGet = function () {
  var req = this.req
    , res = this.res
  res.writeHead(200, { 'content-type': 'text/html' })
  res.html(app.view('index'))
}

module.exports.init = function () {
  app.router.get('/', indexGet)
}
