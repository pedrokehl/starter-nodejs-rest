const mongoClient = require('mongodb').MongoClient;
const config = require('../config');

const auth = config.mongo.username ? `${config.mongo.username}:${config.mongo.password}@` : '';
const url = `mongodb://${auth}${config.mongo.server}:${config.mongo.port}/${config.mongo.database}`;

let dbObject;

function connect() {
    mongoClient.connect(url, (err, db) => {
        if (err) {
            console.error(err.message);
            process.exit(1);
        }
        dbObject = db;
    });
}

function get() {
    return dbObject;
}

module.exports = {
    connect,
    get
};
