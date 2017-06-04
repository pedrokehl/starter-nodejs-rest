const jwt = require('jsonwebtoken');
const config = require('../config');
const secureRandom = require('secure-random');

const SECRET = secureRandom(256, { type: 'Buffer' });

function createToken(object, expiresIn = config.jwt.expiresIn, secret = SECRET) {
    return jwt.sign(object, secret, { expiresIn });
}

function validateToken(req, secret = SECRET) {
    const token = req.body.token || req.params.token || req.headers.authorization;

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject({ status: 403 });
            }
            else {
                req.decoded = decoded;
                resolve();
            }
        });
    });
}

module.exports = {
    createToken,
    validateToken
};
