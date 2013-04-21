var ex = module.exports = function expresto (app) {

  app.use(function exMiddleware (req, res, next) {
    req.expresto = {};
    next();
  });

  var self = {};

};

ex.ring = require('./ring');
ex.rings = require('./rings');
