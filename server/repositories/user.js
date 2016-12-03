'use strict';
const mongo = require('../middlewares/database');

module.exports = {
    findOne: findOne,
    insert: insert,
    update: update
};

function findOne(user) {
    return mongo.get().collection('users').findOne(user);
}

function insert(user) {
    return mongo.get().collection('users').insertOne(user);
}

function update(user, updateValues) {
    return mongo.get().collection('users').updateOne(user, updateValues);
}