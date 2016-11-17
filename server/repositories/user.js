var mongo = require('../core/database'),
    q = require('q');

module.exports = {
    findOne: findOne,
    insert: insert,
    update: update
};

function findOne(user) {
    var deferred = q.defer();
    mongo.get().collection('users').findOne(user, function (err, result) {
        if(err) {
            deferred.reject(new Error(err));
        }
        else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}

function insert(user) {
    var deferred = q.defer();
    mongo.get().collection('users').insertOne(user, function (err, result) {
        if(err) {
            deferred.reject(new Error(err));
        }
        else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}

function update(user, updateValues) {
    var deferred = q.defer();
    mongo.get().collection('users').updateOne(user, updateValues, function (err, result) {
        if(err) {
            deferred.reject(new Error(err));
        }
        else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
}