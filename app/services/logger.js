const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'logs/server.log' }),
  ],
});

logger.saveRequest = (req, res) => {
  const log = {
    type: 'request',
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      headers: req.headers,
      dateTimeRequested: req.start,
    },
    response: {
      message: res.content.json,
      status: res.content.status,
      headers: res.headers,
    },
    duration: Date.now() - req.start,
  };
  logger.info(log);
};

module.exports = logger;
