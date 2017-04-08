const bcrypt = require('bcryptjs');
const q = require('q');

const compare = (string, hashValue) => {
  const deferred = q.defer();
  bcrypt.compare(string, hashValue, (err, result) => {
    if (!result || err) {
      deferred.reject({ status: 403 });
    } else {
      deferred.resolve();
    }
  });
  return deferred.promise;
};

const hash = (string) => {
  const salt = 5;
  const deferred = q.defer();
  bcrypt.hash(string, salt, (err, result) => {
    if (err) {
      deferred.reject({ status: 403 });
    } else {
      deferred.resolve(result);
    }
  });
  return deferred.promise;
};

module.exports = {
  compare,
  hash,
};
