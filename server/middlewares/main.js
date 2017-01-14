const logger = require('../services/logger');

function first(req, res, next) {
    req.start = new Date();

    res.setResponse = (json, status = 200) => {
        req.used = true;
        res.content = {
            json,
            status
        };
    };
    next();
}

function last(req, res) {
    if (!req.used) {
        res.status(404);
    }
    else {
        res.status(res.content.status);
        res.json(res.content.json);
    }
    res.end();

    const log = {
        type: 'request',
        request: {
            method: req.method,
            url: req.url,
            body: req.body,
            headers: req.headers,
            dateTimeRequested: req.start
        },
        response: {
            message: res.jsonContent || '',
            status: res.statusCode,
            headers: res._headers
        },
        duration: Date.now() - req.start
    };

    logger.info(log);
}

module.exports = {
    first,
    last
};
