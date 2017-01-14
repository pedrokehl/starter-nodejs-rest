const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ filename: 'somefile.log' })
    ]
});

module.exports = logger;
