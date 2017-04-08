const jwt = require('jsonwebtoken');
const q = require('q');
const config = require('../../config');

const createToken = (object, expiresIn = config.jwt.expiresIn, secret = config.jwt.secret) => {
  return jwt.sign(object, secret, { expiresIn });
};

const validateToken = (req, secret = config.jwt.secret) => {
  const deferred = q.defer();
  const token = req.body.token || req.params.token || req.headers.authorization;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      deferred.reject({ status: 403 });
    } else {
      req.decoded = decoded;
      deferred.resolve();
    }
  });
  return deferred.promise;
};

module.exports = {
  createToken,
  validateToken,
};
