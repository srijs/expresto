var exResource = require('./resource');

var ex = module.exports = function expresto (app) {

  app.use(function exMiddleware (req, res, next) {
    req.expresto = {};
    next();
  });

  var self = {
    resource: exResource(app)
  };

  return self;

};

ex.ring = require('./ring');
ex.rings = require('./rings');
