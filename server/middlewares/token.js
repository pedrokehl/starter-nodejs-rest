var jwt = require('jsonwebtoken'),
    config = require('../config'),
    q = require('q');

module.exports = {
    createToken: createToken,
    validateAndRefresh: validateAndRefresh,
    validateRequest: validateRequest,
    validateToken: validateToken
};

function createToken(object, expiresIn, secret) {
    expiresIn = expiresIn || config.jwt.expiresIn;
    secret = secret || config.jwt.secret;
    return jwt.sign(object, secret, { expiresIn: expiresIn });
}

function validateToken(req, secret) {
    var deferred = q.defer();
    var token = req.body.token || req.params.token || req.query.token || req.headers['authorization'];

    secret = secret || config.jwt.secret;

    jwt.verify(token, secret, function(err, decoded) {
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
    validateToken(req).then(function () {
        res.header('authorization', createToken({username: req.decoded.username}));
        next();
    }).catch(next);
}