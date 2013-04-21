var ring = require('./ring');

module.exports = function rings () {
  var i, a = [];
  for (i = 0; i < arguments.length; i++) {
    a.push(ring(arguments[i]));
  }
  return a;
}
