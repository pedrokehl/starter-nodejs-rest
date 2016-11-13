const db = require('../bin/mongo');
const q = require('q');

module.exports = {
    findOne: findOne,
    insert: insert
};

function findOne(user) {
    var deferred = q.defer();
    db.get().collection('users').findOne({'username': user.username}, function (err, result) {
        if(err) deferred.reject(new Error(err));
        else deferred.resolve(result);
    });
    return deferred.promise;
}

function insert(user) {
    var deferred = q.defer();
    db.get().collection('users').insertOne(user, function (err, result) {
        if(err) deferred.reject(new Error(err));
        else deferred.resolve(result);
    });
    return deferred.promise;
}