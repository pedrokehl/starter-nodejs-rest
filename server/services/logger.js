const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ filename: 'starter.log' })
    ]
});

logger.saveRequest = (req, res) => {
    const log = {
        type: 'request',
        request: {
            method: req.method,
            url: req.url,
            dateTimeRequested: req.start
        },
        response: {
            status: res.content.status
        },
        duration: Date.now() - req.start
    };

    logger.info(log);
};

module.exports = logger;
