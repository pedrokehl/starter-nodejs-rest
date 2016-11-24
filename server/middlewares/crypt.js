var bcrypt = require('bcryptjs'),
    q = require('q');

module.exports = {
    compare: compare,
    hash: hash
};

function compare(string, hash) {
    var deferred = q.defer();
    bcrypt.compare(string, hash, function(err, result) {
        if (!result || err) {
            deferred.reject({status: 403});
        }
        else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function hash(string) {
    var salt = 5;
    var deferred = q.defer();
    bcrypt.hash(string, salt, function(err, result) {
        if (err) {
            deferred.reject({status: 403});
        }
        else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}