const defaultConfig = require('./default');

defaultConfig.port = process.env.PORT || defaultConfig.port;

defaultConfig.mongo.server = process.env.MONGO_SERVER || defaultConfig.mongo.server;
defaultConfig.mongo.database = process.env.MONGO_DB || defaultConfig.mongo.database;
defaultConfig.mongo.port = process.env.MONGO_PORT || defaultConfig.mongo.port;

defaultConfig.jwt.expiresIn = process.env.JWT_EXPIRESIN || defaultConfig.jwt.expiresIn;

defaultConfig.email.host = process.env.EMAIL_HOST || defaultConfig.email.host;
defaultConfig.email.port = process.env.EMAIL_PORT || defaultConfig.email.port;
defaultConfig.email.user = process.env.EMAIL_USER || defaultConfig.email.user;
defaultConfig.email.pass = process.env.EMAIL_PASS || defaultConfig.email.pass;

module.exports = defaultConfig;
