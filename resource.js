function validator (req, value, next) {
  if (typeof value.validate === 'function') {
    return value.validate(req, function (err, query) {
      if (err) return next(err);
      else     return next(null, query);
    });
  } else {
    next(null, true);
  }
}

function transactor (req, query, value, next) {
  if (typeof value.transaction === 'function') {
    return value.transaction(req, query, function (err, data) {
      if (err) return next(err);
      else     return next(null, data);
    });
  } else {
    next(null, null);
  }
}

function formatter (req, data, value, next) {
  if (typeof value.format === 'function') {
    return value.format(req, data, function (err, formatted) {
      if (err) return next(err);
      else     return next(null, formatted);
    });
  } else {
    next(null, data);
  }
}

module.exports = function exResource (app) {

  return function (route, resource) {

    if (typeof resource.get === 'object') {

      app.get(route, function (req, res) {

        validator(req, resource.get, function (err, query) {
          if (err)    return res.send(500);
          if (!query) return res.send(400);
          transactor(req, query, resource.get, function (err, data) {
            if (err) return res.send(500);
            formatter(req, data, resource.get, function (err, formatted) {
              if (err) return res.send(500);
              res.json(formatted);
            });
          });
        });

      });

    }

  };

};
