const mongo = require('../middlewares/database');

function findOne(user) {
    if (typeof (user) !== 'object') {
        user = { username: user };
    }
    return mongo.get().collection('users').findOne(user);
}

function insert(user) {
    return mongo.get().collection('users').insertOne(user);
}

function update(user, updateValues) {
    return mongo.get().collection('users').updateOne(user, { $set: updateValues });
}

module.exports = {
    findOne,
    insert,
    update,
};
