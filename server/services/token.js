const jwt = require('jsonwebtoken');
const config = require('../config');
const q = require('q');

function createToken(object, expiresIn = config.jwt.expiresIn, secret = config.jwt.secret) {
  return jwt.sign(object, secret, { expiresIn });
}

function validateToken(req, secret = config.jwt.secret) {
  const deferred = q.defer();
  const token = req.body.token || req.params.token || req.headers.authorization;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      deferred.reject({ status: 403 });
    }
    else {
      req.decoded = decoded;
      deferred.resolve();
    }
  });
  return deferred.promise;
}

module.exports = {
  createToken,
  validateToken
};
