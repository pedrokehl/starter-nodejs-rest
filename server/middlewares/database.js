'use strict';
const   mongoClient = require('mongodb').MongoClient,
        config = require('../config');

const   username = config.mongo.username,
        password = config.mongo.password,
        server = config.mongo.server,
        port = config.mongo.port,
        database = config.mongo.database,
        auth = username ? username + ':' + password + '@' : '',
        url = 'mongodb://' + auth + server + ':' + port + '/' + database;

let dbObject;

module.exports = {
    connect: connect,
    get: get
};

function connect() {
    mongoClient.connect(url, (err, db) => {
        if (err) {
            console.log(err.message);
            process.exit(1);
        }
        dbObject = db;
    })
}

function get() {
    return dbObject;
}