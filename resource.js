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
    value.transaction(req, query, function (err, transaction) {
      var data, result;
      if (err) return next(err);
      if (transaction.collection) {
        if (transaction.find) {
          data = transaction.collection.find(transaction.find);
          if (transaction.sort)  data = data.sort(transaction.sort);
          if (transaction.limit) data = data.limit(transaction.limit);
          result = [];
          data.each(function (err, item) {
            if (err)   return next(err);
            if (!item) return next(null, result);
            result.push(item);
          });
        } else if (transaction.insert) {
          transaction.collection.insert(transaction.insert, function (err, docs) {
            if (err) return next(err);
            else     return next(null, docs);
          });
        } else {
          return next(null, null);
        }
      } else {
        return next(null, null);
      }
    });
  } else {
    return next(null, null);
  }
}

function formatter (req, data, value, next) {
  if (typeof value.format === 'function') {
    return value.format(req, data, function (err, formatted) {
      if (err) return next(err);
      else     return next(null, formatted);
    });
  } else {
    return next(null, data);
  }
}

function chain (req, res, value, status){
  validator(req, value, function (err, query) {
    if (err)    return res.send(500);
    if (!query) return res.send(400);
    transactor(req, query, value, function (err, data) {
      if (err) return res.send(500);
      formatter(req, data, value, function (err, formatted) {
        if (err) return res.send(500);
        res.status(status).json(formatted);
      });
    });
  });
}

module.exports = function exResource (app) {

  return function (route, resource) {

    if (typeof resource.get === 'object') {
      app.get(route, function (req, res) {
        chain(req, res, resource.get, 200);
      });
    }

    if (typeof resource.post === 'object') {
      app.post(route, function (req, res) {
        chain(req, res, resource.post, 201);
      });
    }

  };

};
