const   bcrypt = require('bcryptjs'),
        q = require('q');

module.exports = {
    compare: compare,
    hash: hash
};

function compare(string, hash) {
    let deferred = q.defer();
    bcrypt.compare(string, hash, (err, result) => {
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
    const salt = 5;
    const deferred = q.defer();
    bcrypt.hash(string, salt, (err, result) => {
        if (err) {
            deferred.reject({status: 403});
        }
        else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}