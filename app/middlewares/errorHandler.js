const logger = require('../services/logger');

const errorHandler = (err, req, res, next) => {
  let errorMessage = err;
  if (!err.status) {
    logger.error({ type: 'Internal Error', error: err });
    errorMessage = {
      content: 'Internal error',
      status: 500,
    };
  }
  res.setResponse(errorMessage, errorMessage.status);
  next();
};

module.exports = errorHandler;
