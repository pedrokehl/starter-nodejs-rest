const bcrypt = require('bcryptjs');

const SALT = 5;

function compare(string, hashValue) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string, hashValue, (err, result) => {
            if (!result || err) {
                reject({ status: 403, content: 'Incorrect Password' });
            }
            else {
                resolve();
            }
        });
    });
}

function hash(string) {
    return bcrypt.hash(string, SALT);
}

module.exports = {
    compare,
    hash
};
