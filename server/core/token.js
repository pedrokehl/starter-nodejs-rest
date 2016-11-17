var jwt = require('jsonwebtoken'),
    config = require('../config/default');

module.exports = {
    createToken: createToken,
    validateToken: validateToken,
    validateAndRefresh: validateAndRefresh
};

function createToken(object, expiresIn, secret) {
    expiresIn = expiresIn || config.jwt.expiresIn;
    secret = secret || config.jwt.secret;
    return jwt.sign(object, secret, { expiresIn: expiresIn });
}

function validateToken(req, res, next, secret) {
    var token = req.body.token || req.params.token || req.query.token || req.headers['authorization'];

    if (!token) {
        return res.status(403).send({
            errorMessage: 'No token provided.'
        });
    }

    secret = secret || config.jwt.secret;

    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            res.status(403).send({
                errorMessage: 'Failed to authenticate token.'
            });
        }
        else {
            req.decoded = decoded;
            next();
        }
    });
}

function validateAndRefresh(req, res, next) {
    validateToken(req, res, function () {
        req.token = createToken({username: req.decoded.username});
        next();
    });
}