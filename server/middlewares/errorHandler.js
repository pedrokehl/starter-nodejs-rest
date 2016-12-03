'use strict';
module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (!err.status) {
        console.log(err);
        err = {status: 500};
    }
    res.status(err.status);
    res.json(err).end();
}