const config = require('../config');
const mongoClient = require('mongodb').MongoClient;
const logger = require('./logger');

const auth = config.mongo.username ? `${config.mongo.username}:${config.mongo.password}@` : '';
const url = `mongodb://${auth}${config.mongo.server}:${config.mongo.port}/${config.mongo.database}`;

let dbObject;

function connect() {
    mongoClient.connect(url, (err, db) => {
        if (err) {
            logger.error(err.message);
            process.exit(1);
        }
        logger.info('Mongo connected');
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
