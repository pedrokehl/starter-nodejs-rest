const logger = require('../services/logger');

function errorHandler(err, req, res, next) {
    if (err.errors) {
        err = {
            content: err.errors[Object.keys(err.errors)[0]].message,
            status: 400
        };
    }
    else if (!err.status) {
        logger.error({ type: 'Internal Error', error: err });
        err = {
            content: 'Internal error',
            status: 500
        };
    }
    res.setResponse(err.content, err.status);
    next();
}

module.exports = errorHandler;
