module.exports = function ring (fn) {

  var middleware = function exRingMiddleware (req, res, next) {
    if (!req.expresto.ringInfo) req.expresto.ringInfo = {};
    var info = req.expresto.ringInfo;
    fn(function exRingNext (err, state) {
      if (err)    return res.send(500);
      if (!state) return res.send(403);
      else        return next();
    }, info, req);
  };

  return middleware;

};
