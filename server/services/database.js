const config = require('../config');
const mongoose = require('mongoose');
const logger = require('./logger');

mongoose.Promise = Promise;

const dbUrl = 'mongodb://' + config.mongo.server + ':' + config.mongo.port + '/' + config.mongo.database;

function connect() {
    mongoose.connect(dbUrl, { server: { auto_reconnect: true } });

    mongoose.connection.on('error', err => logger.error({ type: 'MongoDB', message: err.message }));
    mongoose.connection.once('connected', () => logger.info({ type: 'MongoDB', message: 'Mongo connected' }));
    mongoose.connection.on('disconnected', () => logger.info({ type: 'MongoDB', message: 'Mongo disconnected' }));
    mongoose.connection.on('reconnected', () => logger.info({ type: 'MongoDB', message: 'Mongo reconnected' }));
}

const mongoConnection = {
    connect
};

mongoose.set('debug', (collection, method, query) => {
    logger.info({
        type: 'query',
        collection,
        method,
        query
    });
});

module.exports = mongoConnection;
