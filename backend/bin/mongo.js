const mongoClient = require('mongodb').MongoClient;
const config = require('../config/default');

var username = config.mongo.username,
    password = config.mongo.password,
    server = config.mongo.server,
    port = config.mongo.port,
    database = config.mongo.database,
    auth = username ? username + ':' + password + '@' : '',
    url = 'mongodb://' + auth + server + ':' + port + '/' + database;

var dbObject;

module.exports = {
    close: close,
    connect: connect,
    get: get
};

function close(done) {
    if (dbObject) {
        dbObject.close(function (err, result) {
            dbObject = null;
            done(err);
        })
    }
}

function connect(done) {
    if (dbObject) {
        return done();
    }
    mongoClient.connect(url, function (err, db) {
        if (err) {
            return done(err);
        }
        dbObject = db;
        done();
    })
}

function get() {
    return dbObject;
}