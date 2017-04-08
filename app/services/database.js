const mongoClient = require('mongodb').MongoClient;
const logger = require('./logger');
const config = require('../../config');

const auth = config.mongo.username ? `${config.mongo.username}:${config.mongo.password}@` : '';
const url = `mongodb://${auth}${config.mongo.server}:${config.mongo.port}/${config.mongo.database}`;

let dbObject;

const connect = () => {
  mongoClient.connect(url, (err, db) => {
    if (err) {
      logger.error(err.message);
      throw new Error(err.message);
    }
    logger.info('Mongo connected');
    dbObject = db;
  });
};

function get() {
  return dbObject;
}

module.exports = {
  connect,
  get,
};
