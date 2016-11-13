const   jwt = require('jsonwebtoken'),
        config = require('../config/default');

module.exports = {
    createToken: createToken,
    validateToken: validateToken
};

function createToken(username) {
    return jwt.sign({username: username}, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

function validateToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            errorMessage: 'No token provided.'
        });
    }

    jwt.verify(token, config.jwt.secret, function(err, decoded) {
        if (err) {
            res.send({
                errorMessage: 'Failed to authenticate token.'
            });
        } else {
            req.token = createToken(decoded.username);
            next();
        }
    });
}