const   jwt = require('jsonwebtoken'),
        config = require('../config/default');

module.exports = validateToken;

function validateToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            error: 'No token provided.'
        });
    }

    jwt.verify(token, config.jwt.secret, function(err, decoded) {
        if (err) {
            return res.send({
                error: 'Failed to authenticate token.'
            });
        } else {
            req.decoded = decoded;
            next();
        }
    });
}