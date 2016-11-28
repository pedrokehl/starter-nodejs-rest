const   jwt = require('jsonwebtoken'),
        config = require('../config'),
        q = require('q');

module.exports = {
    createToken: createToken,
    validateAndRefresh: validateAndRefresh,
    validateRequest: validateRequest,
    validateToken: validateToken
};

function createToken(object, expiresIn = config.jwt.expiresIn, secret = config.jwt.secret) {
    return jwt.sign(object, secret, { expiresIn: expiresIn });
}

function validateToken(req, secret = config.jwt.secret) {
    const deferred = q.defer();
    const token = req.body.token || req.params.token || req.query.token || req.headers['authorization'];

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            deferred.reject({status: 403});
        }
        else {
            req.decoded = decoded;
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function validateRequest(req, res, next) {
    validateToken(req)
        .then(next)
        .catch(next);
}

function validateAndRefresh(req, res, next) {
    validateToken(req).then(() => {
        res.header('authorization', createToken({username: req.decoded.username}));
        next();
    }).catch(next);
}